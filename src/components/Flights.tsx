"use client";

import { useState } from "react";
import { Flight } from "@/lib/types";
import { Plus, Plane, Trash2, Sparkles, ChevronDown, ChevronUp, Star, CheckCircle2, Shield, Zap } from "lucide-react";
import AddItemModal, {
  FormField,
  inputClass,
  selectClass,
  btnPrimary,
} from "./AddItemModal";

interface BookedFlight {
  id: string;
  person: "Alicia" | "Jamie";
  direction: "outbound" | "return";
  airline: string;
  routing: string;
  date: string;
  depart: string;
  arrive: string;
  totalDuration: string;
  segments: {
    flightNumber: string;
    from: string;
    fromCode: string;
    to: string;
    toCode: string;
    departTime: string;
    arriveTime: string;
    duration: string;
    cabin: string;
  }[];
  layover?: string;
  price: string;
  bookingSite: string;
  confirmation: string;
  airlineConfirmation?: string;
  pin?: string;
  addOns: string[];
  insurance?: string;
  watchNote?: string;
}

const bookedFlights: BookedFlight[] = [
  {
    id: "alicia-outbound",
    person: "Alicia",
    direction: "outbound",
    airline: "American Airlines",
    routing: "Los Angeles (LAX) → Dallas (DFW) → Rome (FCO)",
    date: "Sat, Aug 29 → Sun, Aug 30, 2026",
    depart: "12:15 PM (Aug 29 · LAX)",
    arrive: "12:05 PM next day (Aug 30 · FCO)",
    totalDuration: "1 stop at DFW · meets Jamie for transatlantic leg",
    segments: [
      {
        flightNumber: "AA (LAX→DFW)",
        from: "Los Angeles International",
        fromCode: "LAX",
        to: "Dallas/Fort Worth",
        toCode: "DFW",
        departTime: "Sat, Aug 29 · 12:15 PM PT",
        arriveTime: "Sat, Aug 29 · ~5:15 PM CT (verify)",
        duration: "~3h",
        cabin: "Flagship · verify flight #",
      },
      {
        flightNumber: "AA 240",
        from: "Dallas/Fort Worth",
        fromCode: "DFW",
        to: "Rome Fiumicino",
        toCode: "FCO",
        departTime: "Sat, Aug 29 · 6:40 PM CT",
        arriveTime: "Sun, Aug 30 · 12:05 PM",
        duration: "~10h 25m",
        cabin: "Flagship · same flight as Jamie",
      },
    ],
    layover: "~1h 25m at Dallas (DFW) — meet up with Jamie",
    price: "$3,620 + $295 insurance",
    bookingSite: "American Airlines",
    confirmation: "LCFSID",
    addOns: ["Trip Insurance"],
    watchNote: "Together with Jamie on AA 240 DFW→FCO · watching Fri Aug 28 for Flagship price drop",
  },
  {
    id: "alicia-return",
    person: "Alicia",
    direction: "return",
    airline: "Aer Lingus",
    routing: "Venice (VCE) → Dublin (DUB) → Los Angeles (LAX)",
    date: "Sat, Sep 12, 2026",
    depart: "12:15 PM",
    arrive: "6:25 PM (same day)",
    totalDuration: "1 stop · 15h 10m",
    segments: [
      {
        flightNumber: "EI423",
        from: "Venice Marco Polo",
        fromCode: "VCE",
        to: "Dublin Airport",
        toCode: "DUB",
        departTime: "Sat, Sep 12 · 12:15 PM",
        arriveTime: "Sat, Sep 12 · 2:10 PM",
        duration: "2h 55m",
        cabin: "Economy",
      },
      {
        flightNumber: "EI69",
        from: "Dublin Airport",
        fromCode: "DUB",
        to: "Los Angeles International",
        toCode: "LAX",
        departTime: "Sat, Sep 12 · 3:25 PM",
        arriveTime: "Sat, Sep 12 · 6:25 PM",
        duration: "11h 0m",
        cabin: "Business",
      },
    ],
    layover: "1h 15m at Dublin (DUB)",
    price: "$4,027.90",
    bookingSite: "Booking.com",
    confirmation: "40-953279322",
    airlineConfirmation: "3AJHJ2",
    pin: "1651",
    addOns: ["Fast Track", "Travel Protection · $329.94"],
    watchNote:
      "Fast Track QR code arrives by EMAIL the day before flying (Sept 11) — one code per departure airport, so watch for the DUBLIN code for the DUB→LAX leg. Save to phone (or print); scan at the security fast lane. Non-transferable · offered by Gotogate with Airobot/Passnfly.",
    insurance:
      "XCover (Cover Genius) · $329.94 paid · insured: Alicia Sorensen. Covers: trip cancellation up to 100% of ticket cost · emergency medical up to $50,000 · trip interruption up to 150% of prepaid trip costs · baggage loss/theft up to $750 · flight delay 12+ hrs up to $500 (baggage, food, hotel) · 24/7 emergency assistance · includes a 1GB travel eSIM (activation email after booking). Not valid for residents of HI, KS, NY, WY. Claims via xcover.com.",
  },
  {
    id: "jamie-outbound",
    person: "Jamie",
    direction: "outbound",
    airline: "American Airlines",
    routing: "Dallas/Fort Worth (DFW) → Rome (FCO)",
    date: "Sat, Aug 29 → Sun, Aug 30, 2026",
    depart: "6:40 PM (Aug 29)",
    arrive: "12:05 PM next day (Aug 30)",
    totalDuration: "Direct · ~10h 25m overnight",
    segments: [
      {
        flightNumber: "AA 240",
        from: "Dallas/Fort Worth",
        fromCode: "DFW",
        to: "Rome Fiumicino",
        toCode: "FCO",
        departTime: "Sat, Aug 29 · 6:40 PM",
        arriveTime: "Sun, Aug 30 · 12:05 PM",
        duration: "~10h 25m",
        cabin: "Business (I) · Seat 9H",
      },
    ],
    price: "TBC",
    bookingSite: "American Airlines",
    confirmation: "TBC",
    addOns: [],
    watchNote: "Same flight as Alicia from DFW (she connects from LAX) — together for transatlantic leg",
  },
  {
    id: "jamie-return",
    person: "Jamie",
    direction: "return",
    airline: "American Airlines / British Airways",
    routing: "Venice (VCE) → London (LHR) → Dallas (DFW)",
    date: "Sat, Sep 12, 2026",
    depart: "12:30 PM",
    arrive: "TBC (verify final segment)",
    totalDuration: "1 stop · TBC",
    segments: [
      {
        flightNumber: "AA 6744",
        from: "Venice Marco Polo",
        fromCode: "VCE",
        to: "London Heathrow",
        toCode: "LHR",
        departTime: "Sat, Sep 12 · 12:30 PM",
        arriveTime: "Sat, Sep 12 · 1:55 PM",
        duration: "~2h 25m",
        cabin: "Business (J) · op. by British Airways",
      },
      {
        flightNumber: "AA 81",
        from: "London Heathrow",
        fromCode: "LHR",
        to: "Dallas/Fort Worth",
        toCode: "DFW",
        departTime: "Sat, Sep 12 · 4:25 PM",
        arriveTime: "Sat, Sep 12 · TBC (verify)",
        duration: "~10h",
        cabin: "Business",
      },
    ],
    layover: "2h 30m at London Heathrow (LHR)",
    price: "TBC",
    bookingSite: "American Airlines",
    confirmation: "TBC",
    addOns: [],
    watchNote: "Departs Venice 15 min after Alicia — share airport transport",
  },
];

interface FlightOption {
  id: string;
  label: string;
  airline: string;
  routing: string;
  details: string[];
  price: string;
  pros: string[];
  cons: string[];
  recommended?: boolean;
  person: "Alicia" | "Jamie" | "Together";
}

const flightOptions: FlightOption[] = [
  // ALICIA → LAX options
  {
    id: "alicia-1",
    label: "Alicia: Venice → Rome → LAX (ITA nonstop)",
    airline: "ITA Airways",
    routing: "Train VCE → Rome · FCO → LAX nonstop",
    details: [
      "High-speed train Venice → Rome (~3h 45m, from €50)",
      "ITA Airways FCO → LAX nonstop · ~13h 20m · A330/787",
      "7 weekly nonstop flights — most popular on this route",
      "Norse Atlantic also flies FCO → LAX nonstop (budget option)",
    ],
    price: "~$600–$1,000 Economy + ~€50 train",
    pros: [
      "Nonstop transatlantic leg — no US connection",
      "One plane from Italy to LAX",
      "Arrive LAX same calendar day",
    ],
    cons: [
      "Need to train back to Rome on departure day",
      "Earlier start to make train + flight",
      "Consider flying into Rome the night before",
    ],
    recommended: true,
    person: "Alicia",
  },
  {
    id: "alicia-2",
    label: "Alicia: Venice → Philadelphia → LAX (AA)",
    airline: "American Airlines",
    routing: "VCE → PHL (nonstop) → LAX",
    details: [
      "AA715 · VCE → PHL nonstop · ~9h 15m · Boeing 787",
      "Then PHL → LAX connection (~5h 30m)",
      "Total travel: ~16-18 hrs with layover",
    ],
    price: "~$700–$1,100 Economy one-way",
    pros: [
      "No backtracking to Rome — fly straight from Venice",
      "AA nonstop transatlantic leg",
      "AAdvantage miles/status if flying AA outbound",
    ],
    cons: [
      "PHL layover adds time vs FCO nonstop",
      "US customs in PHL before LAX leg",
    ],
    person: "Alicia",
  },
  {
    id: "alicia-3",
    label: "Alicia: Venice → Munich/Frankfurt → LAX",
    airline: "Lufthansa / United (Star Alliance)",
    routing: "VCE → MUC or FRA → LAX nonstop",
    details: [
      "Lufthansa flies VCE → MUC/FRA multiple times daily",
      "Then MUC → LAX or FRA → LAX nonstop (~11-12 hrs)",
      "Smooth connection at European hub",
      "United codeshare available",
    ],
    price: "~$700–$1,200 Economy one-way",
    pros: [
      "European hub connection — US customs at LAX",
      "Star Alliance — United miles if preferred",
      "Frequent VCE departures for flexibility",
    ],
    cons: [
      "Longer total travel time than VCE → PHL",
      "Tight connections possible at MUC/FRA",
    ],
    person: "Alicia",
  },
  // JAMIE → DFW options
  {
    id: "jamie-1",
    label: "Jamie: Venice → London → DFW (BA/AA)",
    airline: "British Airways / American",
    routing: "VCE → LHR → DFW nonstop",
    details: [
      "BA or partner flies VCE → LHR (~2h 30m) multiple times daily",
      "Then AA/BA LHR → DFW nonstop · ~10h 30m",
      "Oneworld alliance — AAdvantage eligible",
      "Total travel ~15-17 hrs with layover",
    ],
    price: "~$700–$1,100 Economy one-way",
    pros: [
      "LHR → DFW is a major AA hub route, daily nonstop",
      "No backtracking from Venice",
      "AAdvantage miles/status if flying AA outbound",
    ],
    cons: [
      "LHR connection can be tight — allow 2+ hrs",
      "Terminal change possible at LHR",
    ],
    recommended: true,
    person: "Jamie",
  },
  {
    id: "jamie-2",
    label: "Jamie: Venice → Frankfurt → DFW (Lufthansa)",
    airline: "Lufthansa / American",
    routing: "VCE → FRA → DFW nonstop",
    details: [
      "Lufthansa VCE → FRA multiple daily (~1h 30m)",
      "Then Lufthansa or AA FRA → DFW nonstop · ~11h",
      "AA operates daily FRA → DFW seasonal/year-round",
      "Star Alliance or Oneworld depending on carrier",
    ],
    price: "~$800–$1,200 Economy one-way",
    pros: [
      "Major European hub with reliable connections",
      "Nonstop transatlantic leg to DFW",
      "FRA is smoother than LHR for connections",
    ],
    cons: [
      "Mixed alliance if AA outbound",
      "Longer total travel time than LHR route",
    ],
    person: "Jamie",
  },
  {
    id: "jamie-3",
    label: "Jamie: Venice → Rome → DFW (AA via FCO)",
    airline: "American Airlines",
    routing: "Train VCE → Rome · FCO → DFW nonstop",
    details: [
      "High-speed train Venice → Rome (~3h 45m, from €50)",
      "AA FCO → DFW nonstop · ~12h · Boeing 787",
      "Seasonal daily service — check dates for Sept 12",
      "Could coordinate with Alicia to Rome together",
    ],
    price: "~$700–$1,100 Economy + ~€50 train",
    pros: [
      "Nonstop transatlantic — no European connection",
      "Travel to Rome together with Alicia",
      "AA hub at DFW — AAdvantage eligible",
    ],
    cons: [
      "Need to train back to Rome on departure day",
      "Seasonal schedule — verify flight runs Sept 12",
      "Earlier start to make train + flight",
    ],
    person: "Jamie",
  },
];

interface FlightsProps {
  flights: Flight[];
  onAdd: (flight: Omit<Flight, "id" | "created_at">) => void;
  onUpdate: (id: string, updates: Partial<Flight>) => void;
  onRemove: (id: string) => void;
}

const statusColors: Record<Flight["status"], string> = {
  not_booked: "bg-gray-100 text-gray-600",
  researching: "bg-gold/20 text-gold-dark",
  booked: "bg-italian-green/10 text-italian-green",
};

const statusLabels: Record<Flight["status"], string> = {
  not_booked: "Not Booked",
  researching: "Researching",
  booked: "Booked",
};

export default function Flights({ flights, onAdd, onUpdate, onRemove }: FlightsProps) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    person: "Alicia" as Flight["person"],
    direction: "outbound" as Flight["direction"],
    from_city: "",
    to_city: "",
    date: "",
    airline: "",
    flight_number: "",
    status: "not_booked" as Flight["status"],
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    setShowModal(false);
    setForm({
      person: "Alicia",
      direction: "outbound",
      from_city: "",
      to_city: "",
      date: "",
      airline: "",
      flight_number: "",
      status: "not_booked",
      notes: "",
    });
  };

  const isInBooked = (f: Flight) =>
    bookedFlights.some(
      (bf) => bf.person === f.person && bf.direction === f.direction
    );
  const outbound = flights.filter((f) => f.direction === "outbound" && !isInBooked(f));
  const returnFlights = flights.filter((f) => f.direction === "return" && !isInBooked(f));

  const FlightCard = ({ flight }: { flight: Flight }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-5 card-hover">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-navy/5 flex items-center justify-center">
            <Plane className="w-4 h-4 text-navy" />
          </div>
          <div>
            <span className="font-medium text-gray-800">{flight.person}</span>
            <span
              className={`ml-2 text-xs px-2 py-0.5 rounded-full ${statusColors[flight.status]}`}
            >
              {statusLabels[flight.status]}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <select
            value={flight.status}
            onChange={(e) =>
              onUpdate(flight.id, { status: e.target.value as Flight["status"] })
            }
            className="text-xs border border-gray-200 rounded-md px-1.5 py-1 bg-white"
          >
            <option value="not_booked">Not Booked</option>
            <option value="researching">Researching</option>
            <option value="booked">Booked</option>
          </select>
          <button
            onClick={() => onRemove(flight.id)}
            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm mb-2">
        <span className="font-medium text-gray-700">{flight.from_city || "—"}</span>
        <span className="text-gray-300">&rarr;</span>
        <span className="font-medium text-gray-700">{flight.to_city || "—"}</span>
      </div>
      {(flight.date || flight.airline || flight.flight_number) && (
        <div className="text-xs text-gray-400 space-y-0.5">
          {flight.date && <div>{flight.date}</div>}
          {flight.airline && (
            <div>
              {flight.airline}
              {flight.flight_number && ` · ${flight.flight_number}`}
            </div>
          )}
        </div>
      )}
      {flight.notes && (
        <div className="mt-2 text-xs text-gray-400 bg-cream rounded-lg p-2">
          {flight.notes}
        </div>
      )}
    </div>
  );

  const [showResearch, setShowResearch] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold text-navy">Flights</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-terracotta text-white rounded-lg text-sm font-medium hover:bg-terracotta-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Flight
        </button>
      </div>

      {/* Trip dates banner */}
      <div className="bg-italian-green/5 border border-italian-green/15 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-sm font-medium text-italian-green">All flights booked &middot; Aug 29 → Sept 12, 2026</div>
          <div className="text-xs text-gray-500 mt-0.5">
            Together on AA 240 DFW→FCO &middot; arrive Aug 30 at 12:05 PM &middot; Both depart VCE Sept 12 within 15 min
          </div>
        </div>
        <div className="text-xs text-italian-green font-medium">4 of 4 flights confirmed</div>
      </div>

      {/* Booked Flights */}
      {bookedFlights.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-italian-green" />
            Confirmed Bookings
          </h3>
          <div className="space-y-3">
            {bookedFlights.map((bf) => (
              <div
                key={bf.id}
                className="rounded-xl border border-italian-green/30 bg-italian-green/5 p-5"
              >
                <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-italian-green/10 flex items-center justify-center shrink-0">
                      <Plane className="w-5 h-5 text-italian-green" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-800">
                          {bf.person} &middot; {bf.direction === "return" ? "Return Flight" : "Outbound Flight"}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-italian-green text-white font-medium uppercase tracking-wide">
                          Booked
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {bf.airline} &middot; {bf.routing}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {bf.date} &middot; {bf.totalDuration}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold text-italian-green tabular-nums">
                      {bf.price}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      via {bf.bookingSite}
                    </div>
                  </div>
                </div>

                {/* Segments */}
                <div className="bg-white rounded-lg p-3 mb-3 space-y-3">
                  {bf.segments.map((seg, idx) => (
                    <div key={idx}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                            <span className="tabular-nums">{seg.fromCode}</span>
                            <span className="text-gray-300">&rarr;</span>
                            <span className="tabular-nums">{seg.toCode}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy/5 text-navy font-medium">
                              {seg.cabin}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {seg.from} &rarr; {seg.to}
                          </div>
                          <div className="text-xs text-gray-400 mt-1 tabular-nums">
                            {seg.departTime} &rarr; {seg.arriveTime}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-medium text-gray-700">{seg.flightNumber}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5 tabular-nums">{seg.duration}</div>
                        </div>
                      </div>
                      {idx < bf.segments.length - 1 && bf.layover && (
                        <div className="ml-1 mt-2 pl-3 border-l-2 border-dashed border-gray-200 text-[11px] text-gray-400 py-1">
                          Layover &middot; {bf.layover}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Watch note */}
                {bf.watchNote && (
                  <div className="text-[11px] text-gold-dark bg-gold/10 border border-gold/15 rounded-lg px-2.5 py-1.5 mb-3">
                    <span className="font-medium">Watching: </span>{bf.watchNote}
                  </div>
                )}

                {/* Add-ons */}
                {bf.addOns.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {bf.addOns.map((addOn) => {
                      const Icon = addOn === "Fast Track" ? Zap : Shield;
                      return (
                        <span
                          key={addOn}
                          className="text-[11px] px-2 py-1 rounded-full bg-gold/10 text-gold-dark font-medium flex items-center gap-1"
                        >
                          <Icon className="w-3 h-3" />
                          {addOn}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Insurance details */}
                {bf.insurance && (
                  <div className="text-[11px] text-gray-500 bg-white border border-gray-100 rounded-lg px-2.5 py-2 mb-3 flex items-start gap-1.5">
                    <Shield className="w-3 h-3 text-gold-dark mt-0.5 shrink-0" />
                    <span>{bf.insurance}</span>
                  </div>
                )}

                {/* Confirmation */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-cream rounded-lg p-2.5">
                  <div>
                    <span className="text-gray-400">Confirmation:</span>{" "}
                    <span className="font-medium text-gray-700 tabular-nums">{bf.confirmation}</span>
                  </div>
                  {bf.airlineConfirmation && (
                    <div>
                      <span className="text-gray-400">Airline conf:</span>{" "}
                      <span className="font-medium text-gray-700 tabular-nums">{bf.airlineConfirmation}</span>
                    </div>
                  )}
                  {bf.pin && (
                    <div>
                      <span className="text-gray-400">PIN:</span>{" "}
                      <span className="font-medium text-gray-700 tabular-nums">{bf.pin}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flight Research / Options */}
      <div>
        <button
          onClick={() => setShowResearch(!showResearch)}
          className="flex items-center gap-2 mb-3 cursor-pointer"
        >
          {showResearch ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            Original Research Notes &middot; Archive (all flights now booked)
          </h3>
        </button>

        {showResearch && (
          <div className="space-y-3">
            {flightOptions.filter((opt) => opt.person === "Jamie").map((opt) => (
              <div
                key={opt.id}
                className={`rounded-xl border p-4 ${
                  opt.recommended
                    ? "bg-olive/5 border-olive/20"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {opt.recommended && <Star className="w-3.5 h-3.5 text-olive fill-olive" />}
                      <span className="font-medium text-gray-800 text-sm">
                        {opt.label}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-navy/10 text-navy font-medium">
                        {opt.person}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{opt.airline}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-medium text-italian-green">{opt.price}</div>
                  </div>
                </div>

                <div className="text-xs text-gray-600 bg-cream rounded-lg p-2.5 mb-2">
                  <div className="font-medium text-gray-700 mb-1">{opt.routing}</div>
                  {opt.details.map((d, i) => (
                    <div key={i} className="text-gray-500 mt-0.5">{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="font-medium text-italian-green">Pros:</span>
                    {opt.pros.map((p, i) => (
                      <div key={i} className="text-gray-500 mt-0.5">+ {p}</div>
                    ))}
                  </div>
                  <div>
                    <span className="font-medium text-italian-red">Cons:</span>
                    {opt.cons.map((c, i) => (
                      <div key={i} className="text-gray-500 mt-0.5">- {c}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-gold/5 border border-gold/10 rounded-lg p-3 text-xs text-gray-500">
              <span className="font-medium text-gold-dark">Note:</span> All flights are now booked &mdash; Jamie chose the LHR routing (AA 6744 + AA 81). These options remain as historical research.
            </div>
          </div>
        )}
      </div>

      {/* Outbound */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
          Outbound &middot; Other Tracking
        </h3>
        {outbound.length === 0 ? (
          <div className="text-sm text-gray-400 bg-cream rounded-xl p-4 text-center">
            All booked outbound flights are shown above
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {outbound.map((f) => (
              <FlightCard key={f.id} flight={f} />
            ))}
          </div>
        )}
      </div>

      {/* Return */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
          Return &middot; Other Tracking
        </h3>
        {returnFlights.length === 0 ? (
          <div className="text-sm text-gray-400 bg-cream rounded-xl p-4 text-center">
            All booked return flights are shown above
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {returnFlights.map((f) => (
              <FlightCard key={f.id} flight={f} />
            ))}
          </div>
        )}
      </div>

      {/* Add Flight Modal */}
      <AddItemModal
        title="Add Flight"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Person">
              <select
                className={selectClass}
                value={form.person}
                onChange={(e) =>
                  setForm({ ...form, person: e.target.value as Flight["person"] })
                }
              >
                <option value="Alicia">Alicia</option>
                <option value="Jamie">Jamie</option>
              </select>
            </FormField>
            <FormField label="Direction">
              <select
                className={selectClass}
                value={form.direction}
                onChange={(e) =>
                  setForm({
                    ...form,
                    direction: e.target.value as Flight["direction"],
                  })
                }
              >
                <option value="outbound">Outbound</option>
                <option value="return">Return</option>
              </select>
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="From">
              <input
                className={inputClass}
                placeholder="LAX"
                value={form.from_city}
                onChange={(e) => setForm({ ...form, from_city: e.target.value })}
              />
            </FormField>
            <FormField label="To">
              <input
                className={inputClass}
                placeholder="Naples"
                value={form.to_city}
                onChange={(e) => setForm({ ...form, to_city: e.target.value })}
              />
            </FormField>
          </div>
          <FormField label="Date">
            <input
              type="date"
              className={inputClass}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Airline">
              <input
                className={inputClass}
                placeholder="e.g., Delta"
                value={form.airline}
                onChange={(e) => setForm({ ...form, airline: e.target.value })}
              />
            </FormField>
            <FormField label="Flight #">
              <input
                className={inputClass}
                placeholder="e.g., DL1234"
                value={form.flight_number}
                onChange={(e) => setForm({ ...form, flight_number: e.target.value })}
              />
            </FormField>
          </div>
          <FormField label="Notes">
            <textarea
              className={inputClass}
              rows={2}
              placeholder="Price, layover info, etc."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </FormField>
          <button type="submit" className={btnPrimary}>
            Add Flight
          </button>
        </form>
      </AddItemModal>
    </div>
  );
}
