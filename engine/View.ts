import { type Vector } from "./Vector.ts";
import { game } from "./Game.ts";

export const canvas = document.createElement("canvas");
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const container = document.createElement("div");
container.style.display = "flex";
container.style.justifyContent = "center";
container.style.alignItems = "center";
container.style.background = "#161616";
container.appendChild(canvas);

export type Viewport = {
  offset: Vector;
  zoom: number;
};

export function createViewport(): Viewport {
  return {
    offset: { x: 0, y: 0 },
    zoom: 1.0,
  };
}

export function resizeCanvas(): void {
  canvas.width = Math.min(
    self.innerWidth,
    game.scene.width * game.scene.viewport.zoom,
  );
  canvas.height = Math.min(
    self.innerHeight,
    game.scene.height * game.scene.viewport.zoom,
  );
  ctx.imageSmoothingEnabled = false;
}

export function adoptView(): void {
  document.body.appendChild(container);
  self.addEventListener("resize", resizeCanvas);
}

export function removeCanvas(): void {
  self.removeEventListener("resize", resizeCanvas);
  document.body.removeChild(container);
}

export function resetViewport(ctx: CanvasRenderingContext2D): void {
  ctx.restore();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(-game.scene.viewport.offset.x, -game.scene.viewport.offset.y);
  ctx.scale(game.scene.viewport.zoom, game.scene.viewport.zoom);
}
