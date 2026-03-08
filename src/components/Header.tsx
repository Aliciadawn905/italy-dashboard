"use client";

import { Plane } from "lucide-react";

export default function Header() {
  return (
    <header>
      <div className="italy-stripe" />
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center">
              <Plane className="w-5 h-5 text-terracotta" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-navy">
                Alicia & Jamie Go to Italy
              </h1>
              <p className="text-sm text-gray-400">
                50th Birthday Trip &middot; Aug 29 – Sept 12, 2026
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-italian-green" />
            <span>Live &middot; shared dashboard</span>
          </div>
        </div>
      </div>
    </header>
  );
}
