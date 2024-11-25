import { useCanvas } from "./View.ts";
import { useInputs } from "./Input.ts";
import { type Scene } from "./Scene.ts";

export type Animation = (
  ctx: CanvasRenderingContext2D,
  delta: number,
  scene: Scene,
) => void;

const { canvas, ctx } = useCanvas();
const processInputs = useInputs();

// TODO: get rid of the null
const currentScene: { value: Scene | null } = {
  value: null,
};

let now: number = Date.now();
let then: number = Date.now();
let delta: number = 0;

function animate(): void {
  requestAnimationFrame(animate);
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  processInputs();

  currentScene.value?.animation(ctx, delta, currentScene.value);

  then = now;
  now = Date.now();
  delta = now - then;

  ctx.fillStyle = "#fff";
  ctx.fillText(`FPS: ${Math.round(1000 / delta)}`, 10, 20);

  ctx.restore();
}

export function setCurrentScene(scene: Scene): void {
  currentScene.value = scene;
}

export function useAnimationProcess(): {
  animate: () => void;
  setCurrentScene: (scene: Scene) => void;
} {
  return {
    animate,
    setCurrentScene,
  };
}
