"use client";

import { useState } from "react";
import MazeGrid from "@/components/maze/maze-grid";
import AlgorithmSelector from "@/components/controls/algorithm-selector";
import PlaybackControls from "@/components/controls/playback-controls";
import SpeedControl from "@/components/controls/speed-control";
import SizeSelector from "@/components/controls/size-selector";
import InfoModal from "@/components/info-modal";
import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Info, Play } from "lucide-react";
import { useMaze } from "@/hooks/use-maze";
import { useAlgorithm } from "@/hooks/use-algorithm";
import type { Algorithm, MazeSize } from "@/lib/types";

export default function MazeSolver() {
  const [algorithm, setAlgorithm] = useState<Algorithm>("astar");
  const [speed, setSpeed] = useState<number>(50);
  const [size, setSize] = useState<MazeSize>("medium");
  const [infoOpen, setInfoOpen] = useState(false);

  const { grid, randomizeMaze, startCell, endCell, randomizeStartEnd } =
    useMaze(size);

  const {
    isPlaying,
    togglePlay,
    currentStep,
    totalSteps,
    stepForward,
    stepBackward,
    solveMaze,
    currentGrid,
  } = useAlgorithm(grid, startCell, endCell, algorithm, speed);

  const handleAlgorithmChange = (value: Algorithm) => {
    setAlgorithm(value);
  };

  const handleSpeedChange = (value: number) => {
    setSpeed(value);
  };

  const handleSizeChange = (value: MazeSize) => {
    setSize(value);
  };

  const handleSolveMaze = () => {
    solveMaze();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Maze Solver</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setInfoOpen(true)}
            aria-label="Information"
            className="cursor-pointer"
          >
            <Info className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side controls */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Maze Options</h3>
                <div className="space-y-4">
                  <SizeSelector value={size} onChange={handleSizeChange} />

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      onClick={randomizeMaze}
                      className="w-full cursor-pointer"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      New Maze
                    </Button>

                    <Button
                      variant="outline"
                      onClick={randomizeStartEnd}
                      className="w-full cursor-pointer"
                    >
                      Randomize Start/End
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Algorithm</h3>
                <AlgorithmSelector
                  value={algorithm}
                  onChange={handleAlgorithmChange}
                />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Animation Speed</h3>
                <SpeedControl value={speed} onChange={handleSpeedChange} />
              </div>

              <Button
                onClick={handleSolveMaze}
                className="w-full cursor-pointer"
              >
                <Play className="mr-2 h-4 w-4" />
                Solve Maze
              </Button>

              <div>
                <h3 className="text-sm font-medium mb-2">Playback</h3>
                <PlaybackControls
                  isPlaying={isPlaying}
                  togglePlay={togglePlay}
                  stepForward={stepForward}
                  stepBackward={stepBackward}
                  canStepForward={currentStep < totalSteps - 1}
                  canStepBackward={currentStep > 0}
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side maze */}
        <div className="lg:col-span-2 h-full">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Maze</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <MazeGrid grid={currentGrid} />
            </CardContent>
          </Card>
        </div>
      </div>

      <InfoModal open={infoOpen} onOpenChange={setInfoOpen} />
    </div>
  );
}
