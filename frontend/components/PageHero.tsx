"use client";

import { useState, useEffect } from "react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string | null;
}

export default function PageHero({ title, subtitle, backgroundImage }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden min-h-[300px] sm:min-h-[350px]">
      {/* Background Image */}
      {backgroundImage && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />
      )}
      {/* Dark Overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: backgroundImage
            ? "linear-gradient(135deg, rgba(10, 31, 68, 0.8) 0%, rgba(26, 58, 110, 0.7) 100%)"
            : "linear-gradient(135deg, var(--school-navy) 0%, #1a3a6e 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-40 sm:pt-44 pb-12 sm:pb-16 flex items-end min-h-[300px] sm:min-h-[350px]">
        <div className="text-center w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-[1px]">
        <svg 
          viewBox="0 0 1440 80" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          preserveAspectRatio="none" 
          className="w-full h-[40px] sm:h-[60px]"
        >
          <path
            d="M0 80L60 73C120 67 240 53 360 47C480 40 600 40 720 43C840 47 960 53 1080 57C1200 60 1320 60 1380 60L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z"
            style={{ fill: "var(--school-grey)" }}
          />
        </svg>
      </div>
    </section>
  );
}
