import { getDistanceSquared, type Vector } from "./Vector.ts";
import { createRenderable, type Renderable } from "./Renderable.ts";

export type Collision = {
  self: CollisionShape;
  other: CollisionShape;
  normal: Vector;
  distance: number;
};

export type CollisionShape = {
  type: CollisionShapeType;
  position: Vector;
  // collisions: Array<Collision>;
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

export function createCircle(
  position: Vector,
  radius: number,
): Circle & Renderable {
  return createRenderable(
    { type: CollisionShapeType.Circle, position, radius },
    renderCircle,
  );
}

function renderRectangle(this: Rectangle, ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = "rgba(255, 0, 128, 0.5)";
  ctx.fillRect(
    this.position.x - this.a / 2,
    this.position.y - this.b / 2,
    this.a,
    this.b,
  );
}

export function createRectangle(
  position: Vector,
  a: number,
  b: number,
): Rectangle & Renderable {
  return createRenderable(
    { type: CollisionShapeType.Rectangle, position, a, b },
    renderRectangle,
  );
}

export function getNormal(a: Vector, b: Vector): Vector {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return { x: dx / distance, y: dy / distance };
}

export function isCircleToCircleCollision(a: Circle, b: Circle): boolean {
  return (
    getDistanceSquared(a.position, b.position) <= (a.radius + b.radius) ** 2
  );
}

export function getCircleToCircleCollision(a: Circle, b: Circle): Collision {
  const dx = a.position.x - b.position.x;
  const dy = a.position.y - b.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return {
    self: a,
    other: b,
    normal: { x: dx / distance, y: dy / distance },
    distance,
  };
}
