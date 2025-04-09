import { type Vector } from "../Vector.ts";
import { updateKinematicBody } from "./update.ts";
import { collideKinematicBody } from "./collide.ts";

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

export type ShapeUnion = Circle | Rectangle;

export type KinematicBody<Shape> = {
  type: ShapeType;
  shape: Shape;
  origin: Vector;
  velocity: Vector;
  update: (self: KinematicBody<ShapeUnion>, friction: number) => void;
  collide: (
    self: KinematicBody<ShapeUnion>,
    other: KinematicBody<ShapeUnion>,
    normalX: number,
    normalY: number,
    overlap: number,
  ) => void;
};

export function createKinemeticCircle(
  origin: Vector,
  radius: number,
  velocity: Vector = { x: 0, y: 0 },
  update: KinematicBody<Circle>["update"] = updateKinematicBody,
  collide: KinematicBody<Circle>["collide"] = collideKinematicBody,
): KinematicBody<Circle> {
  return {
    type: ShapeType.Circle,
    shape: { radius },
    origin,
    velocity,
    update,
    collide,
  };
}
