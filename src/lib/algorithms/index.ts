import { aStarSearch } from "./a-star";
import { breadthFirstSearch } from "./bfs";
import { depthFirstSearch } from "./dfs";
import { dijkstraSearch } from "./dijkstra";
import type { Algorithm, Cell, MazeState } from "../types";

export function runAlgorithm(
  algorithm: Algorithm,
  grid: Cell[][],
  startCell: Cell,
  endCell: Cell
): MazeState[] {
  switch (algorithm) {
    case "astar":
      return aStarSearch(grid, startCell, endCell);
    case "bfs":
      return breadthFirstSearch(grid, startCell, endCell);
    case "dfs":
      return depthFirstSearch(grid, startCell, endCell);
    case "dijkstra":
      return dijkstraSearch(grid, startCell, endCell);
    default:
      return aStarSearch(grid, startCell, endCell);
  }
}
