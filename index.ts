import "./index.css";
import {
  type Link,
  type Node,
  type Renderable,
  getHoverNode,
  highlightNode,
  makeRenderableLink,
  makeRenderableNode,
  render,
} from "./lib";

const nodes: Array<Node & Renderable> = [
  { x: 536.5, y: 542 },
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

const links: Array<Link & Renderable> = [];

const canvas: HTMLCanvasElement = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
canvas.style.backgroundColor = "#0d1117";
const ctx: CanvasRenderingContext2D = canvas.getContext(
  "2d",
) as CanvasRenderingContext2D;

let activeNode: Node | null = null;
const nextLink: Array<Node> = [];

document.addEventListener("mousedown", (event: MouseEvent) => {
  const node = getHoverNode(nodes, event);
  if (node === null) {
    return;
  }

  if (node === activeNode) {
    activeNode = null;
    nextLink.length = 0;
    return;
  }

  activeNode = node;
  nextLink.push(activeNode);

  if (nextLink.length === 2) {
    links.push(makeRenderableLink([nextLink[0], nextLink[1]]));
    nextLink.shift();
  }
});

let hoverNode: Node | null = null;

document.addEventListener("mousemove", (event: MouseEvent) => {
  hoverNode = getHoverNode(nodes, event);
});

let now: number = Date.now();
let then: number = Date.now();
(function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const renderable of [...nodes, ...links] as Array<Renderable>) {
    render.call(renderable, ctx);
  }

  if (hoverNode) {
    highlightNode(hoverNode, ctx);
  }

  if (activeNode) {
    highlightNode(activeNode, ctx);
  }

  then = now;
  now = Date.now();
  const delta = now - then;
  ctx.fillStyle = "#c9d1d9";
  ctx.fillText(`FPS: ${Math.round(1000 / delta)}`, 10, 10);
  requestAnimationFrame(animate);
})();
