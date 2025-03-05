import { type Vector } from "./Vector.ts";
import { createRenderable, type Renderable } from "./Renderable.ts";

export type CollisionShape = {
  type: CollisionShapeType;
  position: Vector;
};

export type Circle = { radius: number } & CollisionShape;

export type Rectangle = { width: number; height: number } & CollisionShape;

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
    this.position.x - this.width / 2,
    this.position.y - this.height / 2,
    this.width,
    this.height,
  );
}

export function createRectangle(
  position: Vector,
  width: number,
  height: number,
): Rectangle & Renderable {
  return createRenderable(
    { type: CollisionShapeType.Rectangle, position, width, height },
    renderRectangle,
  );
}

// TODO: TEST THE FOLLOWING

export function checkCircleCircleCollision(a: Circle, b: Circle): boolean {
  const dx = a.position.x - b.position.x;
  const dy = a.position.y - b.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance <= a.radius + b.radius;
}

export function checkRectangleRectangleCollision(
  a: Rectangle,
  b: Rectangle,
): boolean {
  return (
    a.position.x < b.position.x + b.width &&
    a.position.x + a.width > b.position.x &&
    a.position.y < b.position.y + b.height &&
    a.position.y + a.height > b.position.y
  );
}

export function checkCircleRectangleCollision(
  circle: Circle,
  rectangle: Rectangle,
): boolean {
  const nearestX = Math.max(
    rectangle.position.x,
    Math.min(circle.position.x, rectangle.position.x + rectangle.width),
  );
  const nearestY = Math.max(
    rectangle.position.y,
    Math.min(circle.position.y, rectangle.position.y + rectangle.height),
  );
  const dx = circle.position.x - nearestX;
  const dy = circle.position.y - nearestY;

  return dx * dx + dy * dy < circle.radius * circle.radius;
}
