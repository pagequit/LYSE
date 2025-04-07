import { type Vector } from "./Vector.ts";
import { type KinematicBody } from "./KinematicBody.ts";

const defaultFillStyle = "rgba(255, 0, 128, 0.5)";

export type Circle = {
  radius: number;
};

export type Rectangle = {
  width: number;
  height: number;
};

export enum ShapeType {
  Circle,
  Rectangle,
}

export type StaticBody<Shape> = {
  type: ShapeType;
  shape: Shape;
  origin: Vector;
  onCollision: (
    self: StaticBody<Shape>,
    other: KinematicBody<Circle | Rectangle>,
  ) => void;
};

export function createStaticCircle(
  origin: Vector,
  radius: number,
  onCollision: StaticBody<Circle>["onCollision"],
): StaticBody<Circle> {
  return {
    type: ShapeType.Circle,
    shape: { radius },
    origin,
    onCollision,
  };
}

export function createStaticRectangle(
  origin: Vector,
  width: number,
  height: number,
  onCollision: StaticBody<Rectangle>["onCollision"],
): StaticBody<Rectangle> {
  return {
    type: ShapeType.Rectangle,
    shape: { width, height },
    origin,
    onCollision,
  };
}

export function renderCircle(
  body: StaticBody<Circle>,
  ctx: CanvasRenderingContext2D,
  fillStyle: string = defaultFillStyle,
): void {
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.arc(body.origin.x, body.origin.y, body.shape.radius, 0, 2 * Math.PI);
  ctx.fill();
}

export function renderRectangle(
  body: StaticBody<Rectangle>,
  ctx: CanvasRenderingContext2D,
  fillStyle: string = defaultFillStyle,
): void {
  ctx.fillStyle = fillStyle;
  ctx.fillRect(
    body.origin.x,
    body.origin.y,
    body.shape.width,
    body.shape.height,
  );
}

export function renderStaticBodies(
  staticBodies: Array<StaticBody<Circle | Rectangle>>,
  ctx: CanvasRenderingContext2D,
): void {
  for (const body of staticBodies) {
    switch (body.type) {
      case ShapeType.Circle: {
        renderCircle(body as StaticBody<Circle>, ctx);
        break;
      }
      case ShapeType.Rectangle: {
        renderRectangle(body as StaticBody<Rectangle>, ctx);
        break;
      }
    }
  }
}

export function circlesCollide(
  circleA: StaticBody<Circle>,
  circleB: StaticBody<Circle>,
): boolean {
  const dx = circleA.origin.x - circleB.origin.x;
  const dy = circleA.origin.y - circleB.origin.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance <= circleA.shape.radius + circleB.shape.radius;
}

export function rectanglesCollide(
  rectangleA: StaticBody<Rectangle>,
  rectangleB: StaticBody<Rectangle>,
): boolean {
  return (
    rectangleA.origin.x <= rectangleB.origin.x + rectangleB.shape.width &&
    rectangleA.origin.x + rectangleA.shape.width >= rectangleB.origin.x &&
    rectangleA.origin.y <= rectangleB.origin.y + rectangleB.shape.height &&
    rectangleA.origin.y + rectangleA.shape.height >= rectangleB.origin.y
  );
}

export function circleAndRectangleCollide(
  circle: StaticBody<Circle>,
  rectangle: StaticBody<Rectangle>,
): boolean {
  const nearestX = Math.max(
    rectangle.origin.x,
    Math.min(circle.origin.x, rectangle.origin.x + rectangle.shape.width),
  );
  const nearestY = Math.max(
    rectangle.origin.y,
    Math.min(circle.origin.y, rectangle.origin.y + rectangle.shape.height),
  );
  const dx = circle.origin.x - nearestX;
  const dy = circle.origin.y - nearestY;

  return dx * dx + dy * dy < circle.shape.radius * circle.shape.radius;
}

export function circleContainsCircle(
  circleA: StaticBody<Circle>,
  circleB: StaticBody<Circle>,
): boolean {
  const dx = circleA.origin.x - circleB.origin.x;
  const dy = circleA.origin.y - circleB.origin.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance + circleB.shape.radius <= circleA.shape.radius;
}

export function rectangleContainsRectangle(
  rectangleA: StaticBody<Rectangle>,
  rectangleB: StaticBody<Rectangle>,
): boolean {
  return (
    rectangleA.origin.x <= rectangleB.origin.x &&
    rectangleA.origin.x + rectangleA.shape.width >=
      rectangleB.origin.x + rectangleB.shape.width &&
    rectangleA.origin.y <= rectangleB.origin.y &&
    rectangleA.origin.y + rectangleA.shape.height >=
      rectangleB.origin.y + rectangleB.shape.height
  );
}

export function circleContainsRectangle(
  circle: StaticBody<Circle>,
  rectangle: StaticBody<Rectangle>,
): boolean {
  const dAX = rectangle.origin.x - circle.origin.x;
  const dAY = rectangle.origin.y - circle.origin.y;

  const dBX = rectangle.origin.x + rectangle.shape.width - circle.origin.x;
  const dBY = rectangle.origin.y - circle.origin.y;

  const dCX = rectangle.origin.x - circle.origin.x;
  const dCY = rectangle.origin.y + rectangle.shape.height - circle.origin.y;

  const dDX = rectangle.origin.x + rectangle.shape.width - circle.origin.x;
  const dDY = rectangle.origin.y + rectangle.shape.height - circle.origin.y;

  const dASquare = dAX * dAX + dAY * dAY;
  const dBsquare = dBX * dBX + dBY * dBY;
  const dCSquare = dCX * dCX + dCY * dCY;
  const dDSquare = dDX * dDX + dDY * dDY;

  const radiusSquare = circle.shape.radius ** 2;

  return (
    dASquare <= radiusSquare &&
    dBsquare <= radiusSquare &&
    dCSquare <= radiusSquare &&
    dDSquare <= radiusSquare
  );
}

export function rectangleContainsCircle(
  rectangle: StaticBody<Rectangle>,
  circle: StaticBody<Circle>,
): boolean {
  return (
    rectangle.origin.x <= circle.origin.x - circle.shape.radius &&
    rectangle.origin.x + rectangle.shape.width >=
      circle.origin.x + circle.shape.radius &&
    rectangle.origin.y <= circle.origin.y - circle.shape.radius &&
    rectangle.origin.y + rectangle.shape.height >=
      circle.origin.y + circle.shape.radius
  );
}
