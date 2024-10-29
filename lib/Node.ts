import { colors } from "../style.ts"; // TODO: decouple styling
import type { Vector } from "./Vector.ts";
import { type Renderable, createRenderable } from "./Renderable.ts";

export type Node = {
  position: Vector;
} & Renderable;

export function paintNode(
  node: Node,
  ctx: CanvasRenderingContext2D,
  color: string,
): void {
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(node.position.x, node.position.y, 8, 0, 2 * Math.PI);
  ctx.stroke();
}

function render(this: Node, ctx: CanvasRenderingContext2D): void {
  ctx.lineWidth = 2;
  ctx.strokeStyle = colors.foregroundColor;
  ctx.beginPath();
  ctx.arc(this.position.x, this.position.y, 4, 0, 2 * Math.PI);
  ctx.stroke();
}

export function createNode(position: Vector): Node {
  return createRenderable({ position }, render);
}

export function getNodeByPosition(
  nodes: Array<Node>,
  position: Vector,
): Node | null {
  for (const node of nodes) {
    if (
      node.position.x <= position.x + 8 &&
      node.position.x >= position.x - 8 &&
      node.position.y <= position.y + 8 &&
      node.position.y >= position.y - 8
    ) {
      return node;
    }
  }

  return null;
}
