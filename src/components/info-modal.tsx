import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InfoModal({ open, onOpenChange }: InfoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How It Works</DialogTitle>
          <DialogDescription>
            Learn about maze generation and solving algorithms
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <h3 className="font-semibold mb-1 text-sm">Maze Generation</h3>
            <p className="text-sm text-muted-foreground">
              The maze is generated using a recursive backtracking algorithm,
              which creates a perfect maze (a maze with no loops and exactly one
              path between any two points).
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-1 text-sm">Solving Algorithms</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>
                <span className="font-medium">A* Search:</span> Uses a heuristic
                to find the shortest path efficiently.
              </li>
              <li>
                <span className="font-medium">Breadth-First Search:</span>{" "}
                Explores all neighbors at the present depth before moving
                deeper.
              </li>
              <li>
                <span className="font-medium">Depth-First Search:</span>{" "}
                Explores as far as possible along each branch before
                backtracking.
              </li>
              <li>
                <span className="font-medium">Dijkstra&apos;s Algorithm:</span>{" "}
                Finds the shortest path by considering the distance from the
                start node.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-1 text-sm">Color Legend</h3>
            <div className="grid grid-cols-2 gap-2 ml-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 mr-2 rounded-sm"></div>
                <span className="text-sm">Start</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 mr-2 rounded-sm"></div>
                <span className="text-sm">End</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-800 mr-2 rounded-sm dark:bg-gray-700"></div>
                <span className="text-sm">Wall</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-300 mr-2 rounded-sm"></div>
                <span className="text-sm">Visited</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-400 mr-2 rounded-sm"></div>
                <span className="text-sm">Path</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
