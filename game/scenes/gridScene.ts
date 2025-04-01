import {
  pointer,
  applyPointerEvents,
  removePointerEvents,
} from "../../engine/Pointer.ts";
import { createGrid, type Grid } from "../entities/Grid.ts";
import { createScene, type Scene } from "../../engine/Scene.ts";
import { createNode, paintNode } from "../entities/Node.ts";
import { startPenning, updatePanning } from "../../engine/View.ts";

const scene: Scene = createScene(process, {
  width: 1536,
  height: 1024,
  preProcess,
  postProcess,
});

function preProcess(): void {
  applyPointerEvents({
    onPointerDown,
    onPointerMove,
    onPointerUp,
  });
}

function postProcess(): void {
  removePointerEvents({
    onPointerDown,
    onPointerMove,
    onPointerUp,
  });
}

let isPanning: boolean = false;

function onPointerDown(): void {
  isPanning = true;
  startPenning(pointer.position.x, pointer.position.y);
}

function onPointerMove(): void {
  if (isPanning) {
    updatePanning(pointer.position.x, pointer.position.y);
  }
}

function onPointerUp(): void {
  isPanning = false;
}

const grid: Grid = createGrid(scene.width, scene.height, 32);
const pointerNode = createNode(pointer.position);

function process(ctx: CanvasRenderingContext2D, delta: number): void {
  grid.render(ctx);

  pointerNode.position = pointer.position;
  paintNode(pointerNode, ctx, "rgba(255, 255, 255, 0.5)");
}

export default scene;
