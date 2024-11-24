import { type Vector } from "../lib/Vector.ts";
import { type Animation } from "./Animation.ts";

export type Scene = {
  width: number;
  height: number;
  offset: Vector;
  animation: Animation;
};

export type SceneOptions = {
  width: number;
  height: number;
};

export function createScene(
  animation: Animation,
  { width, height }: SceneOptions,
): Scene {
  const scene = {
    width,
    height,
    offset: { x: 0, y: 0 },
    animation,
  };

  scene.animation = animation.bind(scene);

  return scene satisfies Scene;
}
