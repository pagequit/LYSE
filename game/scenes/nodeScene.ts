import { colors } from "../../style.ts";
import { pointer } from "../../engine/system/Pointer.ts";
import { createScene } from "../../engine/system/Scene.ts";
import { type Vector } from "../../engine/lib/Vector.ts";
import { getSegmentIntersection } from "../../engine/lib/Segment.ts";
import {
  createNode,
  paintNode,
  getNodeByPosition,
  type Node,
} from "../entity/Node.ts";
import { createEdge, paintEdge, type Edge } from "../entity/Edge.ts";
import { originDFS, createGraph, type Graph } from "../entity/Graph";

const nodes: Array<Node> = [
  { x: 60, y: 221 },
  { x: 100, y: 139 },
  { x: 100, y: 495 },
  { x: 127, y: 349 },
  { x: 145, y: 687 },
  { x: 188, y: 57 },
  { x: 216, y: 217 },
  { x: 288, y: 374 },
  { x: 304, y: 553 },
  { x: 307, y: 212 },
  { x: 324, y: 670 },
  { x: 359, y: 116 },
  { x: 392, y: 303 },
  { x: 495, y: 175 },
  { x: 500, y: 615 },
  { x: 487, y: 82 },
  { x: 534, y: 476 },
  { x: 560, y: 282 },
  { x: 617, y: 54 },
  { x: 623, y: 542 },
  { x: 632, y: 198 },
  { x: 655, y: 664 },
  { x: 735, y: 271 },
  { x: 782, y: 446 },
  { x: 800, y: 700 },
  { x: 803, y: 128 },
  { x: 906, y: 287 },
  { x: 954, y: 684 },
  { x: 982, y: 429 },
  { x: 985, y: 106 },
  { x: 1065, y: 533 },
  { x: 1088, y: 315 },
  { x: 1098, y: 179 },
  { x: 1108, y: 650 },
].map(createNode);

const origin: Node = createNode({
  x: self.innerWidth / 2,
  y: self.innerHeight / 2,
});
nodes.push(origin);

const edges: Array<Edge> = [];
const nextEdge: Array<Node> = [];

let graph: Graph = createGraph(nodes, edges);
let mainGraphNodes: Array<Node> = originDFS(origin, graph);
let isIntersecting = false;
let activeNode: Node | null = null;
let hoverNode: Node | null = null;
let isDragging = false;

const dragVector: Vector = { x: 0, y: 0 };
const dragOffset: Vector = {
  x: Math.min(0, (nodeScene.width - self.innerWidth) * 0.5),
  y: Math.min(0, (nodeScene.height - self.innerHeight) * 0.5),
};

nodeScene.process.push(() => {
  if (pointer.isDown) {
    activeNode = getNodeByPosition(nodes, pointer.position);

    if (activeNode === null) {
      isDragging = true;
      dragVector.x = pointer.position.x - dragOffset.x;
      dragVector.y = pointer.position.y - dragOffset.y;

      return;
    }

    nextEdge.push(activeNode);

    if (isDragging) {
      dragOffset.x = Math.min(
        0,
        Math.max(
          nodeScene.width - self.innerWidth,
          pointer.position.x - dragVector.x,
        ),
      );
      dragOffset.y = Math.min(
        0,
        Math.max(
          nodeScene.height - self.innerHeight,
          pointer.position.y - dragVector.y,
        ),
      );

      nodeScene.offset.x = dragOffset.x;
      nodeScene.offset.y = dragOffset.y;

      return;
    }

    hoverNode = getNodeByPosition(nodes, {
      x: pointer.position.x,
      y: pointer.position.y,
    });

    if (activeNode !== null) {
      for (const edge of edges.filter(
        (edge) => edge[0] !== activeNode && edge[1] !== activeNode,
      )) {
        isIntersecting = !!getSegmentIntersection(
          [activeNode.position, pointer.position],
          [edge[0].position, edge[1].position],
        );

        if (isIntersecting) {
          break;
        }
      }
    }

    if (
      !pointer.isDown ||
      hoverNode === null ||
      hoverNode === activeNode ||
      isIntersecting
    ) {
      return;
    }

    activeNode = hoverNode as Node;
    nextEdge.push(activeNode);

    if (nextEdge.length === 2) {
      const maybeEdge: Edge = createEdge([nextEdge[0], nextEdge[1]]);

      let existingIndex = 0;
      const existingEdge: Edge | undefined = edges.find((edge, index) => {
        existingIndex = index;
        return (
          (edge[0] === nextEdge[0] && edge[1] === nextEdge[1]) ||
          (edge[0] === nextEdge[1] && edge[1] === nextEdge[0])
        );
      });

      if (existingEdge !== undefined) {
        edges.splice(existingIndex, 1);
      } else {
        edges.push(maybeEdge);
      }

      nextEdge.shift();

      graph = createGraph(nodes, edges);
      mainGraphNodes = originDFS(origin, graph);
    }
  } else {
    isDragging = false;
    isIntersecting = false;
    activeNode = null;
    nextEdge.length = 0;
  }
});

const pointerNode = createNode(pointer.position);
nodeScene.animations.push((ctx: CanvasRenderingContext2D) => {
  for (const node of nodes) {
    node.render(ctx);
  }

  for (const node of graph.keys()) {
    paintNode(node, ctx, colors.errorColor);
  }

  for (const node of mainGraphNodes) {
    paintNode(node, ctx, colors.warningColor);
  }

  if (activeNode) {
    paintNode(activeNode, ctx, colors.infoColor);

    if (pointer.isDown) {
      paintEdge(createEdge([activeNode!, pointerNode]), ctx, colors.infoColor);
      paintNode(pointerNode, ctx, colors.infoColor);
    }
  }

  pointerNode.position = pointer.position;
  paintNode(pointerNode, ctx, colors.infoColor);

  if (isIntersecting) {
    paintEdge(createEdge([activeNode!, pointerNode]), ctx, colors.errorColor);
    paintNode(pointerNode, ctx, colors.errorColor);
  } else if (hoverNode) {
    paintNode(hoverNode, ctx, colors.infoColor);
  }

  ctx.fillStyle = colors.foregroundColor;
  ctx.fillText(
    `nextEdge: ${nextEdge.length}`,
    -nodeScene.offset.x + 10,
    -nodeScene.offset.y + 30,
  );
});

export default createScene(
  (ctx: CanvasRenderingContext2D, delta: number) => {
    // TODO
  },
  {
    width: 1200,
    height: 800,
  },
);
