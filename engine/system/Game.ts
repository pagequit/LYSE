import { camera, canvas, ctx, applyCanvas } from "./View.ts";
import { useInputs } from "./Input.ts";
import { changeScene, createScene, type Scene } from "./Scene.ts";

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
const processInputs = useInputs();

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

  ctx.fillStyle = "#fff";
  ctx.fillText(
    `FPS: ${Math.round(1000 / delta)}`,
    camera.position.x + 10,
    camera.position.y + 20,
  );

  ctx.restore();
}

export function startGame(scene: Scene): void {
  changeScene(scene);
  animate(now);
}
