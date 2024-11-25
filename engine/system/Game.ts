import { useCanvas } from "./View.ts";
import { useInputs } from "./Input.ts";
import { createScene, type Scene } from "./Scene.ts";

export type Process = (ctx: CanvasRenderingContext2D, delta: number) => void;

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

export function startGame(): void {
  const { canvas, ctx } = useCanvas();
  const processInputs = useInputs();

  let now: number = Date.now();
  let then: number = now;
  let delta: number = 0;

  function animate(timestamp: number): void {
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    processInputs();

    game.scene.process(ctx, delta);

    then = now;
    now = timestamp;
    delta = now - then;

    ctx.fillStyle = "#fff";
    ctx.fillText(`FPS: ${Math.round(1000 / delta)}`, 10, 20);

    ctx.restore();
  }

  game.scene.construct();
  animate(now);
}
