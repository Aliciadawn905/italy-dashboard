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
    id: 0,
    from: "Rome (FCO)",
    to: "Sorrento (La Tonnarella)",
    segments: [
      { mode: "train", type: "Leonardo Express", operator: "Trenitalia", from: "Fiumicino Aeroporto (FCO)", to: "Roma Termini", duration: "32 min", cost: "€14 (~$15)", reservationRequired: false },
      { mode: "train", type: "Intercity 707 — BOOKED", operator: "Trenitalia", from: "Roma Termini 15:26", to: "Napoli Centrale 17:34", duration: "2h 8m", cost: "€26.90 × 2 = €53.80 (1st Class)", reservationRequired: true },
      { mode: "bus", type: "Private car (La Tonnarella, Option 2) — CONFIRMED Jun 20", operator: "Hotel La Tonnarella (Annalisa)", from: "Napoli Centrale · driver waits at arrival with 'Sorensen' sign", to: "Hotel La Tonnarella, Via Capo 31", duration: "~70 min", cost: "€170 added to room folio · PAID AT CHECKOUT (not pre-paid)", reservationRequired: true },
    ],
    alternative: { mode: "ferry", operator: "Alilauro / NLG / Gescab", from: "Napoli Molo Beverello", to: "Sorrento Marina Piccola", duration: "35-45 min", cost: "€15-19 (~$16-21)", note: "Backup only if private car cancelled. Taxi (€15) Napoli Centrale → Molo Beverello, then taxi up Via Capo €20-25. Weather-dependent." },
    totalDuration: "~3.5–4 hrs FCO to hotel (door-to-door)",
    totalCost: "€238 total for two (~$259) — €14 Leonardo + €54 IC 707 + €170 transfer (€170 at checkout)",
    tips: [
      "✅ BOOKED — Intercity 707, Roma Termini 15:26 → Napoli Centrale 17:34, Sun Aug 30. 1st Class, Carriage 1, Seats 6C (Alicia) & 6D (Jamie). PNR ZQ5M25. Tickets in /tickets folder.",
      "✅ CONFIRMED Jun 20 — Hotel La Tonnarella transfer locked in. €170 will be added to room folio and paid at checkout on Sept 2 (NOT pre-paid). Don't try to hand cash to the driver.",
      "Meeting protocol: Driver waits at arrival holding a 'Sorensen' sign — likely near the head of the train or platform exit. Annalisa has forwarded Alicia's +1 310-872-4508 (WhatsApp) to the driver.",
      "⏳ Driver's contact number arrives the night before (Aug 29) — Annalisa or reception will email/WhatsApp. Save it to your phone immediately.",
      "🆘 Emergency hotel contact: +39 081 878 11 53 · info@latonnarella.it · WhatsApp the hotel if you can't find the driver after a few minutes — don't wander away from the platform area.",
      "Vehicle confirmed suitable for 2 adults + 2 standard suitcases + 2 carry-ons. If we pack a 3rd large bag, ask Annalisa to upsize.",
      "Delay policy (per Annalisa): up to 1h late = free, 1–2h late = €50 surcharge, beyond 2h = no-show + double charge. Buffer is generous given AA 240 lands FCO 12:05 PM and IC 707 doesn't board until 15:26.",
      "Cancellation: notify ≥72 hrs before service (deadline: 5 PM Thu Aug 27). Not relevant now that the transfer is locked.",
      "AA 240 lands FCO 12:05 PM Aug 30 — realistic Termini boarding ~1:45 PM after customs + bags (1h 21m buffer before 15:26 train).",
    ],
    route: {
      waypoints: [
        [[41.8045, 12.2508], [41.9008, 12.5018]],
        [[41.9008, 12.5018], [41.5, 13.0], [40.8518, 14.2681]],
        [[40.8518, 14.2681], [40.7539, 14.2338], [40.6248, 14.3520]],
      ],
      labels: [
        { name: "Rome FCO", lat: 41.8045, lng: 12.2508 },
        { name: "Roma Termini", lat: 41.9008, lng: 12.5018 },
        { name: "Napoli Centrale", lat: 40.8518, lng: 14.2681 },
        { name: "La Tonnarella (Via Capo)", lat: 40.6248, lng: 14.3520 },
      ],
      colors: [modeColorHex.train, modeColorHex.train, modeColorHex.bus],
    },
  },
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
  {
    id: 6,
    from: "Rome (Alicia solo)",
    to: "Lake Como — Bellagio",
    segments: [
      { mode: "train", type: "Frecciarossa or Italo", operator: "Trenitalia / Italo", from: "Roma Termini 07:00", to: "Milano Centrale ~10:05", duration: "~3h", cost: "€30–90 advance (~$33–98)", reservationRequired: true },
      { mode: "train", type: "Trenord regional (R/RV)", operator: "Trenord", from: "Milano Centrale ~11:20", to: "Varenna-Esino ~12:35", duration: "~1h 15m", cost: "€7 (~$8) — buy at station, no booking needed", reservationRequired: false },
      { mode: "ferry", type: "Public ferry", operator: "Navigazione Lago di Como", from: "Varenna Imbarcadero ~13:00", to: "Bellagio Imbarcadero ~13:15", duration: "~15 min", cost: "€5 (~$5)", reservationRequired: false },
    ],
    alternative: { mode: "bus", operator: "Private car (NCC)", from: "Milano Centrale", to: "Bellagio (via Varenna ferry, or direct via Como)", duration: "~1h 30m – 2h", cost: "€180–250 (~$195–270)", note: "Backup if Trenord cancelled or strike. Direct car can't fully reach Bellagio peninsula — usually drops at Varenna for the ferry." },
    totalDuration: "~5h 45m Rome → Bellagio (door-to-door)",
    totalCost: "€42–102 per person (~$46–111) for Alicia solo",
    tips: [
      "Sept 7 (Mon) — Alicia's solo leg while Jamie + family stay in Rome. Reunite in Venice on Sept 10.",
      "Book the 07:00 Frecciarossa now — Super Economy fares open ~120 days out and disappear fast. Italo 07:15 is an independent backup if Trenitalia has issues.",
      "1h 20m buffer at Milano Centrale absorbs all typical Freccia delays. Grab a panzerotti at Luini (5 min from platform) while you wait.",
      "Trenord ticket is cheap (€7) and bought on arrival — full flexibility to grab whichever regional runs next if the connection slips.",
      "Sciopero (rail strike) is the only real 'don't get there' scenario. Strikes are announced 10+ days ahead at mit.gov.it — check the week before Sept 7.",
      "Varenna → Bellagio ferry runs frequently during the day (~every 30 min). Last fast hydrofoil ~7 PM, last slow ferry ~10 PM — don't push it late.",
      "Hotel Du Lac is ~30 seconds from Bellagio's Imbarcadero — drop the bags and you're at the pier for the next ferry to Tremezzo/Menaggio.",
      "🆘 Hotel Du Lac Bellagio: +39 031 950320 · info@bellagiohoteldulac.com — call ahead if arrival slips past late evening.",
    ],
    route: {
      waypoints: [
        [[41.9028, 12.4964], [44.0, 10.5], [45.4863, 9.2049]],
        [[45.4863, 9.2049], [45.85, 9.27], [46.0119, 9.2854]],
        [[46.0119, 9.2854], [45.9869, 9.2613]],
      ],
      labels: [
        { name: "Roma Termini", lat: 41.9028, lng: 12.4964 },
        { name: "Milano Centrale", lat: 45.4863, lng: 9.2049 },
        { name: "Varenna-Esino", lat: 46.0119, lng: 9.2854 },
        { name: "Bellagio", lat: 45.9869, lng: 9.2613 },
      ],
      colors: [modeColorHex.train, modeColorHex.train, modeColorHex.ferry],
    },
  },
  {
    id: 7,
    from: "Lake Como — Bellagio (Alicia solo)",
    to: "Venice",
    segments: [
      { mode: "ferry", type: "Public ferry", operator: "Navigazione Lago di Como", from: "Bellagio Imbarcadero", to: "Varenna Imbarcadero", duration: "~15 min", cost: "€5 (~$5)", reservationRequired: false },
      { mode: "train", type: "Trenord regional (R/RV)", operator: "Trenord", from: "Varenna-Esino", to: "Milano Centrale", duration: "~1h 15m", cost: "€7 (~$8)", reservationRequired: false },
      { mode: "train", type: "Frecciarossa or Italo", operator: "Trenitalia / Italo", from: "Milano Centrale", to: "Venezia Santa Lucia", duration: "~2h 30m", cost: "€25–80 advance (~$27–87)", reservationRequired: true },
    ],
    totalDuration: "~4h 30m – 5h Bellagio → Venice (door-to-door)",
    totalCost: "€37–92 per person (~$40–100) for Alicia solo",
    tips: [
      "Sept 10 (Thu) — Alicia rejoins Jamie + family in Venice. Aim for an 8–9 AM Bellagio ferry so you're in Venice by mid-afternoon.",
      "Bellagio → Varenna ferry runs hourly+ from ~7 AM. Walk 30 seconds from Hotel Du Lac to the Imbarcadero.",
      "Varenna-Esino station is a 7-min uphill walk from the ferry pier — give yourself 15 min with bags.",
      "Book the Milano → Venezia Frecciarossa in advance for Super Economy fares (often <€30 if booked 60+ days out).",
      "Venezia Santa Lucia is on the island (Grand Canal) — NOT Mestre (mainland). Confirm 'S. Lucia' on the ticket.",
      "Arrival in Venice: vaporetto Line 1 or 2 from the station to your hotel stop (~€9.50 single, ~€35 for 72hr pass).",
    ],
    route: {
      waypoints: [
        [[45.9869, 9.2613], [46.0119, 9.2854]],
        [[46.0119, 9.2854], [45.85, 9.27], [45.4863, 9.2049]],
        [[45.4863, 9.2049], [45.5, 10.2], [45.4410, 12.3212]],
      ],
      labels: [
        { name: "Bellagio", lat: 45.9869, lng: 9.2613 },
        { name: "Varenna-Esino", lat: 46.0119, lng: 9.2854 },
        { name: "Milano Centrale", lat: 45.4863, lng: 9.2049 },
        { name: "Venezia S. Lucia", lat: 45.4410, lng: 12.3212 },
      ],
      colors: [modeColorHex.ferry, modeColorHex.train, modeColorHex.train],
    },
  },
  {
    id: 8,
    from: "Amalfi Coast (Marmorata)",
    to: "Rome",
    segments: [
      { mode: "bus", type: "Hotel taxi", operator: "Marmorata reception", from: "Hotel Marmorata, Marmorata hamlet ~08:50", to: "Amalfi Marina Grande ~09:00", duration: "~10 min", cost: "~€15 (~$16)", reservationRequired: true },
      { mode: "ferry", type: "Travelmar or Alicost", operator: "Travelmar / Alicost", from: "Amalfi Marina Grande 09:30", to: "Salerno Porto Concordia 10:05", duration: "~35 min", cost: "€12 pp (~$13)", reservationRequired: false },
      { mode: "train", type: "Frecciarossa or Italo", operator: "Trenitalia / Italo", from: "Salerno 10:40", to: "Roma Termini 12:45", duration: "~2h 5m", cost: "€30–60 pp Standard advance (~$33–65)", reservationRequired: true },
    ],
    alternative: { mode: "bus", operator: "SITA Sud", from: "Amalfi", to: "Salerno", duration: "~1h 15m", cost: "€3 pp (~$3)", note: "Backup if Amalfi → Salerno ferry is cancelled (weather, strike). Slower & curvier but reliable. Adds ~40 min to total trip." },
    totalDuration: "~4h door-to-door (Marmorata → Roma Termini)",
    totalCost: "€57–87 per person (~$62–95) + ~€15 hotel taxi",
    tips: [
      "Sept 5 (Sat) — Week 1 → Week 2 transit. Target: in Rome by 2 PM. Plan-of-record arrives Termini 12:45, giving ~1h 15m buffer.",
      "⚠ NEEDS RE-BOOKING — Previous Frecciarossa 9642 (13:05 → 14:40) was cancelled by Alicia. Re-book at earlier slot to hit 2 PM target.",
      "Leave Marmorata by ~9:00 AM. Pre-arrange the morning taxi with reception the night before — Ravello-area taxis don't 'just show up.'",
      "Recommended train: 10:40 Frecciarossa Salerno → Roma Termini, arrives 12:45. Backup: 11:45 → arrives 13:50 (cuts the 2 PM deadline close).",
      "DO NOT take a noon-or-later ferry/train combo — arrival drifts past 14:45 and blows the deadline.",
      "Ferry tickets buy day-of at the Travelmar office on the Amalfi pier. Cash or card, no pre-booking needed.",
      "Skip Naples entirely — Salerno → Rome Frecciarossa is the cleanest 2-hour ride on the network and dodges the Sorrento/Naples transfer madness.",
      "🆘 Hotel Marmorata emergency contact: +39 089 877 777 · info@marmorata.it — call reception for taxi arrangements + any morning-of issues.",
      "⚠ Timetable caveat: Travelmar's Sept ferry schedule and Trenitalia's seasonal Sept timetable aren't fully published until ~30–60 days before. These times are based on summer 2025 patterns + Trenitalia historical data. Re-verify before re-booking.",
      "Book on Trenitalia.com, Italo.com, or via ItaliaRail (where the previous Frecciarossa 9642 was originally booked under order #68EFH4PC8ZE5B).",
      "Splurge alternative: private NCC car door-to-door Marmorata → Rome, ~3.5 hrs, ~€600–700 for two. Worth it only if heavy bags or zero-transfer preference.",
    ],
    route: {
      waypoints: [
        [[40.6313, 14.6080], [40.6342, 14.6029]],
        [[40.6342, 14.6029], [40.66, 14.70], [40.6747, 14.7654]],
        [[40.6747, 14.7654], [41.5, 13.0], [41.9008, 12.5018]],
      ],
      labels: [
        { name: "Marmorata", lat: 40.6313, lng: 14.6080 },
        { name: "Amalfi", lat: 40.6342, lng: 14.6029 },
        { name: "Salerno", lat: 40.6747, lng: 14.7654 },
        { name: "Roma Termini", lat: 41.9008, lng: 12.5018 },
      ],
      colors: [modeColorHex.bus, modeColorHex.ferry, modeColorHex.train],
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
  const [expandedLeg, setExpandedLeg] = useState<number | null>(0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-serif text-xl font-semibold text-navy">
          Getting Around Italy
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          FCO arrival + inter-city travel &middot; Est. total:{" "}
          <span className="font-medium text-olive">&euro;128-272 (~$140-297) per person (trains/ferries only)</span>
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
