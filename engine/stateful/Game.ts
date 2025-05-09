import { adoptCanvas, ctx, resetViewport, resizeCanvas } from "./View.ts";
import { applyInputs, processInputs } from "./Input.ts";
import { createScene, type Scene } from "../lib/Scene.ts";
import { type AudioPlayer, createAudioPlayer } from "../lib/AudioPlayer.ts";

export type Game = {
  scene: Scene;
  settings: {
    scale: number;
  };
  BGMPlayer: AudioPlayer;
};

const scene: Scene = createScene(() => {}, {
  width: self.innerWidth,
  height: self.innerHeight,
});

const BGMPlayer: AudioPlayer = createAudioPlayer();

export const game: Game = {
  BGMPlayer,
  scene,
  settings: {
    scale: 1,
  },
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
