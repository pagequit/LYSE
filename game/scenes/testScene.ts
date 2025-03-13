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

const scene: Scene = createScene(process, {
  width: 2048,
  height: 1152,
  construct,
  destruct,
});

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

const grid: Grid = createGrid(scene.width, scene.height, 64);
const pointerNode = createNode(pointer.position);
const isTouchDevice = self.navigator.maxTouchPoints > 0;

const rectangle = createCollisionRectangle(
  { x: scene.width / 2 - 96, y: (scene.height / 2) * 0.75 },
  128,
  64,
);

const collisionShapes = [dummy.collisionBody, rectangle];

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

function process(ctx: CanvasRenderingContext2D, delta: number): void {
  grid.render(ctx);

  processPlayer(player, collisionShapes, delta);

  animatePlayer(player, ctx, delta);
  animatePlayer(dummy, ctx, delta);

  renderCircle(player.collisionBody, ctx);
  renderCircle(dummy.collisionBody, ctx);
  renderRectangle(rectangle, ctx);

  pointerNode.position = pointer.position;
  paintNode(pointerNode, ctx, "rgba(255, 255, 255, 0.5)");

  setSceneCameraPosition(
    player.position.x - (self.innerWidth - 64) / 2,
    player.position.y - (self.innerHeight - 64) / 2,
  );
}

export default scene;
