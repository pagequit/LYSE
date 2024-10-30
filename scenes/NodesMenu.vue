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
import { createGraph, originDFS } from "../lib/Graph.ts";
import { type Vector } from "../lib/Vector.ts";
import { type Scene } from "../lib/Scene.ts";
import { getSegmentIntersection } from "../lib/Segment.ts";
import { render } from "../lib/Renderable.ts";
import { useViewport } from "./useViewport.ts";
import { useCanvas } from "./useCanvas.ts";
import { gameState } from "./useGameState.ts";
import { getNodes } from "./getNodes.ts";

const state = gameState.nodesMenu;

const { nodes, origin } = getNodes();
nodes.push(origin);

const { canvas, ctx } = useCanvas();
const { viewport, viewOffset } = useViewport();
const container = useTemplateRef("container");

canvas.width = Math.min(window.innerWidth, viewport.width);
canvas.height = Math.min(window.innerHeight, viewport.height);

onMounted(() => {
  container.value!.appendChild(canvas);

  window.addEventListener("resize", onResize);
  document.addEventListener("mousedown", onPointerDown);
  document.addEventListener("touchstart", onPointerDown);
  document.addEventListener("mousemove", onPointerMove);
  document.addEventListener("touchmove", onPointerMove);
  document.addEventListener("mouseup", onPointerUp);
  document.addEventListener("touchend", onPointerUp);
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

let mainGraphNodes = originDFS(origin, state.graph);
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
}

function onPointerDown(event: MouseEvent | TouchEvent): void {
  isPointerDown = true;
  const position = event instanceof MouseEvent ? event : event.touches[0];

  pointerPosition.x = position.clientX + pointerOffset.x;
  pointerPosition.y = position.clientY + pointerOffset.y;

  const node = getNodeByPosition(nodes, {
    x: pointerPosition.x,
    y: pointerPosition.y,
  });

  if (node === null) {
    isDragging = true;
    dragVector.x = position.clientX - dragOffset.x;
    dragVector.y = position.clientY - dragOffset.y;
    return;
  }

  activeNode = node;
  nextEdge.push(activeNode);
}

function onPointerMove(event: MouseEvent | TouchEvent): void {
  const position: { clientX: number; clientY: number } =
    event instanceof MouseEvent ? event : event.touches[0];

  pointerPosition.x = position.clientX + pointerOffset.x;
  pointerPosition.y = position.clientY + pointerOffset.y;

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

  hoverNode = getNodeByPosition(nodes, {
    x: pointerPosition.x,
    y: pointerPosition.y,
  });

  if (activeNode !== null) {
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

    scene.layers[0] = [...nodes, ...state.edges];
    nextEdge.shift();

    state.graph = createGraph(nodes, state.edges);
    mainGraphNodes = originDFS(origin, state.graph);
  }
}

function onPointerUp(): void {
  isPointerDown = false;
  isDragging = false;
  isIntersecting = false;
  activeNode = null;
  nextEdge.length = 0;
}

scene.layers.push([...nodes, ...state.edges]);

let now: number = Date.now();
let then: number = Date.now();
(function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(dragOffset.x, dragOffset.y);

  for (const layer of scene.layers) {
    for (const renderable of layer) {
      render.call(renderable, ctx);
    }
  }

  for (const node of state.graph.keys()) {
    paintNode(node, ctx, colors.errorColor);
  }

  for (const node of mainGraphNodes) {
    paintNode(node, ctx, colors.warningColor);
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
  }

  if (hoverNode && !isIntersecting) {
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

  ctx.restore();
  requestAnimationFrame(animate);
})();
</script>

<template>
  <div class="container" ref="container"></div>
</template>
