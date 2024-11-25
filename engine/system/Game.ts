import { useCanvas } from "./View.ts";
import { useInputs } from "./Input.ts";
import { type Scene } from "./Scene.ts";

export type Game = {
  scene: Scene;
  state: unknown;
};

export type Process = (
  ctx: CanvasRenderingContext2D,
  delta: number,
  scene: Scene,
) => void;

export function startGame(game: Game): void {
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

    game.scene.process(ctx, delta, game.scene);

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

export function changeScene(game: Game, scene: Scene): void {
  game.scene.destruct();
  game.scene = scene;
  game.scene.construct();
}

export function createGame(startScene: Scene): Game {
  return {
    scene: startScene,
    state: {},
  };
}
