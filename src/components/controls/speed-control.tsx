"use client";

import { Slider } from "@/components/ui/slider";

interface SpeedControlProps {
  value: number;
  onChange: (value: number) => void;
}

export default function SpeedControl({ value, onChange }: SpeedControlProps) {
  const handleChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-500">
        <span>Slow</span>
        <span>Fast</span>
      </div>
      <Slider
        value={[value]}
        min={1}
        max={100}
        step={1}
        onValueChange={handleChange}
        className="cursor-pointer"
      />
    </div>
  );
}
