import "./index.css";
import {
  type Edge,
  type Node,
  type Renderable,
  getNodeByPosition,
  highlightNode,
  makeRenderableLink,
  makeRenderableNode,
  render,
  backgroundColor,
  foregroundColor,
} from "./lib";

const nodes: Array<Node & Renderable> = [
  { x: 536, y: 542 },
  { x: 70, y: 65 },
  { x: 242, y: 73 },
  { x: 147, y: 242 },
  { x: 299, y: 247 },
  { x: 85, y: 467 },
  { x: 417, y: 386 },
  { x: 262, y: 702 },
  { x: 274, y: 511 },
  { x: 93, y: 660 },
  { x: 155, y: 927 },
  { x: 533, y: 905 },
  { x: 396, y: 725 },
  { x: 855, y: 1019 },
  { x: 924, y: 889 },
  { x: 696, y: 768 },
  { x: 959, y: 350 },
  { x: 957, y: 481 },
  { x: 730, y: 397 },
  { x: 812, y: 493 },
  { x: 850, y: 162 },
  { x: 973, y: 141 },
  { x: 588, y: 68 },
  { x: 588, y: 273 },
  { x: 471, y: 185 },
  { x: 819, y: 302 },
  { x: 680, y: 188 },
  { x: 886, y: 677 },
  { x: 659, y: 639 },
  { x: 514, y: 674 },
  { x: 411, y: 557 },
  { x: 552, y: 408 },
  { x: 634, y: 490 },
  { x: 730, y: 576 },
  { x: 579, y: 731 },
  { x: 311, y: 910 },
  { x: 317, y: 374 },
  { x: 81, y: 347 },
  { x: 190, y: 592 },
  { x: 688, y: 971 },
  { x: 805, y: 734 },
  { x: 179, y: 808 },
].map(makeRenderableNode);
const edges: Array<Edge & Renderable> = [];

const canvas: HTMLCanvasElement = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
canvas.style.backgroundColor = backgroundColor;
const ctx: CanvasRenderingContext2D = canvas.getContext(
  "2d",
) as CanvasRenderingContext2D;

const nextEdge: Array<Node & Renderable> = [];
let activeNode: (Node & Renderable) | null = null;
let isPointerDown: boolean = false;
let hoverNode: (Node & Renderable) | null = null;
let pointerNode: Node & Renderable = makeRenderableNode({ x: 0, y: 0 });

function renderMouseLink(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = foregroundColor;
  ctx.beginPath();
  ctx.moveTo(activeNode!.x, activeNode!.y);
  ctx.lineTo(pointerNode.x, pointerNode.y);
  ctx.stroke();
}

function onPointerDown(event: MouseEvent | TouchEvent) {
  isPointerDown = true;
  const position = event instanceof MouseEvent ? event : event.touches[0];

  pointerNode.x = position.clientX;
  pointerNode.y = position.clientY;

  const node = getNodeByPosition(nodes, {
    x: position.clientX,
    y: position.clientY,
  });

  if (node === null) {
    return;
  }

  activeNode = node as Node & Renderable;
  nextEdge.push(activeNode);
}

function onPointerMove(event: MouseEvent | TouchEvent) {
  const position = event instanceof MouseEvent ? event : event.touches[0];

  pointerNode.x = position.clientX;
  pointerNode.y = position.clientY;

  hoverNode = getNodeByPosition(nodes, {
    x: position.clientX,
    y: position.clientY,
  }) as Node & Renderable;

  if (!isPointerDown || hoverNode === null || hoverNode === activeNode) {
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
  }
}

function onPointerUp() {
  isPointerDown = false;
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

  for (const renderable of [...nodes, ...edges] as Array<Renderable>) {
    render.call(renderable, ctx);
  }

  if (hoverNode) {
    highlightNode(hoverNode, ctx);
  }

  if (activeNode) {
    highlightNode(activeNode, ctx);

    if (isPointerDown) {
      renderMouseLink(ctx);
      render.call(pointerNode, ctx);
    }
  }

  then = now;
  now = Date.now();
  const delta = now - then;
  ctx.fillStyle = "#c9d1d9";
  ctx.fillText(`FPS: ${Math.round(1000 / delta)}`, 10, 10);
  requestAnimationFrame(animate);
})();
