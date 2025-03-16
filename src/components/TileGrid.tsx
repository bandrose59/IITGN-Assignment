
import { useState, useEffect } from "react";
import Tile from "./Tile";
import { 
  GridState, 
  TileWithRotation, 
  Position, 
  isValidPlacement,
  isGridSolved,
  checkEdgeMatches
} from "@/utils/puzzleUtils";
import { cn } from "@/lib/utils";

interface TileGridProps {
  grid: GridState;
  selectedTile: TileWithRotation | null;
  onPlaceTile: (position: Position) => void;
  onRemoveTile: (position: Position) => void;
  onRotateTile: (position: Position) => void;
  isInteractive?: boolean;
}

export default function TileGrid({ 
  grid, 
  selectedTile, 
  onPlaceTile, 
  onRemoveTile,
  onRotateTile,
  isInteractive = true
}: TileGridProps) {
  const [highlightedCell, setHighlightedCell] = useState<Position | null>(null);
  const [edgeMatches, setEdgeMatches] = useState<boolean[][]>([]);
  const [isValid, setIsValid] = useState<boolean>(true);
  
  // Update edge matches whenever the grid changes
  useEffect(() => {
    setEdgeMatches(checkEdgeMatches(grid));
    
    // Check validity of placements
    let valid = true;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        const tile = grid[r][c];
        if (tile && !isValidPlacement(grid, tile, [r, c])) {
          valid = false;
          break;
        }
      }
      if (!valid) break;
    }
    setIsValid(valid);
  }, [grid]);

  const handleCellClick = (position: Position) => {
    if (!isInteractive) return;
    
    const [row, col] = position;
    const currentTile = grid[row][col];
    
    if (currentTile) {
      // Remove tile if already placed
      onRemoveTile(position);
    } else if (selectedTile) {
      // Place selected tile
      onPlaceTile(position);
    }
  };
  
  const handleCellRightClick = (e: React.MouseEvent, position: Position) => {
    e.preventDefault();
    if (!isInteractive) return;
    
    const [row, col] = position;
    const currentTile = grid[row][col];
    
    if (currentTile) {
      // Rotate tile if already placed
      onRotateTile(position);
    }
  };
  
  const handleMouseEnter = (position: Position) => {
    if (isInteractive) {
      setHighlightedCell(position);
    }
  };
  
  const handleMouseLeave = () => {
    setHighlightedCell(null);
  };
  
  const isCellHighlighted = (row: number, col: number): boolean => {
    return highlightedCell !== null && 
           highlightedCell[0] === row && 
           highlightedCell[1] === col;
  };
  
  return (
    <div className="relative panel p-6 max-w-md mx-auto">
      <div className="grid grid-cols-3 gap-4">
        {grid.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "relative flex items-center justify-center w-24 h-24 rounded-lg transition-colors",
                isCellHighlighted(rowIndex, colIndex) && !cell ? "bg-primary/10" : "bg-secondary",
                "border border-border/60"
              )}
              onClick={() => handleCellClick([rowIndex, colIndex])}
              onContextMenu={(e) => handleCellRightClick(e, [rowIndex, colIndex])}
              onMouseEnter={() => handleMouseEnter([rowIndex, colIndex])}
              onMouseLeave={handleMouseLeave}
            >
              {cell && (
                <Tile
                  tile={cell}
                  isSelected={false}
                  isPlaced={true}
                  isMatched={isValid}
                  onRotate={() => onRotateTile([rowIndex, colIndex])}
                  size="lg"
                />
              )}
            </div>
          ))
        ))}
      </div>
      
      {/* Edge match indicators */}
      <div className="absolute inset-0 pointer-events-none">
        {edgeMatches.map((row, r) => (
          row.map((matched, c) => {
            const isHorizontal = r % 2 === 0 && c % 2 === 1;
            const isVertical = r % 2 === 1 && c % 2 === 0;
            
            if (!isHorizontal && !isVertical) return null;
            
            const tileRow = Math.floor(r / 2);
            const tileCol = Math.floor(c / 2);
            
            // Only show for existing tiles
            const hasTile = isHorizontal 
              ? grid[tileRow][tileCol] && grid[tileRow][tileCol + 1]
              : grid[tileRow][tileCol] && grid[tileRow + 1][tileCol];
            
            if (!hasTile) return null;
            
            return (
              <div
                key={`edge-${r}-${c}`}
                className={cn(
                  "absolute rounded-full transition-colors",
                  matched ? "bg-green-400/80" : "bg-red-400/80",
                  isHorizontal ? "w-4 h-2" : "w-2 h-4"
                )}
                style={{
                  top: isHorizontal 
                    ? `calc(${tileRow} * 6rem + 3rem + 1.5rem)` 
                    : `calc(${tileRow} * 6rem + 6rem + 0.5rem)`,
                  left: isHorizontal 
                    ? `calc(${tileCol} * 6rem + 6rem + 0.5rem)` 
                    : `calc(${tileCol} * 6rem + 3rem + 1.5rem)`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            );
          })
        ))}
      </div>
    </div>
  );
}
