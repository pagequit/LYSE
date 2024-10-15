import {
  type Renderable,
  makeRenderable,
  foregroundColor,
  infoColor,
} from "./index.ts";

export type Node = {
  x: number;
  y: number;
};

export function renderNode(this: Node, ctx: CanvasRenderingContext2D): void {
  ctx.beginPath();
  ctx.arc(this.x, this.y, 4, 0, 2 * Math.PI);
  ctx.strokeStyle = foregroundColor;
  ctx.stroke();
}

export function highlightNode(
  node: Node,
  ctx: CanvasRenderingContext2D,
  color: string,
): void {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI);
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
