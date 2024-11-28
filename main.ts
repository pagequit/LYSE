import "./style.css";
import { startGame } from "./engine/system/Game.ts";
// import testScene from "./game/scenes/testScene.ts";
import nodeScene from "./game/scenes/nodeScene.ts";

startGame(nodeScene);
