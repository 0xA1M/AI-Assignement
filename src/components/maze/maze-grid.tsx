"use client";

import { motion } from "framer-motion";
import type { Cell } from "@/lib/types";

interface MazeGridProps {
  grid: Cell[][];
}

export default function MazeGrid({ grid }: MazeGridProps) {
  if (!grid.length) return <div>Loading maze...</div>;

  // Calculate cell size based on grid dimensions
  // Smaller grids get larger cells, larger grids get smaller cells
  const cellSize =
    grid.length <= 10
      ? "w-8 h-8 md:w-10 md:h-10"
      : grid.length <= 15
      ? "w-6 h-6 md:w-8 md:h-8"
      : grid.length <= 20
      ? "w-5 h-5 md:w-6 md:h-6"
      : "w-4 h-4 md:w-5 md:h-5";

  // Find all path cells and sort them by pathIndex if available
  const pathCells: { row: number; col: number; index: number }[] = [];

  grid.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      if (cell.isPath) {
        pathCells.push({
          row: rowIdx,
          col: colIdx,
          index: cell.pathIndex !== undefined ? cell.pathIndex : 0,
        });
      }
    });
  });

  // Sort path cells by index to ensure animation flows from start to end
  pathCells.sort((a, b) => a.index - b.index);

  return (
    <div className="grid gap-0 border border-gray-300 dark:border-gray-700">
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="flex">
          {row.map((cell, colIdx) => {
            // Determine if this is a path cell and its index in the path
            const pathIndex = pathCells.findIndex(
              (p) => p.row === rowIdx && p.col === colIdx
            );

            return (
              <motion.div
                key={`${rowIdx}-${colIdx}`}
                className={`${cellSize} border border-gray-100 dark:border-gray-800 ${
                  cell.isWall
                    ? "bg-gray-900 dark:bg-gray-800"
                    : cell.isStart
                    ? "bg-green-500 dark:bg-green-400"
                    : cell.isEnd
                    ? "bg-red-500 dark:bg-red-400"
                    : cell.isPath
                    ? "bg-yellow-400 dark:bg-yellow-300"
                    : cell.isVisited
                    ? "bg-blue-300 dark:bg-blue-500/50"
                    : "bg-white dark:bg-gray-950"
                }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  backgroundColor: cell.isPath
                    ? ["#FFFFFF00", "#FBBF24"]
                    : undefined,
                }}
                transition={{
                  duration: 0.2,
                  ...(cell.isPath && {
                    backgroundColor: {
                      duration: 0.5,
                      delay: pathIndex * 0.05,
                    },
                  }),
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
