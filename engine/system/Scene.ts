import { type Vector } from "../lib/Vector.ts";
import { type Animation } from "./Animation.ts";

export type Scene = {
  width: number;
  height: number;
  offset: Vector;
  animation: Animation;
};

export type SceneSettings = {
  width: number;
  height: number;
};

export function createScene(
  animation: Animation,
  settings: SceneSettings,
): Scene {
  return {
    width: settings.width,
    height: settings.height,
    offset: { x: 0, y: 0 },
    animation,
  };
}
