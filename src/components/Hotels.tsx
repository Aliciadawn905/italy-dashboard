"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Star,
  Lightbulb,
  Hotel,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  CalendarCheck,
  BedDouble,
  Phone,
  MapPin,
  Coffee,
  Ban,
} from "lucide-react";

interface BookingDetails {
  reservationCode: string;
  pin?: string;
  bookedBy: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  room: string;
  guests: string;
  total: string;
  prepaymentDate: string;
  refundable: boolean;
  breakfast: boolean;
  address: string;
  phone: string;
}

interface HotelEntry {
  name: string;
  stars: number;
  price: string;
  features: string;
  bestFor: string;
  recommended?: boolean;
  link?: string;
  booked?: boolean;
  booking?: BookingDetails;
}

interface CityHotels {
  city: string;
  week: string;
  vibe: string;
  tip: string;
  hotels: HotelEntry[];
}

const hotelData: CityHotels[] = [
  {
    city: "Sorrento / Amalfi Coast",
    week: "Week 1 · Days 1–3",
    vibe: "Relaxing — just the two of you",
    tip: "La Tonnarella locked in for the Sorrento stretch — clifftop Via Capo location, easy ferries to Positano, Amalfi & Capri. Already paid (non-refundable). Naples → hotel private car (Option 2, €170) confirmed for the Aug 30 IC 707 17:34 arrival.",
    hotels: [
      {
        name: "Hotel La Tonnarella (Sorrento)",
        stars: 4,
        price: "$$$$",
        features: "Clifftop boutique above Marina Grande with 270° views of the Gulf of Naples, Vietri-tiled suites, jacuzzi bathrooms, and a private beach lift. Traditional Sorrentine elegance.",
        bestFor: "Booked — 3 nights Aug 30 → Sept 2",
        recommended: true,
        booked: true,
        link: "https://www.latonnarella.com/",
        booking: {
          reservationCode: "2605312308GRWEPZFT",
          bookedBy: "Alicia Sorensen",
          checkIn: "Sun, Aug 30, 2026",
          checkOut: "Wed, Sept 2, 2026",
          nights: 3,
          room: "Suite Deluxe — sea-view terrace, jacuzzi for two",
          guests: "2 adults",
          total: "€2,271 (~$2,498)",
          prepaymentDate: "Charged May 31, 2026 via SysPay",
          refundable: false,
          breakfast: true,
          address: "Via Capo 31, 80067 Sorrento (NA), Italy",
          phone: "+39 081 878 11 53",
        },
      },
    ],
  },
  {
    city: "Amalfi Coast — Ravello",
    week: "Week 1 · Days 4–6 · Sept 2–5",
    vibe: "Relaxing — just the two of you",
    tip: "Marmorata locked in with the Junior Suite (private balcony overlooking Amalfi). Already paid in full and NON-REFUNDABLE — no flexibility once booked.",
    hotels: [
      {
        name: "Ravello Art Hotel Marmorata",
        stars: 4,
        price: "$$$$",
        features: "Restored 13th-c paper mill on the water in Marmorata hamlet (between Ravello village & Amalfi town). Private beach club, saltwater wellness pool, private dock for boat-tour pickups, fine dining at L'Antica Cartiera. Sea-view rooms across the property.",
        bestFor: "Booked — 3 nights Sept 2 → Sept 5 (Junior Suite, balcony)",
        recommended: true,
        booked: true,
        link: "https://hotelmarmorata.com/",
        booking: {
          reservationCode: "ERIC_26103059",
          pin: "d399u",
          bookedBy: "Alicia Sorensen (direct via hotel booking engine)",
          checkIn: "Wed, Sept 2, 2026",
          checkOut: "Sat, Sept 5, 2026",
          nights: 3,
          room: "Junior Suite — private balcony overlooking Amalfi, sitting area, emotional shower",
          guests: "2 adults",
          total: "€2,490 (~$2,739)",
          prepaymentDate: "Fully charged Jun 8, 2026 (auth 09933D)",
          refundable: false,
          breakfast: false,
          address: "Marmorata hamlet (between Ravello village & Amalfi town), Ravello (SA) 84010, Italy",
          phone: "+39 089 877 777",
        },
      },
    ],
  },
  {
    city: "Rome",
    week: "Week 2 · Days 8–10",
    vibe: "Sightseeing with Jamie's family",
    tip: "For a group with Jamie's family, consider an apartment in Trastevere — more space, kitchen for breakfasts, more authentic, often cheaper per person. The neighborhood itself is one of Rome's best.",
    hotels: [
      {
        name: "Trastevere Apartment (Airbnb/VRBO)",
        stars: 0,
        price: "$$$",
        features: "2-3 bedroom apartment in Rome's most charming neighborhood. Space for the whole family, kitchen, authentic living.",
        bestFor: "Best for family week — space + location + value",
        recommended: true,
      },
      {
        name: "Hotel de Russie",
        stars: 5,
        price: "$$$$",
        features: "Near Piazza del Popolo, gardens, spa. Family-friendly with plenty of space.",
        bestFor: "Luxury option that works for families",
        link: "https://www.roccofortehotels.com/hotels-and-resorts/hotel-de-russie/",
      },
      {
        name: "Hotel Locarno",
        stars: 4,
        price: "$$$",
        features: "Art Deco charm, near Piazza del Popolo, romantic courtyard",
        bestFor: "Stylish mid-range option",
        link: "https://www.hotellocarno.com/en",
      },
      {
        name: "Il Palazzetto",
        stars: 4,
        price: "$$$",
        features: "Small, elegant, rooftop views over Rome from the Spanish Steps",
        bestFor: "Great value for quality — smaller group",
        link: "https://www.hotelhasslerroma.com/il-palazzetto/",
      },
    ],
  },
  {
    city: "Lake Como (Bellagio)",
    week: "Week 2 · Days 10–13 · Alicia solo",
    vibe: "Solo escape — Alicia only",
    tip: "Alicia's solo detour while Jamie + family are in Rome. Bellagio is the central pier hub on Lake Como — every ferry route converges here, perfect for the no-car, boat-everywhere plan. Reunites with Jamie + family in Venice on Sept 10.",
    hotels: [
      {
        name: "Hotel Du Lac & SPA (Bellagio)",
        stars: 4,
        price: "$$$",
        features: "Family-run 4★ on Piazza Mazzini, directly across from the Bellagio ferry pier. Lake-view rooms, classic Italian elegance, walk-everywhere village location.",
        bestFor: "Booked — 3 nights Sept 7 → Sept 10",
        recommended: true,
        booked: true,
        link: "https://www.bellagiohoteldulac.com/",
        booking: {
          reservationCode: "5301340135",
          pin: "7004",
          bookedBy: "Alicia Sorensen (via Booking.com · hotel conf #64424)",
          checkIn: "Mon, Sept 7, 2026 · 14:00 check-in",
          checkOut: "Thu, Sept 10, 2026 · 11:00 check-out",
          nights: 3,
          room: "Standard Double Room (no lake view) — upgrade possible by contacting hotel directly",
          guests: "Booked as 2 (Alicia traveling solo)",
          total: "€960 + €18 city tax (~$1,110 + ~$20)",
          prepaymentDate: "Pay at hotel · free modify/cancel until check-in · €320/night",
          refundable: true,
          breakfast: true,
          address: "Piazza Mazzini 32, 22021 Bellagio (CO), Italy",
          phone: "+39 031 950320",
        },
      },
    ],
  },
  {
    city: "Venice",
    week: "Week 2 · Days 11–14 · Sept 10–12",
    vibe: "Grand finale with family",
    tip: "Palazzetto Madonna locked in — San Polo palazzo minutes from the Frari and the San Tomà vaporetto stop, an easy hop to Rialto and San Marco. Flexible rate: free cancellation until 3 days before arrival (Sept 7), then 1-night penalty. Pay at the hotel at checkout (card on file as guarantee only). Family rooms for Jamie's kids still to be booked.",
    hotels: [
      {
        name: "Palazzetto Madonna (San Polo)",
        stars: 4,
        price: "$$$",
        features: "Boutique palazzo hotel in the heart of San Polo, steps from the Frari basilica and the San Tomà vaporetto stop. Deluxe rooms with hardwood or marble floors, marble bathrooms, and chromotherapy showers on request.",
        bestFor: "Booked — 2 nights Sept 10 → Sept 12 (Deluxe Room)",
        recommended: true,
        booked: true,
        link: "https://www.palazzettomadonna.com/",
        booking: {
          reservationCode: "12071XBBJM0000000623",
          bookedBy: "Alicia Sorensen (direct via hotel booking engine)",
          checkIn: "Thu, Sept 10, 2026",
          checkOut: "Sat, Sept 12, 2026",
          nights: 2,
          room: "Deluxe Room — hardwood/marble floors, marble bathroom, chromotherapy shower on request",
          guests: "2 adults",
          total: "€987 + €18 city tax = €1,005 (~$1,106)",
          prepaymentDate: "Pay at hotel · free cancel until 3 days before arrival (Sept 7), then 1-night penalty · card as guarantee",
          refundable: true,
          breakfast: true,
          address: "San Polo 2902, 30125 Venice, Italy",
          phone: "+39 041 3071174",
        },
      },
    ],
  },
];

const priceColors: Record<string, string> = {
  "$$": "text-italian-green",
  "$$$": "text-olive",
  "$$$$": "text-gold-dark",
  "$$$$$": "text-terracotta",
};

const vibeColors: Record<string, string> = {
  "Relaxing — just the two of you": "bg-olive/10 text-olive",
  "Sightseeing with Jamie's family": "bg-navy/10 text-navy",
  "Grand finale with family": "bg-navy/10 text-navy",
  "Solo escape — Alicia only": "bg-terracotta/10 text-terracotta",
};

export default function Hotels() {
  const [expanded, setExpanded] = useState<string | null>("Sorrento / Amalfi Coast");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold text-navy">Hotels</h2>
        <p className="text-sm text-gray-400 mt-1">
          Relaxing retreats for Week 1 (just you two) &middot; Family-friendly for Week 2
        </p>
      </div>

      <div className="space-y-3">
        {hotelData.map((city) => {
          const isExpanded = expanded === city.city;
          return (
            <div
              key={city.city}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => setExpanded(isExpanded ? null : city.city)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-cream/50 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center shrink-0">
                  <Hotel className="w-5 h-5 text-navy" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif font-semibold text-gray-800">
                      {city.city}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${vibeColors[city.vibe] || "bg-gray-100 text-gray-600"}`}>
                      {city.vibe}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {city.week} &middot; {city.hotels.length} options
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-300" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-300" />
                )}
              </button>

              {/* Expanded */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-0 border-t border-gray-50">
                  <div className="space-y-3 mt-4">
                    {city.hotels.map((hotel) => (
                      <div
                        key={hotel.name}
                        className={`rounded-xl p-4 ${
                          hotel.booked
                            ? "bg-italian-green/5 border border-italian-green/30"
                            : hotel.recommended
                            ? "bg-olive/5 border border-olive/15"
                            : "bg-cream"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {hotel.booked ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-italian-green" />
                              ) : hotel.recommended ? (
                                <Sparkles className="w-3.5 h-3.5 text-olive" />
                              ) : null}
                              {hotel.link ? (
                                <a
                                  href={hotel.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium text-navy text-sm hover:underline inline-flex items-center gap-1"
                                >
                                  {hotel.name}
                                  <ExternalLink className="w-3 h-3 text-gray-400" />
                                </a>
                              ) : (
                                <span className="font-medium text-gray-800 text-sm">
                                  {hotel.name}
                                </span>
                              )}
                              <span
                                className={`text-xs font-medium ${
                                  priceColors[hotel.price] || "text-gray-500"
                                }`}
                              >
                                {hotel.price}
                              </span>
                              {hotel.booked && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-italian-green text-white font-medium uppercase tracking-wide">
                                  Booked
                                </span>
                              )}
                            </div>
                            {hotel.stars > 0 && (
                              <div className="flex items-center gap-0.5 mt-1">
                                {Array.from({ length: hotel.stars }).map(
                                  (_, i) => (
                                    <Star
                                      key={i}
                                      className="w-3 h-3 text-gold fill-gold"
                                    />
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {hotel.features}
                        </p>
                        <p
                          className={`text-[11px] mt-1.5 font-medium ${
                            hotel.booked
                              ? "text-italian-green"
                              : hotel.recommended
                              ? "text-olive"
                              : "text-gray-500"
                          }`}
                        >
                          {hotel.booked ? "✓ " : hotel.recommended ? "★ " : ""}
                          {hotel.bestFor}
                        </p>

                        {hotel.booked && hotel.booking && (
                          <div className="mt-3 bg-white rounded-lg border border-italian-green/20 p-3 space-y-3">
                            {/* Stay summary */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                              <div>
                                <div className="text-[10px] uppercase tracking-wide text-gray-400 flex items-center gap-1">
                                  <CalendarCheck className="w-3 h-3" /> Check-in
                                </div>
                                <div className="font-medium text-gray-800 mt-0.5 tabular-nums">
                                  {hotel.booking.checkIn}
                                </div>
                              </div>
                              <div>
                                <div className="text-[10px] uppercase tracking-wide text-gray-400 flex items-center gap-1">
                                  <CalendarCheck className="w-3 h-3" /> Check-out
                                </div>
                                <div className="font-medium text-gray-800 mt-0.5 tabular-nums">
                                  {hotel.booking.checkOut}
                                </div>
                              </div>
                              <div>
                                <div className="text-[10px] uppercase tracking-wide text-gray-400">Nights</div>
                                <div className="font-medium text-gray-800 mt-0.5 tabular-nums">
                                  {hotel.booking.nights} &middot; {hotel.booking.guests}
                                </div>
                              </div>
                              <div>
                                <div className="text-[10px] uppercase tracking-wide text-gray-400">Total</div>
                                <div className="font-semibold text-italian-green mt-0.5 tabular-nums">
                                  {hotel.booking.total}
                                </div>
                              </div>
                            </div>

                            {/* Room */}
                            <div className="flex items-start gap-2 text-xs text-gray-700 bg-cream rounded-md px-2.5 py-2">
                              <BedDouble className="w-3.5 h-3.5 text-olive mt-0.5 shrink-0" />
                              <span>{hotel.booking.room}</span>
                            </div>

                            {/* Inclusion chips */}
                            <div className="flex items-center gap-2 flex-wrap">
                              {hotel.booking.breakfast && (
                                <span className="text-[11px] px-2 py-1 rounded-full bg-gold/10 text-gold-dark font-medium flex items-center gap-1">
                                  <Coffee className="w-3 h-3" /> Breakfast included
                                </span>
                              )}
                              <span
                                className={`text-[11px] px-2 py-1 rounded-full font-medium flex items-center gap-1 ${
                                  hotel.booking.refundable
                                    ? "bg-italian-green/10 text-italian-green"
                                    : "bg-terracotta/10 text-terracotta"
                                }`}
                              >
                                <Ban className="w-3 h-3" />
                                {hotel.booking.refundable ? "Refundable" : "Non-refundable"}
                              </span>
                            </div>

                            {/* Contact */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-600">
                              <div className="flex items-start gap-1.5">
                                <MapPin className="w-3 h-3 text-navy mt-0.5 shrink-0" />
                                <span>{hotel.booking.address}</span>
                              </div>
                              <div className="flex items-start gap-1.5">
                                <Phone className="w-3 h-3 text-navy mt-0.5 shrink-0" />
                                <a
                                  href={`tel:${hotel.booking.phone.replace(/\s/g, "")}`}
                                  className="hover:underline tabular-nums"
                                >
                                  {hotel.booking.phone}
                                </a>
                              </div>
                            </div>

                            {/* Confirmation */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-cream rounded-lg p-2.5">
                              <div>
                                <span className="text-gray-400">Confirmation:</span>{" "}
                                <span className="font-medium text-gray-700 tabular-nums">
                                  {hotel.booking.reservationCode}
                                </span>
                              </div>
                              {hotel.booking.pin && (
                                <div>
                                  <span className="text-gray-400">PIN:</span>{" "}
                                  <span className="font-medium text-gray-700 tabular-nums">
                                    {hotel.booking.pin}
                                  </span>
                                </div>
                              )}
                              <div>
                                <span className="text-gray-400">Booked by:</span>{" "}
                                <span className="font-medium text-gray-700">
                                  {hotel.booking.bookedBy}
                                </span>
                              </div>
                              <div className="sm:col-span-2 text-[11px] text-gray-500">
                                {hotel.booking.prepaymentDate}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Tip */}
                  <div className="mt-4 flex items-start gap-2 text-xs text-gray-500 bg-gold/5 rounded-lg p-3 border border-gold/10">
                    <Lightbulb className="w-3.5 h-3.5 text-gold mt-0.5 shrink-0" />
                    <span>{city.tip}</span>
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
