import "./style.css";
import { colors } from "./style.ts";
import { useCanvas } from "./engine/system/View.ts";
import { input, useInputs } from "./engine/system/Input.ts";
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

const { canvas, ctx } = useCanvas();

const processInputs = useInputs();

const player = createPlayer({
  x: (canvas.width - 64) / 2,
  y: (canvas.height - 64) / 2,
});

setState(player, State.Idle);
setDirection(player, Direction.Down);

type Grid = {
  height: number;
  width: number;
  tileSize: number;
  x: number;
  y: number;
};

const grid: Grid = {
  height: canvas.height,
  width: canvas.width,
  tileSize: 64,
  x: canvas.width / 64,
  y: canvas.height / 64,
};

function renderGrid(grid: Grid, ctx: CanvasRenderingContext2D): void {
  for (let i = 0; i < grid.x; i++) {
    for (let j = 0; j < grid.y; j++) {
      ctx.fillStyle = i % 2 === j % 2 ? "transparent" : "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(
        i * grid.tileSize,
        j * grid.tileSize,
        grid.tileSize,
        grid.tileSize,
      );
    }
  }
}

let now: number = Date.now();
let then: number = Date.now();
let delta: number = 0;
(function animate() {
  requestAnimationFrame(animate);
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  renderGrid(grid, ctx);

  processInputs();
  processPlayer(player, input, delta);
  animatePlayer(player, ctx, delta);

  renderTouchControls(ctx);

  then = now;
  now = Date.now();
  delta = now - then;

  ctx.fillStyle = colors.foregroundColor;
  ctx.fillText(`FPS: ${Math.round(1000 / delta)}`, 10, 20);

  ctx.restore();
})();
