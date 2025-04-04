import template from "./template.html?raw";
import style from "./style.css?inline";
import { changeScene, scaleViewport } from "../../../engine/Game.ts";
import nodeScene from "../../scenes/nodeScene.ts";
import testScene from "../../scenes/testScene.ts";
import gridScene from "../../scenes/gridScene.ts";
import {
  createEffect,
  createSignal,
} from "../../../engine/observer/observer.js";

const templateElement = document.createElement("template");
const styleElement = document.createElement("style");

templateElement.innerHTML = template;
styleElement.innerHTML = style;

const [scale, setScale] = createSignal(1);

export function mount(): void {
  document.head.appendChild(styleElement);
  document.body.appendChild(templateElement.content);

  createEffect(() => {
    scaleValue.textContent = scale().toFixed(1);
    scaleViewport(parseFloat(scaleInput.value));
  });
}

export const fpsMonitor = templateElement.content.getElementById(
  "fps",
) as HTMLElement;

const fullscreenButton = templateElement.content.getElementById(
  "fullscreen",
) as HTMLButtonElement;

fullscreenButton.addEventListener("click", () => {
  if (document.fullscreenElement && document.exitFullscreen) {
    return document.exitFullscreen();
  }
  document.body.requestFullscreen();
});

const menuToggle = templateElement.content.getElementById(
  "menu-toggle",
) as HTMLElement;

const mainMenu = templateElement.content.querySelector(
  ".main-menu",
) as HTMLElement;

menuToggle.addEventListener("click", () => {
  mainMenu.classList.toggle("open");
});

const scaleInput = templateElement.content.querySelector(
  ".main-menu input",
) as HTMLInputElement;

scaleInput.addEventListener("input", () => {
  setScale(parseFloat(scaleInput.value));
});

const scaleValue = templateElement.content.getElementById(
  "scale-value",
) as HTMLElement;

const nodesButton = templateElement.content.getElementById(
  "nodes",
) as HTMLButtonElement;

nodesButton.addEventListener("click", () => {
  changeScene(nodeScene);
});

const testButton = templateElement.content.getElementById(
  "test",
) as HTMLButtonElement;

testButton.addEventListener("click", () => {
  changeScene(testScene);
});

const gridButton = templateElement.content.getElementById(
  "grid",
) as HTMLButtonElement;

gridButton.addEventListener("click", () => {
  changeScene(gridScene);
});
