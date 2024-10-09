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

// todo: turn the arguments around
function draw(this: Renderable, ctx: CanvasRenderingContext2D): void {
  this.render.call(this, ctx);
}

function renderNode(this: Node, ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.arc(this.x, this.y, 4, 0, 2 * Math.PI);
  ctx.strokeStyle = "#c9d1d9";
  ctx.stroke();
}

function makeRenderableNode(node: Node): Node & Renderable {
  return makeRenderable(node, renderNode);
}

const nodes = [nodeA, nodeB].map(makeRenderableNode);

type Link = [Node, Node];

const link: Link = [nodeA, nodeB];

function renderLink(this: Link, ctx: CanvasRenderingContext2D) {
  ctx.moveTo(this[0].x, this[0].y);
  ctx.lineTo(this[1].x, this[1].y);
  ctx.strokeStyle = "#c9d1d9";
  ctx.stroke();
}

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
    draw.call(node, ctx);
  }

  renderLink.call(link, ctx);

  then = now;
  now = Date.now();
  const delta = now - then;
  ctx.fillStyle = "#c9d1d9";
  ctx.fillText(`FPS: ${Math.round(1000 / delta)}`, 10, 10);
  requestAnimationFrame(animate);
})();
