import { type KinematicBody, type ShapeUnion } from "./KinematicBody.ts";

export function collideKinematicBody(
  self: KinematicBody<ShapeUnion>,
  other: KinematicBody<ShapeUnion>,
  normalX: number,
  normalY: number,
  overlap: number,
): void {
  self.origin.x -= normalX * overlap;
  self.origin.y -= normalY * overlap;

  const dot =
    (self.velocity.x - other.velocity.x) * normalX +
    (self.velocity.y - other.velocity.y) * normalY;
  self.velocity.x -= dot * normalX;
  self.velocity.y -= dot * normalY;
}
