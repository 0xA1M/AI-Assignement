"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Algorithm } from "@/lib/types";

interface AlgorithmSelectorProps {
  value: Algorithm;
  onChange: (value: Algorithm) => void;
}

export default function AlgorithmSelector({
  value,
  onChange,
}: AlgorithmSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <Select value={value} onValueChange={onChange as (value: string) => void}>
        <SelectTrigger className="cursor-pointer">
          <SelectValue placeholder="Select Algorithm" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="astar" className="cursor-pointer">
            A* Search
          </SelectItem>
          <SelectItem value="bfs" className="cursor-pointer">
            Breadth-First Search
          </SelectItem>
          <SelectItem value="dfs" className="cursor-pointer">
            Depth-First Search
          </SelectItem>
          <SelectItem value="dijkstra" className="cursor-pointer">
            Dijkstra&apos;s Algorithm
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
