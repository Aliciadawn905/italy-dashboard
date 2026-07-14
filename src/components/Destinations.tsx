"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Users,
  Calendar,
  Thermometer,
  Lightbulb,
  MapPin,
  Plane,
} from "lucide-react";

interface DestinationInfo {
  name: string;
  region: string;
  days: string;
  who: string;
  overview: string;
  bestMonths: string;
  weather: string;
  baseRecommendation: string;
  gettingThere: string;
  highlights: string[];
  insiderTips: string[];
}

const destinations: DestinationInfo[] = [
  {
    name: "Amalfi Coast",
    region: "Campania",
    days: "Days 1–3",
    who: "Alicia & Jamie",
    overview:
      "Dramatic clifftop villages cascading down to turquoise waters. The Amalfi Coast is Italy's most iconic stretch of coastline — a UNESCO World Heritage landscape of lemon groves, pastel houses, and winding coastal roads.",
    bestMonths: "May–June or September–October (avoid July–August peak crowds and heat)",
    weather: "Mediterranean. 22–27°C in May/Sept. Hot and humid in summer.",
    baseRecommendation:
      "Ravello (quieter, elevated, panoramic) or Positano (iconic, busy, beautiful)",
    gettingThere:
      "Fly into Naples (NAP). Private transfer or SITA Sud bus to coast (~1.5 hrs)",
    highlights: [
      "Positano village — pastel cliffside houses and pebble beaches",
      "Villa Rufolo in Ravello — stunning gardens and sea views",
      "Boat tour along the coast — grottos, beaches, and cliffside views",
      "Valle dei Mulini hike — waterfalls through old paper mill ruins",
      "Amalfi Cathedral — Arab-Norman architecture",
      "Limoncello tasting from local producers",
    ],
    insiderTips: [
      "Book hotels 6+ months ahead for summer dates",
      "Drive the coast road only if comfortable with narrow cliff roads — bus or boat is easier",
      "Limoncello is best bought directly from local producers",
      "The SITA buses are standing-room in August — go early",
      "Sit on the right side of the bus heading south for the best sea views",
    ],
  },
  {
    name: "Rome",
    region: "Lazio",
    days: "Days 8–10",
    who: "Full group",
    overview:
      "The Eternal City where ancient ruins stand shoulder-to-shoulder with Renaissance palaces and buzzing trattorias. Three thousand years of history are layered into every street corner.",
    bestMonths: "April–May or September–October",
    weather: "22–28°C in shoulder season. Peak summer is very hot and crowded.",
    baseRecommendation:
      "Trastevere for charm and restaurants, or near Termini for transit convenience",
    gettingThere:
      "BOOKED: 07:30 taxi Marmorata → Salerno station (€120, driver Dino), then Frecciarossa 8509 Salerno 09:11 → Roma Termini 10:40 (PNR NLKYF5, seats 3D/4D).",
    highlights: [
      "Colosseum + Roman Forum + Palatine Hill — the heart of ancient Rome",
      "Vatican Museums + Sistine Chapel — Michelangelo's masterpiece ceiling",
      "St. Peter's Basilica — dome climb with panoramic city views",
      "Trevi Fountain — throw a coin to guarantee your return",
      "Pantheon — best-preserved ancient Roman building",
      "Trastevere — cobblestone streets and the best neighborhood for dinner",
    ],
    insiderTips: [
      "The Colosseum/Roman Forum/Palatine Hill combo ticket is best value",
      "Vatican requires separate advance booking — get the 8am slot",
      "Trastevere is the best neighborhood for family dinners",
      "Avoid midday at the Trevi Fountain — go at dawn or 10pm",
      "Buy a 48hr or 72hr transit pass for Metro + buses",
    ],
  },
  {
    name: "Venice",
    region: "Veneto",
    days: "Days 11–14",
    who: "Full group",
    overview:
      "A city built on water where cars don't exist and every turn reveals another breathtaking canal view. Venice is unlike anywhere else on earth — part living museum, part floating dreamscape.",
    bestMonths: "April–May or September–October (avoid Acqua Alta flooding Nov–Jan)",
    weather: "18–24°C in shoulder season.",
    baseRecommendation:
      "Cannaregio or Dorsoduro for a more local experience away from San Marco crowds",
    gettingThere:
      "Train from Rome (Frecciarossa, ~3.5 hrs) — spectacular scenery. Arrive at Santa Lucia station (island, not Mestre/mainland).",
    highlights: [
      "Grand Canal Vaporetto ride — Line 1 is the best orientation tour",
      "Piazza San Marco + St. Mark's Basilica — Byzantine golden mosaics",
      "Doge's Palace — Gothic masterpiece and seat of Venetian power",
      "Rialto Bridge + Market — iconic bridge and centuries-old fish market",
      "Gondola ride — the quintessential Venice experience",
      "Murano Island — free glass-blowing demonstrations",
    ],
    insiderTips: [
      "Buy a multi-day Vaporetto pass immediately on arrival (€9.50/day, €35/72hrs)",
      "Get genuinely lost — that's the point of Venice",
      "Book gondola rides through official stands (fixed pricing ~€80–90 for 30 min)",
      "Murano glass factory visits are free — great for mixed-age groups",
      "The Rialto Market sells fresh lagoon seafood — go before noon",
      "Cicchetti bar hop in Cannaregio — small plates and ombra (small glass of wine) at 5–6 bars",
    ],
  },
];

export default function Destinations() {
  const [expanded, setExpanded] = useState<string | null>("Amalfi Coast");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold text-navy">
          Destinations
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Deep-dive guides for each stop on your Italian adventure
        </p>
      </div>

      <div className="space-y-3">
        {destinations.map((dest) => {
          const isExpanded = expanded === dest.name;
          return (
            <div
              key={dest.name}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => setExpanded(isExpanded ? null : dest.name)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-cream/50 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-terracotta" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif font-semibold text-gray-800">
                      {dest.name}
                    </span>
                    <span className="text-[11px] text-gray-400 italic">
                      {dest.region}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {dest.days}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {dest.who}
                    </span>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-300" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-300" />
                )}
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-0 border-t border-gray-50">
                  {/* Overview */}
                  <p className="text-sm text-gray-600 leading-relaxed mt-4">
                    {dest.overview}
                  </p>

                  {/* Info grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <div className="bg-cream rounded-lg p-3">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-olive mb-1">
                        <Calendar className="w-3 h-3" />
                        Best Months
                      </div>
                      <p className="text-xs text-gray-600">{dest.bestMonths}</p>
                    </div>
                    <div className="bg-cream rounded-lg p-3">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-olive mb-1">
                        <Thermometer className="w-3 h-3" />
                        Weather
                      </div>
                      <p className="text-xs text-gray-600">{dest.weather}</p>
                    </div>
                    <div className="bg-cream rounded-lg p-3">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-olive mb-1">
                        <MapPin className="w-3 h-3" />
                        Where to Stay
                      </div>
                      <p className="text-xs text-gray-600">
                        {dest.baseRecommendation}
                      </p>
                    </div>
                    <div className="bg-cream rounded-lg p-3">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-olive mb-1">
                        <Plane className="w-3 h-3" />
                        Getting There
                      </div>
                      <p className="text-xs text-gray-600">
                        {dest.gettingThere}
                      </p>
                    </div>
                  </div>

                  {/* Key Highlights */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-navy mb-2">
                      Key Highlights
                    </h4>
                    <div className="space-y-1.5">
                      {dest.highlights.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-xs text-gray-600"
                        >
                          <span className="text-terracotta mt-0.5 shrink-0">
                            &bull;
                          </span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Insider Tips */}
                  <div className="mt-4 bg-gold/5 rounded-lg p-4 border border-gold/10">
                    <h4 className="text-sm font-medium text-gold-dark mb-2 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Insider Tips
                    </h4>
                    <div className="space-y-1.5">
                      {dest.insiderTips.map((tip, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-xs text-gray-600"
                        >
                          <Lightbulb className="w-3 h-3 text-gold mt-0.5 shrink-0" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
