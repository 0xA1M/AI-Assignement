"use client";

import { useState, useEffect, useCallback } from "react";
import type { Cell, Position, MazeSize } from "@/lib/types";
import { createMaze } from "@/lib/maze-generator";
import { MAZE_DIMENSIONS } from "@/lib/types";

export function useMaze(size: MazeSize = "medium") {
  const [dimensions, setDimensions] = useState(MAZE_DIMENSIONS[size]);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [startCell, setStartCell] = useState<Position>({ row: 1, col: 1 });
  const [endCell, setEndCell] = useState<Position>({
    row: dimensions.rows - 2,
    col: dimensions.cols - 2,
  });

  // Update dimensions when size changes
  useEffect(() => {
    setDimensions(MAZE_DIMENSIONS[size]);
  }, [size]);

  // Initialize the grid when dimensions change
  useEffect(() => {
    initializeGrid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions]);

  // Generate random position that is not a wall
  const getRandomPosition = useCallback((grid: Cell[][]): Position => {
    const rows = grid.length;
    const cols = grid[0]?.length || 0;

    if (rows === 0 || cols === 0) return { row: 0, col: 0 };

    let row, col;
    let attempts = 0;
    const maxAttempts = rows * cols; // Prevent infinite loop

    do {
      row = Math.floor(Math.random() * (rows - 2)) + 1;
      col = Math.floor(Math.random() * (cols - 2)) + 1;
      attempts++;

      // If we've tried too many times, just find any non-wall cell
      if (attempts > maxAttempts) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (!grid[r][c].isWall) {
              return { row: r, col: c };
            }
          }
        }
        // If we still can't find one, return a default
        return { row: 1, col: 1 };
      }
    } while (grid[row][col].isWall);

    return { row, col };
  }, []);

  // Generate random start and end positions that are far apart
  const generateRandomStartEnd = useCallback(
    (grid: Cell[][]): [Position, Position] => {
      const start = getRandomPosition(grid);
      let end;

      // Try to find an end position that's reasonably far from start
      const minDistance = Math.floor(
        Math.min(grid.length, grid[0]?.length || 0) / 2
      );
      let attempts = 0;
      const maxAttempts = 50; // Prevent too many attempts

      do {
        end = getRandomPosition(grid);
        attempts++;

        // If we've tried too many times, just use what we have
        if (attempts > maxAttempts) {
          break;
        }
      } while (
        Math.abs(start.row - end.row) + Math.abs(start.col - end.col) <
        minDistance
      );

      return [start, end];
    },
    [getRandomPosition]
  );

  const initializeGrid = useCallback(() => {
    // Create initial grid with all walls
    let newGrid = createMaze(
      dimensions.rows,
      dimensions.cols,
      { row: 1, col: 1 },
      { row: dimensions.rows - 2, col: dimensions.cols - 2 }
    );

    // Generate random start and end positions
    const [start, end] = generateRandomStartEnd(newGrid);

    // Set start and end cells
    newGrid = newGrid.map((row) =>
      row.map((cell) => ({
        ...cell,
        isStart: cell.row === start.row && cell.col === start.col,
        isEnd: cell.row === end.row && cell.col === end.col,
      }))
    );

    // Ensure start and end cells are not walls
    newGrid[start.row][start.col].isWall = false;
    newGrid[end.row][end.col].isWall = false;

    setStartCell(start);
    setEndCell(end);
    setGrid(newGrid);
  }, [dimensions, generateRandomStartEnd]);

  const randomizeMaze = useCallback(() => {
    initializeGrid();
  }, [initializeGrid]);

  const randomizeStartEnd = useCallback(() => {
    if (!grid.length) return;

    // Create a copy of the grid
    const newGrid = JSON.parse(JSON.stringify(grid));

    // Reset all start and end flags
    newGrid.forEach((row: Cell[]) => {
      row.forEach((cell: Cell) => {
        cell.isStart = false;
        cell.isEnd = false;
      });
    });

    // Generate new start and end positions
    const [start, end] = generateRandomStartEnd(newGrid);

    // Update new start and end
    newGrid[start.row][start.col].isWall = false;
    newGrid[start.row][start.col].isStart = true;
    newGrid[end.row][end.col].isWall = false;
    newGrid[end.row][end.col].isEnd = true;

    setStartCell(start);
    setEndCell(end);
    setGrid(newGrid);
  }, [grid, generateRandomStartEnd]);

  return {
    grid,
    rows: dimensions.rows,
    cols: dimensions.cols,
    startCell,
    endCell,
    randomizeMaze,
    randomizeStartEnd,
  };
}
