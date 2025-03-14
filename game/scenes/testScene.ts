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
  createCollisionRectangle,
  renderCircle,
  renderRectangle,
} from "../../engine/CollisionBody.ts";
import {
  createKinemeticCircle,
  createKinemeticRectangle,
  processCircleRectangleCollisionKinematics,
  renderKinemeticCircle,
  renderKinemeticRectangle,
  updateKinematicBody,
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
  { x: (scene.width - 64) / 2, y: ((scene.height - 64) / 2) * 0.725 },
  64,
  64,
);
setDirection(player, Direction.Right);

const dummy: Player = createPlayer(
  { x: (scene.width - 64) / 2, y: ((scene.height - 64) / 2) * 1.125 },
  128,
  128,
);
setDirection(dummy, Direction.Left);

const collisionRectangle = createCollisionRectangle(
  { x: scene.width / 2, y: (scene.height / 2) * 0.725 },
  64,
  64,
);

const kinematicRectangle = createKinemeticRectangle(
  { x: scene.width / 2 - 96, y: (scene.height / 2) * 0.75 },
  128,
  64,
);

const kiniematicCircle = createKinemeticCircle(
  { x: scene.width / 2, y: (scene.height / 2) * 1.175 },
  32,
);

const collisionBodies = [collisionRectangle];
const kinematicBodies = [kinematicRectangle, kiniematicCircle];

function process(ctx: CanvasRenderingContext2D, delta: number): void {
  grid.render(ctx);

  processPlayer(player, collisionBodies, kinematicBodies, delta);

  processCircleRectangleCollisionKinematics(
    kiniematicCircle,
    kinematicRectangle,
  );
  for (const body of kinematicBodies) {
    updateKinematicBody(body, delta, 0.99);
  }

  animatePlayer(player, ctx, delta);
  animatePlayer(dummy, ctx, delta);

  renderCircle(player.collisionBody, ctx);
  renderCircle(dummy.collisionBody, ctx);
  renderRectangle(collisionRectangle, ctx);

  renderKinemeticRectangle(kinematicRectangle, ctx);
  renderKinemeticCircle(kiniematicCircle, ctx);

  pointerNode.position = pointer.position;
  paintNode(pointerNode, ctx, "rgba(255, 255, 255, 0.5)");

  setSceneCameraPosition(
    player.position.x - (self.innerWidth - 64) / 2,
    player.position.y - (self.innerHeight - 64) / 2,
  );
}

export default scene;
