import "./style.css";
import { createGame, startGame } from "./engine/system/Game.ts";
import testScene from "./game/scenes/testScene.ts";

const game = createGame(testScene);
startGame(game);

export default game;
