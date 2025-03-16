
import { useState, useEffect } from "react";
import PuzzleSolver from "@/components/PuzzleSolver";
import { TileWithRotation } from "@/utils/puzzleUtils";

export default function Index() {
  const [isLoaded, setIsLoaded] = useState(false);

  const initialTiles: TileWithRotation[] = [
    { id: 0, edges: ['+', '-', '+', '-'], rotation: 0 },
    { id: 1, edges: ['-', '+', '-', '+'], rotation: 0 },
    { id: 2, edges: ['+', '-', '+', '-'], rotation: 0 },
    { id: 3, edges: ['-', '+', '-', '+'], rotation: 0 },
    { id: 4, edges: ['+', '-', '+', '-'], rotation: 0 },
    { id: 5, edges: ['-', '+', '-', '+'], rotation: 0 },
    { id: 6, edges: ['+', '-', '+', '-'], rotation: 0 },
    { id: 7, edges: ['-', '+', '-', '+'], rotation: 0 },
    { id: 8, edges: ['+', '-', '+', '-'], rotation: 0 }
  ];
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="py-8 px-6 text-center animate-fade-in">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm uppercase tracking-wider text-primary font-medium mb-2">
            Puzzle Challenge
          </p>
          <h1 className="text-4xl font-semibold tracking-tight mb-4">
            IIT GN
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Arrange the 3×3 grid of tiles so that the symbols on adjacent edges match. 
            Click to place tiles and right-click to rotate them.
          </p>
        </div>
      </header>
      
      <main className="flex-1 container px-4 py-6">
        <div 
          className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <PuzzleSolver initialTiles={initialTiles} />
        </div>
        
        <div className="mt-12 max-w-2xl mx-auto text-center">
          <div className="panel p-6">
            <h2 className="text-xl font-medium mb-3">How to Play Puzzle Game??</h2>
            <ul className="text-muted-foreground text-left space-y-2">
              <li>1. Select a tile from the grid on the right</li>
              <li>2. Click an empty cell in the puzzle grid to place the tile</li>
              <li>3. Right-click on a tile to rotate it 90° clockwise</li>
              <li>4. Match all adjacent edges (+ to + and - to -)</li>
              <li>5. Green indicators show correct matches, red shows mismatches</li>
            </ul>
          </div>
        </div>
      </main>
      
      <footer className="py-6 px-4 text-center text-sm text-muted-foreground">
        <p>Ritesh Yevatkar</p>
      </footer>
    </div>
  );
}
