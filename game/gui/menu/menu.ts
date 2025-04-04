import markup from "./menu.html?raw";
import { changeScene, scaleViewport } from "../../../engine/Game.ts";
import nodeScene from "../../scenes/nodeScene.ts";
import testScene from "../../scenes/testScene.ts";
import gridScene from "../../scenes/gridScene.ts";
import { createEffect, createSignal } from "../observers.ts";

const template = document.createElement("template");
template.innerHTML = markup;

const [scale, setScale] = createSignal(1);

export function mount(): void {
  document.body.appendChild(template.content);

  createEffect(() => {
    scaleValue.textContent = scale().toFixed(1);
    scaleViewport(parseFloat(scaleInput.value));
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

const scaleInput = template.content.querySelector(
  ".main-menu input",
) as HTMLInputElement;

scaleInput.addEventListener("input", () => {
  setScale(parseFloat(scaleInput.value));
});

const scaleValue = template.content.getElementById(
  "scale-value",
) as HTMLElement;

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
