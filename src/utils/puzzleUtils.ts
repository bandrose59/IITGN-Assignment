
export type TileEdges = [string, string, string, string]; // [top, right, bottom, left]
export type Position = [number, number]; // [row, col]
export type GridState = Array<Array<TileWithRotation | null>>;

export interface TileWithRotation {
  id: number;
  edges: TileEdges;
  rotation: number; 
  // 0, 1, 2, 3 representing number of 90-degree clockwise rotations
}

export interface PuzzleState {
  tiles: TileWithRotation[];
  grid: GridState;
  selectedTileIndex: number | null;
  isSolved: boolean;
  message: string;
}

// Apply rotation to a tile's edges
export function getRotatedEdges(edges: TileEdges, rotation: number): TileEdges {
  const normalizedRotation = rotation % 4;
  if (normalizedRotation === 0) return edges;
  
  // Create a copy and shift elements based on rotation
  const rotatedEdges = [...edges] as TileEdges;
  for (let i = 0; i < normalizedRotation; i++) {
    rotatedEdges.unshift(rotatedEdges.pop()!);
  }
  
  return rotatedEdges;
}

// Check if two tiles match on their adjacent edges
export function edgesMatch(edge1: string, edge2: string): boolean {
  return edge1 === edge2;
}

// Check if placing a tile at a specific position is valid
export function isValidPlacement(
  grid: GridState,
  tile: TileWithRotation,
  position: Position
): boolean {
  const [row, col] = position;
  const rotatedEdges = getRotatedEdges(tile.edges, tile.rotation);

  // Check top edge
  if (row > 0 && grid[row - 1][col]) {
    const topTile = grid[row - 1][col]!;
    const topTileEdges = getRotatedEdges(topTile.edges, topTile.rotation);
    if (!edgesMatch(rotatedEdges[0], topTileEdges[2])) {
      return false;
    }
  }

  // Check right edge
  if (col < grid[0].length - 1 && grid[row][col + 1]) {
    const rightTile = grid[row][col + 1]!;
    const rightTileEdges = getRotatedEdges(rightTile.edges, rightTile.rotation);
    if (!edgesMatch(rotatedEdges[1], rightTileEdges[3])) {
      return false;
    }
  }

  // Check bottom edge
  if (row < grid.length - 1 && grid[row + 1][col]) {
    const bottomTile = grid[row + 1][col]!;
    const bottomTileEdges = getRotatedEdges(bottomTile.edges, bottomTile.rotation);
    if (!edgesMatch(rotatedEdges[2], bottomTileEdges[0])) {
      return false;
    }
  }

  // Check left edge
  if (col > 0 && grid[row][col - 1]) {
    const leftTile = grid[row][col - 1]!;
    const leftTileEdges = getRotatedEdges(leftTile.edges, leftTile.rotation);
    if (!edgesMatch(rotatedEdges[3], leftTileEdges[1])) {
      return false;
    }
  }

  return true;
}

// Check if the entire grid is a valid solution
export function isGridSolved(grid: GridState): boolean {
  if (!grid.every(row => row.every(tile => tile !== null))) {
    return false; // Grid is not completely filled
  }

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const tile = grid[row][col]!;
      const isValid = isValidPlacement(grid, tile, [row, col]);
      if (!isValid) return false;
    }
  }
  
  return true;
}

// Find a solution using backtracking
export function solvePuzzle(
  tiles: TileWithRotation[],
  gridSize: number = 3
): GridState | null {
  const availableTiles = [...tiles];
  const grid: GridState = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(null));

  function backtrack(row: number, col: number): boolean {
    // If we've gone through all positions, we're done
    if (row === gridSize) {
      return true;
    }

    // Calculate next position
    const nextCol = (col + 1) % gridSize;
    const nextRow = nextCol === 0 ? row + 1 : row;

    // Try each available tile
    for (let i = 0; i < availableTiles.length; i++) {
      const tile = availableTiles[i];
      
      // Try each rotation
      for (let rotation = 0; rotation < 4; rotation++) {
        tile.rotation = rotation;
        
        if (isValidPlacement(grid, tile, [row, col])) {
          // Place the tile and remove it from available tiles
          grid[row][col] = tile;
          availableTiles.splice(i, 1);
          
          // Recursively try to solve the rest of the grid
          if (backtrack(nextRow, nextCol)) {
            return true;
          }
          
          // If we get here, this placement didn't work, so backtrack
          grid[row][col] = null;
          availableTiles.splice(i, 0, tile);
        }
      }
    }
    
    return false;
  }

  // Start backtracking from the top-left corner
  const solved = backtrack(0, 0);
  return solved ? grid : null;
}

// Create a deep copy of the grid
export function cloneGrid(grid: GridState): GridState {
  return grid.map(row => 
    row.map(tile => 
      tile === null ? null : { ...tile, edges: [...tile.edges] }
    )
  );
}

// Check if all edges match 
export function checkEdgeMatches(grid: GridState): boolean[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const matches: boolean[][] = Array(rows * 2 - 1).fill(null).map(() => 
    Array(cols * 2 - 1).fill(false)
  );

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = grid[r][c];
      if (!tile) continue;
      
      const tileEdges = getRotatedEdges(tile.edges, tile.rotation);
      
      // Check horizontal match 
      if (c < cols - 1 && grid[r][c + 1]) {
        const rightTile = grid[r][c + 1]!;
        const rightEdges = getRotatedEdges(rightTile.edges, rightTile.rotation);
        matches[r * 2][c * 2 + 1] = edgesMatch(tileEdges[1], rightEdges[3]);
      }
      
      // Check vertical match 
      if (r < rows - 1 && grid[r + 1][c]) {
        const bottomTile = grid[r + 1][c]!;
        const bottomEdges = getRotatedEdges(bottomTile.edges, bottomTile.rotation);
        matches[r * 2 + 1][c * 2] = edgesMatch(tileEdges[2], bottomEdges[0]);
      }
    }
  }
  
  return matches;
}

// Shuffle
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
