
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { TileWithRotation, getRotatedEdges } from "@/utils/puzzleUtils";

interface TileProps {
  tile: TileWithRotation;
  isSelected: boolean;
  isPlaced: boolean;
  isMatched?: boolean;
  onClick?: () => void;
  onRotate?: () => void;
  size?: "sm" | "md" | "lg";
}

export default function Tile({ 
  tile, 
  isSelected, 
  isPlaced, 
  isMatched = true,
  onClick, 
  onRotate, 
  size = "md"
}: TileProps) {
  const [rotationClass, setRotationClass] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  
  const rotatedEdges = getRotatedEdges(tile.edges, tile.rotation);
  
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-20 h-20",
    lg: "w-24 h-24"
  };
  
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Match duration of rotate-tile animation
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);
  
  // Trigger rotation animation when rotation changes
  useEffect(() => {
    if (!isPlaced) return;
    
    setIsAnimating(true);
    setRotationClass(`rotate-[${tile.rotation * 90}deg]`);
  }, [tile.rotation, isPlaced]);
  
  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRotate && !isAnimating) {
      onRotate();
    }
  };
  
  return (
    <div 
      className={cn(
        "tile",
        sizeClasses[size],
        isSelected ? "ring-2 ring-primary" : "",
        isPlaced ? "" : "opacity-80",
        isMatched ? "" : "ring-2 ring-destructive/70",
        isAnimating ? "animate-rotate-tile" : rotationClass
      )}
      style={{ 
        transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0)",
        transformOrigin: "center",
      }}
      onClick={onClick}
      onContextMenu={handleRotate}
    >
      {/* Top edge */}
      <div className="tile-symbol tile-symbol-top">{rotatedEdges[0]}</div>
      
      {/* Right edge */}
      <div className="tile-symbol tile-symbol-right">{rotatedEdges[1]}</div>
      
      {/* Bottom edge */}
      <div className="tile-symbol tile-symbol-bottom">{rotatedEdges[2]}</div>
      
      {/* Left edge */}
      <div className="tile-symbol tile-symbol-left">{rotatedEdges[3]}</div>
      
      {/* Rotate indicator */}
      {!isPlaced && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/5 
                     rounded-lg opacity-0 hover:opacity-100 transition-opacity"
          onClick={handleRotate}
        >
          <svg 
            className="w-6 h-6 text-foreground/70"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
        </div>
      )}
      
      {/* Tile ID */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-foreground/40">
        {tile.id + 1}
      </div>
    </div>
  );
}
