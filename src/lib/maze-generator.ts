import type { Cell, Position } from "./types";

export function generateEmptyGrid(
  rows: number,
  cols: number,
  startPos: Position,
  endPos: Position
): Cell[][] {
  const grid: Cell[][] = [];

  // Create a grid filled with walls
  for (let row = 0; row < rows; row++) {
    const currentRow: Cell[] = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push({
        row,
        col,
        isWall: true,
        isVisited: false,
        isPath: false,
        isStart: row === startPos.row && col === startPos.col,
        isEnd: row === endPos.row && col === endPos.col,
        distance: Number.POSITIVE_INFINITY,
        previousCell: null,
      });
    }
    grid.push(currentRow);
  }

  return grid;
}

export function generateMaze(
  grid: Cell[][],
  startRow: number,
  startCol: number,
  rows: number,
  cols: number
): Cell[][] {
  const directions = [
    [0, 2], // right
    [2, 0], // down
    [0, -2], // left
    [-2, 0], // up
  ];

  function carvePassages(row: number, col: number) {
    // Shuffle directions
    const shuffledDirections = [...directions].sort(() => Math.random() - 0.5);

    // Mark current cell as passage
    grid[row][col].isWall = false;

    // Explore in random directions
    for (const [dr, dc] of shuffledDirections) {
      const newRow = row + dr;
      const newCol = col + dc;

      // Check if the new cell is within bounds and is a wall
      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        grid[newRow][newCol].isWall
      ) {
        // Carve a passage by making the wall between current and new cell a passage
        grid[row + dr / 2][col + dc / 2].isWall = false;
        carvePassages(newRow, newCol);
      }
    }
  }

  // Start the recursive backtracking
  carvePassages(startRow, startCol);

  return grid;
}

export function createMaze(
  rows: number,
  cols: number,
  startPos: Position,
  endPos: Position
): Cell[][] {
  let grid = generateEmptyGrid(rows, cols, startPos, endPos);
  grid = generateMaze(grid, startPos.row, startPos.col, rows, cols);

  // Ensure start and end cells are not walls
  grid[startPos.row][startPos.col].isWall = false;
  grid[endPos.row][endPos.col].isWall = false;

  return grid;
}
