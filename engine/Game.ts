import { adoptView, ctx, resetViewport } from "./View.ts";
import { applyInputs, processInputs } from "./Input.ts";
import { changeScene, createScene, type Scene } from "./Scene.ts";
import { pointer } from "./Pointer.ts";
import { adoptMonitor, monitor } from "./monitor.ts";

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

const fpsMonitor = document.createElement("div");
monitor.appendChild(fpsMonitor);
const pointerMonitor = document.createElement("div");
monitor.appendChild(pointerMonitor);
const viewportMonitor = document.createElement("div");
monitor.appendChild(viewportMonitor);

monitor.addEventListener("click", () => {
  document.body.requestFullscreen();
});

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

  fpsMonitor.innerText = `FPS: ${Math.round(1000 / delta)}`;
  pointerMonitor.innerText = `pointer: (${pointer.position.x}, ${pointer.position.y})`;
  viewportMonitor.innerText = `viewport: (${game.scene.viewport.offset.x}, ${game.scene.viewport.offset.y})`;
}

export function startGame(scene: Scene): void {
  adoptView();
  applyInputs();
  adoptMonitor();

  changeScene(scene);
  animate(now);
}
