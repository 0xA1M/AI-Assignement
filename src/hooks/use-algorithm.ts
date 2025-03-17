"use client";

import { useState, useEffect, useRef } from "react";
import type { Cell, Algorithm, MazeState } from "@/lib/types";
import { runAlgorithm } from "@/lib/algorithms";

export function useAlgorithm(
  grid: Cell[][],
  startPos: { row: number; col: number },
  endPos: { row: number; col: number },
  algorithm: Algorithm,
  speed: number
) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [mazeStates, setMazeStates] = useState<MazeState[]>([]);
  const [currentGrid, setCurrentGrid] = useState<Cell[][]>(grid);

  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const algorithmRef = useRef(algorithm);
  const isSolvingRef = useRef(false);

  // Update current grid when grid changes (e.g., on randomize)
  useEffect(() => {
    // Create a clean copy of the grid without any path or visited cells
    const cleanGrid = grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        isPath: false,
        isVisited: false,
        previousCell: null,
        distance: Number.POSITIVE_INFINITY,
        fScore: undefined,
        gScore: undefined,
        hScore: undefined,
        pathIndex: undefined,
      }))
    );

    setCurrentGrid(cleanGrid);
    setMazeStates([]);
    setCurrentStep(0);
    setIsPlaying(false);
    isSolvingRef.current = false;

    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, [grid]);

  // Reset when algorithm changes
  useEffect(() => {
    if (algorithm !== algorithmRef.current) {
      algorithmRef.current = algorithm;

      // Reset the grid to remove any path or visited cells
      if (grid.length > 0) {
        const cleanGrid = grid.map((row) =>
          row.map((cell) => ({
            ...cell,
            isPath: false,
            isVisited: false,
            previousCell: null,
            distance: Number.POSITIVE_INFINITY,
            fScore: undefined,
            gScore: undefined,
            hScore: undefined,
            pathIndex: undefined,
          }))
        );

        setCurrentGrid(cleanGrid);
        setMazeStates([]);
        setCurrentStep(0);
        setIsPlaying(false);
        isSolvingRef.current = false;

        // Cancel any ongoing animation
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      }
    }
  }, [algorithm, grid]);

  // Animation loop
  useEffect(() => {
    if (isPlaying) {
      const animate = (time: number) => {
        if (time - lastTimeRef.current > 1000 - speed * 10) {
          lastTimeRef.current = time;
          if (currentStep < mazeStates.length - 1) {
            setCurrentStep((prev) => prev + 1);
          } else {
            setIsPlaying(false);
          }
        }
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPlaying, currentStep, mazeStates.length, speed]);

  // Update grid based on current step
  useEffect(() => {
    if (mazeStates.length > 0 && currentStep < mazeStates.length) {
      const currentState = mazeStates[currentStep];

      // Only show the path in the final state
      const isLastState = currentStep === mazeStates.length - 1;

      // If it's not the last state, remove the path from the grid
      if (!isLastState && currentState.grid) {
        const gridWithoutPath = currentState.grid.map((row) =>
          row.map((cell) => ({
            ...cell,
            isPath: false,
            pathIndex: undefined,
          }))
        );
        setCurrentGrid(gridWithoutPath);
      } else {
        setCurrentGrid(currentState.grid);
      }
    }
  }, [currentStep, mazeStates]);

  const solveMaze = () => {
    // Prevent multiple simultaneous solves
    if (isSolvingRef.current) return;
    isSolvingRef.current = true;

    // Stop any current animation
    setIsPlaying(false);
    setCurrentStep(0);

    if (!grid.length) {
      isSolvingRef.current = false;
      return;
    }

    // Make sure we have valid start and end positions
    if (
      startPos.row < 0 ||
      startPos.col < 0 ||
      endPos.row < 0 ||
      endPos.col < 0 ||
      startPos.row >= grid.length ||
      startPos.col >= grid[0].length ||
      endPos.row >= grid.length ||
      endPos.col >= grid[0].length
    ) {
      console.error("Invalid start or end position");
      isSolvingRef.current = false;
      return;
    }

    // Create a clean copy of the grid without any path or visited cells
    const cleanGrid = grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        isPath: false,
        isVisited: false,
        previousCell: null,
        distance: Number.POSITIVE_INFINITY,
        fScore: undefined,
        gScore: undefined,
        hScore: undefined,
        pathIndex: undefined,
      }))
    );

    // Get the start and end cells from the clean grid
    const start = cleanGrid[startPos.row][startPos.col];
    const end = cleanGrid[endPos.row][endPos.col];

    // Make sure start and end are not walls
    if (start.isWall || end.isWall) {
      console.error("Start or end is a wall");
      isSolvingRef.current = false;
      return;
    }

    // Run the selected algorithm
    const states = runAlgorithm(algorithm, cleanGrid, start, end);

    // Set the states and start playing
    if (states.length > 0) {
      // Make sure the path is only in the final state
      const processedStates = states.map((state, index) => {
        if (index < states.length - 1) {
          // Remove path from all but the last state
          return {
            ...state,
            grid: state.grid.map((row) =>
              row.map((cell) => ({
                ...cell,
                isPath: false,
                pathIndex: undefined,
              }))
            ),
          };
        }
        return state;
      });

      setMazeStates(processedStates);
      setCurrentGrid(processedStates[0].grid);

      // Use a small timeout to ensure the states are set before starting to play
      setTimeout(() => {
        setIsPlaying(true);
        isSolvingRef.current = false;
      }, 100);
    } else {
      isSolvingRef.current = false;
    }
  };

  const stepForward = () => {
    if (currentStep < mazeStates.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return {
    isPlaying,
    togglePlay,
    currentStep,
    totalSteps: mazeStates.length,
    stepForward,
    stepBackward,
    solveMaze,
    currentGrid,
  };
}
