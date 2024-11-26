import { type Vector } from "../lib/Vector.ts";
import { game } from "./Game.ts";

export type Process = (ctx: CanvasRenderingContext2D, delta: number) => void;

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
  construct?: Scene["construct"];
  destruct?: Scene["destruct"];
};

export function createScene(
  process: Process,
  { width, height, construct, destruct }: SceneSettings,
): Scene {
  return {
    width,
    height,
    offset: { x: 0, y: 0 },
    process,
    construct: construct ? construct : () => {},
    destruct: destruct ? destruct : () => {},
  };
}

export function changeScene(scene: Scene): void {
  game.scene.destruct();
  game.scene = scene;
  game.scene.construct();
}
