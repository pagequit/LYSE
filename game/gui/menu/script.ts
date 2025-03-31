import template from "./template.html?raw";
import style from "./style.css?inline";
import { game } from "../../../engine/Game.ts";
import { resizeCanvas } from "../../../engine/View.ts";
import { changeScene } from "../../../engine/Scene.ts";
import nodeScene from "../../scenes/nodeScene.ts";
import testScene from "../../scenes/testScene.ts";

const templateElement = document.createElement("template");
const styleElement = document.createElement("style");

templateElement.innerHTML = template;
styleElement.innerHTML = style;

export function mount(): void {
  document.head.appendChild(styleElement);
  document.body.appendChild(templateElement.content);
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

const zoomInput = templateElement.content.querySelector(
  ".main-menu input",
) as HTMLInputElement;

zoomInput.addEventListener("input", () => {
  game.settings.zoom = parseFloat(zoomInput.value);
  resizeCanvas();
});

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
