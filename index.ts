import "./index.css";
import {
  type Renderable,
  type Node,
  type Link,
  render,
  makeRenderableNode,
  makeRenderableLink,
} from "./lib";

const nodeA: Node = {
  x: 100,
  y: 100,
};

const nodeB: Node = {
  x: 300,
  y: 200,
};

const nodes: Array<Node & Renderable> = [nodeA, nodeB].map(makeRenderableNode);

const linkAB: Link = [nodeA, nodeB];

const links: Array<Link & Renderable> = [linkAB].map(makeRenderableLink);

const canvas: HTMLCanvasElement = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
canvas.style.backgroundColor = "#0d1117";
const ctx: CanvasRenderingContext2D = canvas.getContext(
  "2d",
) as CanvasRenderingContext2D;

document.addEventListener("mousedown", (event: MouseEvent) => {
  if (event) {
    nodes.push(
      makeRenderableNode({
        x: event.clientX,
        y: event.clientY,
      }),
    );
  }
});

let now: number = Date.now();
let then: number = Date.now();
(function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const renderable of [...nodes, ...links] as Array<Renderable>) {
    render.call(renderable, ctx);
  }

  then = now;
  now = Date.now();
  const delta = now - then;
  ctx.fillStyle = "#c9d1d9";
  ctx.fillText(`FPS: ${Math.round(1000 / delta)}`, 10, 10);
  requestAnimationFrame(animate);
})();
