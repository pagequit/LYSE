import { type Vector } from "../lib/Vector.ts";

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

function resize(): void {
  canvas.width = self.innerWidth;
  canvas.height = self.innerHeight;
  ctx.imageSmoothingEnabled = false;
}

export function applyCanvas(): void {
  document.body.appendChild(canvas);
  self.addEventListener("resize", resize);
  resize();
}

export function removeCanvas(): void {
  self.removeEventListener("resize", resize);
  document.body.removeChild(canvas);
}
