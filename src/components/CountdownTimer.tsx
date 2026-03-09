"use client";

import { useEffect, useState } from "react";

const TRIP_DATE = new Date("2026-08-29T00:00:00");

interface CountdownTimerProps {
  variant?: "default" | "overlay";
}

export default function CountdownTimer({ variant = "default" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calc() {
      const now = new Date();
      const diff = TRIP_DATE.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, []);

  const blocks = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ];

  if (variant === "overlay") {
    return (
      <div className="flex gap-2">
        {blocks.map((block) => (
          <div
            key={block.label}
            className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-2 text-center min-w-[56px]"
          >
            <div className="font-serif text-xl font-bold text-white tabular-nums leading-none">
              {String(block.value).padStart(2, "0")}
            </div>
            <div className="text-[10px] text-white/60 uppercase tracking-wider mt-1">
              {block.label}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      {blocks.map((block) => (
        <div
          key={block.label}
          className="bg-white rounded-xl border border-gray-100 px-4 py-3 text-center min-w-[72px] card-hover"
        >
          <div className="font-serif text-2xl font-bold text-navy tabular-nums">
            {String(block.value).padStart(2, "0")}
          </div>
          <div className="text-[11px] text-gray-400 uppercase tracking-wider mt-0.5">
            {block.label}
          </div>
        </div>
      ))}
    </div>
  );
}
