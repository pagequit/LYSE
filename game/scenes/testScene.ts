import {
  applyTouchControls,
  removeTouchControls,
} from "../../engine/TouchControls.ts";
import { pointer } from "../../engine/Pointer.ts";
import {
  animatePlayer,
  createPlayer,
  Direction,
  processPlayer,
  setDirection,
  type Player,
} from "../entities/Player.ts";
import { createGrid, type Grid } from "../entities/Grid.ts";
import { createScene, type Scene } from "../../engine/Scene.ts";
import { createNode, paintNode } from "../entities/Node.ts";
import {
  circleContainsCircle,
  rectangleContainsCircle,
  rectangleContainsRectangle,
  createStaticCircle,
  createStaticRectangle,
  renderCircle,
  renderStaticBodies,
  renderRectangle,
  ShapeType,
  type Circle,
  type Rectangle,
} from "../../engine/StaticBody.ts";
import {
  createKinemeticCircle,
  createKinemeticRectangle,
  updateKinematicBody,
  renderKinematicBodies,
  processKinematicBodies,
  type KinematicBody,
  setActiveKinematicBodies,
} from "../../engine/KinematicBody.ts";
import type { Vector } from "../../engine/Vector.ts";
import { focusViewport } from "../../engine/View.ts";
import { animateSprite, createSprite } from "../../engine/Sprite.ts";

const scene: Scene = createScene(process, {
  width: 1536,
  height: 1024,
  preProcess,
  postProcess,
});

const grid: Grid = createGrid(scene.width, scene.height, 16);
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

const collisionCircle = createStaticCircle(
  { x: scene.width / 2, y: scene.height / 2 - 192 },
  32,
);

const collisionRectangle = createStaticRectangle(
  { x: scene.width / 2, y: scene.height / 2 - 192 },
  64,
  64,
);

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

const iceFloor = createStaticRectangle(
  { x: 256, y: scene.height - 448 },
  512,
  256,
);

const swamp = createStaticCircle({ x: 512, y: scene.height - 768 }, 128);

const wall = createStaticRectangle({ x: 256, y: 512 }, 16, scene.height / 2);

const portalA = {
  animation: createSprite({
    imageSrc: "/portal.png",
    width: 64,
    height: 64,
    frameDuraton: 1000 / 3,
    frameWidth: 16,
    frameHeight: 16,
    xFrames: 3,
    yFrames: 1,
  }),
  collisionBody: createStaticCircle({ x: 512, y: 448 }, 16),
};

const portalB = {
  animation: createSprite({
    imageSrc: "/portal2.png",
    width: 64,
    height: 64,
    frameDuraton: 1000 / 3,
    frameWidth: 16,
    frameHeight: 16,
    xFrames: 3,
    yFrames: 1,
  }),
  collisionBody: createStaticCircle({ x: 768, y: 448 }, 16),
};

function animatePortal(
  portal: typeof portalA | typeof portalB,
  ctx: CanvasRenderingContext2D,
  delta: number,
): void {
  animateSprite(
    portal.animation,
    {
      x: portal.collisionBody.origin.x - portal.animation.width * 0.5,
      y: portal.collisionBody.origin.y - portal.animation.height * 0.625,
    },
    ctx,
    delta,
  );
}

const activeKinematicBodies: Array<KinematicBody<Circle | Rectangle>> = [];
const collisionBodies = [
  collisionRectangle,
  collisionCircle,
  wall,
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

  const playerFrictionModSwamp = circleContainsCircle(
    swamp,
    player.kinematicBody,
  )
    ? 0.5
    : 1;
  const playerFrictionModIce = rectangleContainsCircle(
    iceFloor,
    player.kinematicBody,
  )
    ? 0.015
    : 1;

  processPlayer(player, playerFrictionModSwamp * playerFrictionModIce);

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
          iceFloor,
          body as KinematicBody<Circle>,
        );

        break;
      }
      case ShapeType.Rectangle: {
        onIce = rectangleContainsRectangle(
          iceFloor,
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

  renderRectangle(iceFloor, ctx, "rgba(255, 255, 255, 0.5)");
  renderCircle(swamp, ctx, "rgba(0, 0, 0, 0.5)");

  renderStaticBodies(collisionBodies, ctx);
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
