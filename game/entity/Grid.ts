import { createRenderable, type Renderable } from "../../engine/lib/Renderable";

export type Grid = {
  tileSize: number;
  width: number;
  height: number;
  x: number;
  y: number;
} & Renderable;

function render(this: Grid, ctx: CanvasRenderingContext2D): void {
  for (let i = 0; i < this.x; i++) {
    for (let j = 0; j < this.y; j++) {
      ctx.fillStyle = i % 2 === j % 2 ? "transparent" : "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(
        i * this.tileSize,
        j * this.tileSize,
        this.tileSize,
        this.tileSize,
      );
    }
  }
}

export function createGrid(
  width: number,
  height: number,
  tileSize: number,
): Grid {
  return createRenderable(
    {
      tileSize,
      width,
      height,
      x: width / tileSize,
      y: height / tileSize,
    },
    render,
  );
}
