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
  createKinemeticRectangle,
  updateKinematicBody,
  renderKinematicBodies,
  processKinematicBodies,
  type KinematicBody,
  setActiveKinematicBodies,
} from "../../lib/KinematicBody.ts";
import type { Vector } from "../../lib/Vector.ts";
import { focusViewport } from "../../lib/View.ts";
import { createSprite, drawSprite, type Sprite } from "../../lib/Sprite.ts";
import type { SpriteAnimation } from "../../lib/SpriteAnimation.ts";

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

const player: Player = createPlayer(
  { x: (scene.width - 64) / 2, y: (scene.height - 64) / 2 + 16 },
  64,
  64,
);
setDirection(player, Direction.Right);

const iceCubePosition = {
  x: scene.width / 2 + 96,
  y: scene.height / 2 - 64,
};

type RenderNode = {
  position: Vector;
  offset: Vector;
};

const iceCube = {
  animation: createSprite({
    imageSrc: "/ice-cube.png",
    origin: { ...iceCubePosition },
    width: 64,
    height: 64,
    frameWidth: 16,
    frameHeight: 16,
    xFrames: 1,
    yFrames: 1,
  }),
  collisionBody: createKinemeticRectangle(iceCubePosition, 64, 64),
  renderNode: {
    position: { x: 0, y: 0 },
    offset: { x: 32, y: 56 },
  },
};

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
const kinematicBodies = [player.kinematicBody, iceCube.collisionBody];

const deltaPosition: Vector = {
  x: player.position.x,
  y: player.position.y,
};

function renderFrameAndPosition(
  object: {
    animation: Sprite;
    renderNode: RenderNode;
  },
  ctx: CanvasRenderingContext2D,
): void {
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#fddf68";
  ctx.beginPath();
  ctx.arc(
    object.renderNode.position.x,
    object.renderNode.position.y,
    4,
    0,
    2 * Math.PI,
  );
  ctx.stroke();

  ctx.strokeRect(
    object.animation.origin.x,
    object.animation.origin.y,
    object.animation.width,
    object.animation.height,
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

  // move the render stuff here before the kinematic bodies are processed

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

  // this is what I need to do
  // but, there is an offset between the animation and the collision body as well
  // in this case it's just zero by acciddent
  iceCube.animation.origin.x = iceCube.collisionBody.origin.x;
  iceCube.animation.origin.y = iceCube.collisionBody.origin.y;
  iceCube.renderNode.position.x =
    iceCube.animation.origin.x + iceCube.renderNode.offset.x;
  iceCube.renderNode.position.y =
    iceCube.animation.origin.y + iceCube.renderNode.offset.y;

  // so the general plan is:
  // ---
  // (processPlayer?)
  // setActivieKinematicBodies
  // processKinematicBodies
  // updateKinematicBodies
  // update the animation origin of active kinematic bodies
  //  - set the animation origin to the kinematic body origin + offset
  //  - set the renderNode position to the animation origin + offset
  //    * but an inactive kinematic body might become active in the updateKinematicBodies function
  //    * so I have to query the active kinematic bodies again ... that sucks
  //    * or, I render first and then update the kinematic bodies ... probably a good idea
  // y-sort the renderNode positions
  // draw the animations based on the y-sort
  // repeat?

  focusViewportToPlayerPosition();

  drawSprite(background, ctx);

  drawSprite(iceFloor.animation, ctx);
  drawSprite(DERSCHNEEMANN.animation, ctx);
  drawSprite(icicle.animation, ctx);
  drawSprite(iceCube.animation, ctx);

  animatePlayer(player, ctx, delta);

  // renderStaticBodies(collisionBodies, ctx);
  // renderKinematicBodies(kinematicBodies, ctx);
  // renderKinematicBodies(activeKinematicBodies, ctx);

  renderFrameAndPosition(iceCube, ctx);
}

export default scene;
