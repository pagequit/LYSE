import { startGame } from "./engine/stateful/Game.ts";
// import { mount } from "./game/gui/menu/menu.ts";
// import scene from "./game/scenes/gridScene.ts";
import scene from "./game/scenes/testScene.ts";
// import scene from "./game/scenes/nodeScene.ts";
import { mount } from "./game/gui/menu/SettingsMenu.tsx";
import { canvas } from "./engine/stateful/View.ts";
import "./style.css";

mount(canvas);
startGame(scene);
