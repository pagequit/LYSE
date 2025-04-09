import { pointer } from "../../lib/Pointer.ts";
import { type Vector } from "../../lib/Vector.ts";
import { createGrid, type Grid } from "../entities/Grid.ts";
import { createScene, type Scene } from "../../lib/Scene.ts";
import { paintNode, type Node } from "../entities/Node.ts";
import { startPanning, updatePanning } from "../../lib/View.ts";
import {
  createKinemeticRectangle,
  renderRectangle,
  type KinematicBody,
  type Rectangle,
} from "../../lib/KinematicBody.ts";

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

const tileSize = 64;

const hoverTile: KinematicBody<Rectangle> = createKinemeticRectangle(
  { x: 0, y: 0 },
  tileSize,
  tileSize,
);

let panDistance = 0;
let isPanning = false;

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
const edgeNode: Node = { position: { x: 0, y: 0 } };

function renderHoverTile(
  position: Vector,
  tile: KinematicBody<Rectangle>,
  ctx: CanvasRenderingContext2D,
): void {
  tile.origin.x = Math.floor(position.x / tileSize) * tileSize;
  tile.origin.y = Math.floor(position.y / tileSize) * tileSize;
  renderRectangle(hoverTile, ctx, "rgba(255, 255, 255, 0.125)");
}

function closestTileEdge(
  position: Vector,
  targetPosition: Vector,
  tile: KinematicBody<Rectangle>,
): void {
  const centerX = tile.origin.x + tile.shape.width / 2;
  const centerY = tile.origin.y + tile.shape.height / 2;

  targetPosition.x =
    position.x < centerX ? tile.origin.x : tile.origin.x + tile.shape.width;
  targetPosition.y =
    position.y < centerY ? tile.origin.y : tile.origin.y + tile.shape.height;
}

function process(ctx: CanvasRenderingContext2D, delta: number): void {
  grid.render(ctx);

  renderHoverTile(pointer.position, hoverTile, ctx);

  closestTileEdge(pointer.position, edgeNode.position, hoverTile);
  paintNode(edgeNode, ctx, "rgba(255, 255, 255, 0.5)");
}

export default scene;
