import {
  applyTouchControls,
  removeTouchControls,
} from "../../lib/TouchControls.ts";
import { pointer } from "../../lib/Pointer.ts";
import {
  animatePlayer,
  createPlayer,
  Direction,
  processPlayer,
  setDirection,
  type Player,
} from "../entities/Player.ts";
import { createGrid, type Grid } from "../entities/Grid.ts";
import { createScene, type Scene } from "../../lib/Scene.ts";
import { createNode, paintNode } from "../entities/Node.ts";
import {
  rectangleContainsCircle,
  rectangleContainsRectangle,
  createStaticCircle,
  createStaticRectangle,
  ShapeType,
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
import {
  createSprite,
  drawSprite,
  createSpritePlayer,
  playbackSpritePlayer,
} from "../../lib/Sprite.ts";

const scene: Scene = createScene(process, {
  width: 1536,
  height: 1024,
  preProcess,
  postProcess,
});

const grid: Grid = createGrid(scene.width, scene.height, 64);
const pointerNode = createNode(pointer.position);
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

const portalA = {
  animation: createSpritePlayer(
    createSprite({
      imageSrc: "/portal.png",
      width: 64,
      height: 64,
      frameWidth: 16,
      frameHeight: 16,
      xFrames: 3,
      yFrames: 1,
    }),
    334,
  ),
  collisionBody: createStaticCircle({ x: 512, y: 448 }, 16),
};

const portalB = {
  animation: createSpritePlayer(
    createSprite({
      imageSrc: "/portal2.png",
      width: 64,
      height: 64,
      frameWidth: 16,
      frameHeight: 16,
      xFrames: 3,
      yFrames: 1,
    }),
    334,
  ),
  collisionBody: createStaticCircle({ x: 768, y: 448 }, 16),
};

function animatePortal(
  portal: typeof portalA | typeof portalB,
  ctx: CanvasRenderingContext2D,
  delta: number,
): void {
  const globalAlpha = ctx.globalAlpha;
  ctx.globalAlpha = 0.667;

  playbackSpritePlayer(
    portal.animation,
    {
      x: portal.collisionBody.origin.x - portal.animation.sprite.width * 0.5,
      y: portal.collisionBody.origin.y - portal.animation.sprite.height * 0.625,
    },
    ctx,
    delta,
  );

  ctx.globalAlpha = globalAlpha;
}

const background = createSprite({
  imageSrc: "/test-scene.png",
  width: scene.width,
  height: scene.height,
  frameWidth: scene.width / 4,
  frameHeight: scene.height / 4,
  xFrames: 1,
  yFrames: 1,
});

const iceFloor = {
  animation: createSprite({
    imageSrc: "/ice-floor.png",
    width: 128 * 4,
    height: 64 * 4,
    frameWidth: 128,
    frameHeight: 64,
    xFrames: 1,
    yFrames: 1,
  }),
  collisionBody: createStaticRectangle(
    { x: 256, y: scene.height - 448 },
    512,
    256,
  ),
};

const icicle = {
  animation: createSprite({
    imageSrc: "/icicle.png",
    width: 64,
    height: 128,
    frameWidth: 16,
    frameHeight: 32,
    xFrames: 1,
    yFrames: 1,
  }),
  collisionBody: createStaticCircle(
    { x: scene.width / 2, y: scene.height / 2 - 192 },
    28,
  ),
};

const activeKinematicBodies: Array<KinematicBody<Circle | Rectangle>> = [];
const collisionBodies = [
  wall,
  icicle.collisionBody,
  portalA.collisionBody,
  portalB.collisionBody,
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
  grid.render(ctx);

  const playerFrictionModIce = rectangleContainsCircle(
    iceFloor.collisionBody,
    player.kinematicBody,
  )
    ? 0.015
    : 1;

  processPlayer(player, playerFrictionModIce);

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

  drawSprite(background, { x: 0, y: 0 }, ctx);
  drawSprite(iceFloor.animation, iceFloor.collisionBody.origin, ctx);
  drawSprite(
    icicle.animation,
    {
      x: icicle.collisionBody.origin.x - 28,
      y: icicle.collisionBody.origin.y - 86,
    },
    ctx,
  );

  // renderStaticBodies(collisionBodies, ctx);
  renderKinematicBodies(kinematicBodies, ctx);
  renderKinematicBodies(activeKinematicBodies, ctx);

  animatePlayer(player, ctx, delta);
  animatePortal(portalA, ctx, delta);
  animatePortal(portalB, ctx, delta);

  focusViewportToPlayerPosition();

  pointerNode.position = pointer.position;
  paintNode(pointerNode, ctx, "rgba(255, 255, 255, 0.5)");
}

export default scene;
