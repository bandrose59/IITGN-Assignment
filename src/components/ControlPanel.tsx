
import { useState } from "react";
import Tile from "./Tile";
import { TileWithRotation, solvePuzzle, shuffleArray } from "@/utils/puzzleUtils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ControlPanelProps {
  tiles: TileWithRotation[];
  selectedTileIndex: number | null;
  onSelectTile: (index: number) => void;
  onResetPuzzle: () => void;
  onSolvePuzzle: () => void;
  onShuffleTiles: () => void;
  isSolved: boolean;
}

export default function ControlPanel({
  tiles,
  selectedTileIndex,
  onSelectTile,
  onResetPuzzle,
  onSolvePuzzle,
  onShuffleTiles,
  isSolved
}: ControlPanelProps) {
  const [showHint, setShowHint] = useState(false);
  
  const handleRotateTile = (index: number) => {
    onSelectTile(index);
    tiles[index].rotation = (tiles[index].rotation + 1) % 4;
  };
  
  const handleShowHint = () => {
    setShowHint(true);
    setTimeout(() => setShowHint(false), 5000);
    
    // Check if a solution exists
    const solution = solvePuzzle([...tiles].map(tile => ({ ...tile })));
    if (solution) {
      toast("A solution exists! Keep trying!", {
        description: "Right-click tiles to rotate them.",
        duration: 5000,
      });
    } else {
      toast("This configuration might not have a solution.", {
        description: "Try shuffling the tiles.",
        duration: 5000,
      });
    }
  };
  
  return (
    <div className="panel p-6 max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4">Tile Selection</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {tiles.map((tile, index) => (
            <div 
              key={tile.id} 
              className={cn(
                "flex items-center justify-center transition-all duration-200",
                showHint && "animate-pulse-light"
              )}
            >
              <Tile
                tile={tile}
                isSelected={selectedTileIndex === index}
                isPlaced={false}
                onClick={() => onSelectTile(index)}
                onRotate={() => handleRotateTile(index)}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="secondary" 
          className="w-full button-secondary" 
          onClick={onResetPuzzle}
        >
          Reset
        </Button>
        
        <Button 
          variant="secondary" 
          className="w-full button-secondary" 
          onClick={onShuffleTiles}
        >
          Shuffle
        </Button>
        
        <Button 
          variant="secondary" 
          className="w-full button-secondary" 
          onClick={handleShowHint}
        >
          Hint
        </Button>
        
        <Button 
          variant="secondary" 
          className="w-full button-secondary" 
          onClick={onSolvePuzzle}
        >
          Solve
        </Button>
      </div>
      
      {isSolved && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg animate-fade-in">
          <p className="font-medium text-center">Puzzle Solved! 🎉</p>
        </div>
      )}
    </div>
  );
}
