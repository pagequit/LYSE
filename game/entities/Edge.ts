import { colors } from "../style.ts"; // TODO: decouple styling
import { type Node } from "./Node.ts";
import { type Renderable } from "../../engine/Renderable.ts";

export type Edge = {
  nodes: [Node, Node];
} & Renderable;

export function paintEdge(
  edge: Edge,
  ctx: CanvasRenderingContext2D,
  color: string,
): void {
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(edge.nodes[0].position.x, edge.nodes[0].position.y);
  ctx.lineTo(edge.nodes[1].position.x, edge.nodes[1].position.y);
  ctx.stroke();
}

function render(this: Edge, ctx: CanvasRenderingContext2D) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = colors.foregroundColor;
  ctx.moveTo(this.nodes[0].position.x, this.nodes[0].position.y);
  ctx.lineTo(this.nodes[1].position.x, this.nodes[1].position.y);
  ctx.stroke();
}

export function createEdge(nodes: [Node, Node]): Edge {
  return { nodes, render };
}
