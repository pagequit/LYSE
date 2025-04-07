import { type Vector } from "../../lib/Vector.ts";

export type Node = {
  position: Vector;
};

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

export function getNodeByPosition(
  nodes: Array<Node>,
  position: Vector,
): Node | null {
  for (const node of nodes) {
    if (
      node.position.x <= position.x + 16 &&
      node.position.x >= position.x - 16 &&
      node.position.y <= position.y + 16 &&
      node.position.y >= position.y - 16
    ) {
      return node;
    }
  }

  return null;
}
