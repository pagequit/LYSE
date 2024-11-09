<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from "vue";
import { colors } from "../style.ts";
import {
  type Node,
  createNode,
  paintNode,
  getNodeByPosition,
} from "../lib/Node.ts";
import { type Edge, createEdge, paintEdge } from "../lib/Edge.ts";
import { type Vector } from "../lib/Vector.ts";
import { type Scene } from "../lib/Scene.ts";
import { render } from "../lib/Renderable.ts";
import { useViewport } from "./useViewport.ts";
import { useCanvas } from "./useCanvas.ts";
import { gameState } from "./useGameState.ts";
import {
  type Player,
  State,
  Direction,
  animatePlayer,
  createPlayer,
  setDirection,
} from "../entities/Player.ts";

const state = gameState.worldMap;
const { canvas, ctx } = useCanvas();
const { viewport, viewOffset } = useViewport();
const container = useTemplateRef("container");

canvas.width = Math.min(window.innerWidth, viewport.width);
canvas.height = Math.min(window.innerHeight, viewport.height);

let isDraggingNode = false;
let shiftDown = false;
let ctrlDown = false;

type Grid = {
  height: number;
  width: number;
  tileSize: number;
  x: number;
  y: number;
};

const grid: Grid = {
  height: viewport.height,
  width: viewport.width,
  tileSize: 64,
  x: viewport.width / 64,
  y: viewport.height / 64,
};

function renderGrid(grid: Grid, ctx: CanvasRenderingContext2D): void {
  for (let i = 0; i < grid.x; i++) {
    for (let j = 0; j < grid.y; j++) {
      ctx.fillStyle = i % 2 === j % 2 ? "transparent" : "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(
        i * grid.tileSize,
        j * grid.tileSize,
        grid.tileSize,
        grid.tileSize,
      );
    }
  }
}
onMounted(() => {
  container.value!.appendChild(canvas);

  window.addEventListener("resize", onResize);
  document.addEventListener("mousedown", onPointerDown);
  document.addEventListener("touchstart", onPointerDown);
  document.addEventListener("mousemove", onPointerMove);
  document.addEventListener("touchmove", onPointerMove);
  document.addEventListener("mouseup", onPointerUp);
  document.addEventListener("touchend", onPointerUp);

  document.addEventListener("keydown", ({ key }) => {
    switch (key) {
      case "Shift":
        shiftDown = true;
        break;
      case "Control":
        ctrlDown = true;
        break;
    }
  });

  document.addEventListener("keyup", ({ key }) => {
    switch (key) {
      case "Shift":
        shiftDown = false;
        break;
      case "Control":
        ctrlDown = false;
        break;
    }
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
  document.removeEventListener("mousedown", onPointerDown);
  document.removeEventListener("touchstart", onPointerDown);
  document.removeEventListener("mousemove", onPointerMove);
  document.removeEventListener("touchmove", onPointerMove);
  document.removeEventListener("mouseup", onPointerUp);
  document.removeEventListener("touchend", onPointerUp);
});

const scene: Scene = {
  viewport,
  layers: [],
};

const player: Player = createPlayer({
  x: (viewport.width - 256) / 2,
  y: (viewport.height - 256) / 2,
});

player.state = State.Idle;
setDirection(player, Direction.Down);

const nextEdge: Array<Node> = [];

let activeNode: Node | null = null;
let hoverNode: Node | null = null;
let isDragging = false;
let isPointerDown = false;

const dragVector: Vector = { x: 0, y: 0 };
const dragOffset: Vector = {
  x: Math.min(0, (canvas.width - viewport.width) * 0.5),
  y: Math.min(0, (canvas.height - viewport.height) * 0.5),
};

const pointerPosition: Vector = { x: 0, y: 0 };
const pointerNode: Node = createNode(pointerPosition);
const pointerOffset: Vector = {
  x: viewOffset.x - dragOffset.x,
  y: viewOffset.y - dragOffset.y,
};

function onResize(): void {
  canvas.width = Math.min(window.innerWidth, viewport.width);
  canvas.height = Math.min(window.innerHeight, viewport.height);

  viewOffset.x =
    window.innerWidth < viewport.width
      ? 0
      : (viewport.width - window.innerWidth) * 0.5;
  viewOffset.y =
    window.innerHeight < viewport.height
      ? 0
      : (viewport.height - window.innerHeight) * 0.5;

  pointerOffset.x = viewOffset.x - dragOffset.x;
  pointerOffset.y = viewOffset.y - dragOffset.y;
}

function onPointerDown(event: MouseEvent | TouchEvent): void {
  isPointerDown = true;
  const position: { clientX: number; clientY: number } =
    event instanceof MouseEvent ? event : event.touches[0];

  const gridPosition = getGridPosition(
    {
      x: position.clientX + pointerOffset.x,
      y: position.clientY + pointerOffset.y,
    },
    grid.tileSize,
  );

  pointerPosition.x = gridPosition.x;
  pointerPosition.y = gridPosition.y;

  const node = getNodeByPosition(state.nodes, {
    x: pointerPosition.x,
    y: pointerPosition.y,
  });

  if (node === null) {
    if (ctrlDown) {
      state.nodes.push(createNode({ ...pointerPosition }));
      scene.layers.push([...state.nodes, ...state.edges]);
    } else {
      isDragging = true;
      dragVector.x = position.clientX - dragOffset.x;
      dragVector.y = position.clientY - dragOffset.y;
    }
    return;
  }

  activeNode = node;

  if (shiftDown) {
    nextEdge.push(activeNode);
    return;
  }

  isDraggingNode = true;
}

function onPointerMove(event: MouseEvent | TouchEvent): void {
  const position: { clientX: number; clientY: number } =
    event instanceof MouseEvent ? event : event.touches[0];

  const gridPosition = getGridPosition(
    {
      x: position.clientX + pointerOffset.x,
      y: position.clientY + pointerOffset.y,
    },
    grid.tileSize,
  );

  pointerPosition.x = gridPosition.x;
  pointerPosition.y = gridPosition.y;

  if (isDragging) {
    dragOffset.x = Math.min(
      0,
      Math.max(canvas.width - viewport.width, position.clientX - dragVector.x),
    );

    dragOffset.y = Math.min(
      0,
      Math.max(
        canvas.height - viewport.height,
        position.clientY - dragVector.y,
      ),
    );

    pointerOffset.x = viewOffset.x - dragOffset.x;
    pointerOffset.y = viewOffset.y - dragOffset.y;

    return;
  }

  hoverNode = getNodeByPosition(state.nodes, {
    x: pointerPosition.x,
    y: pointerPosition.y,
  });

  if (activeNode !== null && isDraggingNode) {
    activeNode.position.x = pointerPosition.x;
    activeNode.position.y = pointerPosition.y;
    return;
  }

  if (!isPointerDown || hoverNode === null || hoverNode === activeNode) {
    return;
  }

  activeNode = hoverNode as Node;
  nextEdge.push(activeNode);

  if (nextEdge.length === 2) {
    const maybeEdge: Edge = createEdge([nextEdge[0], nextEdge[1]]);

    let existingIndex = 0;
    const existingEdge: Edge | undefined = state.edges.find((edge, index) => {
      existingIndex = index;
      return (
        (edge[0] === nextEdge[0] && edge[1] === nextEdge[1]) ||
        (edge[0] === nextEdge[1] && edge[1] === nextEdge[0])
      );
    });

    if (existingEdge !== undefined) {
      state.edges.splice(existingIndex, 1);
    } else {
      state.edges.push(maybeEdge);
    }

    scene.layers[0] = [...state.nodes, ...state.edges];
    nextEdge.shift();
  }
}

function onPointerUp(): void {
  isPointerDown = false;
  isDragging = false;
  isDraggingNode = false;
  activeNode = null;
  nextEdge.length = 0;
}

function getGridPosition(position: Vector, tileSize: number): Vector {
  return {
    x: Math.round(position.x / tileSize) * tileSize,
    y: Math.round(position.y / tileSize) * tileSize,
  };
}

scene.layers.push([...state.nodes, ...state.edges]);
ctx.imageSmoothingEnabled = false;

let now: number = Date.now();
let then: number = Date.now();
(function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(dragOffset.x, dragOffset.y);

  renderGrid(grid, ctx);

  for (const layer of scene.layers) {
    for (const renderable of layer) {
      render.call(renderable, ctx);
    }
  }

  if (activeNode) {
    paintNode(activeNode, ctx, colors.infoColor);

    if (isPointerDown) {
      paintEdge(createEdge([activeNode!, pointerNode]), ctx, colors.infoColor);
      paintNode(pointerNode, ctx, colors.infoColor);
    }
  }

  paintNode(pointerNode, ctx, colors.infoColor);

  animatePlayer(player, ctx);

  then = now;
  now = Date.now();
  const delta: number = now - then;
  ctx.fillStyle = colors.foregroundColor;
  ctx.fillText(
    `FPS: ${Math.round(1000 / delta)}`,
    -dragOffset.x + 10,
    -dragOffset.y + 20,
  );
  ctx.fillText(
    `Nodes: ${state.nodes.length}`,
    -dragOffset.x + 10,
    -dragOffset.y + 30,
  );
  ctx.fillText(
    `Edges: ${state.edges.length}`,
    -dragOffset.x + 10,
    -dragOffset.y + 40,
  );

  ctx.restore();
})();
</script>

<template>
  <div class="container" ref="container"></div>
</template>
