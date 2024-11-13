import { type Vector } from "../lib/Vector.ts";

const offset: Vector = { x: 0, y: 0 };
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

function resize(): void {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

export function useCanvas() {
  document.body.appendChild(canvas);

  window.addEventListener("resize", resize);
  resize();

  return { canvas, ctx, offset };
}
