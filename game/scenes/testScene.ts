import { renderTouchControls } from "../../engine/system/TouchControls.ts";
import {
  animatePlayer,
  createPlayer,
  type Player,
  processPlayer,
} from "../entity/Player.ts";
import { grid, renderGrid } from "../entity/Grid.ts";
import { changeScene, createScene } from "../../engine/system/Scene.ts";
import nodeScene from "./nodeScene.ts";

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
}

function destruct(): void {
  self.removeEventListener("keyup", handleEscape);
}

export default createScene(
  (ctx: CanvasRenderingContext2D, delta: number) => {
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
