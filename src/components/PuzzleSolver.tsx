
import { useState, useEffect } from "react";
import { 
  TileWithRotation, 
  Position, 
  GridState, 
  PuzzleState,
  isGridSolved,
  solvePuzzle,
  cloneGrid,
  shuffleArray
} from "@/utils/puzzleUtils";
import TileGrid from "./TileGrid";
import ControlPanel from "./ControlPanel";
import { toast } from "@/hooks/use-toast";

interface PuzzleSolverProps {
  initialTiles: TileWithRotation[];
}

export default function PuzzleSolver({ initialTiles }: PuzzleSolverProps) {
  const [state, setState] = useState<PuzzleState>(() => {
    const tiles = initialTiles.map((tile, index) => ({
      ...tile,
      id: index,
      rotation: 0
    }));
    
    return {
      tiles: tiles,
      grid: Array(3).fill(null).map(() => Array(3).fill(null)),
      selectedTileIndex: null,
      isSolved: false,
      message: ""
    };
  });
  
  // Check if puzzle is solved whenever the grid changes
  useEffect(() => {
    const solved = isGridSolved(state.grid);
    if (solved && !state.isSolved) {
      setState(prev => ({ ...prev, isSolved: true }));
      toast.success("Puzzle solved successfully!", {
        description: "All tile edges are matching correctly."
      });
    } else if (!solved && state.isSolved) {
      setState(prev => ({ ...prev, isSolved: false }));
    }
  }, [state.grid, state.isSolved]);
  
  const handleSelectTile = (index: number) => {
    setState(prev => ({
      ...prev,
      selectedTileIndex: prev.selectedTileIndex === index ? null : index
    }));
  };
  
  const handlePlaceTile = (position: Position) => {
    if (state.selectedTileIndex === null) return;
    
    const [row, col] = position;
    const selectedTile = state.tiles[state.selectedTileIndex];
    
    // Create updated grid and mark tile as used
    const newGrid = cloneGrid(state.grid);
    newGrid[row][col] = { ...selectedTile };
    
    // Remove tile from available tiles
    const newTiles = [...state.tiles];
    newTiles[state.selectedTileIndex] = {
      ...newTiles[state.selectedTileIndex],
      used: true
    } as TileWithRotation;
    
    setState(prev => ({
      ...prev,
      grid: newGrid,
      tiles: newTiles,
      selectedTileIndex: null
    }));
  };
  
  const handleRemoveTile = (position: Position) => {
    const [row, col] = position;
    const tileToRemove = state.grid[row][col];
    
    if (!tileToRemove) return;
    
    // Create updated grid with tile removed
    const newGrid = cloneGrid(state.grid);
    newGrid[row][col] = null;
    
    setState(prev => ({
      ...prev,
      grid: newGrid
    }));
  };
  
  const handleRotateTile = (position: Position) => {
    const [row, col] = position;
    const tileToRotate = state.grid[row][col];
    
    if (!tileToRotate) return;
    
    // Create updated grid with rotated tile
    const newGrid = cloneGrid(state.grid);
    newGrid[row][col] = {
      ...tileToRotate,
      rotation: (tileToRotate.rotation + 1) % 4
    };
    
    setState(prev => ({
      ...prev,
      grid: newGrid
    }));
  };
  
  const handleResetPuzzle = () => {
    setState(prev => ({
      ...prev,
      grid: Array(3).fill(null).map(() => Array(3).fill(null)),
      selectedTileIndex: null,
      isSolved: false,
      message: ""
    }));
    
    toast("Puzzle has been reset", {
      description: "Start fresh with a new arrangement."
    });
  };
  
  const handleSolvePuzzle = () => {
    // Create copies of the tiles to solve with
    const tilesToSolve = state.tiles.map(tile => ({ ...tile, rotation: 0 }));
    
    // Attempt to find a solution
    const solution = solvePuzzle(tilesToSolve);
    
    if (solution) {
      setState(prev => ({
        ...prev,
        grid: solution,
        selectedTileIndex: null,
        isSolved: true,
        message: "Puzzle solved automatically!"
      }));
      
      toast.success("Puzzle solved automatically!", {
        description: "The algorithm found a valid solution."
      });
    } else {
      toast.error("No solution found", {
        description: "Try shuffling the tiles to get a solvable configuration."
      });
    }
  };
  
  const handleShuffleTiles = () => {
    const shuffledTiles = shuffleArray([...state.tiles]);
    
    setState(prev => ({
      ...prev,
      tiles: shuffledTiles.map(tile => ({ ...tile, rotation: Math.floor(Math.random() * 4) })),
      grid: Array(3).fill(null).map(() => Array(3).fill(null)),
      selectedTileIndex: null,
      isSolved: false,
      message: ""
    }));
    
    toast("Tiles shuffled", {
      description: "Try solving with this new configuration."
    });
  };
  
  return (
    <div className="grid gap-8 md:grid-cols-2 items-start max-w-5xl mx-auto">
      <TileGrid
        grid={state.grid}
        selectedTile={state.selectedTileIndex !== null ? state.tiles[state.selectedTileIndex] : null}
        onPlaceTile={handlePlaceTile}
        onRemoveTile={handleRemoveTile}
        onRotateTile={handleRotateTile}
      />
      
      <ControlPanel
        tiles={state.tiles}
        selectedTileIndex={state.selectedTileIndex}
        onSelectTile={handleSelectTile}
        onResetPuzzle={handleResetPuzzle}
        onSolvePuzzle={handleSolvePuzzle}
        onShuffleTiles={handleShuffleTiles}
        isSolved={state.isSolved}
      />
    </div>
  );
}
