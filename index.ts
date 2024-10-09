import "./index.css";

type Node = {
  x: number;
  y: number;
};

const nodeA: Node = {
  x: 100,
  y: 100,
};

const nodeB: Node = {
  x: 300,
  y: 200,
};

type Renderable = {
  render: (ctx: CanvasRenderingContext2D) => void;
};

function makeRenderable<T extends {}>(
  entity: T,
  render: Renderable["render"],
): T & Renderable {
  return {
    ...entity,
    render,
  };
}

function draw(ctx: CanvasRenderingContext2D): (entity: Renderable) => void {
  return (entity: Renderable) => entity.render.call(entity, ctx);
}

function renderNode(this: Node, ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "#c9d1d9";
  ctx.beginPath();
  ctx.arc(this.x, this.y, 4, 0, 2 * Math.PI);
  ctx.stroke();
}

function makeRenderableNode(node: Node): Node & Renderable {
  return makeRenderable(node, renderNode);
}

const nodes = [nodeA, nodeB].map(makeRenderableNode);

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
canvas.style.backgroundColor = "#0d1117";
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

let now = Date.now();
let then = Date.now();
(function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const node of nodes) {
    draw(ctx)(node);
  }

  then = now;
  now = Date.now();
  const delta = now - then;
  ctx.fillStyle = "#c9d1d9";
  ctx.fillText("FPS: " + Math.round(1000 / delta), 10, 10);
  requestAnimationFrame(animate);
})();
