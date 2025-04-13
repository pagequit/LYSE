import {
  applyTouchControls,
  removeTouchControls,
} from "../../engine/stateful/TouchControls.ts";
import {
  animatePlayer,
  createPlayer,
  Direction,
  processPlayer,
  setDirection,
  type Player,
} from "../entities/Player.ts";
import { createScene, type Scene } from "../../engine/lib/Scene.ts";
import {
  createKinemeticRectangle,
  updateKinematicBody,
  renderKinematicBodies,
  processKinematicBodies,
  setActiveKinematicBodies,
  createKinemeticCircle,
  rectangleContainsCircle,
  rectangleContainsRectangle,
  ShapeType,
  type KinematicBody,
  type Circle,
  type Rectangle,
  type UnionShape,
} from "../../engine/lib/KinematicBody.ts";
import { focusViewport } from "../../engine/stateful/View.ts";
import { createSprite, drawSprite } from "../../engine/lib/Sprite.ts";
import type { Vector } from "../../engine/lib/Vector.ts";
import { paintNode } from "../entities/Node.ts";
import type { Drawable } from "../../engine/lib/Drawable.ts";
import {
  togglePausePlay,
  enqueueAudioFromUrl,
  connectAudioPlayer,
  createAudioPlayer,
  type AudioPlayer,
} from "../../engine/lib/AudioPlayer.ts";

const scene: Scene = createScene(process, {
  width: 1536,
  height: 1024,
  preProcess,
  postProcess,
});

const audioPlayer: AudioPlayer = createAudioPlayer();
audioPlayer.source.loop = true;
await enqueueAudioFromUrl(audioPlayer, "/bgm.wav");
connectAudioPlayer(audioPlayer, audioPlayer.queue[0]);

const isTouchDevice = self.navigator.maxTouchPoints > 0;

function handleAudioPlayer(event: KeyboardEvent): void {
  if (event.code !== "Space") {
    return;
  }

  togglePausePlay(audioPlayer).then(() => {
    console.log("audioPlayer", audioPlayer.ctx.state);
  });
}

function preProcess(): void {
  window.addEventListener("keydown", handleAudioPlayer);

  if (isTouchDevice) {
    applyTouchControls();
  }
}

function postProcess(): void {
  window.removeEventListener("keydown", handleAudioPlayer);
  if (audioPlayer.ctx.state === "running") {
    audioPlayer.source.stop();
  }

  if (isTouchDevice) {
    removeTouchControls();
  }
}

const wall = createKinemeticRectangle({ x: 0, y: 0 }, scene.width, 64 * 3);

const background = createSprite({
  imageSrc: "/test-scene.png",
  origin: { x: 0, y: 0 },
  width: scene.width,
  height: scene.height,
  frameWidth: scene.width / 4,
  frameHeight: scene.height / 4,
  xFrames: 1,
  yFrames: 1,
});

const player: Player = createPlayer(
  { x: (scene.width - 64) / 2, y: (scene.height - 64) / 2 + 16 },
  64,
  64,
);
setDirection(player, Direction.Right);

const onIceFriction = 0.99;
const iceFloorPosition = {
  x: 256,
  y: scene.height - 448,
};
const iceFloor = {
  animation: createSprite({
    imageSrc: "/ice-floor.png",
    origin: iceFloorPosition,
    width: 128 * 4,
    height: 64 * 4,
    frameWidth: 128,
    frameHeight: 64,
    xFrames: 1,
    yFrames: 1,
  }),
  collisionBody: createKinemeticRectangle(iceFloorPosition, 512, 256),
};

const iceCubePosition = {
  x: scene.width / 2 + 96,
  y: scene.height / 2 - 64,
};
const iceCube = {
  position: iceCubePosition,
  animation: createSprite({
    imageSrc: "/ice-cube.png",
    origin: {
      x: iceCubePosition.x,
      y: iceCubePosition.y - 4,
    },
    width: 64,
    height: 64,
    frameWidth: 16,
    frameHeight: 16,
    xFrames: 1,
    yFrames: 1,
  }),
  collisionBody: createKinemeticRectangle(
    iceCubePosition,
    64,
    60,
    { x: 0, y: 0 },
    (self, friction) => {
      updateKinematicBody(self, friction);
      iceCube.animation.origin.x = self.origin.x;
      iceCube.animation.origin.y = self.origin.y - 4;
    },
  ),
  draw: (ctx: CanvasRenderingContext2D) => {
    drawSprite(iceCube.animation, ctx);
  },
};

const iciclePosition = {
  x: scene.width / 2,
  y: scene.height / 2 - 128,
};
const icicle = {
  position: iciclePosition,
  animation: createSprite({
    imageSrc: "/icicle.png",
    origin: {
      x: iciclePosition.x - 28,
      y: iciclePosition.y - 86,
    },
    width: 64,
    height: 128,
    frameWidth: 16,
    frameHeight: 32,
    xFrames: 1,
    yFrames: 1,
  }),
  collisionBody: createKinemeticCircle(iciclePosition, 28),
  draw: (ctx: CanvasRenderingContext2D) => {
    drawSprite(icicle.animation, ctx);
  },
};

const activeKinematicBodies: Array<KinematicBody<UnionShape>> = [];
const kinematicBodies = [player.kinematicBody, iceCube.collisionBody];
const staticBodies = [wall, icicle.collisionBody];
const ySortedObjects: Array<Drawable> = [player, icicle, iceCube];

function process(ctx: CanvasRenderingContext2D, delta: number): void {
  processPlayer(
    player,
    rectangleContainsCircle(iceFloor.collisionBody, player.kinematicBody)
      ? 0.015
      : 1,
  );

  setActiveKinematicBodies(activeKinematicBodies, kinematicBodies);

  drawSprite(background, ctx);
  drawSprite(iceFloor.animation, ctx);

  ySortedObjects.sort((a, b) => a.position.y - b.position.y);
  for (const object of ySortedObjects) {
    object.draw(ctx, delta);
  }

  focusViewport(player.kinematicBody.origin.x, player.kinematicBody.origin.y);

  // renderKinematicBodies(kinematicBodies, ctx);

  processKinematicBodies(activeKinematicBodies, staticBodies, kinematicBodies);

  for (const body of activeKinematicBodies) {
    let friction = 0.5;
    switch (body.type) {
      case ShapeType.Circle: {
        friction = rectangleContainsCircle(
          iceFloor.collisionBody,
          body as KinematicBody<Circle>,
        )
          ? onIceFriction
          : friction;

        break;
      }
      case ShapeType.Rectangle: {
        friction = rectangleContainsRectangle(
          iceFloor.collisionBody,
          body as KinematicBody<Rectangle>,
        )
          ? onIceFriction
          : friction;

        break;
      }
    }

    body.update(body, friction);
  }
}

export default scene;
