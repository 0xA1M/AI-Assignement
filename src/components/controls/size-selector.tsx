"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MazeSize } from "@/lib/types";

interface SizeSelectorProps {
  value: MazeSize;
  onChange: (value: MazeSize) => void;
}

export default function SizeSelector({ value, onChange }: SizeSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Maze Size</label>
      <Select value={value} onValueChange={onChange as (value: string) => void}>
        <SelectTrigger className="cursor-pointer">
          <SelectValue placeholder="Select Size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="small" className="cursor-pointer">
            Small (10x10)
          </SelectItem>
          <SelectItem value="medium" className="cursor-pointer">
            Medium (15x15)
          </SelectItem>
          <SelectItem value="large" className="cursor-pointer">
            Large (20x20)
          </SelectItem>
          <SelectItem value="xlarge" className="cursor-pointer">
            Extra Large (25x25)
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
