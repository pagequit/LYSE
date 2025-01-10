import { type Vector } from "./Vector.ts";
import { createRenderable, type Renderable } from "./Renderable.ts";

export type CollisionShape = {
  position: Vector;
} & Renderable;

function render(this: CollisionShape, ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = "rgba(255, 0, 128, 0.5)";
  ctx.beginPath();
  ctx.arc(this.position.x, this.position.y, 16, 0, 2 * Math.PI);
  ctx.fill();
}

export function createCollisionShape(position: Vector): CollisionShape {
  return createRenderable({ position }, render);
}
