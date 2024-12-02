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
import { grid, renderGrid } from "../entity/Grid.ts";
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

function handleEscape({ key }: KeyboardEvent): void {
  if (key === "Escape") {
    changeScene(nodeScene);
  }
}

const scene: Scene = createScene(process, {
  width: self.innerWidth,
  height: self.innerHeight,
  construct,
  destruct,
});

const isTouchDevice = "ontouchstart" in self || navigator.maxTouchPoints > 0;

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

const pointerNode = createNode(pointer.position);

function process(ctx: CanvasRenderingContext2D, delta: number): void {
  scene.camera.position.x = player.position.x - (self.innerWidth - 64) / 2;
  scene.camera.position.y = player.position.y - (self.innerHeight - 64) / 2;

  pointerNode.position = pointer.position;
  paintNode(pointerNode, ctx, "rgba(255, 255, 255, 0.5)");

  renderGrid(grid, ctx);
  animatePlayer(player, ctx, delta);
  processPlayer(player, delta);
}

export default scene;
