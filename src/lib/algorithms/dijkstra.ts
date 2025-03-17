import type { Cell, MazeState } from "../types";

export function dijkstraSearch(
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

  const unvisitedSet: Cell[] = [];
  const visitedSet: Cell[] = [];

  // Initialize distances
  for (let row = 0; row < gridCopy.length; row++) {
    for (let col = 0; col < gridCopy[0].length; col++) {
      if (!gridCopy[row][col].isWall) {
        gridCopy[row][col].distance = Number.POSITIVE_INFINITY;
        unvisitedSet.push(gridCopy[row][col]);
      }
    }
  }

  startCell.distance = 0;

  while (unvisitedSet.length > 0) {
    // Sort unvisited nodes by distance
    unvisitedSet.sort((a, b) => a.distance - b.distance);

    // Get the node with the smallest distance
    const current = unvisitedSet.shift()!;

    // If we encounter a node with Infinity distance, we're done
    if (current.distance === Number.POSITIVE_INFINITY) return states;

    current.isVisited = true;
    visitedSet.push(current);

    // Add current state
    const currentGrid = JSON.parse(JSON.stringify(gridCopy));
    currentGrid[current.row][current.col].isVisited = true;

    states.push({
      grid: currentGrid,
      visitedCells: [...visitedSet],
      pathCells: [],
      currentStep: states.length,
    });

    // If we found the end node
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
        visitedCells: [...visitedSet],
        pathCells: path,
        currentStep: states.length,
      });

      return states;
    }

    // Update distances to neighbors
    const neighbors = getNeighbors(gridCopy, current);

    for (const neighbor of neighbors) {
      if (!neighbor.isVisited) {
        const distance = current.distance + 1;

        if (distance < neighbor.distance) {
          neighbor.distance = distance;
          neighbor.previousCell = current;
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
