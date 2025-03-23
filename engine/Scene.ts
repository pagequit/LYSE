import { game } from "./Game.ts";
import type { Vector } from "./Vector.ts";
import { type Viewport, createViewport, resizeCanvas } from "./View.ts";

export type Process = (ctx: CanvasRenderingContext2D, delta: number) => void;

export type Scene = {
  width: number;
  height: number;
  viewport: Viewport;
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
    viewport: createViewport(),
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

export function setViewportOffset(x: number, y: number): void {
  game.scene.viewport.offset.x = Math.max(
    0,
    Math.min(x, game.scene.width * game.scene.viewport.zoom - self.innerWidth),
  );
  game.scene.viewport.offset.y = Math.max(
    0,
    Math.min(
      y,
      game.scene.height * game.scene.viewport.zoom - self.innerHeight,
    ),
  );
}

export function focusViewportToPosition(position: Vector): void {
  setViewportOffset(
    position.x * game.scene.viewport.zoom - self.innerWidth / 2,
    position.y * game.scene.viewport.zoom - self.innerHeight / 2,
  );
}
