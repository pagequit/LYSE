import { type Node } from "../renderable/Node.ts";
import { type Edge } from "../renderable/Edge.ts";

export type Graph = Map<Node, Array<Node>>;

export function createGraph(nodes: Array<Node>, edges: Array<Edge>): Graph {
  const graph: Graph = new Map();

  for (const node of nodes) {
    const neighbours = edges.reduce((acc, edge) => {
      if (edge[0] === node) {
        acc.push(edge[1]);
        return acc;
      }

      if (edge[1] === node) {
        acc.push(edge[0]);
        return acc;
      }

      return acc;
    }, [] as Array<Node>);

    if (neighbours.length > 0) {
      graph.set(node, neighbours);
    }
  }

  return graph;
}

export function originDFS(origin: Node, graph: Graph): Array<Node> {
  const visited: Array<Node> = [origin];

  if (!graph.has(origin)) {
    return visited;
  }

  function innerDFS(node: Node, graph: Graph): void {
    const neighbours = graph.get(node)!;
    for (const node of neighbours) {
      if (visited.includes(node)) {
        continue;
      }

      visited.push(node);
      innerDFS(node, graph);
    }
  }
  innerDFS(origin, graph);

  return visited;
}
