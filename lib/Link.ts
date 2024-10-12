import {
  makeRenderable,
  type Renderable,
  type Node,
  foregroundColor,
} from "./index.ts";

export type Link = [Node, Node];

export function renderLink(this: Link, ctx: CanvasRenderingContext2D) {
  ctx.moveTo(this[0].x, this[0].y);
  ctx.lineTo(this[1].x, this[1].y);
  ctx.strokeStyle = foregroundColor;
  ctx.stroke();
}

export function makeRenderableLink(link: Link): Link & Renderable {
  return makeRenderable(link, renderLink);
}
