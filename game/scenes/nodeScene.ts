import { pointer } from "../../lib/Pointer.ts";
import { createScene, type Scene } from "../../lib/Scene.ts";
import {
  createSegmentIntersection,
  setSegmentIntersection,
} from "../../lib/Segment.ts";
import {
  createNode,
  getNodeByPosition,
  type Node,
  paintNode,
} from "../entities/Node.ts";
import { createEdge, type Edge, paintEdge } from "../entities/Edge.ts";
import { createGraph, type Graph, originDFS } from "../entities/Graph.ts";
import { focusViewport, startPanning, updatePanning } from "../../lib/View.ts";

const scene: Scene = createScene(process, {
  width: 1024,
  height: 768,
  preProcess,
  postProcess,
});

function preProcess(): void {
  document.addEventListener("mousedown", onPointerDown);
  document.addEventListener("touchstart", onPointerDown);
  document.addEventListener("mousemove", onPointerMove);
  document.addEventListener("touchmove", onPointerMove);
  document.addEventListener("mouseup", onPointerUp);
  document.addEventListener("touchend", onPointerUp);

  focusViewport(origin.position.x, origin.position.y);
}

function postProcess(): void {
  document.removeEventListener("mousedown", onPointerDown);
  document.removeEventListener("touchstart", onPointerDown);
  document.removeEventListener("mousemove", onPointerMove);
  document.removeEventListener("touchmove", onPointerMove);
  document.removeEventListener("mouseup", onPointerUp);
  document.removeEventListener("touchend", onPointerUp);
}

const nodes: Array<Node> = [
  { x: 60, y: 221 },
  { x: 100, y: 139 },
  { x: 100, y: 495 },
  { x: 127, y: 349 },
  { x: 145, y: 687 },
  { x: 188, y: 57 },
  { x: 216, y: 217 },
  { x: 288, y: 374 },
  { x: 304, y: 553 },
  { x: 307, y: 212 },
  { x: 324, y: 670 },
  { x: 359, y: 116 },
  { x: 392, y: 303 },
  { x: 495, y: 175 },
  { x: 500, y: 615 },
  { x: 487, y: 82 },
  { x: 534, y: 476 },
  { x: 560, y: 282 },
  { x: 617, y: 54 },
  { x: 623, y: 542 },
  { x: 632, y: 198 },
  { x: 655, y: 664 },
  { x: 735, y: 271 },
  { x: 782, y: 446 },
  { x: 800, y: 700 },
  { x: 803, y: 128 },
  { x: 906, y: 287 },
  { x: 954, y: 684 },
  { x: 982, y: 429 },
  { x: 985, y: 106 },
  { x: 1065, y: 533 },
  { x: 1088, y: 315 },
  { x: 1098, y: 179 },
  { x: 1108, y: 650 },
].map(createNode);

const origin: Node = createNode({
  x: scene.width / 2,
  y: scene.height / 2,
});
nodes.push(origin);

const edges: Array<Edge> = [];
const nextEdge: Array<Node> = [];

const pointerNode = createNode(pointer.position);

const segmentIntersection = createSegmentIntersection();
let isPanning = false;
let isIntersecting = false;

let hoverNode: Node | null = null;
let activeNode: Node | null = null;

let graph: Graph = createGraph(nodes, edges);
let mainGraphNodes: Array<Node> = originDFS(origin, graph);

function onPointerDown(): void {
  const node = getNodeByPosition(nodes, {
    x: pointer.position.x,
    y: pointer.position.y,
  });

  if (node === null) {
    isPanning = true;
    startPanning(pointer.position.x, pointer.position.y);

    return;
  }

  activeNode = node;
  nextEdge.push(activeNode);
}

function onPointerMove(): void {
  if (isPanning) {
    updatePanning(pointer.position.x, pointer.position.y);
    return;
  }

  hoverNode = getNodeByPosition(nodes, {
    x: pointer.position.x,
    y: pointer.position.y,
  });

  if (activeNode !== null) {
    for (const edge of edges.filter(
      (edge) => edge.nodes[0] !== activeNode && edge.nodes[1] !== activeNode,
    )) {
      setSegmentIntersection(
        segmentIntersection,
        [activeNode.position, pointer.position],
        [edge.nodes[0].position, edge.nodes[1].position],
      );

      isIntersecting = !Number.isNaN(segmentIntersection.offset);
      if (isIntersecting) {
        break;
      }
    }
  }

  if (
    !pointer.isDown ||
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
    const existingEdge: Edge | undefined = edges.find((edge, index) => {
      existingIndex = index;
      return (
        (edge.nodes[0] === nextEdge[0] && edge.nodes[1] === nextEdge[1]) ||
        (edge.nodes[0] === nextEdge[1] && edge.nodes[1] === nextEdge[0])
      );
    });

    if (existingEdge !== undefined) {
      edges.splice(existingIndex, 1);
    } else {
      edges.push(maybeEdge);
    }

    nextEdge.shift();

    graph = createGraph(nodes, edges);
    mainGraphNodes = originDFS(origin, graph);
  }
}

function onPointerUp(): void {
  isPanning = false;
  isIntersecting = false;
  activeNode = null;
  nextEdge.length = 0;
}

function process(ctx: CanvasRenderingContext2D): void {
  for (const node of nodes) {
    node.render(ctx);
  }

  for (const edge of edges) {
    edge.render(ctx);
  }

  for (const node of graph.keys()) {
    paintNode(node, ctx, "#eb3342");
  }

  for (const node of mainGraphNodes) {
    paintNode(node, ctx, "#fddf68");
  }

  if (activeNode) {
    paintNode(activeNode, ctx, "#4493f8");

    if (pointer.isDown) {
      paintEdge(createEdge([activeNode!, pointerNode]), ctx, "#4493f8");
      paintNode(pointerNode, ctx, "#4493f8");
    }
  }

  pointerNode.position = pointer.position;
  paintNode(pointerNode, ctx, "#4493f8");

  if (isIntersecting) {
    paintEdge(createEdge([activeNode!, pointerNode]), ctx, "#eb3342");
    paintNode(pointerNode, ctx, "#eb3342");
  } else if (hoverNode) {
    paintNode(hoverNode, ctx, "#4493f8");
  }
}

export default scene;
