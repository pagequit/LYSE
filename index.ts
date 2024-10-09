import "./index.css";

type Node = {
  x: number;
  y: number;
};

type Link = {
  a: Node;
  b: Node;
};

type Network = Array<Link>;

function getDistance(link: Link): number {
  return Math.sqrt(
    Math.pow(link.a.x - link.b.x, 2) + Math.pow(link.a.x - link.b.x, 2),
  );
}

function appendToNetwork(network: Network, link: Link): Network {
  network.push(link);

  return network;
}

const nodeA: Node = {
  x: -1,
  y: 0,
};

const nodeB: Node = {
  x: 1,
  y: 2,
};

const nodeC: Node = {
  x: 0,
  y: 3,
};

const link1: Link = {
  a: nodeA,
  b: nodeB,
};

const link2: Link = {
  a: nodeB,
  b: nodeC,
};

const network: Network = [link1, link2];

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

  then = now;
  now = Date.now();
  const delta = now - then;
  ctx.fillStyle = "#c9d1d9";
  ctx.fillText("FPS: " + Math.round(1000 / delta), 10, 10);
  requestAnimationFrame(animate);
})();
