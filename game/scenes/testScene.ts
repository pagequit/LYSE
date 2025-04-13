import {
  applyTouchControls,
  removeTouchControls,
} from "../../lib/TouchControls.ts";
import {
  animatePlayer,
  createPlayer,
  Direction,
  processPlayer,
  setDirection,
  type Player,
} from "../entities/Player.ts";
import { createScene, type Scene } from "../../lib/Scene.ts";
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
} from "../../lib/KinematicBody.ts";
import { focusViewport } from "../../lib/View.ts";
import { createSprite, drawSprite } from "../../lib/Sprite.ts";
import type { Vector } from "../../lib/Vector.ts";
import { paintNode } from "../entities/Node.ts";
import type { Drawable } from "../../lib/Drawable.ts";

const scene: Scene = createScene(process, {
  width: 1536,
  height: 1024,
  preProcess,
  postProcess,
});

const isTouchDevice = self.navigator.maxTouchPoints > 0;

const bgm = {
  audioContext: new AudioContext(),
  audioElement: null as HTMLAudioElement | null,
  audioSource: null as MediaElementAudioSourceNode | null,
  sourceNode: null as AudioBufferSourceNode | null,
  audioBuffer: null as AudioBuffer | null,
  startTime: 0,
  isPlaying: false,
};

async function loadAudio(url: string): Promise<AudioBuffer | null> {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const decodedAudio = await bgm.audioContext.decodeAudioData(arrayBuffer);
    return decodedAudio;
  } catch (error) {
    console.error("Error loading or decoding audio:", error);
    return null;
  }
}

function playSound(buffer: AudioBuffer) {
  bgm.sourceNode = bgm.audioContext.createBufferSource();
  bgm.sourceNode.buffer = buffer;
  bgm.sourceNode.connect(bgm.audioContext.destination);
  bgm.sourceNode.onended = playSound.bind(null, buffer); // Schedule the next playback
  bgm.startTime = bgm.audioContext.currentTime;
  bgm.sourceNode.start();
  bgm.isPlaying = true;
  console.log("Background music started (gapless).");
}

async function playBackgroundMusic() {
  if (bgm.audioContext.state === "suspended") {
    await bgm.audioContext.resume();
  }

  if (!bgm.audioBuffer) {
    bgm.audioBuffer = await loadAudio("/hain.wav");
  }

  if (!bgm.isPlaying) {
    playSound(bgm.audioBuffer!);
  }
}

function stopBackgroundMusic() {
  if (bgm.isPlaying && bgm.sourceNode) {
    bgm.sourceNode.onended = null; // Prevent the automatic restart
    bgm.sourceNode.stop();
    bgm.isPlaying = false;
  }
}

function preProcess(): void {
  self.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      if (bgm.isPlaying) {
        stopBackgroundMusic();
      } else {
        playBackgroundMusic();
      }
    }
  });

  if (isTouchDevice) {
    applyTouchControls();
  }
}

function postProcess(): void {
  stopBackgroundMusic();

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
