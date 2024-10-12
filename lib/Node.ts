import {
  type Renderable,
  makeRenderable,
  foregroundColor,
  highlightColor,
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

export function highlightNode(node: Node, ctx: CanvasRenderingContext2D): void {
  ctx.strokeStyle = highlightColor;
  ctx.beginPath();
  ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI);
  ctx.stroke();
}

export function makeRenderableNode(node: Node): Node & Renderable {
  return makeRenderable(node, renderNode);
}

export function getHoverNode(
  nodes: Array<Node>,
  event: MouseEvent,
): Node | null {
  for (const node of nodes) {
    if (
      node.x <= event.clientX + 8 &&
      node.x >= event.clientX - 8 &&
      node.y <= event.clientY + 8 &&
      node.y >= event.clientY - 8
    ) {
      return node;
    }
  }

  return null;
}
