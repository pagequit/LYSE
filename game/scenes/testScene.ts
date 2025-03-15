import {
  applyTouchControls,
  removeTouchControls,
} from "../../engine/TouchControls.ts";
import { pointer } from "../../engine/Pointer.ts";
import {
  animatePlayer,
  createPlayer,
  Direction,
  type Player,
  processPlayer,
  setDirection,
} from "../entities/Player.ts";
import { createGrid, type Grid } from "../entities/Grid.ts";
import {
  changeScene,
  createScene,
  type Scene,
  setSceneCameraPosition,
} from "../../engine/Scene.ts";
import nodeScene from "./nodeScene.ts";
import { createNode, paintNode } from "../entities/Node.ts";
import {
  createCollisionCircle,
  createCollisionRectangle,
  renderCircle,
  renderRectangle,
  ShapeType,
  type Circle,
  type CollisionBody,
  type Rectangle,
} from "../../engine/CollisionBody.ts";
import {
  createKinemeticCircle,
  createKinemeticRectangle,
  processCircleRectangleCollisionKinematics,
  renderKinemeticCircle,
  renderKinemeticRectangle,
  updateKinematicBody,
  type KinematicBody,
} from "../../engine/KinematicBody.ts";

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

const kiniematicCircle = createKinemeticCircle(
  { x: scene.width / 2, y: scene.height / 2 + 256 },
  32,
);

const collisionBodies = [collisionRectangle, collisionCircle];
const kinematicBodies = [kinematicRectangle, kiniematicCircle];

function process(ctx: CanvasRenderingContext2D, delta: number): void {
  grid.render(ctx);

  processPlayer(player, collisionBodies, kinematicBodies, delta);

  processCircleRectangleCollisionKinematics(
    kiniematicCircle,
    kinematicRectangle,
  );
  for (const body of kinematicBodies) {
    updateKinematicBody(body, delta, 1);
  }

  for (const body of collisionBodies) {
    switch (body.type) {
      case ShapeType.Circle: {
        renderCircle(body as CollisionBody<Circle>, ctx);
        break;
      }
      case ShapeType.Rectangle: {
        renderRectangle(body as CollisionBody<Rectangle>, ctx);
        break;
      }
    }
  }

  for (const body of kinematicBodies) {
    switch (body.type) {
      case ShapeType.Circle: {
        renderKinemeticCircle(body as KinematicBody<Circle>, ctx);
        break;
      }
      case ShapeType.Rectangle: {
        renderKinemeticRectangle(body as KinematicBody<Rectangle>, ctx);
        break;
      }
    }
  }

  animatePlayer(player, ctx, delta);

  pointerNode.position = pointer.position;
  paintNode(pointerNode, ctx, "rgba(255, 255, 255, 0.5)");

  setSceneCameraPosition(
    player.position.x - (self.innerWidth - 64) / 2,
    player.position.y - (self.innerHeight - 64) / 2,
  );
}

export default scene;
