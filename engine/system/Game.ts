import { applyCanvas, canvas, ctx } from "./View.ts";
import { applyInputs, processInputs } from "./Input.ts";
import { changeScene, createScene, type Scene } from "./Scene.ts";
import { pointer } from "./Pointer.ts";
import { applyMonitor, monitor } from "../gui/monitor.ts";

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
monitor.appendChild(fpsMonitor);
const pointerMonitor = document.createElement("div");
monitor.appendChild(pointerMonitor);
const cameraMonitor = document.createElement("div");
monitor.appendChild(cameraMonitor);

let now: number = self.performance.now();
let then: number = now;
let delta: number = 0;

function animate(timestamp: number): void {
  requestAnimationFrame(animate);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(-game.scene.camera.position.x, -game.scene.camera.position.y);

  processInputs();

  game.scene.process(ctx, delta);

  then = now;
  now = timestamp;
  delta = now - then;

  ctx.restore();

  fpsMonitor.innerText = `FPS: ${Math.round(1000 / delta)}`;
  pointerMonitor.innerText = `pointer: (${pointer.position.x}, ${pointer.position.y})`;
  cameraMonitor.innerText = `camera: (${game.scene.camera.position.x}, ${game.scene.camera.position.y})`;
}

export function startGame(scene: Scene): void {
  changeScene(scene);
  animate(now);
}
