import { type Node } from "../lib/Node.ts";
import { type Edge } from "../lib/Edge.ts";
import { type Graph } from "../lib/Graph.ts";

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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.gameState = gameState;
