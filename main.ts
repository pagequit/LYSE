import { startGame } from "./engine/Game.ts";
import testScene from "./game/scenes/testScene.ts";
import { mount } from "./game/gui/menu/script.ts";

mount();
startGame(testScene);
