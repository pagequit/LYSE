import { type Vector } from "../lib/Vector.ts";
import { type Process } from "./Game.ts";

export type Scene = {
  width: number;
  height: number;
  offset: Vector;
  process: Process;
  construct: () => void;
  destruct: () => void;
};

export type SceneSettings = {
  width: number;
  height: number;
  construct: Scene["construct"];
  destruct: Scene["destruct"];
};

export function createScene(process: Process, settings: SceneSettings): Scene {
  return {
    width: settings.width,
    height: settings.height,
    offset: { x: 0, y: 0 },
    process,
    construct: settings.construct,
    destruct: settings.destruct,
  };
}
