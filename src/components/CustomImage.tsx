import React, { useState } from 'react';

interface CustomImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  onClick?: () => void;
}

export const CustomImage: React.FC<CustomImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-square',
  onClick,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Strictly use local image fallback, zero internet URLs
  const imageSource = error ? '/madu/3.jpeg' : src;

  return (
    <div 
      className={`relative overflow-hidden bg-[#212121] ${aspectRatio} ${className}`}
      onClick={onClick}
    >
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-[#2a2a2a]" />
      )}
      <img
        src={imageSource}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        className={`h-full w-full object-cover transition-all duration-700 ease-out ${
          loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
      />
    </div>
  );
};
