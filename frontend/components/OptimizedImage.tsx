"use client";

import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  aspectRatio?: "square" | "video" | "auto";
}

export default function OptimizedImage({
  src,
  alt,
  className = "",
  width,
  height,
  priority = false,
  aspectRatio = "auto",
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    auto: "",
  };

  return (
    <div className={`relative overflow-hidden ${aspectClasses[aspectRatio]} ${className}`}>
      {isLoading && (
        <div
          className="absolute inset-0 animate-pulse bg-slate-200"
          aria-hidden="true"
        />
      )}
      {hasError ? (
        <div
          className="flex items-center justify-center bg-slate-200 text-slate-400"
          role="img"
          aria-label={`${alt} - Image failed to load`}
        >
          <span className="text-sm">Image unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
        />
      )}
    </div>
  );
}
