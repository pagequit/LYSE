import { game } from "./Game.ts";
import type { Vector } from "./Vector.ts";
import { type Camera, createCamera, resizeCanvas } from "./View.ts";

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
  resizeCanvas();
  game.scene.construct();
}

export function setSceneCameraPosition(x: number, y: number): void {
  game.scene.camera.position.x = Math.max(
    0,
    Math.min(x, game.scene.width - self.innerWidth),
  );
  game.scene.camera.position.y = Math.max(
    0,
    Math.min(y, game.scene.height - self.innerHeight),
  );
}

export function focusSceneCameraToPosition(position: Vector): void {
  setSceneCameraPosition(
    position.x - self.innerWidth * 0.5,
    position.y - self.innerHeight * 0.5,
  );
}
