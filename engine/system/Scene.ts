import { type Vector } from "../lib/Vector.ts";

export type Scene = {
  width: number;
  height: number;
  offset: Vector;
};

export function createScene(width: number, height: number): Scene {
  return {
    width,
    height,
    offset: { x: 0, y: 0 },
  };
}
