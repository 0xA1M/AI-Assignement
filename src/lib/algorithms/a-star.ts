import type { Cell, MazeState } from "../types";

export function aStarSearch(
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

  const openSet: Cell[] = [startCell];
  const closedSet: Cell[] = [];

  startCell.gScore = 0;
  startCell.hScore = manhattanDistance(startCell, endCell);
  startCell.fScore = startCell.hScore;

  while (openSet.length > 0) {
    // Find the cell with the lowest fScore
    openSet.sort((a, b) => (a.fScore || 0) - (b.fScore || 0));
    const current = openSet.shift()!;

    // If we reached the end
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
        visitedCells: [...closedSet],
        pathCells: path,
        currentStep: states.length,
      });

      return states;
    }

    closedSet.push(current);
    current.isVisited = true;

    // Add current state
    const currentGrid = JSON.parse(JSON.stringify(gridCopy));
    currentGrid[current.row][current.col].isVisited = true;

    states.push({
      grid: currentGrid,
      visitedCells: [...closedSet],
      pathCells: [],
      currentStep: states.length,
    });

    // Get neighbors
    const neighbors = getNeighbors(gridCopy, current);

    for (const neighbor of neighbors) {
      if (
        closedSet.some(
          (cell) => cell.row === neighbor.row && cell.col === neighbor.col
        )
      ) {
        continue;
      }

      const tentativeGScore = (current.gScore || 0) + 1;

      if (
        !openSet.some(
          (cell) => cell.row === neighbor.row && cell.col === neighbor.col
        )
      ) {
        openSet.push(neighbor);
      } else if (
        tentativeGScore >= (neighbor.gScore || Number.POSITIVE_INFINITY)
      ) {
        continue;
      }

      neighbor.previousCell = current;
      neighbor.gScore = tentativeGScore;
      neighbor.hScore = manhattanDistance(neighbor, endCell);
      neighbor.fScore = neighbor.gScore + neighbor.hScore;
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

// Manhattan distance heuristic for A*
function manhattanDistance(cellA: Cell, cellB: Cell): number {
  return Math.abs(cellA.row - cellB.row) + Math.abs(cellA.col - cellB.col);
}
