import { useCanvas } from "./View.ts";
import { useInputs } from "./Input.ts";

const { canvas, ctx } = useCanvas();
const processInputs = useInputs();

export type Process = (delta: number) => void;
const processes: Process[] = [];

export type Animation = (ctx: CanvasRenderingContext2D, delta: number) => void;
const animations: Animation[] = [];

let now: number = Date.now();
let then: number = Date.now();
let delta: number = 0;

function animate(): void {
  requestAnimationFrame(animate);
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  processInputs();
  for (let i = 0; i < processes.length; i++) {
    processes[i](delta);
  }

  for (let i = 0; i < animations.length; i++) {
    animations[i](ctx, delta);
  }

  then = now;
  now = Date.now();
  delta = now - then;

  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.fillText(`FPS: ${Math.round(1000 / delta)}`, 10, 20);

  ctx.restore();
}

function addProcess(process: Process): void {
  processes.push(process);
}

function addAnimation(animation: Animation): void {
  animations.push(animation);
}

export function useAnimationProcess(): {
  animate: () => void;
  addProcess: (process: Process) => void;
  addAnimation: (animation: Animation) => void;
} {
  return {
    animate,
    addProcess,
    addAnimation,
  };
}
