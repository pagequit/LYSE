import {
  renderCircle,
  type CollisionBody,
  type Circle,
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

export function createKinemeticCircle(
  radius: number,
  position: Vector,
  velocity: Vector = { x: 0, y: 0 },
): KinematicBody<Circle> {
  return {
    shape: { radius },
    position,
    velocity,
  };
}

function renderRectangle(this: Rectangle, ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = "rgba(255, 0, 128, 0.5)";
  ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
}

export function createRectangle(
  position: Vector,
  width: number,
  height: number,
): Rectangle & Renderable {
  return {
    type: CollisionShapeType.Rectangle,
    position,
    width,
    height,
    render: renderRectangle,
  };
}
