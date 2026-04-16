"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Train,
  Bus,
  Ship,
  ChevronDown,
  ChevronUp,
  Clock,
  Euro,
  MapPin,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

/* ── Route Map (dynamic, client-only) ─────────────────────── */

const RouteMap = dynamic(() => import("@/components/RouteMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-cream/50 rounded-xl">
      <div className="w-5 h-5 border-2 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
    </div>
  ),
});

/* ── Data types ────────────────────────────────────────────── */

interface Segment {
  mode: "train" | "bus" | "ferry";
  type: string;
  operator: string;
  from: string;
  to: string;
  duration: string;
  cost: string;
  reservationRequired: boolean;
}

interface RoutePoint {
  name: string;
  lat: number;
  lng: number;
}

interface Leg {
  id: number;
  from: string;
  to: string;
  segments: Segment[];
  alternative?: {
    mode: "ferry" | "bus";
    operator: string;
    from: string;
    to: string;
    duration: string;
    cost: string;
    note: string;
  };
  totalDuration: string;
  totalCost: string;
  tips: string[];
  route: {
    waypoints: [number, number][][];
    labels: RoutePoint[];
    colors: string[];
  };
}

/* ── Leg data with route coords + USD equivalents ──────────── */

const modeColorHex = {
  train: "#1E3A5F",
  bus: "#5C6B3C",
  ferry: "#C75B39",
};

const legs: Leg[] = [
  {
    id: 1,
    from: "Naples",
    to: "Amalfi Coast",
    segments: [
      { mode: "train", type: "Circumvesuviana", operator: "EAV", from: "Napoli Garibaldi (Centrale underground)", to: "Sorrento", duration: "50-70 min", cost: "\u20AC4.60 (~$5)", reservationRequired: false },
      { mode: "bus", type: "SITA Sud #5070", operator: "SITA Sud", from: "Sorrento Bus Terminal", to: "Positano / Ravello", duration: "40-90 min", cost: "\u20AC1.80-2.60 (~$2-3)", reservationRequired: false },
    ],
    alternative: { mode: "ferry", operator: "Alilauro / NLG", from: "Napoli Molo Beverello", to: "Amalfi Marina", duration: "75-90 min", cost: "\u20AC18-24 (~$20-26)", note: "Scenic but weather-dependent. Runs Apr-Oct." },
    totalDuration: "2-2.5 hrs",
    totalCost: "\u20AC7-24 (~$8-26)",
    tips: [
      "No direct train to the Amalfi Coast",
      "Circumvesuviana can be crowded \u2014 guard valuables",
      "Campania Express (~\u20AC15 / $16) is a comfort upgrade with A/C",
      "SITA buses are standing-room in August \u2014 go early",
      "Sit on the right side of the bus for sea views",
      "Private transfer from Naples airport is \u20AC80-120 (~$87-130) and avoids all hassle",
    ],
    route: {
      waypoints: [
        [[40.8518, 14.2681], [40.7539, 14.2338], [40.6263, 14.3759]],
        [[40.6263, 14.3759], [40.6281, 14.4861], [40.6340, 14.6020]],
      ],
      labels: [
        { name: "Napoli Centrale", lat: 40.8518, lng: 14.2681 },
        { name: "Sorrento", lat: 40.6263, lng: 14.3759 },
        { name: "Positano", lat: 40.6281, lng: 14.4861 },
        { name: "Amalfi", lat: 40.6340, lng: 14.6020 },
      ],
      colors: [modeColorHex.train, modeColorHex.bus],
    },
  },
  {
    id: 2,
    from: "Amalfi Coast",
    to: "Tuscany / Chianti",
    segments: [
      { mode: "bus", type: "SITA Sud / car", operator: "Rental car or hired driver", from: "Ravello / Positano", to: "Chianti (Greve / Castellina)", duration: "4-5 hrs", cost: "\u20AC200-300 (~$218-327) hired driver, or rental car", reservationRequired: false },
    ],
    totalDuration: "4-5 hrs",
    totalCost: "\u20AC200-300 (~$218-327) driver, or rental car from \u20AC40/day",
    tips: [
      "Rental car recommended for full Tuscany flexibility",
      "Alternatively hire a driver for the Amalfi \u2192 Chianti transfer (\u20AC200-300)",
      "The drive itself is beautiful \u2014 stop wherever looks good",
      "Pick up rental car in Amalfi/Salerno, return in Florence",
      "Avoid driving the narrow Amalfi coast roads if possible \u2014 let a local do it",
    ],
    route: {
      waypoints: [
        [[40.6340, 14.6020], [40.6824, 14.7681], [41.2, 14.0], [42.0, 12.5], [43.0, 11.5], [43.4667, 11.3167]],
      ],
      labels: [
        { name: "Amalfi", lat: 40.6340, lng: 14.6020 },
        { name: "Salerno", lat: 40.6824, lng: 14.7681 },
        { name: "Greve in Chianti", lat: 43.4667, lng: 11.3167 },
      ],
      colors: [modeColorHex.bus],
    },
  },
  {
    id: 3,
    from: "Tuscany / Chianti",
    to: "Florence",
    segments: [
      { mode: "bus", type: "Car / Bus", operator: "Rental car or local bus", from: "Greve in Chianti", to: "Florence city center", duration: "30-60 min", cost: "\u20AC0 (own car) or \u20AC7 (~$8) bus", reservationRequired: false },
    ],
    totalDuration: "30-60 min",
    totalCost: "\u20AC0-7 (~$0-8)",
    tips: [
      "Return rental car at Florence airport or city drop-off before entering ZTL zone",
      "Florence\u2019s ZTL (restricted traffic zone) covers the entire historic center \u2014 do NOT drive in",
      "ZTL cameras automatically fine you \u20AC100+ \u2014 drop the car before the center",
      "SITA bus from Greve to Florence takes ~1 hour, runs regularly",
      "Almost everything in Florence is walkable once you arrive",
    ],
    route: {
      waypoints: [
        [[43.4667, 11.3167], [43.5833, 11.2833], [43.7696, 11.2558]],
      ],
      labels: [
        { name: "Greve in Chianti", lat: 43.4667, lng: 11.3167 },
        { name: "Firenze S.M.N.", lat: 43.7696, lng: 11.2558 },
      ],
      colors: [modeColorHex.bus],
    },
  },
  {
    id: 4,
    from: "Florence",
    to: "Rome",
    segments: [
      { mode: "train", type: "Frecciarossa", operator: "Trenitalia / Italo", from: "Firenze S.M.N.", to: "Roma Termini", duration: "1h 32min - 1h 45min", cost: "\u20AC15-50 (~$16-55)", reservationRequired: true },
    ],
    totalDuration: "1h 32min",
    totalCost: "\u20AC15-50 (~$16-55)",
    tips: [
      "Italy\u2019s busiest high-speed route \u2014 49 direct trains/day",
      "Compare Trenitalia and Italo prices \u2014 Italo often cheaper",
      "Super Economy fares are non-refundable but half price",
      "Book 60-90 days ahead for best prices",
      "Jamie\u2019s family arrives in Rome on Day 8 \u2014 coordinate timing",
    ],
    route: {
      waypoints: [
        [[43.7696, 11.2558], [43.0742, 11.3010], [42.7924, 11.7867], [42.4173, 12.1066], [41.9028, 12.4964]],
      ],
      labels: [
        { name: "Firenze S.M.N.", lat: 43.7696, lng: 11.2558 },
        { name: "Roma Termini", lat: 41.9028, lng: 12.4964 },
      ],
      colors: [modeColorHex.train],
    },
  },
  {
    id: 5,
    from: "Rome",
    to: "Venice",
    segments: [
      { mode: "train", type: "Frecciarossa", operator: "Trenitalia / Italo", from: "Roma Termini", to: "Venezia Santa Lucia", duration: "3h 25min - 3h 45min", cost: "\u20AC30-60 (~$33-65)", reservationRequired: true },
    ],
    totalDuration: "3h 25min - 3h 45min",
    totalCost: "\u20AC30-60 (~$33-65)",
    tips: [
      "Spectacular scenery \u2014 watch for the Apennines and Bologna approach",
      "Book ahead for family of 5 \u2014 try to get seats together",
      "Arrive at Venezia Santa Lucia (island) NOT Mestre (mainland)",
      "Buy a multi-day Vaporetto pass immediately on arrival (\u20AC9.50/day, \u20AC35/72hrs)",
      "Water taxi from station to hotel is ~\u20AC80-120 but saves hauling luggage on vaporetti",
    ],
    route: {
      waypoints: [
        [[41.9028, 12.4964], [42.4, 12.3], [43.3, 11.8], [44.4942, 11.3426], [45.0, 11.8], [45.4410, 12.3212]],
      ],
      labels: [
        { name: "Roma Termini", lat: 41.9028, lng: 12.4964 },
        { name: "Bologna", lat: 44.4942, lng: 11.3426 },
        { name: "Venezia S. Lucia", lat: 45.4410, lng: 12.3212 },
      ],
      colors: [modeColorHex.train],
    },
  },
];

const generalTips = [
  "Book Frecciarossa tickets 60-120 days ahead for Super Economy fares",
  "Trenitalia and Italo are competitors \u2014 always compare both",
  "High-speed trains (Frecce) require reservations; Regional trains do not",
  "Late August is peak season \u2014 book early, expect crowds",
  "Validate paper tickets at yellow machines before boarding Regional trains",
  "Download Trenitalia and Italo apps for mobile tickets",
];

const modeIcons = { train: Train, bus: Bus, ferry: Ship };
const modeColors = {
  train: { bg: "bg-navy/10", text: "text-navy" },
  bus: { bg: "bg-olive/10", text: "text-olive" },
  ferry: { bg: "bg-terracotta/10", text: "text-terracotta" },
};

/* ── Legend ─────────────────────────────────────────────────── */

function ModeLegend() {
  return (
    <div className="flex items-center gap-4 text-[11px] text-gray-400 mt-2">
      <span className="flex items-center gap-1.5">
        <span className="w-6 h-0 border-t-2 border-navy" />
        Train
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-6 h-0 border-t-2 border-dashed border-olive" />
        Bus
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-6 h-0 border-t-2 border-dotted border-terracotta" />
        Ferry
      </span>
    </div>
  );
}

/* ── Main component ────────────────────────────────────────── */

export default function Transportation() {
  const [expandedLeg, setExpandedLeg] = useState<number | null>(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-serif text-xl font-semibold text-navy">
          Getting Around Italy
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Getting between each destination &middot; Est. total:{" "}
          <span className="font-medium text-olive">&euro;53-167 (~$58-182) per person (trains/buses only)</span>
        </p>
      </div>

      {/* Route Overview */}
      <div className="flex flex-wrap items-center gap-1.5 text-sm bg-white rounded-xl border border-gray-100 px-5 py-4">
        {legs.map((leg, i) => (
          <span key={leg.id} className="flex items-center gap-1.5">
            {i === 0 && (
              <span className="font-medium text-navy">{leg.from}</span>
            )}
            <ArrowRight className="w-3.5 h-3.5 text-terracotta/50" />
            <span className="font-medium text-navy">{leg.to}</span>
          </span>
        ))}
      </div>

      {/* Legs */}
      <div className="space-y-3">
        {legs.map((leg) => {
          const isExpanded = expandedLeg === leg.id;
          return (
            <div
              key={leg.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedLeg(isExpanded ? null : leg.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-cream/50 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-terracotta">{leg.id}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{leg.from}</span>
                    <ArrowRight className="w-4 h-4 text-terracotta/40" />
                    <span className="font-medium text-gray-800">{leg.to}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {leg.totalDuration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Euro className="w-3 h-3" />
                      {leg.totalCost}
                    </span>
                    <span className="flex items-center gap-1">
                      {leg.segments.map((s) => {
                        const Icon = modeIcons[s.mode];
                        return <Icon key={s.type} className="w-3 h-3 text-gray-400" />;
                      })}
                    </span>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-300" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-300" />
                )}
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-0 border-t border-gray-50">
                  {/* Map + Segments side by side */}
                  <div className="flex flex-col lg:flex-row gap-4 mt-4">
                    {/* Mini route map */}
                    <div className="lg:w-[300px] h-[220px] lg:h-auto lg:min-h-[240px] rounded-xl overflow-hidden border border-gray-100 shrink-0">
                      <RouteMap
                        waypoints={leg.route.waypoints}
                        labels={leg.route.labels}
                        modeColors={leg.route.colors}
                      />
                    </div>

                    {/* Segments + details */}
                    <div className="flex-1 min-w-0">
                      <div className="space-y-3">
                        {leg.segments.map((seg, i) => {
                          const Icon = modeIcons[seg.mode];
                          const colors = modeColors[seg.mode];
                          return (
                            <div key={i} className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                                  <Icon className={`w-4 h-4 ${colors.text}`} />
                                </div>
                                {i < leg.segments.length - 1 && (
                                  <div className="w-px h-full bg-gray-200 my-1" />
                                )}
                              </div>
                              <div className="flex-1 pb-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium text-sm text-gray-800">{seg.type}</span>
                                  <span className="text-[11px] text-gray-400">{seg.operator}</span>
                                  {seg.reservationRequired && (
                                    <span className="text-[10px] bg-gold/15 text-gold-dark px-1.5 py-0.5 rounded font-medium">
                                      Reservation
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                  <MapPin className="w-3 h-3 text-gray-300" />
                                  <span>{seg.from}</span>
                                  <ArrowRight className="w-3 h-3 text-gray-300" />
                                  <span>{seg.to}</span>
                                </div>
                                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {seg.duration}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Euro className="w-3 h-3" />
                                    {seg.cost}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Alternative */}
                      {leg.alternative && (
                        <div className="mt-4 bg-terracotta/5 rounded-lg p-3 border border-terracotta/10">
                          <div className="flex items-center gap-2 mb-1">
                            <Ship className="w-3.5 h-3.5 text-terracotta" />
                            <span className="text-xs font-medium text-terracotta">Scenic Alternative</span>
                          </div>
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">{leg.alternative.operator}</span>{" "}
                            {leg.alternative.from} &rarr; {leg.alternative.to} &middot;{" "}
                            {leg.alternative.duration} &middot; {leg.alternative.cost}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-1">{leg.alternative.note}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Map legend */}
                  <ModeLegend />

                  {/* Tips */}
                  <div className="mt-4 space-y-1.5">
                    {leg.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-500">
                        <Lightbulb className="w-3 h-3 text-gold mt-0.5 shrink-0" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* General Tips */}
      <div className="bg-navy/5 rounded-xl p-5">
        <h3 className="font-medium text-navy text-sm mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-gold" />
          General Train Tips for Italy
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {generalTips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <span className="text-terracotta mt-0.5">&bull;</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
