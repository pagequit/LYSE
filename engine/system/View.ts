import { type Vector } from "../lib/Vector.ts";

export type Camera = {
  position: Vector;
};

export const camera: Camera = {
  position: { x: 0, y: 0 },
};

export const canvas = document.createElement("canvas");
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

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
