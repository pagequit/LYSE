import { renderTouchControls } from "../../engine/system/TouchControls.ts";
import { pointer } from "../../engine/system/Pointer.ts";
import {
  animatePlayer,
  createPlayer,
  type Player,
  processPlayer,
} from "../entity/Player.ts";
import { grid, renderGrid } from "../entity/Grid.ts";
import { changeScene, createScene } from "../../engine/system/Scene.ts";
import nodeScene from "./nodeScene.ts";
import scene from "./nodeScene.ts";
import { paintNode, createNode } from "../entity/Node.ts";

const player: Player = createPlayer({
  x: (self.innerWidth - 64) / 2,
  y: (self.innerHeight - 64) / 2,
});

function handleEscape({ key }: KeyboardEvent): void {
  if (key === "Escape") {
    changeScene(nodeScene);
  }
}

function construct(): void {
  self.addEventListener("keyup", handleEscape);
  pointer.offset.x = 0;
  pointer.offset.y = 0;
}

function destruct(): void {
  self.removeEventListener("keyup", handleEscape);
}

const pointerNode = createNode(pointer.position);

export default createScene(
  (ctx: CanvasRenderingContext2D, delta: number) => {
    pointerNode.position = pointer.position;
    paintNode(pointerNode, ctx, "rgba(255, 255, 255, 0.5)");

    scene.offset.x = player.position.x - (self.innerWidth - 64) / 2;
    scene.offset.y = player.position.y - (self.innerHeight - 64) / 2;

    ctx.translate(-scene.offset.x, -scene.offset.y);
    renderGrid(grid, ctx);
    animatePlayer(player, ctx, delta);
    renderTouchControls(ctx);
    processPlayer(player, delta);
  },
  {
    width: self.innerWidth,
    height: self.innerHeight,
    construct,
    destruct,
  },
);
