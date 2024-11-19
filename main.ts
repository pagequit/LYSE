import "./style.css";
import { useAnimationProcess } from "./engine/system/animate.ts";
import { renderTouchControls } from "./engine/system/TouchControls.ts";
import {
  animatePlayer,
  createPlayer,
  processPlayer,
} from "./game/entity/Player.ts";
import { renderGrid, grid } from "./game/entity/Grid.ts";

const player = createPlayer({
  x: (self.innerWidth - 64) / 2,
  y: (self.innerHeight - 64) / 2,
});

const { animate, addProcess, addAnimation } = useAnimationProcess();
addProcess((delta: number) => {
  processPlayer(player, delta);
});
addAnimation((ctx: CanvasRenderingContext2D, delta: number) => {
  renderGrid(grid, ctx);
  animatePlayer(player, ctx, delta);
  renderTouchControls(ctx);
});
animate();
