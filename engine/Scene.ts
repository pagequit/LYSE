import { game } from "./Game.ts";
import { type Viewport, createViewport, resizeCanvas } from "./View.ts";

export type Process = (ctx: CanvasRenderingContext2D, delta: number) => void;

export type Scene = {
  width: number;
  height: number;
  viewport: Viewport;
  process: Process;
  preProcess: () => void;
  postProcess: () => void;
};

export type SceneSettings = {
  width: number;
  height: number;
  preProcess?: Scene["preProcess"];
  postProcess?: Scene["postProcess"];
};

export function createScene(
  process: Process,
  { width, height, preProcess, postProcess }: SceneSettings,
): Scene {
  return {
    width,
    height,
    viewport: createViewport(),
    process,
    preProcess: preProcess ?? (() => {}),
    postProcess: postProcess ?? (() => {}),
  };
}

export function changeScene(scene: Scene): void {
  game.scene.postProcess();
  game.scene = scene;
  game.scene.preProcess(); // FIXME
  resizeCanvas();
}
