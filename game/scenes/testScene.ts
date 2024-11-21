import { renderTouchControls } from "../../engine/system/TouchControls.ts";
import {
  animatePlayer,
  createPlayer,
  processPlayer,
  type Player,
} from "../entity/Player.ts";
import { renderGrid, grid } from "../entity/Grid.ts";
import { createScene, type Scene } from "../../engine/system/Scene.ts";

const player: Player = createPlayer({
  x: (self.innerWidth - 64) / 2,
  y: (self.innerHeight - 64) / 2,
});

const testScene: Scene = createScene(1200, 800);

testScene.process.push((delta: number) => {
  processPlayer(player, delta);
});

testScene.animations.push((ctx: CanvasRenderingContext2D, delta: number) => {
  renderGrid(grid, ctx);
  animatePlayer(player, ctx, delta);
  renderTouchControls(ctx);
});

export { testScene };
