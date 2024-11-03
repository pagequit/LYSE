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
import { getSegmentIntersection } from "../lib/Segment.ts";
import { render } from "../lib/Renderable.ts";
import { useViewport } from "./useViewport.ts";
import { useCanvas } from "./useCanvas.ts";
import { gameState } from "./useGameState.ts";

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
  tileSize: 16,
  x: viewport.width / 16,
  y: viewport.height / 16,
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

const nextEdge: Array<Node> = [];

let isIntersecting = false;
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
  const position = event instanceof MouseEvent ? event : event.touches[0];

  pointerPosition.x = position.clientX + pointerOffset.x;
  pointerPosition.y = position.clientY + pointerOffset.y;

  const node = getNodeByPosition(state.nodes, {
    x: pointerPosition.x,
    y: pointerPosition.y,
  });

  if (node === null) {
    if (shiftDown) {
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

  // grid move
  pointerPosition.x =
    Math.round(position.clientX / grid.tileSize) * grid.tileSize +
    pointerOffset.x;
  pointerPosition.y =
    Math.round(position.clientY / grid.tileSize) * grid.tileSize +
    pointerOffset.y;

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

  if (activeNode !== null) {
    if (isDraggingNode) {
      activeNode.position.x = pointerPosition.x;
      activeNode.position.y = pointerPosition.y;
      return;
    }

    for (const edge of state.edges.filter(
      (edge) => edge[0] !== activeNode && edge[1] !== activeNode,
    )) {
      isIntersecting = !!getSegmentIntersection(
        [activeNode.position, pointerPosition],
        [edge[0].position, edge[1].position],
      );

      if (isIntersecting) {
        break;
      }
    }
  }

  if (
    !isPointerDown ||
    hoverNode === null ||
    hoverNode === activeNode ||
    isIntersecting
  ) {
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
  isIntersecting = false;
  activeNode = null;
  nextEdge.length = 0;
}

scene.layers.push([...state.nodes, ...state.edges]);

let now: number = Date.now();
let then: number = Date.now();
(function animate() {
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

  if (isIntersecting) {
    paintEdge(createEdge([activeNode!, pointerNode]), ctx, colors.errorColor);
    paintNode(pointerNode, ctx, colors.errorColor);
  } else if (hoverNode) {
    paintNode(hoverNode, ctx, colors.infoColor);
  }

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
  requestAnimationFrame(animate);
})();
</script>

<template>
  <div class="container" ref="container"></div>
</template>

<style>
canvas {
  border: 1px solid whitesmoke;
}
</style>
