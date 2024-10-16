import { type Renderable, makeRenderable, colors } from "./index.ts";

export type Node = {
  x: number;
  y: number;
};

export function paintNode(
  node: Node,
  ctx: CanvasRenderingContext2D,
  color: string,
): void {
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI);
  ctx.stroke();
}

export function renderNode(this: Node, ctx: CanvasRenderingContext2D): void {
  ctx.lineWidth = 2;
  ctx.strokeStyle = colors.foregroundColor;
  ctx.beginPath();
  ctx.arc(this.x, this.y, 4, 0, 2 * Math.PI);
  ctx.stroke();
}

export function makeRenderableNode(node: Node): Node & Renderable {
  return makeRenderable(node, renderNode);
}

export function getNodeByPosition(
  nodes: Array<Node>,
  position: { x: number; y: number },
): Node | null {
  for (const node of nodes) {
    if (
      node.x <= position.x + 8 &&
      node.x >= position.x - 8 &&
      node.y <= position.y + 8 &&
      node.y >= position.y - 8
    ) {
      return node;
    }
  }

  return null;
}
