import type { Drawable } from "./Drawable.ts";
import type { KinematicBody, UnionShape } from "./KinematicBody.ts";
import type { Sprite } from "./Sprite.ts";
import type { Vector } from "./Vector.ts";

export type GameObject = {
  sprite: Sprite;
  drawable: Drawable;
};

export type DynamicGameObject<Shape> = {
  kinematicBody: KinematicBody<Shape>;
} & GameObject;

export function createGameObject(
  sprite: Sprite,
  position: Vector = { x: 0, y: 0 },
): GameObject {
  return {
    sprite,
  };
}
