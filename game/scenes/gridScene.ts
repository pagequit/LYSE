import { pointer } from "../../engine/Pointer.ts";
import { createGrid, type Grid } from "../entities/Grid.ts";
import { createScene, type Scene } from "../../engine/Scene.ts";
import { createNode, paintNode } from "../entities/Node.ts";
import type { Vector } from "../../engine/Vector.ts";

const scene: Scene = createScene(process, {
  width: 1536,
  height: 1024,
  construct,
  destruct,
});

const grid: Grid = createGrid(scene.width, scene.height, 32);
const pointerNode = createNode(pointer.position);

function construct(): void {}

function destruct(): void {}

function process(ctx: CanvasRenderingContext2D, _delta: number): void {
  grid.render(ctx);

  pointerNode.position = pointer.position;
  paintNode(pointerNode, ctx, "rgba(255, 255, 255, 0.5)");
}

export default scene;
