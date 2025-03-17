import type { Cell, MazeState } from "../types";

export function depthFirstSearch(
  grid: Cell[][],
  start: Cell,
  end: Cell
): MazeState[] {
  // Create a deep copy of the grid to avoid modifying the original
  const gridCopy = JSON.parse(JSON.stringify(grid));
  const states: MazeState[] = [];

  // Get the start and end cells from the copied grid
  const startCell = gridCopy[start.row][start.col];
  const endCell = gridCopy[end.row][end.col];

  // Initialize the first state
  states.push({
    grid: JSON.parse(JSON.stringify(gridCopy)),
    visitedCells: [],
    pathCells: [],
    currentStep: 0,
  });

  const stack: Cell[] = [startCell];
  const visited: Cell[] = [];

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (current.row === endCell.row && current.col === endCell.col) {
      // Reconstruct path
      const path: Cell[] = [];
      let temp: Cell | null = current;

      while (temp !== null) {
        path.unshift(temp);
        temp = temp.previousCell;
      }

      // Add final state with path
      const finalGrid = JSON.parse(JSON.stringify(gridCopy));

      // Mark path cells in order from start to end
      path.forEach((cell, index) => {
        if (!cell.isStart && !cell.isEnd) {
          finalGrid[cell.row][cell.col].isPath = true;
          // Store the path index for animation ordering
          finalGrid[cell.row][cell.col].pathIndex = index;
        }
      });

      states.push({
        grid: finalGrid,
        visitedCells: [...visited],
        pathCells: path,
        currentStep: states.length,
      });

      return states;
    }

    if (!current.isVisited) {
      current.isVisited = true;
      visited.push(current);

      // Add current state
      const currentGrid = JSON.parse(JSON.stringify(gridCopy));
      currentGrid[current.row][current.col].isVisited = true;

      states.push({
        grid: currentGrid,
        visitedCells: [...visited],
        pathCells: [],
        currentStep: states.length,
      });

      const neighbors = getNeighbors(gridCopy, current);

      for (const neighbor of neighbors) {
        if (!neighbor.isVisited) {
          neighbor.previousCell = current;
          stack.push(neighbor);
        }
      }
    }
  }

  return states;
}

// Helper function to get valid neighbors
function getNeighbors(grid: Cell[][], cell: Cell): Cell[] {
  const { row, col } = cell;
  const neighbors: Cell[] = [];
  const rows = grid.length;
  const cols = grid[0].length;

  // Check all four directions
  if (row > 0 && !grid[row - 1][col].isWall) neighbors.push(grid[row - 1][col]);
  if (row < rows - 1 && !grid[row + 1][col].isWall)
    neighbors.push(grid[row + 1][col]);
  if (col > 0 && !grid[row][col - 1].isWall) neighbors.push(grid[row][col - 1]);
  if (col < cols - 1 && !grid[row][col + 1].isWall)
    neighbors.push(grid[row][col + 1]);

  return neighbors;
}
