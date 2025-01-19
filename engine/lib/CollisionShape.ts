import { type Vector } from "./Vector.ts";
import { createRenderable, type Renderable } from "./Renderable.ts";

export type CollisionShape = {
  type: CollisionShapeType;
  position: Vector;
};

export type Circle = { radius: number } & CollisionShape;

export type Rectangle = { a: number; b: number } & CollisionShape;

export enum CollisionShapeType {
  Circle,
  Rectangle,
}

function renderCircle(this: Circle, ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = "rgba(255, 0, 128, 0.5)";
  ctx.beginPath();
  ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
  ctx.fill();
}

export function createCollisionShapeCircle(
  position: Vector,
  radius: number,
): Circle & Renderable {
  return createRenderable(
    { type: CollisionShapeType.Circle, position, radius },
    renderCircle,
  );
}
