export type Algorithm = "astar" | "bfs" | "dfs" | "dijkstra";
export type MazeSize = "small" | "medium" | "large" | "xlarge";

export type Cell = {
  row: number;
  col: number;
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
  isStart: boolean;
  isEnd: boolean;
  distance: number;
  previousCell: Cell | null;
  fScore?: number;
  gScore?: number;
  hScore?: number;
  pathIndex?: number; // Added for path animation ordering
};

export type Position = {
  row: number;
  col: number;
};

export type MazeState = {
  grid: Cell[][];
  visitedCells: Cell[];
  pathCells: Cell[];
  currentStep: number;
};

export const MAZE_DIMENSIONS: Record<MazeSize, { rows: number; cols: number }> =
  {
    small: { rows: 10, cols: 10 },
    medium: { rows: 15, cols: 15 },
    large: { rows: 20, cols: 20 },
    xlarge: { rows: 25, cols: 25 },
  };
