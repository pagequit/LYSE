import "./style.css";
import { useAnimationProcess } from "./engine/system/animate.ts";
import { renderTouchControls } from "./engine/system/TouchControls.ts";
import {
  animatePlayer,
  createPlayer,
  Direction,
  processPlayer,
  setDirection,
  setState,
  State,
} from "./game/entity/Player.ts";
import { renderGrid, grid } from "./game/entity/Grid.ts";
import { useCanvas } from "./engine/system/View.ts";

const { canvas } = useCanvas();

const player = createPlayer({
  x: (canvas.width - 64) / 2,
  y: (canvas.height - 64) / 2,
});

setState(player, State.Idle);
setDirection(player, Direction.Down);

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
