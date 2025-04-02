import { type Vector } from "./Vector.ts";
import { game } from "./Game.ts";

export const canvas = document.createElement("canvas");
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const container = document.createElement("div");
container.style.display = "flex";
container.style.justifyContent = "center";
container.style.alignItems = "center";
container.style.background = "#161616"; // FIXME
container.appendChild(canvas);

export type Viewport = {
  origin: Vector;
};

export function createViewport(x: number = 0, y: number = 0): Viewport {
  return {
    origin: { x, y },
  };
}

export function resizeCanvas(): void {
  canvas.width = Math.min(
    self.innerWidth,
    game.scene.width * game.settings.scale,
  );
  canvas.height = Math.min(
    self.innerHeight,
    game.scene.height * game.settings.scale,
  );
  ctx.imageSmoothingEnabled = false;
}

export function adoptCanvas(): void {
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
  ctx.translate(-game.scene.viewport.origin.x, -game.scene.viewport.origin.y);
  ctx.scale(game.settings.scale, game.settings.scale);
}

export function setViewportOrigin(x: number, y: number): void {
  game.scene.viewport.origin.x = Math.max(
    0,
    Math.min(x, game.scene.width * game.settings.scale - self.innerWidth),
  );

  game.scene.viewport.origin.y = Math.max(
    0,
    Math.min(y, game.scene.height * game.settings.scale - self.innerHeight),
  );
}

export function focusViewport(x: number, y: number): void {
  setViewportOrigin(
    x * game.settings.scale - self.innerWidth / 2,
    y * game.settings.scale - self.innerHeight / 2,
  );
}

const panOrigin: Vector = { x: 0, y: 0 };
const panDelta: Vector = { x: 0, y: 0 };

export function startPenning(x: number, y: number): void {
  panOrigin.x = x;
  panOrigin.y = y;
  panDelta.x = 0;
  panDelta.y = 0;
}

export function updatePanning(x: number, y: number): void {
  panDelta.x = panOrigin.x - x;
  panDelta.y = panOrigin.y - y;

  setViewportOrigin(
    game.scene.viewport.origin.x + panDelta.x,
    game.scene.viewport.origin.y + panDelta.y,
  );
}
