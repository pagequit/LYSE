import markup from "./menu.html?raw";
import {
  changeScene,
  scaleViewport,
  game,
} from "../../../engine/stateful/Game.ts";
import nodeScene from "../../scenes/nodeScene.ts";
import testScene from "../../scenes/testScene.ts";
import gridScene from "../../scenes/gridScene.ts";
import { createEffect, createSignal } from "../observers.ts";
import {
  connectAudioPlayer,
  enqueueAudioFromUrl,
  setGain,
  togglePausePlay,
} from "../../../engine/lib/AudioPlayer.ts";

const template = document.createElement("template");
template.innerHTML = markup;

const [scale, setScale] = createSignal(1);
const [volume, setVolume] = createSignal(1);

export function mount(): void {
  document.body.appendChild(template.content);
  scaleInput.value = scale().toFixed(1);
  volumeInput.value = volume().toFixed(1);

  createEffect(() => {
    scaleValue.textContent = scale().toFixed(1);
    scaleViewport(parseFloat(scaleInput.value));
  });

  createEffect(() => {
    volumeValue.textContent = volume().toFixed(1);
    setGain(game.BGMPlayer, parseFloat(volumeInput.value));
  });

  enqueueAudioFromUrl(game.BGMPlayer, "/bgm.wav").then(() => {
    connectAudioPlayer(game.BGMPlayer, game.BGMPlayer.queue[0]);
    game.BGMPlayer.source.loop = true;
  });
}

export const fpsMonitor = template.content.getElementById("fps") as HTMLElement;

const fullscreenButton = template.content.getElementById(
  "fullscreen",
) as HTMLButtonElement;

fullscreenButton.addEventListener("click", () => {
  if (document.fullscreenElement && document.exitFullscreen) {
    return document.exitFullscreen();
  }
  document.body.requestFullscreen();
});

const menuToggle = template.content.getElementById(
  "menu-toggle",
) as HTMLElement;

const mainMenu = template.content.querySelector(".main-menu") as HTMLElement;

menuToggle.addEventListener("click", () => {
  mainMenu.classList.toggle("open");
});

const scaleInput = template.content.getElementById("scale") as HTMLInputElement;
scaleInput.addEventListener("input", () => {
  setScale(parseFloat(scaleInput.value));
});

const scaleValue = template.content.getElementById(
  "scale-value",
) as HTMLElement;

const volumeInput = template.content.getElementById(
  "volume",
) as HTMLInputElement;

volumeInput.addEventListener("input", () => {
  setVolume(parseFloat(volumeInput.value));
});

const volumeValue = template.content.getElementById(
  "volume-value",
) as HTMLElement;

const bgmButton = template.content.getElementById("bgm") as HTMLButtonElement;
bgmButton.addEventListener("click", () => {
  togglePausePlay(game.BGMPlayer);
});

const nodesButton = template.content.getElementById(
  "nodes",
) as HTMLButtonElement;
nodesButton.addEventListener("click", () => {
  changeScene(nodeScene);
});

const testButton = template.content.getElementById("test") as HTMLButtonElement;
testButton.addEventListener("click", () => {
  changeScene(testScene);
});

const gridButton = template.content.getElementById("grid") as HTMLButtonElement;
gridButton.addEventListener("click", () => {
  changeScene(gridScene);
});
