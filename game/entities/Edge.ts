import { type Node } from "./Node.ts";

export type Edge = [Node, Node];

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
