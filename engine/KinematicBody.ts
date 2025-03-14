import {
  renderCircle,
  renderRectangle,
  ShapeType,
  type CollisionBody,
  type Circle,
  type Rectangle,
} from "./CollisionBody.ts";
import { type Vector } from "./Vector.ts";

const defaultFillStyle = "rgba(64, 64, 255, 0.5)";

export type KinematicBody<Shape> = CollisionBody<Shape> & {
  velocity: Vector;
};

export function renderKinemeticCircle(
  body: KinematicBody<Circle>,
  ctx: CanvasRenderingContext2D,
  fillStyle: string = defaultFillStyle,
): void {
  renderCircle(body, ctx, fillStyle);
}

export function renderKinemeticRectangle(
  body: KinematicBody<Rectangle>,
  ctx: CanvasRenderingContext2D,
  fillStyle: string = defaultFillStyle,
): void {
  renderRectangle(body, ctx, fillStyle);
}

export function createKinemeticCircle(
  origin: Vector,
  radius: number,
  velocity: Vector = { x: 0, y: 0 },
): KinematicBody<Circle> {
  return {
    type: ShapeType.Circle,
    shape: { radius },
    origin,
    velocity,
  };
}

export function createKinemeticRectangle(
  origin: Vector,
  width: number,
  height: number,
  velocity: Vector = { x: 0, y: 0 },
): KinematicBody<Rectangle> {
  return {
    type: ShapeType.Rectangle,
    shape: { width, height },
    origin,
    velocity,
  };
}

export function processCircleCollisionKinematics(
  circleA: KinematicBody<Circle>,
  circleB: KinematicBody<Circle>,
): void {
  const dx = circleA.origin.x - circleB.origin.x;
  const dy = circleA.origin.y - circleB.origin.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= circleA.shape.radius + circleB.shape.radius && distance > 0) {
    const normalX = dx / distance;
    const normalY = dy / distance;
    const overlap =
      (distance - circleA.shape.radius - circleB.shape.radius) / 2;

    circleA.origin.x -= normalX * overlap;
    circleA.origin.y -= normalY * overlap;
    circleB.origin.x += normalX * overlap;
    circleB.origin.y += normalY * overlap;

    const dvx = circleA.velocity.x - circleB.velocity.x;
    const dvy = circleA.velocity.y - circleB.velocity.y;
    const dot = dvx * normalX + dvy * normalY;

    circleA.velocity.x -= dot * normalX;
    circleA.velocity.y -= dot * normalY;
    circleB.velocity.x += dot * normalX;
    circleB.velocity.y += dot * normalY;
  }
}

export function processCircleRectangleCollisionKinematics(
  circle: KinematicBody<Circle>,
  rectangle: KinematicBody<Rectangle>,
): void {
  const dx =
    circle.origin.x +
    circle.velocity.x -
    Math.max(
      rectangle.origin.x,
      Math.min(circle.origin.x, rectangle.origin.x + rectangle.shape.width),
    );
  const dy =
    circle.origin.y +
    circle.velocity.y -
    Math.max(
      rectangle.origin.y,
      Math.min(circle.origin.y, rectangle.origin.y + rectangle.shape.height),
    );
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= circle.shape.radius && distance > 0) {
    const normalX = dx / distance;
    const normalY = dy / distance;
    const overlap = (distance - circle.shape.radius) / 2;

    circle.origin.x -= normalX * overlap;
    circle.origin.y -= normalY * overlap;
    rectangle.origin.x += normalX * overlap;
    rectangle.origin.y += normalY * overlap;

    const dvx = circle.velocity.x - rectangle.velocity.x;
    const dvy = circle.velocity.y - rectangle.velocity.y;
    const dot = dvx * normalX + dvy * normalY;

    circle.velocity.x -= dot * normalX;
    circle.velocity.y -= dot * normalY;
    rectangle.velocity.x += dot * normalX;
    rectangle.velocity.y += dot * normalY;
  }
}

export function updateKinematicBody(
  body: KinematicBody<Circle | Rectangle>,
  delta: number,
): void {
  body.origin.x += body.velocity.x * delta * 0.25;
  body.origin.y += body.velocity.y * delta * 0.25;
  body.velocity.x *= 0.25;
  body.velocity.y *= 0.25;
}
