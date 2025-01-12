import { type Vector } from "./Vector.ts";
import { createRenderable, type Renderable } from "./Renderable.ts";

export type CollisionShape = {
  type: CollisionShapeType;
  position: Vector;
} & Renderable;

export enum CollisionShapeType {
  Circle,
  Rectangle,
}

function renderCircle(
  this: CollisionShape & { size: number },
  ctx: CanvasRenderingContext2D,
): void {
  ctx.fillStyle = "rgba(255, 0, 128, 0.5)";
  ctx.beginPath();
  ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

export function createCollisionShapeCircle(
  position: Vector,
  size: number,
): CollisionShape {
  return createRenderable(
    { type: CollisionShapeType.Circle, position, size },
    renderCircle,
  );
}

type CollisionPool = Map<CollisionShape, CollisionShape>;

export function createCollisionPool(): CollisionPool {
  return new Map();
}
