import type { Vector } from "./Vector.ts";

export type Drawable = {
  position: Vector;
  draw: (ctx: CanvasRenderingContext2D, delta: number) => void;
};
