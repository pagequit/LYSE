import {
  applyTouchControls,
  removeTouchControls,
} from "../../engine/gui/TouchControls.ts";
import { pointer } from "../../engine/system/Pointer.ts";
import {
  animatePlayer,
  createPlayer,
  Direction,
  type Player,
  processPlayer,
  setDirection,
} from "../entity/Player.ts";
import { createGrid, type Grid } from "../entity/Grid.ts";
import {
  changeScene,
  createScene,
  type Scene,
  setSceneCameraPosition,
} from "../../engine/system/Scene.ts";
import nodeScene from "./nodeScene.ts";
import { createNode, paintNode } from "../entity/Node.ts";
import type { CollisionShape } from "../../engine/lib/Shape.ts";

const scene: Scene = createScene(process, {
  width: 2048,
  height: 1152,
  construct,
  destruct,
});

const player: Player = createPlayer({
  x: (scene.width - 64) / 2,
  y: ((scene.height - 64) / 2) * 0.725,
});

setDirection(player, Direction.Right);

const dummy: Player = createPlayer({
  x: (scene.width - 64) / 2,
  y: ((scene.height - 64) / 2) * 1.125,
});

setDirection(dummy, Direction.Left);

const grid: Grid = createGrid(scene.width, scene.height, 64);
const pointerNode = createNode(pointer.position);
const isTouchDevice = "ontouchstart" in self || navigator.maxTouchPoints > 0;

function handleEscape({ key }: KeyboardEvent): void {
  if (key === "Escape") {
    changeScene(nodeScene);
  }
}

function construct(): void {
  self.addEventListener("keyup", handleEscape);
  if (isTouchDevice) {
    applyTouchControls();
  }
}

function destruct(): void {
  self.removeEventListener("keyup", handleEscape);
  if (isTouchDevice) {
    removeTouchControls();
  }
}

function processCollisions(cShapes: Array<CollisionShape>) {
  for (let i = 0; i < cShapes.length; i++) {
    for (let j = 0; j < cShapes.length; j++) {
      if (cShapes[i] === cShapes[j]) {
        continue;
      }

      const dx = Math.abs(cShapes[i].position.x - cShapes[j].position.x);
      const dy = Math.abs(cShapes[i].position.y - cShapes[j].position.y);

      const distance = Math.sqrt(dx * dx + dy * dy);

      // all shapes a circles with a radius of 16
      if (distance <= 32) {
        console.log("collision");
      }
    }
  }
}

const cShapes = [player.collisionShape, dummy.collisionShape];

function process(ctx: CanvasRenderingContext2D, delta: number): void {
  processCollisions(cShapes);

  grid.render(ctx);

  pointerNode.position = pointer.position;
  paintNode(pointerNode, ctx, "rgba(255, 255, 255, 0.5)");

  animatePlayer(player, ctx, delta);
  processPlayer(player, delta);

  animatePlayer(dummy, ctx, delta);

  player.collisionShape.render(ctx);
  dummy.collisionShape.render(ctx);

  setSceneCameraPosition(
    player.position.x - (self.innerWidth - 64) / 2,
    player.position.y - (self.innerHeight - 64) / 2,
  );
}

export default scene;
