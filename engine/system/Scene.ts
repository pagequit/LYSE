import { type Vector } from "../lib/Vector.ts";

export type Process = (delta: number) => void;

export type Animation = (ctx: CanvasRenderingContext2D, delta: number) => void;

export type Scene = {
  width: number;
  height: number;
  offset: Vector;
  process: Array<Process>;
  animations: Array<Animation>;
};

export function createScene(width: number, height: number): Scene {
  return {
    width,
    height,
    offset: { x: 0, y: 0 },
    process: [],
    animations: [],
  };
}
