"use client";

import { useMemo } from "react";

type Star = {
  id: number;
  top: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
};

export default function StarBackground() {
  const stars: Star[] = useMemo(() => {
    return Array.from({ length: 120 }, (_, i) => ({
      id: i,
      top: `${Math.floor((i * 137.5 + 13) % 100)}%`,
      left: `${Math.floor((i * 97.3 + 7) % 100)}%`,
      size: ((i * 31 + 5) % 3) + 1,
      duration: (((i * 73) % 4) + 2),
      delay: ((i * 47) % 5),
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Deep space gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, #0d1b3e 0%, #0a0f1e 40%, #060810 100%)",
        }}
      />

      {/* Nebula effect */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at 70% 30%, rgba(80,40,120,0.6) 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, rgba(20,60,100,0.5) 0%, transparent 40%)",
        }}
      />

      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            "--duration": `${star.duration}s`,
            "--delay": `${star.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Moon */}
      <div
        className="absolute"
        style={{ top: "6%", right: "8%", width: 90, height: 90 }}
      >
        <div
          className="w-full h-full rounded-full moon-glow"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, #fff8e7, #f5d88e 50%, #e8c060)",
            boxShadow:
              "inset -12px -8px 20px rgba(180,130,0,0.4), 0 0 40px rgba(255,215,100,0.3)",
          }}
        />
        {/* Moon craters */}
        <div
          className="absolute rounded-full"
          style={{
            top: "25%",
            left: "55%",
            width: 12,
            height: 12,
            background: "rgba(180,140,30,0.35)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: "55%",
            left: "30%",
            width: 8,
            height: 8,
            background: "rgba(180,140,30,0.3)",
          }}
        />
      </div>

      {/* Shooting star */}
      <div
        className="absolute"
        style={{
          top: "15%",
          right: "25%",
          width: 2,
          height: 2,
          background: "white",
          borderRadius: "50%",
          boxShadow: "0 0 4px white",
          animation: "shooting-star 6s ease-in 4s infinite",
        }}
      />
    </div>
  );
}
