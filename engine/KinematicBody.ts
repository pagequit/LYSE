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
