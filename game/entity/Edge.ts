import { colors } from "../../style.ts"; // TODO: decouple styling
import type { Node } from "./Node.ts";
import {
  createRenderable,
  type Renderable,
} from "../../engine/lib/Renderable.ts";

export type Edge = [Node, Node] & Renderable;

export function paintEdge(
  edge: Edge,
  ctx: CanvasRenderingContext2D,
  color: string,
): void {
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(edge[0].position.x, edge[0].position.y);
  ctx.lineTo(edge[1].position.x, edge[1].position.y);
  ctx.stroke();
}

function render(this: Edge, ctx: CanvasRenderingContext2D) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = colors.foregroundColor;
  ctx.moveTo(this[0].position.x, this[0].position.y);
  ctx.lineTo(this[1].position.x, this[1].position.y);
  ctx.stroke();
}

export function createEdge(nodes: [Node, Node]): Edge & Renderable {
  return createRenderable(nodes, render);
}
