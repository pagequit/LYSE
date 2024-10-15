import {
  makeRenderable,
  type Renderable,
  type Node,
  foregroundColor,
} from "./index.ts";

export type Edge = [Node, Node];

export function highlightEdge(
  edge: Edge,
  ctx: CanvasRenderingContext2D,
  color: string,
): void {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(edge[0].x, edge[0].y);
  ctx.lineTo(edge[1].x, edge[1].y);
  ctx.stroke();
}

export function renderLink(this: Edge, ctx: CanvasRenderingContext2D) {
  ctx.moveTo(this[0].x, this[0].y);
  ctx.lineTo(this[1].x, this[1].y);
  ctx.strokeStyle = foregroundColor;
  ctx.stroke();
}

export function makeRenderableLink(edge: Edge): Edge & Renderable {
  return makeRenderable(edge, renderLink);
}
