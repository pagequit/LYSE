import {
  makeRenderable,
  type Renderable,
  type Node,
  foregroundColor,
} from "./index.ts";

export type Edge = [Node, Node];

export function renderLink(this: Edge, ctx: CanvasRenderingContext2D) {
  ctx.moveTo(this[0].x, this[0].y);
  ctx.lineTo(this[1].x, this[1].y);
  ctx.strokeStyle = foregroundColor;
  ctx.stroke();
}

export function makeRenderableLink(edge: Edge): Edge & Renderable {
  return makeRenderable(edge, renderLink);
}
