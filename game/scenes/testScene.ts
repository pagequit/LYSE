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
import {
  changeScene,
  createScene,
  focusSceneCameraToPosition,
  type Scene,
} from "../../engine/Scene.ts";
import nodeScene from "./nodeScene.ts";
import { createNode, paintNode } from "../entities/Node.ts";
import {
  checkCircleCollision,
  checkCircleContainsCircle,
  checkCircleContainsRectangle,
  checkCircleRectangleCollision,
  checkRectangleCollision,
  checkRectangleContainsRectangle,
  createCollisionCircle,
  createCollisionRectangle,
  renderCircle,
  renderCollisionBodies,
  renderRectangle,
  ShapeType,
  type Circle,
  type Rectangle,
} from "../../engine/CollisionBody.ts";
import {
  createKinemeticCircle,
  createKinemeticRectangle,
  updateKinematicBody,
  renderKinematicBodies,
  processKinematicBodies,
  type KinematicBody,
} from "../../engine/KinematicBody.ts";
import { isZero } from "../../engine/Vector.ts";

const scene: Scene = createScene(process, {
  width: 2048,
  height: 1152,
  construct,
  destruct,
});

const grid: Grid = createGrid(scene.width, scene.height, 64);
const pointerNode = createNode(pointer.position);
const isTouchDevice = self.navigator.maxTouchPoints > 0;

function handleEscape({ key }: KeyboardEvent): void {
  if (key === "Escape") {
    changeScene(nodeScene);
  }
}

function construct(): void {
  self.addEventListener("keyup", handleEscape);

  if (isTouchDevice) {
    applyTouchControls();
  }
}

function destruct(): void {
  self.removeEventListener("keyup", handleEscape);

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

const collisionCircle = createCollisionCircle(
  { x: scene.width / 2, y: scene.height / 2 - 128 },
  32,
);

const collisionRectangle = createCollisionRectangle(
  { x: scene.width / 2, y: scene.height / 2 - 128 },
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

const iceFloor = createCollisionRectangle(
  { x: 256, y: scene.height - 512 },
  512,
  256,
);

const swamp = createCollisionCircle({ x: 512, y: scene.height - 512 }, 128);

const wall = createCollisionRectangle({ x: 256, y: 512 }, 16, scene.height / 2);

const collisionBodies = [collisionRectangle, collisionCircle, wall];
const kinematicBodies = [
  player.kinematicBody,
  kinematicRectangle,
  kiniematicCircle,
  kinematicSquare,
];

const activeKinematicBodies: Array<KinematicBody<Circle | Rectangle>> = [];

function process(ctx: CanvasRenderingContext2D, delta: number): void {
  grid.render(ctx);

  const playerFrictionModSwamp = checkCircleContainsCircle(
    swamp,
    player.kinematicBody,
  )
    ? 0.5
    : 1;
  const playerFrictionModIce = checkCircleRectangleCollision(
    player.kinematicBody,
    iceFloor,
  )
    ? 0.015
    : 1;

  processPlayer(player, playerFrictionModSwamp * playerFrictionModIce);

  // I don't think that I want to do this in any scene separately
  activeKinematicBodies.length = 0;
  for (const body of kinematicBodies) {
    if (!isZero(body.velocity)) {
      activeKinematicBodies.push(body);
    }
  }

  // anyway, I want to be able to control the active bodies, don't I?
  processKinematicBodies(
    activeKinematicBodies,
    collisionBodies,
    kinematicBodies,
  );

  // both, filter for active bodies and process them, might belong to the update function, don't ya?
  for (const body of activeKinematicBodies) {
    let onIce = false;
    switch (body.type) {
      case ShapeType.Circle: {
        onIce = checkCircleRectangleCollision(
          body as KinematicBody<Circle>,
          iceFloor,
        );

        break;
      }
      case ShapeType.Rectangle: {
        onIce = checkRectangleCollision(
          body as KinematicBody<Rectangle>,
          iceFloor,
        );

        if (
          checkRectangleContainsRectangle(
            iceFloor,
            body as KinematicBody<Rectangle>,
          )
        ) {
          console.log("on ice");
        }

        if (
          checkCircleContainsRectangle(swamp, body as KinematicBody<Rectangle>)
        ) {
          console.log("in swamp");
        }

        break;
      }
    }

    if (onIce) {
      updateKinematicBody(body, delta, 0.985);
    } else {
      updateKinematicBody(body, delta, 0.1);
    }
  }

  focusSceneCameraToPosition(player.position);

  renderRectangle(iceFloor, ctx, "rgba(255, 255, 255, 0.5)");
  renderCircle(swamp, ctx, "rgba(0, 0, 0, 0.5)");

  renderCollisionBodies(collisionBodies, ctx);
  renderKinematicBodies(kinematicBodies, ctx);
  renderKinematicBodies(activeKinematicBodies, ctx);

  animatePlayer(player, ctx, delta);

  pointerNode.position = pointer.position;
  paintNode(pointerNode, ctx, "rgba(255, 255, 255, 0.5)");
}

export default scene;
