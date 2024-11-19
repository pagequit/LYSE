import { useCanvas } from "../../engine/system/View.ts";

const { canvas } = useCanvas();

export type Grid = {
  height: number;
  width: number;
  tileSize: number;
  x: number;
  y: number;
};

export const grid: Grid = {
  height: canvas.height,
  width: canvas.width,
  tileSize: 64,
  x: canvas.width / 64,
  y: canvas.height / 64,
};

export function renderGrid(grid: Grid, ctx: CanvasRenderingContext2D): void {
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
