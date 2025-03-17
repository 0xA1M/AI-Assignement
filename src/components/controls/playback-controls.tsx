"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";

interface PlaybackControlsProps {
  isPlaying: boolean;
  togglePlay: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  canStepForward: boolean;
  canStepBackward: boolean;
  currentStep: number;
  totalSteps: number;
}

export default function PlaybackControls({
  isPlaying,
  togglePlay,
  stepForward,
  stepBackward,
  canStepForward,
  canStepBackward,
  currentStep,
  totalSteps,
}: PlaybackControlsProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between gap-2">
        <Button
          variant="outline"
          onClick={stepBackward}
          disabled={!canStepBackward}
          size="sm"
          className="flex-1 cursor-pointer"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={togglePlay}
          size="sm"
          className="flex-1 cursor-pointer"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          onClick={stepForward}
          disabled={!canStepForward}
          size="sm"
          className="flex-1 cursor-pointer"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-center text-sm text-gray-500">
        Step {currentStep} of {totalSteps > 0 ? totalSteps - 1 : 0}
      </div>
    </div>
  );
}
