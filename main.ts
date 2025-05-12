import { startGame } from "./engine/stateful/Game.ts";
// import { mount } from "./game/gui/menu/menu.ts";
// import scene from "./game/scenes/gridScene.ts";
// import scene from "./game/scenes/testScene.ts";
import scene from "./game/scenes/nodeScene.ts";
import { mount } from "./game/gui/SettingsMenu.tsx";
import "./style.css";

startGame(scene);
mount(document.querySelector(".canvas-container")!);
