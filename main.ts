import "./style.css";
import { startGame } from "./engine/system/Game.ts";
import { changeScene } from "./engine/system/Scene.ts";
import testScene from "./game/scenes/testScene.ts";

changeScene(testScene);
startGame();
