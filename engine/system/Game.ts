import { camera, canvas, ctx, applyCanvas } from "./View.ts";
import { applyInputs, processInputs } from "./Input.ts";
import { changeScene, createScene, type Scene } from "./Scene.ts";
import { pointer } from "./Pointer.ts";
import { applyMonitor, monoitor } from "../gui/monitor.ts";

export type Game = {
  scene: Scene;
  state: unknown;
};

export const game: Game = {
  scene: createScene(() => {}, {
    width: 0,
    height: 0,
  }),
  state: {},
};

applyCanvas();
applyInputs();
applyMonitor();
const fpsMonitor = document.createElement("div");
monoitor.appendChild(fpsMonitor);
const pointerMonitor = document.createElement("div");
monoitor.appendChild(pointerMonitor);
const cameraMonitor = document.createElement("div");
monoitor.appendChild(cameraMonitor);

let now: number = self.performance.now();
let then: number = now;
let delta: number = 0;

function animate(timestamp: number): void {
  requestAnimationFrame(animate);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(-camera.position.x, -camera.position.y);

  processInputs();

  game.scene.process(ctx, delta);

  then = now;
  now = timestamp;
  delta = now - then;

  ctx.restore();

  fpsMonitor.innerText = `FPS: ${Math.round(1000 / delta)}`;
  pointerMonitor.innerText = `pointer: (${pointer.position.x}, ${pointer.position.y})`;
  cameraMonitor.innerText = `camera: (${camera.position.x}, ${camera.position.y})`;
}

export function startGame(scene: Scene): void {
  changeScene(scene);
  animate(now);
}
