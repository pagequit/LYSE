import type { Vector } from "../Vector";
import { type KinematicBody, type ShapeUnion } from "./KinematicBody.ts";

export function collideKinematicBody(
  self: KinematicBody<ShapeUnion>,
  impact: Vector,
  normalX: number,
  normalY: number,
  overlap: number,
): void {
  self.origin.x -= normalX * overlap;
  self.origin.y -= normalY * overlap;

  const dot =
    (self.velocity.x - impact.x) * normalX +
    (self.velocity.y - impact.y) * normalY;
  self.velocity.x -= dot * normalX;
  self.velocity.y -= dot * normalY;
}
