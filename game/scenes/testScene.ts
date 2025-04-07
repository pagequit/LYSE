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
  rectangleContainsCircle,
  rectangleContainsRectangle,
  createStaticCircle,
  createStaticRectangle,
  ShapeType,
  renderStaticBodies,
  type Circle,
  type Rectangle,
} from "../../lib/StaticBody.ts";
import {
  createKinemeticCircle,
  createKinemeticRectangle,
  updateKinematicBody,
  renderKinematicBodies,
  processKinematicBodies,
  type KinematicBody,
  setActiveKinematicBodies,
} from "../../lib/KinematicBody.ts";
import type { Vector } from "../../lib/Vector.ts";
import { focusViewport } from "../../lib/View.ts";
import { createSprite, drawSprite } from "../../lib/Sprite.ts";

const scene: Scene = createScene(process, {
  width: 1536,
  height: 1024,
  preProcess,
  postProcess,
});

const isTouchDevice = self.navigator.maxTouchPoints > 0;

function preProcess(): void {
  if (isTouchDevice) {
    applyTouchControls();
  }
}

function postProcess(): void {
  if (isTouchDevice) {
    removeTouchControls();
  }
}

const player: Player = createPlayer(
  { x: (scene.width - 64) / 2, y: (scene.height - 64) / 2 + 16 },
  64,
  64,
);
setDirection(player, Direction.Right);

const kinematicRectangle = createKinemeticRectangle(
  { x: scene.width / 2 - 96, y: scene.height / 2 + 64 },
  128,
  64,
);

const kinematicSquare = createKinemeticRectangle(
  { x: scene.width / 2 - 96, y: scene.height / 2 + 128 },
  64,
  64,
);

const kiniematicCircle = createKinemeticCircle(
  { x: scene.width / 2, y: scene.height / 2 + 256 },
  32,
);

const wall = createStaticRectangle({ x: 0, y: 0 }, scene.width, 64 * 3);

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
  collisionBody: createStaticRectangle(iceFloorPosition, 512, 256),
};

const iciclePosition = {
  x: scene.width / 2,
  y: scene.height / 2 - 192,
};
const icicle = {
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
  collisionBody: createStaticCircle(iciclePosition, 28),
};

const DERSCHNEEMANN_POSITION = {
  x: scene.width / 2 + 128,
  y: scene.height / 2 - 192,
};
const DERSCHNEEMANN = {
  animation: createSprite({
    imageSrc: "/DERSCHNEEMANN.png",
    origin: {
      x: DERSCHNEEMANN_POSITION.x - 32,
      y: DERSCHNEEMANN_POSITION.y - 42,
    },
    width: 64,
    height: 64,
    frameWidth: 16,
    frameHeight: 16,
    xFrames: 1,
    yFrames: 1,
  }),
  collisionBody: createStaticCircle(DERSCHNEEMANN_POSITION, 20),
};

const activeKinematicBodies: Array<KinematicBody<Circle | Rectangle>> = [];
const collisionBodies = [
  wall,
  DERSCHNEEMANN.collisionBody,
  icicle.collisionBody,
];
const kinematicBodies = [
  player.kinematicBody,
  kinematicRectangle,
  kiniematicCircle,
  kinematicSquare,
];

const deltaPosition: Vector = {
  x: player.position.x,
  y: player.position.y,
};

function renderFrameAndPosition(
  player: Player,
  ctx: CanvasRenderingContext2D,
): void {
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#fddf68";
  ctx.beginPath();
  ctx.arc(player.position.x, player.position.y, 4, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.strokeRect(
    player.animations[player.state].sprite.origin.x,
    player.animations[player.state].sprite.origin.y,
    player.animations[player.state].sprite.width,
    player.animations[player.state].sprite.height,
  );
}

function focusViewportToPlayerPosition(): void {
  if (
    player.position.x ** 2 +
      player.position.y ** 2 -
      (deltaPosition.x ** 2 + deltaPosition.y ** 2) >
    1
  ) {
    focusViewport(player.position.x, player.position.y);
  } else {
    focusViewport(deltaPosition.x, deltaPosition.y);
  }

  deltaPosition.x = player.position.x;
  deltaPosition.y = player.position.y;
}

function process(ctx: CanvasRenderingContext2D, delta: number): void {
  processPlayer(
    player,
    rectangleContainsCircle(iceFloor.collisionBody, player.kinematicBody)
      ? 0.015
      : 1,
  );

  setActiveKinematicBodies(activeKinematicBodies, kinematicBodies);

  processKinematicBodies(
    activeKinematicBodies,
    collisionBodies,
    kinematicBodies,
  );

  for (const body of activeKinematicBodies) {
    let onIce = false;
    switch (body.type) {
      case ShapeType.Circle: {
        onIce = rectangleContainsCircle(
          iceFloor.collisionBody,
          body as KinematicBody<Circle>,
        );

        break;
      }
      case ShapeType.Rectangle: {
        onIce = rectangleContainsRectangle(
          iceFloor.collisionBody,
          body as KinematicBody<Rectangle>,
        );

        break;
      }
    }

    if (onIce) {
      updateKinematicBody(body, 0.99);
    } else {
      updateKinematicBody(body, 0.5);
    }
  }

  focusViewportToPlayerPosition();

  drawSprite(background, ctx);
  drawSprite(iceFloor.animation, ctx);
  drawSprite(DERSCHNEEMANN.animation, ctx);
  drawSprite(icicle.animation, ctx);

  animatePlayer(player, ctx, delta);

  renderStaticBodies(collisionBodies, ctx);
  renderKinematicBodies(kinematicBodies, ctx);
  renderKinematicBodies(activeKinematicBodies, ctx);

  renderFrameAndPosition(player, ctx);
}

export default scene;
