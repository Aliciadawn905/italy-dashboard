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
    id: 7,
    from: "Sorrento (La Tonnarella)",
    to: "Amalfi Coast — Marmorata",
    segments: [
      { mode: "bus", type: "Private taxi — CONFIRMED Aug 12 (arranged by Sandra)", operator: "Hotel Marmorata", from: "Hotel La Tonnarella 09:30", to: "Ravello Art Hotel Marmorata ~11:00", duration: "~90 min (coast road — can stretch toward 2h in traffic)", cost: "€200 · CASH to driver", reservationRequired: true },
    ],
    totalDuration: "~1.5–2 hrs door-to-door",
    totalCost: "€200 cash for two",
    tips: [
      "✅ CONFIRMED Aug 12 — Sandra (info@marmorata.it) booked the taxi: pickup 9:30 AM at La Tonnarella, Wed Sept 2. €200 CASH to the driver — bring exact bills, drivers rarely carry change.",
      "9:30 departure beats the day-tripper wave: SS163 is clear before ~9:00 and jammed 11 AM–4 PM. Expect ~90 min; don't stress if it runs longer.",
      "Confirmed for 2 adults + ~4 bags.",
      "Arrival ~11:00 is before the 2 PM check-in — drop bags at reception, then it's a 5-min walk into Amalfi town for lunch (casual, no reservation needed).",
      "Backup if the taxi falls through: taxi to Sorrento Marina Piccola (€15–20) + Travelmar/NLG ferry to Amalfi (~1h, ~€25 pp) + 5-min taxi or walk to the hotel.",
    ],
    route: {
      waypoints: [
        [[40.6248, 14.3520], [40.628, 14.485], [40.634, 14.603], [40.6355, 14.6155]],
      ],
      labels: [
        { name: "La Tonnarella (Sorrento)", lat: 40.6248, lng: 14.3520 },
        { name: "Positano", lat: 40.628, lng: 14.485 },
        { name: "Marmorata (Ravello)", lat: 40.6355, lng: 14.6155 },
      ],
      colors: [modeColorHex.bus],
    },
  },
  {
    id: 1,
    from: "Ravello (Marmorata)",
    to: "Rome (family pickup)",
    segments: [
      { mode: "bus", type: "Mercedes Van \u2014 CONFIRMED (driver: Dino)", operator: "Hotel Marmorata (Sandra)", from: "Hotel Marmorata 07:30", to: "Salerno Centrale ~08:10", duration: "~40 min", cost: "\u20AC120 \u00B7 pay driver by credit card or cash", reservationRequired: true },
      { mode: "train", type: "Frecciarossa 8509 \u2014 BOOKED", operator: "Trenitalia", from: "Salerno 09:11", to: "Roma Termini 10:40", duration: "1h 29m (fast train)", cost: "\u20AC84 \u00D7 2 = \u20AC168 (Business, Area Silenzio)", reservationRequired: true },
    ],
    totalDuration: "~3.5 hrs Marmorata \u2192 Termini",
    totalCost: "\u20AC288 total for two (~$313)",
    tips: [
      "Sept 5 (Sat) \u2014 Week 1 \u2192 Week 2 handoff. Meet Jamie's family at Roma Termini Meeting Point ~1 PM. Their FCO flight lands 12:30 PM, they take Leonardo Express to Termini arriving ~2:05 PM.",
      "\u2705 BOOKED \u2014 Frecciarossa 8509, Salerno 09:11 \u2192 Roma Termini 10:40. 1st Business Area Silenzio. Carriage 2, seats 3D (Alicia) & 4D (Jamie). PNR NLKYF5. Tickets in /tickets folder.",
      "\u2705 CONFIRMED \u2014 Marmorata \u2192 Salerno private van transfer. Mercedes Van, \u20AC120, driver DINO. WhatsApp: +39 339 391 7300. Save this contact and WhatsApp Dino on Sept 4 to confirm pickup timing.",
      "\uD83C\uDF73 Breakfast \u2014 Marmorata dining room opens 07:30-10:30, but Sandra confirmed 10-min early access at 07:20 AM so you can eat before pickup. Quick espresso + pastry, then head to the van at 07:30.",
      "\uD83D\uDEE1\uFE0F Big cushion \u2014 Frecciarossa 8509 arrives Termini at 10:40, giving ~3h 25m buffer before family lands at Termini ~2:05 PM. Even a 90-min train delay wouldn't blow the meetup.",
      "Coastal drive Marmorata \u2192 Salerno is ~40 min via SS163 \u2192 A3 autostrada. 07:30 pickup puts you at Salerno ~08:10, ~1 hour before the 09:11 train.",
      "Drop bags at the Piazza Barberini penthouse around 11:15 AM (13-min walk or ~\u20AC15 taxi from Termini), freshen up, walk back to Termini for the family meetup. Or wait at the station: lunch at Mercato Centrale (10-min walk) or espresso inside Termini until ~1:45 PM.",
      "After family meetup: 2 taxis from the Termini rank to the penthouse (Via di San Nicola da Tolentino, ~\u20AC15-20 each for 5 pax + luggage) \u2014 or it's a flat 13-min walk if the kids can roll their own bags. Barberini metro (Linea A, 1 stop from Termini) also works.",
      "\uD83C\uDD98 Hotel Marmorata: +39 089 877 777 \u00B7 info@hotelmarmorata.com \u2014 call Sandra if anything shifts.",
    ],
    route: {
      waypoints: [
        [[40.6313, 14.6080], [40.66, 14.72], [40.6747, 14.7654]],
        [[40.6747, 14.7654], [41.5, 13.0], [41.9028, 12.4964]],
      ],
      labels: [
        { name: "Marmorata", lat: 40.6313, lng: 14.6080 },
        { name: "Salerno", lat: 40.6747, lng: 14.7654 },
        { name: "Roma Termini", lat: 41.9028, lng: 12.4964 },
      ],
      colors: [modeColorHex.bus, modeColorHex.train],
    },
  },
  {
    id: 2,
    from: "Rome (Alicia solo)",
    to: "Lake Como — Bellagio",
    segments: [
      { mode: "train", type: "Frecciarossa 9608 — BOOKED", operator: "Trenitalia", from: "Roma Termini 06:50", to: "Milano Centrale 10:00", duration: "3h 10m", cost: "€129 (Business Area Silenzio, BASE fare)", reservationRequired: true },
      { mode: "train", type: "Trenord regional (R/RV)", operator: "Trenord", from: "Milano Centrale 11:10", to: "Varenna-Esino ~12:25", duration: "~1h 15m", cost: "€7 (~$8) — buy at station, no booking needed", reservationRequired: false },
      { mode: "ferry", type: "Public ferry", operator: "Navigazione Lago di Como", from: "Varenna Imbarcadero ~12:35", to: "Bellagio Imbarcadero ~12:50", duration: "~15 min", cost: "€5 (~$5)", reservationRequired: false },
    ],
    alternative: { mode: "bus", operator: "Private car (NCC)", from: "Milano Centrale", to: "Bellagio (via Varenna ferry, or direct via Como)", duration: "~1h 30m – 2h", cost: "€180–250 (~$195–270)", note: "Backup if Trenord cancelled or strike. Direct car can't fully reach Bellagio peninsula — usually drops at Varenna for the ferry." },
    totalDuration: "~6h Rome → Bellagio (door-to-door)",
    totalCost: "€141 total (Alicia solo, including Trenord + ferry)",
    tips: [
      "Sept 7 (Mon) — Alicia's solo leg while Jamie + family stay in Rome (penthouse through Thu Sept 10). Reunite in Venice on Sept 10.",
      "Early start: 06:50 train from Termini — pre-book a taxi from the Piazza Barberini penthouse for ~06:15 (10 min, ~€15; FreeNow app or have the host arrange). Termini is also a 13-min walk if you'd rather roll the bag in the quiet morning.",
      "✅ BOOKED — Frecciarossa 9608, Roma Termini 06:50 → Milano Centrale 10:00. 1st Business Area Silenzio. Carriage 2, seat 3D. PNR N36HBN. Ticket in /tickets folder.",
      "1h 10m buffer at Milano Centrale absorbs typical Freccia delays. Grab a panzerotti at Luini (5 min from platform) while you wait.",
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
    id: 3,
    from: "Lake Como — Bellagio (Alicia solo)",
    to: "Venice",
    segments: [
      { mode: "ferry", type: "Public ferry", operator: "Navigazione Lago di Como", from: "Bellagio Imbarcadero", to: "Varenna Imbarcadero", duration: "~15 min", cost: "€5 (~$5)", reservationRequired: false },
      { mode: "train", type: "Trenord regional (R/RV)", operator: "Trenord", from: "Varenna-Esino", to: "Milano Centrale", duration: "~1h 15m", cost: "€7 (~$8)", reservationRequired: false },
      { mode: "train", type: "Frecciarossa 9731 — BOOKED", operator: "Trenitalia", from: "Milano Centrale 13:45", to: "Venezia S. Lucia 16:12", duration: "2h 27m", cost: "€46.90 (Business Economy)", reservationRequired: true },
    ],
    totalDuration: "~5h 30m Bellagio → Venice (door-to-door)",
    totalCost: "€58.90 total (Alicia solo, including ferry + Trenord)",
    tips: [
      "Sept 10 (Thu) — Alicia rejoins Jamie + family in Venice. Arriving Venezia S. Lucia at 4:12 PM — plenty of time for aperitivo before dinner.",
      "✅ BOOKED — Frecciarossa 9731, Milano Centrale 13:45 → Venezia S. Lucia 16:12. 1st Business (Economy fare — non-refundable, changeable with fee). Carriage 3, seat 9D. PNR N8AMY5. Ticket in /tickets folder.",
      "Full day timeline: 10:30 AM checkout → 10:35 AM walk to Bellagio pier → ~10:50 AM ferry → 11:05 AM Varenna → 11:15 AM at Varenna-Esino station → ~11:20-11:45 AM Trenord → ~12:35-1:00 PM Milano Centrale → 13:45 Frecciarossa → 16:12 Venezia S. Lucia.",
      "45-70 min buffer at Milano Centrale — grab a panzerotti at Luini (5-min walk from platform, iconic) or lunch at Trattoria Milanese.",
      "Bellagio → Varenna ferry runs hourly+ from ~7 AM. Walk 30 seconds from Hotel Du Lac to the Imbarcadero. Buy €5 ticket at the pier, cash or card.",
      "Varenna-Esino station is a 7-min uphill walk from the ferry pier — give yourself 15 min with your bag.",
      "Trenord regional Varenna → Milano runs ~every hour. €7 turn-up-and-go ticket at the station. Not high-speed — no reservations needed.",
      "Venezia Santa Lucia is on the island (Grand Canal) — NOT Mestre (mainland). Confirmed 'S. Lucia' on the ticket ✓.",
      "Arrival → Palazzetto Madonna: exit the station to the vaporetto docks on the Grand Canal (2 min). Line 2 toward Rialto/San Marco → San Tomà (~12-15 min, faster) or Line 1 (~20 min, scenic every-stop crawl). €9.50 single — or buy a multi-day ACTV pass at the station machines; it covers the family hops + the Sept 12 ride to Piazzale Roma.",
      "🚶 Walk from San Tomà stop (150m, ~3 min, ZERO bridges): (1) off the pier, straight ahead on Calle Traghetto Vecchio · (2) LEFT at the first cross street, Calle del Campanile · (3) at the next corner turn RIGHT just BEFORE the bridge onto Fondamenta del Forner · hotel is on your right, facing the canal.",
      "Don't walk from the station with luggage — 15-20 min crossing several stepped bridges. And skip the water taxi here (€70-90): San Tomà drops you practically at the door for €9.50.",
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
    id: 4,
    from: "Rome (Jamie + family)",
    to: "Venice",
    segments: [
      { mode: "train", type: "Frecciarossa", operator: "Trenitalia / Italo", from: "Roma Termini", to: "Venezia Santa Lucia", duration: "3h 25min - 3h 45min", cost: "€30-60 (~$33-65)", reservationRequired: true },
    ],
    totalDuration: "3h 25min - 3h 45min",
    totalCost: "€30-60 (~$33-65) per person × 5 = €150-300 total",
    tips: [
      "Spectacular scenery — watch for the Apennines and Bologna approach.",
      "Book ahead for family of 5 — try to get seats together (4-seat table blocks work well).",
      "Arrive at Venezia Santa Lucia (island) NOT Mestre (mainland).",
      "Buy a multi-day Vaporetto pass immediately on arrival (€9.50/day, €35/72hrs).",
      "Water taxi from station to hotel is ~€80-120 but saves hauling luggage on vaporetti.",
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
    id: 5,
    from: "Venice (Palazzetto Madonna)",
    to: "Marco Polo Airport (VCE) — Alicia solo",
    segments: [
      { mode: "ferry", type: "Vaporetto Line 1 or 2", operator: "ACTV", from: "San Tomà stop ~09:00 (3 min from hotel, NO bridges — hotel-confirmed)", to: "Piazzale Roma ~09:15", duration: "~12–15 min (2 stops up the Grand Canal)", cost: "€9.50 (or covered by 72-hr pass)", reservationRequired: false },
      { mode: "bus", type: "ATVO Venezia Express (or ACTV Line 5)", operator: "ATVO", from: "Piazzale Roma ~09:30", to: "VCE terminal ~09:55", duration: "~20–25 min, luggage hold under the coach", cost: "€10 (~$11)", reservationRequired: false },
    ],
    alternative: { mode: "ferry", operator: "Private water taxi via hotel reception", from: "Palazzetto Madonna's own dock (the hotel has a private riva at the entrance)", to: "VCE water taxi dock", duration: "~35 min + 10-min walk to terminal", cost: "€135–170 solo (~$150–190)", note: "The splurge option — the hotel arranges it and the boat picks up AT the hotel door. Ask reception at least 24 hrs before departure. Solo it's ~7× the bus route; worth it only if you want the lagoon crossing one last time." },
    totalDuration: "~1 hr door-to-terminal (09:00 → ~09:55)",
    totalCost: "~€20 total (~$22) · water taxi alternative €135–170",
    tips: [
      "Sept 12 (Sat) — departure day, Alicia traveling to VCE solo. Aer Lingus EI423, VCE 12:15 PM → Dublin (US Preclearance) → LAX.",
      "Recommended solo route: San Tomà vaporetto → Piazzale Roma → ATVO airport coach. ~€20 all-in, ~1 hr, at the terminal by ~10:00 = 2h 15m before departure.",
      "🚶 Walk to San Tomà (150m, ~3 min, ZERO bridges — reverse of arrival): out the hotel door turn LEFT along Fondamenta del Forner · LEFT onto Calle del Campanile at the corner · RIGHT onto Calle Traghetto Vecchio · straight to the vaporetto pier.",
      "ATVO Venezia Express runs 2–3×/hour from Piazzale Roma, dedicated luggage hold, ~25 min. Buy at the ATVO kiosk/machine or atvo.it — grab the ~09:30 departure.",
      "Hotel water taxi option: the hotel has its own dock at the entrance and arranges private taxis — tell reception ≥24 hrs before departure (i.e., by Friday morning Sept 11). €135–170 solo.",
      "Shared water taxi (~€40 pp, GetYourGuide/Venice Shuttle) exists but runs on ITS schedule from set docks — for a 12:15 flight the bus route is more predictable and half the price.",
      "Alilaguna Orange (€18) is NOT recommended from this hotel — nearest stops (Rialto/San Stae) mean a 10-min+ luggage walk with bridges, then a slow ~60-75 min ride.",
      "Check-out before you leave — settle the €1,005 folio (room + city tax), cards accepted. Dublin preclearance: use the Global Entry lane, then walk straight out at LAX.",
      "🆘 Palazzetto Madonna: +39 041 3071174 · info@palazzettomadonna.com — reception handles taxi bookings and knows the morning timings cold.",
    ],
    route: {
      waypoints: [
        [[45.4360, 12.3262], [45.4386, 12.3211], [45.4385, 12.3183]],
        [[45.4385, 12.3183], [45.4680, 12.3050], [45.5048, 12.3460]],
      ],
      labels: [
        { name: "San Tomà (hotel stop)", lat: 45.4360, lng: 12.3262 },
        { name: "Piazzale Roma", lat: 45.4385, lng: 12.3183 },
        { name: "Marco Polo (VCE)", lat: 45.5048, lng: 12.3460 },
      ],
      colors: [modeColorHex.ferry, modeColorHex.bus],
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
          FCO arrival &middot; Amalfi Coast &middot; Rome &middot; Bellagio &middot; Venice &middot;{" "}
          <span className="font-medium text-olive">see each leg for booked / estimated costs</span>
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
