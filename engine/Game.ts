import { adoptCanvas, ctx, resetViewport, resizeCanvas } from "./View.ts";
import { applyInputs, processInputs } from "./Input.ts";
import { createScene, type Scene } from "./Scene.ts";
import { fpsMonitor } from "../game/gui/menu/script.ts";

export const game = {
  scene: createScene(() => {}, {
    width: self.innerWidth,
    height: self.innerHeight,
  }),
  settings: {
    scale: 1,
  },
  state: {},
};

export type Game = typeof game;

let now: number = self.performance.now();
let then: number = now;
let delta: number = 0;

function animate(timestamp: number): void {
  requestAnimationFrame(animate);
  resetViewport(ctx);
  processInputs();

  game.scene.process(ctx, delta);

  then = now;
  now = timestamp;
  delta = now - then;

  fpsMonitor.innerText = `${Math.round(1000 / delta)} FPS`;
}

export function startGame(scene: Scene): void {
  adoptCanvas();
  applyInputs();

  changeScene(scene);
  animate(now);
}

export function changeScene(scene: Scene): void {
  game.scene.postProcess();
  game.scene = scene;
  game.scene.preProcess();
  resizeCanvas();
}

export function scaleViewport(scale: number): void {
  game.settings.scale = scale;
  resizeCanvas();
}
