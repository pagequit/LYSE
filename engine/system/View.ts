import { type Vector } from "../lib/Vector.ts";
import { game } from "./Game.ts";

export type Camera = {
  position: Vector;
};

export const canvas = document.createElement("canvas");
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

export function createCamera(): Camera {
  return {
    position: { x: 0, y: 0 },
  };
}

export function resizeCanvas(): void {
  canvas.width = Math.min(self.innerWidth, game.scene.width);
  canvas.height = Math.min(self.innerHeight, game.scene.height);
  ctx.imageSmoothingEnabled = false;
}

export function applyCanvas(): void {
  document.body.appendChild(canvas);
  self.addEventListener("resize", resizeCanvas);
}

export function removeCanvas(): void {
  self.removeEventListener("resize", resizeCanvas);
  document.body.removeChild(canvas);
}
