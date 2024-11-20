import "./style.css";
import { useAnimationProcess } from "./engine/system/animate.ts";
import TestScene from "./game/scenes/TestScene.ts";

const { animate, addProcess, addAnimation } = useAnimationProcess();
addScene(TestScene);
animate();
