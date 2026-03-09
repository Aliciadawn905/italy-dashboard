"use client";

import { useState } from "react";
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
}

const legs: Leg[] = [
  {
    id: 1,
    from: "Naples",
    to: "Amalfi Coast",
    segments: [
      {
        mode: "train",
        type: "Circumvesuviana",
        operator: "EAV",
        from: "Napoli Garibaldi (Centrale underground)",
        to: "Sorrento",
        duration: "50-70 min",
        cost: "\u20AC4.60",
        reservationRequired: false,
      },
      {
        mode: "bus",
        type: "SITA Sud #5070",
        operator: "SITA Sud",
        from: "Sorrento Bus Terminal",
        to: "Positano / Amalfi",
        duration: "40-90 min",
        cost: "\u20AC1.80-2.60",
        reservationRequired: false,
      },
    ],
    alternative: {
      mode: "ferry",
      operator: "Alilauro / NLG",
      from: "Napoli Molo Beverello",
      to: "Amalfi Marina",
      duration: "75-90 min",
      cost: "\u20AC18-24",
      note: "Scenic but weather-dependent. Runs Apr-Oct.",
    },
    totalDuration: "2-2.5 hrs",
    totalCost: "\u20AC7-24",
    tips: [
      "No direct train to the Amalfi Coast",
      "Circumvesuviana can be crowded \u2014 guard valuables",
      "Campania Express (~\u20AC15) is a comfort upgrade with A/C",
      "SITA buses are standing-room in August \u2014 go early",
      "Sit on the right side of the bus for sea views",
    ],
  },
  {
    id: 2,
    from: "Amalfi Coast",
    to: "Rome",
    segments: [
      {
        mode: "bus",
        type: "SITA Sud #5020",
        operator: "SITA Sud",
        from: "Amalfi / Positano bus stop",
        to: "Salerno Centrale",
        duration: "75 min",
        cost: "\u20AC2.60",
        reservationRequired: false,
      },
      {
        mode: "train",
        type: "Frecciarossa",
        operator: "Trenitalia",
        from: "Salerno Centrale",
        to: "Roma Termini",
        duration: "1h 23min - 2h 10min",
        cost: "\u20AC15-45",
        reservationRequired: true,
      },
    ],
    alternative: {
      mode: "ferry",
      operator: "TravelMar / Alilauro",
      from: "Amalfi Marina",
      to: "Salerno Port",
      duration: "35 min",
      cost: "\u20AC8-10",
      note: "Faster than the bus to Salerno. Seasonal Apr-Oct.",
    },
    totalDuration: "2.5-3.5 hrs",
    totalCost: "\u20AC18-48",
    tips: [
      "Go via Salerno, not back through Naples \u2014 faster",
      "Book Frecciarossa Super Economy 60-90 days ahead for best price",
      "~27 trains/day from Salerno to Rome",
    ],
  },
  {
    id: 3,
    from: "Rome",
    to: "Florence",
    segments: [
      {
        mode: "train",
        type: "Frecciarossa",
        operator: "Trenitalia / Italo",
        from: "Roma Termini",
        to: "Firenze S.M.N.",
        duration: "1h 32min - 1h 45min",
        cost: "\u20AC15-50",
        reservationRequired: true,
      },
    ],
    totalDuration: "1h 32min",
    totalCost: "\u20AC15-50",
    tips: [
      "Italy\u2019s busiest high-speed route \u2014 49 direct trains/day",
      "Compare Trenitalia and Italo prices \u2014 Italo often cheaper",
      "Super Economy fares are non-refundable but half price",
      "Firenze S.M.N. is walking distance to the Duomo",
    ],
  },
  {
    id: 4,
    from: "Florence",
    to: "Cinque Terre",
    segments: [
      {
        mode: "train",
        type: "Regionale Veloce",
        operator: "Trenitalia",
        from: "Firenze S.M.N.",
        to: "La Spezia Centrale",
        duration: "2h 00min - 2h 34min",
        cost: "\u20AC10-16",
        reservationRequired: false,
      },
    ],
    totalDuration: "2h - 2h 34min",
    totalCost: "\u20AC10-25",
    tips: [
      "Regional trains are cheapest \u2014 no reservation needed",
      "Some routes change at Pisa Centrale \u2014 check for direct",
      "~7 direct trains per day",
      "From La Spezia, Cinque Terre Express connects all 5 villages",
      "Cinque Terre Card: ~\u20AC16/day for unlimited trains + park access",
    ],
  },
  {
    id: 5,
    from: "Cinque Terre",
    to: "Venice",
    segments: [
      {
        mode: "train",
        type: "InterCity / Frecciabianca",
        operator: "Trenitalia",
        from: "La Spezia Centrale",
        to: "Milano Centrale",
        duration: "2h 30min - 3h",
        cost: "\u20AC18-30",
        reservationRequired: true,
      },
      {
        mode: "train",
        type: "Frecciarossa",
        operator: "Trenitalia / Italo",
        from: "Milano Centrale",
        to: "Venezia Santa Lucia",
        duration: "2h 25min",
        cost: "\u20AC15-45",
        reservationRequired: true,
      },
    ],
    totalDuration: "5-6 hrs (incl. transfer)",
    totalCost: "\u20AC33-75",
    tips: [
      "No direct train \u2014 transfer in Milan is fastest",
      "Allow 30-45 min for transfer at Milano Centrale",
      "Book both segments separately for best prices",
      "Arrive at Venezia Santa Lucia (island) NOT Mestre (mainland)",
    ],
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

const modeIcons = {
  train: Train,
  bus: Bus,
  ferry: Ship,
};

const modeColors = {
  train: { bg: "bg-navy/10", text: "text-navy", border: "border-navy/20" },
  bus: { bg: "bg-olive/10", text: "text-olive", border: "border-olive/20" },
  ferry: { bg: "bg-terracotta/10", text: "text-terracotta", border: "border-terracotta/20" },
};

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
          Trains, buses & ferries between each destination \u00b7 Est. total:{" "}
          <span className="font-medium text-olive">\u20AC83-222 per person</span>
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
                onClick={() =>
                  setExpandedLeg(isExpanded ? null : leg.id)
                }
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-cream/50 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-terracotta">
                    {leg.id}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">
                      {leg.from}
                    </span>
                    <ArrowRight className="w-4 h-4 text-terracotta/40" />
                    <span className="font-medium text-gray-800">
                      {leg.to}
                    </span>
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
                        return (
                          <Icon
                            key={s.type}
                            className="w-3 h-3 text-gray-400"
                          />
                        );
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
                  {/* Segments */}
                  <div className="space-y-3 mt-4">
                    {leg.segments.map((seg, i) => {
                      const Icon = modeIcons[seg.mode];
                      const colors = modeColors[seg.mode];
                      return (
                        <div key={i} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}
                            >
                              <Icon className={`w-4 h-4 ${colors.text}`} />
                            </div>
                            {i < leg.segments.length - 1 && (
                              <div className="w-px h-full bg-gray-200 my-1" />
                            )}
                          </div>
                          <div className="flex-1 pb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm text-gray-800">
                                {seg.type}
                              </span>
                              <span className="text-[11px] text-gray-400">
                                {seg.operator}
                              </span>
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
                        <span className="text-xs font-medium text-terracotta">
                          Scenic Alternative
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">
                          {leg.alternative.operator}
                        </span>{" "}
                        {leg.alternative.from} &rarr;{" "}
                        {leg.alternative.to} &middot;{" "}
                        {leg.alternative.duration} &middot;{" "}
                        {leg.alternative.cost}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {leg.alternative.note}
                      </p>
                    </div>
                  )}

                  {/* Tips */}
                  <div className="mt-4 space-y-1.5">
                    {leg.tips.map((tip, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs text-gray-500"
                      >
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
            <div
              key={i}
              className="flex items-start gap-2 text-xs text-gray-600"
            >
              <span className="text-terracotta mt-0.5">&bull;</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
