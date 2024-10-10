import { makeRenderable, type Renderable } from "./index.ts";

export type Node = {
  x: number;
  y: number;
};

export function renderNode(this: Node, ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.arc(this.x, this.y, 4, 0, 2 * Math.PI);
  ctx.strokeStyle = "#c9d1d9";
  ctx.stroke();
}

export function makeRenderableNode(node: Node): Node & Renderable {
  return makeRenderable(node, renderNode);
}
