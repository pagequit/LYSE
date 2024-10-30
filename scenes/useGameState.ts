import { type Edge } from "../lib/Edge.ts";
import { type Graph } from "../lib/Graph.ts";

export type GameState = {
  nodesMenu: {
    edges: Array<Edge>;
    graph: Graph;
  };
};

export const gameState: GameState = {
  nodesMenu: {
    edges: [],
    graph: new Map(),
  },
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.gameState = gameState;
