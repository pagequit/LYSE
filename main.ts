import "./style.css";
import { useAnimationProcess } from "./engine/system/Animation.ts";
import testScene from "./game/scenes/testScene.ts";
// import { nodeScene } from "./game/scenes/nodeScene.ts";

const { animate, setCurrentScene } = useAnimationProcess();

setCurrentScene(testScene);
// setCurrentScene(nodeScene);

animate();
