import template from "./template.html?raw";
import style from "./style.css?inline";

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

const menuToggle = templateElement.content.getElementById(
  "menu-toggle",
) as HTMLElement;

const mainMenu = templateElement.content.querySelector(
  ".main-menu",
) as HTMLElement;

menuToggle.addEventListener("click", () => {
  mainMenu.classList.toggle("open");
});
