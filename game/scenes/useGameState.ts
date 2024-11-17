import { type Node } from "../entity/Node.ts";
import { type Edge } from "../entity/Edge.ts";
import { type Graph } from "../entity/Graph.ts";

export type GameState = {
  worldMap: {
    nodes: Array<Node>;
    edges: Array<Edge>;
  };
  nodesMenu: {
    edges: Array<Edge>;
    graph: Graph;
  };
};

export const gameState: GameState = {
  worldMap: {
    nodes: [],
    edges: [],
  },
  nodesMenu: {
    edges: [],
    graph: new Map(),
  },
};
