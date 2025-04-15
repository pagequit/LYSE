import {
  applyTouchControls,
  removeTouchControls,
} from "../../engine/stateful/TouchControls.ts";
import {
  createPlayer,
  Direction,
  type Player,
  processPlayer,
  setDirection,
} from "../entities/Player.ts";
import { createScene, type Scene } from "../../engine/lib/Scene.ts";
import {
  type Circle,
  createKinemeticCircle,
  createKinemeticRectangle,
  type KinematicBody,
  processKinematicBodies,
  type Rectangle,
  rectangleContainsCircle,
  rectangleContainsRectangle,
  setActiveKinematicBodies,
  ShapeType,
  type UnionShape,
  updateKinematicBody,
} from "../../engine/lib/KinematicBody.ts";
import { focusViewport } from "../../engine/stateful/View.ts";
import { createSprite, drawSprite } from "../../engine/lib/Sprite.ts";
import type { Drawable } from "../../engine/lib/Drawable.ts";

const scene: Scene = createScene(process, {
  width: 1536,
  height: 1024,
  preProcess,
  postProcess,
});

function preProcess(): void {
  if (self.navigator.maxTouchPoints > 0) {
    applyTouchControls();
  }
}

function postProcess(): void {
  if (self.navigator.maxTouchPoints > 0) {
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
    (self, delta, friction) => {
      updateKinematicBody(self, delta, friction);
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

const onIceFriction = 0.5;

function process(ctx: CanvasRenderingContext2D, delta: number): void {
  drawSprite(background, ctx);
  drawSprite(iceFloor.animation, ctx);

  ySortedObjects.sort((a, b) => a.position.y - b.position.y);
  for (const object of ySortedObjects) {
    object.draw(ctx, delta);
  }

  focusViewport(player.kinematicBody.origin.x, player.kinematicBody.origin.y);

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

    body.update(body, delta, friction);
  }

  processKinematicBodies(activeKinematicBodies, staticBodies, kinematicBodies);

  processPlayer(
    player,
    delta,
    rectangleContainsCircle(iceFloor.collisionBody, player.kinematicBody)
      ? 0.5
      : 0.5,
  );

  setActiveKinematicBodies(activeKinematicBodies, kinematicBodies);
}

export default scene;
