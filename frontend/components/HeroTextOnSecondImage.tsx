"use client";
import React, { useState, useEffect } from "react";

interface HeroTextOnSecondImageProps {
  mission: string | null;
}

const HeroTextOnSecondImage: React.FC<HeroTextOnSecondImageProps> = ({ mission }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show description text once the second image is displayed (after one interval)
    const timer = setTimeout(() => setShow(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <>
      <p className="text-base md:text-lg text-white/80 max-w-2xl" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.15)" }}>
        {mission || "To provide quality education that nurtures academic excellence, moral integrity, and holistic development in every learner."}
      </p>
    </>
  );
};

export default HeroTextOnSecondImage;