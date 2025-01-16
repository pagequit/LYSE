import { type Vector } from "./Vector.ts";
import { createRenderable, type Renderable } from "./Renderable.ts";

export type CollisionShape<T> = {
  type: CollisionShapeType;
  position: Vector;
} & T;

export type Circle = { radius: number };

export enum CollisionShapeType {
  Circle,
  Rectangle,
}

function renderCircle(
  this: CollisionShape<Circle>,
  ctx: CanvasRenderingContext2D,
): void {
  ctx.fillStyle = "rgba(255, 0, 128, 0.5)";
  ctx.beginPath();
  ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
  ctx.fill();
}

export function createCollisionShapeCircle(
  position: Vector,
  radius: number,
): CollisionShape<Circle> & Renderable {
  return createRenderable(
    { type: CollisionShapeType.Circle, position, radius },
    renderCircle,
  );
}
