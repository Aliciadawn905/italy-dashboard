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
    tip: "Sorrento is the classic base for the Amalfi Coast — easy ferries to Positano, Amalfi & Capri, and a calmer atmosphere than the cliffside towns. Ravello & Positano below remain as alternatives.",
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
      {
        name: "Hotel Caruso (Ravello)",
        stars: 5,
        price: "$$$$",
        features: "Infinity pool overlooking the sea, peaceful hilltop setting, Belmond luxury. The most relaxing hotel on the coast.",
        bestFor: "Ultimate relaxation — our top pick for Week 1 vibe",
        recommended: true,
        link: "https://www.belmond.com/hotels/europe/italy/amalfi-coast/belmond-hotel-caruso/",
      },
      {
        name: "Villa Cimbrone (Ravello)",
        stars: 5,
        price: "$$$$",
        features: "Historic gardens, refined rooms, Terrace of Infinity with panoramic views. Quiet and serene.",
        bestFor: "Peaceful luxury with world-famous gardens",
        recommended: true,
        link: "https://www.hotelvillacimbrone.com/",
      },
      {
        name: "Palazzo Murat (Positano)",
        stars: 4,
        price: "$$$",
        features: "Beautiful courtyard with lemon trees, in the heart of Positano but feels tucked away. Romantic.",
        bestFor: "Great value + central Positano location",
        link: "https://palazzomurat.it/en",
      },
      {
        name: "Hotel Villa Franca (Positano)",
        stars: 4,
        price: "$$$",
        features: "Rooftop pool, excellent views, spa treatments available",
        bestFor: "Pool + views without the 5-star price",
        link: "https://www.villafrancahotel.it/en/index.php",
      },
      {
        name: "Il San Pietro di Positano",
        stars: 5,
        price: "$$$$",
        features: "Carved into cliffs, private beach, Michelin restaurant. Absolute top tier.",
        bestFor: "Once-in-a-lifetime splurge for the birthday trip",
        link: "https://www.ilsanpietro.com/",
      },
    ],
  },
  {
    city: "Tuscany / Chianti",
    week: "Week 1 · Days 4–5",
    vibe: "Relaxing — wine country retreat",
    tip: "An agriturismo (farm stay) is the most relaxing and authentic Tuscan experience. You wake up surrounded by vineyards and olive groves. Search agriturismo.it for options.",
    hotels: [
      {
        name: "Borgo San Felice (Castelnuovo Berardenga)",
        stars: 5,
        price: "$$$$",
        features: "Medieval village converted to luxury resort. Vineyard views, pool, total tranquility. Feels like your own private hamlet.",
        bestFor: "Most relaxing option — our top pick",
        recommended: true,
        link: "https://www.borgosanfelice.com/en/index",
      },
      {
        name: "Podere Felceto (Greve in Chianti)",
        stars: 3,
        price: "$$",
        features: "Authentic agriturismo — rustic charm, farm-to-table breakfast, surrounded by vines and olive trees",
        bestFor: "Best value + most authentic Tuscan experience",
        recommended: true,
        link: "https://www.poderefelceto.com/en/",
      },
      {
        name: "Castello di Casole (Casole d'Elsa)",
        stars: 5,
        price: "$$$$",
        features: "1,000-acre estate with spa, extraordinary Tuscan landscape. Complete escape.",
        bestFor: "Grand estate spa retreat",
        link: "https://www.belmond.com/hotels/europe/italy/tuscany/belmond-castello-di-casole/",
      },
      {
        name: "Tenuta di Ricavo (Castellina in Chianti)",
        stars: 4,
        price: "$$$",
        features: "Intimate hamlet hotel with pool, excellent wine list, peaceful setting",
        bestFor: "Wine lovers in a quiet setting",
        link: "https://www.ricavo.com/",
      },
    ],
  },
  {
    city: "Florence",
    week: "Week 1 · Days 6–7",
    vibe: "Relaxing base for art & culture",
    tip: "Stay in Oltrarno (south of Arno) — it's quieter, more authentic, and walkable to everything. You'll have already relaxed for 5 days, so this is a gentle transition into sightseeing.",
    hotels: [
      {
        name: "Soprarno Suites (Oltrarno)",
        stars: 3,
        price: "$$$",
        features: "Boutique, artsy, in the heart of Oltrarno. Feels like a local apartment, not a tourist hotel. Quiet streets.",
        bestFor: "Authentic local experience — our top pick for Florence",
        recommended: true,
        link: "https://www.soprarnosuites.com/",
      },
      {
        name: "Portrait Firenze",
        stars: 5,
        price: "$$$$",
        features: "Lungarno Collection, views over Arno from Ponte Vecchio. Intimate suites, rooftop terrace.",
        bestFor: "Luxury with river views",
        link: "https://www.lungarnocollection.com/portrait-firenze/",
      },
      {
        name: "Hotel Lungarno",
        stars: 5,
        price: "$$$$",
        features: "Facing the Arno, Ferragamo family-owned, excellent breakfast with a view",
        bestFor: "Classic Florentine luxury",
        link: "https://www.lungarnocollection.com/hotel-lungarno/",
      },
      {
        name: "Hotel Davanzati",
        stars: 3,
        price: "$$",
        features: "Central, well-run, friendly staff. Simple but comfortable.",
        bestFor: "Good value in a central location",
        link: "https://www.hoteldavanzati.it/",
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
          bookedBy: "Alicia Sorensen (via Booking.com)",
          checkIn: "Mon, Sept 7, 2026",
          checkOut: "Thu, Sept 10, 2026",
          nights: 3,
          room: "Standard Double Room",
          guests: "1 adult (solo)",
          total: "€960 (~$1,110)",
          prepaymentDate: "Pay at hotel · free modify/cancel until check-in",
          refundable: true,
          breakfast: false,
          address: "Piazza Mazzini 32, 22021 Bellagio (CO), Italy",
          phone: "+39 031 950320",
        },
      },
    ],
  },
  {
    city: "Venice",
    week: "Week 2 · Days 11–14",
    vibe: "Grand finale with family",
    tip: "Cannaregio is the best neighborhood for families — authentic, less touristy, great cicchetti bars, and well-connected by vaporetto. Dorsoduro is another great option.",
    hotels: [
      {
        name: "Ca' Sagredo Hotel (Cannaregio)",
        stars: 5,
        price: "$$$$",
        features: "Grand Canal views, stunning frescoed rooms, extraordinary architecture. In the authentic Cannaregio neighborhood.",
        bestFor: "Best location for family week — our top pick",
        recommended: true,
        link: "https://www.casagredohotel.com/",
      },
      {
        name: "Palazzetto Pisani",
        stars: 4,
        price: "$$$$",
        features: "Grand Canal views, historic palazzo, excellent service",
        bestFor: "Grand Canal views at a slightly lower price",
        link: "https://www.palazzettopisani.com/",
      },
      {
        name: "Hotel Danieli",
        stars: 5,
        price: "$$$$",
        features: "Iconic Gothic palazzo near Piazza San Marco. Reopening Aug 2026 as Four Seasons Venice.",
        bestFor: "Birthday splurge — most iconic hotel in Venice",
        link: "https://www.fourseasons.com/venice/",
      },
      {
        name: "Aman Venice",
        stars: 5,
        price: "$$$$$",
        features: "16th-century palazzo with only 24 rooms. The most extraordinary hotel in Venice.",
        bestFor: "Once-in-a-lifetime — if budget allows",
        link: "https://www.aman.com/hotels/aman-venice",
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
  "Relaxing — wine country retreat": "bg-olive/10 text-olive",
  "Relaxing base for art & culture": "bg-olive/10 text-olive",
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
