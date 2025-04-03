import { pointer } from "../../engine/Pointer.ts";
import { type Vector } from "../../engine/Vector.ts";
import { createGrid, type Grid } from "../entities/Grid.ts";
import { createScene, type Scene } from "../../engine/Scene.ts";
import { createNode, paintNode } from "../entities/Node.ts";
import { startPanning, updatePanning } from "../../engine/View.ts";
import {
  createStaticRectangle,
  renderRectangle,
  type Rectangle,
  type StaticBody,
} from "../../engine/StaticBody.ts";

const scene: Scene = createScene(process, {
  width: 1536,
  height: 1024,
  preProcess,
  postProcess,
});

function preProcess(): void {
  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("contextmenu", onContextMenu);
}

function postProcess(): void {
  document.removeEventListener("mousedown", onMouseDown);
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
  document.removeEventListener("contextmenu", onContextMenu);
}

const tileSize: number = 64;

const hoverTile: StaticBody<Rectangle> = createStaticRectangle(
  { x: 0, y: 0 },
  tileSize,
  tileSize,
);

let panDistance: number = 0;
let isPanning: boolean = false;

function onContextMenu(event: MouseEvent): void {
  if (panDistance > 1) {
    event.preventDefault();
  }
}

function onMouseDown(event: MouseEvent): void {
  switch (event.button) {
    case 0:
      {
        // WIP
      }
      break;
    case 2:
      {
        panDistance = 0;
        isPanning = true;
        startPanning(pointer.position.x, pointer.position.y);
      }
      break;
  }
}

function onMouseMove(): void {
  if (isPanning) {
    panDistance = updatePanning(pointer.position.x, pointer.position.y);
  }
}

function onMouseUp(event: MouseEvent): void {
  isPanning = event.button === 2 ? false : isPanning;
}

const grid: Grid = createGrid(scene.width, scene.height, tileSize);
const pointerNode = createNode(pointer.position);

function renderHoverTile(
  position: Vector,
  tile: StaticBody<Rectangle>,
  ctx: CanvasRenderingContext2D,
): void {
  tile.origin.x = Math.floor(position.x / tileSize) * tileSize;
  tile.origin.y = Math.floor(position.y / tileSize) * tileSize;
  renderRectangle(hoverTile, ctx, "rgba(255, 255, 255, 0.25)");
}

function process(ctx: CanvasRenderingContext2D, delta: number): void {
  grid.render(ctx);

  renderHoverTile(pointer.position, hoverTile, ctx);

  pointerNode.position = pointer.position;
  paintNode(pointerNode, ctx, "rgba(255, 255, 255, 0.5)");
}

export default scene;
