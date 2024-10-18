import "./style.css";
import {
  type Edge,
  type Graph,
  type Intersection,
  type Node,
  type Renderable,
  colors,
  getIntersection,
  getNodeByPosition,
  makeGraph,
  makeRenderableLink,
  makeRenderableNode,
  originDFS,
  paintEdge,
  paintNode,
  render,
} from "./lib";

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

const nodes: Array<Node & Renderable> = [
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
].map(makeRenderableNode);

const origin: Node & Renderable = makeRenderableNode({
  x: view.width / 2,
  y: view.height / 2,
});

nodes.push(origin);

const edges: Array<Edge & Renderable> = [];

const nextEdge: Array<Node & Renderable> = [];

let isIntersecting: boolean = false;
let activeNode: (Node & Renderable) | null = null;
let hoverNode: (Node & Renderable) | null = null;
let mainGraphNodes: Array<Node> = [origin];
let graph: Graph = new Map();
let isDragging: boolean = false;
let isPointerDown: boolean = false;
const dragVector: { x: number; y: number } = { x: 0, y: 0 };
const dragOffset: { x: number; y: number } = {
  x: Math.min(0, (canvas.width - view.width) * 0.5),
  y: Math.min(0, (canvas.height - view.height) * 0.5),
};
const pointerNode: Node = { x: 0, y: 0 };
const pointerOffset: { x: number; y: number } = {
  x: viewOffset.x - dragOffset.x,
  y: viewOffset.y - dragOffset.y,
};

function onPointerDown(event: MouseEvent | TouchEvent): void {
  isPointerDown = true;
  const position = event instanceof MouseEvent ? event : event.touches[0];

  pointerNode.x = position.clientX + pointerOffset.x;
  pointerNode.y = position.clientY + pointerOffset.y;

  const node = getNodeByPosition(nodes, {
    x: pointerNode.x,
    y: pointerNode.y,
  });

  if (node === null) {
    isDragging = true;
    dragVector.x = position.clientX - dragOffset.x;
    dragVector.y = position.clientY - dragOffset.y;
    return;
  }

  activeNode = node as Node & Renderable;
  nextEdge.push(activeNode);
}

function onPointerMove(event: MouseEvent | TouchEvent): void {
  const position: { clientX: number; clientY: number } =
    event instanceof MouseEvent ? event : event.touches[0];

  pointerNode.x = position.clientX + pointerOffset.x;
  pointerNode.y = position.clientY + pointerOffset.y;

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
    x: pointerNode.x,
    y: pointerNode.y,
  }) as Node & Renderable;

  if (activeNode !== null) {
    for (const edge of edges.filter(
      (edge) => edge[0] !== activeNode && edge[1] !== activeNode,
    )) {
      const maybeIntersection: Intersection = getIntersection(
        activeNode,
        pointerNode,
        edge[0],
        edge[1],
      );

      isIntersecting =
        maybeIntersection.offset > 0 && maybeIntersection.offset < 1;
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

  activeNode = hoverNode as Node & Renderable;
  nextEdge.push(activeNode);

  if (nextEdge.length === 2) {
    const maybeEdge: Edge & Renderable = makeRenderableLink([
      nextEdge[0],
      nextEdge[1],
    ]);

    let existingIndex = 0;
    const existingEdge: (Edge & Renderable) | undefined = edges.find(
      (edge, index) => {
        existingIndex = index;
        return (
          (edge[0] === nextEdge[0] && edge[1] === nextEdge[1]) ||
          (edge[0] === nextEdge[1] && edge[1] === nextEdge[0])
        );
      },
    );

    if (existingEdge !== undefined) {
      edges.splice(existingIndex, 1);
    } else {
      edges.push(maybeEdge);
    }

    nextEdge.shift();

    graph = makeGraph(nodes, edges);
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

let now: number = Date.now();
let then: number = Date.now();
(function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(dragOffset.x, dragOffset.y);

  for (const renderable of [...nodes, ...edges] as Array<Renderable>) {
    render.call(renderable, ctx);
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
      paintEdge([activeNode!, pointerNode], ctx, colors.infoColor);
      paintNode(pointerNode, ctx, colors.infoColor);
    }
  }

  if (isIntersecting) {
    paintEdge([activeNode!, pointerNode], ctx, colors.errorColor);
    paintNode(pointerNode, ctx, colors.errorColor);
  }

  if (hoverNode && !isIntersecting) {
    paintNode(hoverNode, ctx, colors.infoColor);
  }

  paintNode(pointerNode, ctx, colors.infoColor);

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
