import "./style.css";
import { colors } from "./style.ts";
import {
  getNodeByPosition,
  createNode,
  paintNode,
  type Node,
} from "./renderable/Node.ts";
import { createEdge, paintEdge, type Edge } from "./renderable/Edge.ts";
import { type Renderable, render } from "./renderable/Renderable.ts";
import {
  createGraph,
  getIntersection,
  originDFS,
  type Graph,
  type Vector,
} from "./lib/index.ts";
import init, {
  Vector as Vec,
  Edge as E,
  Node as N,
  Intersection,
  createGraph as cG,
  type Graph as G,
} from "./wasm/pkg/lyse.js";

await init();

const vec1 = new Vec(1, 0);
const vec2 = new Vec(1, 2);
const vec3 = new Vec(0, 1);
const vec4 = new Vec(2, 1);

const intersection = Intersection.find(vec1, vec2, vec3, vec4);

if (intersection !== undefined) {
  const {
    position: { x, y },
    offset,
  } = intersection;

  console.log(x, y, offset);
}

const n1 = new N(vec1);
const n2 = new N(vec2);
const n3 = new N(vec3);
const n4 = new N(vec4);

const e1 = new E(n1, n2);
const e2 = new E(n3, n4);

const g: G = cG([n1, n2, n4, n3], [e1, e2]);

for (const neighbors of g.values()) {
  for (const neighbor of neighbors) {
    console.log(neighbor.position.x, neighbor.position.y);
  }
}

type Scene = {
  view: View;
  layers: Array<Array<Renderable>>;
};

const canvas: HTMLCanvasElement = document.createElement("canvas");
document.getElementById("view")!.appendChild(canvas);
canvas.style.backgroundColor = colors.backgroundColor;
const ctx: CanvasRenderingContext2D = canvas.getContext(
  "2d",
) as CanvasRenderingContext2D;

type View = {
  width: number;
  height: number;
};

const view: View = {
  width: 1200,
  height: 780,
};

const scene: Scene = {
  view,
  layers: [],
};

canvas.width = Math.min(window.innerWidth, view.width);
canvas.height = Math.min(window.innerHeight, view.height);
const viewOffset = {
  x:
    window.innerWidth < view.width ? 0 : (view.width - window.innerWidth) * 0.5,
  y:
    window.innerHeight < view.height
      ? 0
      : (view.height - window.innerHeight) * 0.5,
};

window.addEventListener("resize", () => {
  canvas.width = Math.min(window.innerWidth, view.width);
  canvas.height = Math.min(window.innerHeight, view.height);

  viewOffset.x =
    window.innerWidth < view.width ? 0 : (view.width - window.innerWidth) * 0.5;
  viewOffset.y =
    window.innerHeight < view.height
      ? 0
      : (view.height - window.innerHeight) * 0.5;
});

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
  x: view.width / 2,
  y: view.height / 2,
});

nodes.push(origin);

const edges: Array<Edge> = [];

const nextEdge: Array<Node> = [];

let isIntersecting: boolean = false;
let activeNode: Node | null = null;
let hoverNode: Node | null = null;
let mainGraphNodes: Array<Node> = [origin];
let graph: Graph = new Map();
let isDragging: boolean = false;
let isPointerDown: boolean = false;
const dragVector: Vector = { x: 0, y: 0 };
const dragOffset: Vector = {
  x: Math.min(0, (canvas.width - view.width) * 0.5),
  y: Math.min(0, (canvas.height - view.height) * 0.5),
};
const pointerPosition: Vector = { x: 0, y: 0 };
const pointerNode: Node = createNode(pointerPosition);
const pointerOffset: Vector = {
  x: viewOffset.x - dragOffset.x,
  y: viewOffset.y - dragOffset.y,
};

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
      Math.max(canvas.width - view.width, position.clientX - dragVector.x),
    );

    dragOffset.y = Math.min(
      0,
      Math.max(canvas.height - view.height, position.clientY - dragVector.y),
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
    for (const edge of edges.filter(
      (edge) => edge[0] !== activeNode && edge[1] !== activeNode,
    )) {
      isIntersecting = !!getIntersection(
        activeNode.position,
        pointerPosition,
        edge[0].position,
        edge[1].position,
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
    const existingEdge: Edge | undefined = edges.find((edge, index) => {
      existingIndex = index;
      return (
        (edge[0] === nextEdge[0] && edge[1] === nextEdge[1]) ||
        (edge[0] === nextEdge[1] && edge[1] === nextEdge[0])
      );
    });

    if (existingEdge !== undefined) {
      edges.splice(existingIndex, 1);
    } else {
      edges.push(maybeEdge);
    }

    scene.layers[0] = [...nodes, ...edges];
    nextEdge.shift();

    graph = createGraph(nodes, edges);
    mainGraphNodes = originDFS(origin, graph);
  }
}

function onPointerUp(): void {
  isPointerDown = false;
  isDragging = false;
  isIntersecting = false;
  activeNode = null;
  nextEdge.length = 0;
}

document.addEventListener("mousedown", onPointerDown);
document.addEventListener("touchstart", onPointerDown);

document.addEventListener("mousemove", onPointerMove);
document.addEventListener("touchmove", onPointerMove);

document.addEventListener("mouseup", onPointerUp);
document.addEventListener("touchend", onPointerUp);

scene.layers.push([...nodes, ...edges]);

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

  for (const node of graph.keys()) {
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
