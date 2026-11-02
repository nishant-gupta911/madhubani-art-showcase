import React, { useState, useRef } from 'react';

interface InteractiveLoupeProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  zoomLevel?: number;
  className?: string;
  onClick?: () => void;
}

export const InteractiveLoupe: React.FC<InteractiveLoupeProps> = ({
  src,
  alt,
  aspectRatio = 'aspect-4/5',
  zoomLevel = 2.4,
  className = '',
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`relative overflow-hidden bg-paper-2 cursor-crosshair group select-none ${aspectRatio} ${className}`}
    >
      {/* Standard Image */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isHovered ? 'opacity-30' : 'opacity-100'
        }`}
      />

      {/* High-Precision Zoom Layer on Hover */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-transform duration-75 ease-out"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
            backgroundSize: `${zoomLevel * 100}%`,
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}

      {/* Inspection Crosshair Reticle */}
      {isHovered && (
        <div 
          className="absolute pointer-events-none border border-accent/70 w-24 h-24 -translate-x-1/2 -translate-y-1/2 shadow-2xl"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
          }}
        >
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-accent" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-accent" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-accent" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-accent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
          </div>
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-ink/90 text-paper text-[9px] font-mono px-1.5 py-0.5 border border-line whitespace-nowrap">
            2.4X MACRO LOUPE
          </span>
        </div>
      )}

      {/* Default Hint Badge */}
      {!isHovered && (
        <div className="absolute bottom-3 right-3 bg-ink/85 text-paper text-[10px] uppercase font-mono tracking-[1.2px] px-2.5 py-1 border border-line pointer-events-none flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-accent rounded-full" />
          <span>HOVER FOR MACRO FIBER ZOOM</span>
        </div>
      )}
    </div>
  );
};
