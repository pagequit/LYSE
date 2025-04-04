import { startGame } from "./engine/Game.ts";
import { mount } from "./game/gui/menu/menu.ts";
import scene from "./game/scenes/gridScene.ts";
// import scene from "./game/scenes/testScene.ts";
// import scene from "./game/scenes/nodeScene.ts";

mount();
startGame(scene);
