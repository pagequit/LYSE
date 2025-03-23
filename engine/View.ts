import { type Vector } from "./Vector.ts";
import { game } from "./Game.ts";

export const canvas = document.createElement("canvas");
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

export type Viewport = {
  offset: Vector;
  zoom: number;
};

export function createViewport(): Viewport {
  return {
    offset: { x: 0, y: 0 },
    zoom: 0.9,
  };
}

export function resizeCanvas(): void {
  canvas.width = Math.min(self.innerWidth, game.scene.width);
  canvas.height = Math.min(self.innerHeight, game.scene.height);
  ctx.imageSmoothingEnabled = false;
}

export function adoptCanvas(): void {
  document.body.appendChild(canvas);
  self.addEventListener("resize", resizeCanvas);
}

export function removeCanvas(): void {
  self.removeEventListener("resize", resizeCanvas);
  document.body.removeChild(canvas);
}

export function resetViewport(ctx: CanvasRenderingContext2D): void {
  ctx.restore();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(-game.scene.viewport.offset.x, -game.scene.viewport.offset.y);
  ctx.scale(game.scene.viewport.zoom, game.scene.viewport.zoom);
}
