import { adoptView, ctx, resetViewport } from "./View.ts";
import { applyInputs, processInputs } from "./Input.ts";
import { changeScene, createScene, type Scene } from "./Scene.ts";
import { fpsMonitor } from "../game/gui/menu/script.ts";

export type Game = {
  scene: Scene;
  state: unknown;
};

export const game: Game = {
  scene: createScene(() => {}, {
    width: self.innerWidth,
    height: self.innerHeight,
  }),
  state: {},
};

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
  adoptView();
  applyInputs();

  changeScene(scene);
  animate(now);
}
