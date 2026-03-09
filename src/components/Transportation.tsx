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
      { mode: "bus", type: "SITA Sud #5070", operator: "SITA Sud", from: "Sorrento Bus Terminal", to: "Positano / Amalfi", duration: "40-90 min", cost: "\u20AC1.80-2.60 (~$2-3)", reservationRequired: false },
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
    to: "Rome",
    segments: [
      { mode: "bus", type: "SITA Sud #5020", operator: "SITA Sud", from: "Amalfi / Positano bus stop", to: "Salerno Centrale", duration: "75 min", cost: "\u20AC2.60 (~$3)", reservationRequired: false },
      { mode: "train", type: "Frecciarossa", operator: "Trenitalia", from: "Salerno Centrale", to: "Roma Termini", duration: "1h 23min - 2h 10min", cost: "\u20AC15-45 (~$16-49)", reservationRequired: true },
    ],
    alternative: { mode: "ferry", operator: "TravelMar / Alilauro", from: "Amalfi Marina", to: "Salerno Port", duration: "35 min", cost: "\u20AC8-10 (~$9-11)", note: "Faster than the bus to Salerno. Seasonal Apr-Oct." },
    totalDuration: "2.5-3.5 hrs",
    totalCost: "\u20AC18-48 (~$20-52)",
    tips: [
      "Go via Salerno, not back through Naples \u2014 faster",
      "Book Frecciarossa Super Economy 60-90 days ahead for best price",
      "~27 trains/day from Salerno to Rome",
    ],
    route: {
      waypoints: [
        [[40.6340, 14.6020], [40.6824, 14.7681]],
        [[40.6824, 14.7681], [41.0092, 14.3419], [41.9028, 12.4964]],
      ],
      labels: [
        { name: "Amalfi", lat: 40.6340, lng: 14.6020 },
        { name: "Salerno", lat: 40.6824, lng: 14.7681 },
        { name: "Roma Termini", lat: 41.9028, lng: 12.4964 },
      ],
      colors: [modeColorHex.bus, modeColorHex.train],
    },
  },
  {
    id: 3,
    from: "Rome",
    to: "Florence",
    segments: [
      { mode: "train", type: "Frecciarossa", operator: "Trenitalia / Italo", from: "Roma Termini", to: "Firenze S.M.N.", duration: "1h 32min - 1h 45min", cost: "\u20AC15-50 (~$16-55)", reservationRequired: true },
    ],
    totalDuration: "1h 32min",
    totalCost: "\u20AC15-50 (~$16-55)",
    tips: [
      "Italy\u2019s busiest high-speed route \u2014 49 direct trains/day",
      "Compare Trenitalia and Italo prices \u2014 Italo often cheaper",
      "Super Economy fares are non-refundable but half price",
      "Firenze S.M.N. is walking distance to the Duomo",
    ],
    route: {
      waypoints: [
        [[41.9028, 12.4964], [42.4173, 12.1066], [42.7924, 11.7867], [43.0742, 11.3010], [43.7696, 11.2558]],
      ],
      labels: [
        { name: "Roma Termini", lat: 41.9028, lng: 12.4964 },
        { name: "Firenze S.M.N.", lat: 43.7696, lng: 11.2558 },
      ],
      colors: [modeColorHex.train],
    },
  },
  {
    id: 4,
    from: "Florence",
    to: "Cinque Terre",
    segments: [
      { mode: "train", type: "Regionale Veloce", operator: "Trenitalia", from: "Firenze S.M.N.", to: "La Spezia Centrale", duration: "2h 00min - 2h 34min", cost: "\u20AC10-16 (~$11-17)", reservationRequired: false },
    ],
    totalDuration: "2h - 2h 34min",
    totalCost: "\u20AC10-25 (~$11-27)",
    tips: [
      "Regional trains are cheapest \u2014 no reservation needed",
      "Some routes change at Pisa Centrale \u2014 check for direct",
      "~7 direct trains per day",
      "From La Spezia, Cinque Terre Express connects all 5 villages",
      "Cinque Terre Card: ~\u20AC16/day ($17) for unlimited trains + park access",
    ],
    route: {
      waypoints: [
        [[43.7696, 11.2558], [43.7228, 10.4017], [44.1024, 9.8240]],
      ],
      labels: [
        { name: "Firenze S.M.N.", lat: 43.7696, lng: 11.2558 },
        { name: "Pisa Centrale", lat: 43.7228, lng: 10.4017 },
        { name: "La Spezia", lat: 44.1024, lng: 9.8240 },
      ],
      colors: [modeColorHex.train],
    },
  },
  {
    id: 5,
    from: "Cinque Terre",
    to: "Venice",
    segments: [
      { mode: "train", type: "InterCity / Frecciabianca", operator: "Trenitalia", from: "La Spezia Centrale", to: "Milano Centrale", duration: "2h 30min - 3h", cost: "\u20AC18-30 (~$20-33)", reservationRequired: true },
      { mode: "train", type: "Frecciarossa", operator: "Trenitalia / Italo", from: "Milano Centrale", to: "Venezia Santa Lucia", duration: "2h 25min", cost: "\u20AC15-45 (~$16-49)", reservationRequired: true },
    ],
    totalDuration: "5-6 hrs (incl. transfer)",
    totalCost: "\u20AC33-75 (~$36-82)",
    tips: [
      "No direct train \u2014 transfer in Milan is fastest",
      "Allow 30-45 min for transfer at Milano Centrale",
      "Book both segments separately for best prices",
      "Arrive at Venezia Santa Lucia (island) NOT Mestre (mainland)",
    ],
    route: {
      waypoints: [
        [[44.1024, 9.8240], [44.4056, 9.9766], [44.6471, 10.9252], [45.4654, 9.1860]],
        [[45.4654, 9.1860], [45.4408, 10.9929], [45.4410, 12.3212]],
      ],
      labels: [
        { name: "La Spezia", lat: 44.1024, lng: 9.8240 },
        { name: "Milano Centrale", lat: 45.4654, lng: 9.1860 },
        { name: "Venezia S. Lucia", lat: 45.4410, lng: 12.3212 },
      ],
      colors: [modeColorHex.train, modeColorHex.train],
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
          Trains, buses & ferries between each destination &middot; Est. total:{" "}
          <span className="font-medium text-olive">&euro;83-222 (~$91-242) per person</span>
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
