import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InfoPanel() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">How It Works</CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <div>
          <h3 className="font-semibold mb-1 text-sm">Maze Generation</h3>
          <p className="text-xs text-gray-600">
            The maze is generated using a recursive backtracking algorithm,
            which creates a perfect maze (a maze with no loops and exactly one
            path between any two points).
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-1 text-sm">Solving Algorithms</h3>
          <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
            <li>
              <span className="font-medium">A* Search:</span> Uses a heuristic
              to find the shortest path efficiently.
            </li>
            <li>
              <span className="font-medium">Breadth-First Search:</span>{" "}
              Explores all neighbors at the present depth before moving deeper.
            </li>
            <li>
              <span className="font-medium">Depth-First Search:</span> Explores
              as far as possible along each branch before backtracking.
            </li>
            <li>
              <span className="font-medium">Dijkstra&apos;s Algorithm:</span>{" "}
              Finds the shortest path by considering the distance from the start
              node.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-1 text-sm">Color Legend</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 mr-1"></div>
              <span className="text-xs">Start</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 mr-1"></div>
              <span className="text-xs">End</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-800 mr-1"></div>
              <span className="text-xs">Wall</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-300 mr-1"></div>
              <span className="text-xs">Visited</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-400 mr-1"></div>
              <span className="text-xs">Path</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
