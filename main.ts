import { startGame } from "./engine/Game.ts";
import { mount } from "./game/gui/menu/script.ts";
import scene from "./game/scenes/gridScene.ts";

mount();
startGame(scene);
