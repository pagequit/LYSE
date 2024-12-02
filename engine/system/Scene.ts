import { game } from "./Game.ts";
import { type Camera, createCamera } from "./View.ts";

export type Process = (ctx: CanvasRenderingContext2D, delta: number) => void;

export type Scene = {
  width: number;
  height: number;
  camera: Camera;
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
    camera: createCamera(),
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
