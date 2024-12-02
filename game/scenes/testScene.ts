import {
  applyTouchControls,
  removeTouchControls,
} from "../../engine/gui/TouchControls.ts";
import { pointer } from "../../engine/system/Pointer.ts";
import {
  animatePlayer,
  createPlayer,
  type Player,
  processPlayer,
} from "../entity/Player.ts";
import { createGrid, type Grid } from "../entity/Grid.ts";
import {
  changeScene,
  createScene,
  type Scene,
} from "../../engine/system/Scene.ts";
import nodeScene from "./nodeScene.ts";
import { createNode, paintNode } from "../entity/Node.ts";

const player: Player = createPlayer({
  x: (self.innerWidth - 64) / 2,
  y: (self.innerHeight - 64) / 2,
});

const scene: Scene = createScene(process, {
  width: 1200,
  height: 800,
  construct,
  destruct,
});

const grid: Grid = createGrid(scene.width, scene.height, 64);
const pointerNode = createNode(pointer.position);
const isTouchDevice = "ontouchstart" in self || navigator.maxTouchPoints > 0;

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

  scene.camera.position.x = player.position.x - (self.innerWidth - 64) / 2;
  scene.camera.position.y = player.position.y - (self.innerHeight - 64) / 2;
  pointerNode.position = pointer.position;
  paintNode(pointerNode, ctx, "rgba(255, 255, 255, 0.5)");

  animatePlayer(player, ctx, delta);
  processPlayer(player, delta);
}

export default scene;
