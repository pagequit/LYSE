import { type ShapeUnion, type KinematicBody } from "./KinematicBody.ts";

export function updateKinematicBody(
  body: KinematicBody<ShapeUnion>,
  friction: number = 1,
): void {
  body.velocity.x *= friction;
  body.velocity.y *= friction;

  body.velocity.x = Math.abs(body.velocity.x) < 0.01 ? 0 : body.velocity.x;
  body.velocity.y = Math.abs(body.velocity.y) < 0.01 ? 0 : body.velocity.y;

  body.origin.x += body.velocity.x;
  body.origin.y += body.velocity.y;
}
