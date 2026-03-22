"use client";

import { useState } from "react";
import Image from "next/image";
import CountdownTimer from "./CountdownTimer";
import { Flight, ItineraryDay, Restaurant, Activity, Note, TabId } from "@/lib/types";
import { Plane, Calendar, UtensilsCrossed, MapPin, StickyNote, X, Star, Camera, Church, Landmark, Wine, Ship, Palette } from "lucide-react";

const destinations = [
  {
    name: "Naples",
    subtitle: "Where it begins",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80",
    sites: [
      { name: "Pompeii", icon: Landmark, desc: "Ancient Roman city preserved by volcanic ash from Mt. Vesuvius" },
      { name: "Spaccanapoli", icon: Church, desc: "Historic street cutting through the old city center" },
      { name: "Naples National Archaeological Museum", icon: Landmark, desc: "World-class collection of Roman artifacts" },
      { name: "Castel dell'Ovo", icon: Landmark, desc: "Seaside castle on the waterfront with panoramic views" },
      { name: "Pizza at Da Michele", icon: Star, desc: "Legendary birthplace of Margherita pizza since 1870" },
      { name: "Mount Vesuvius", icon: Camera, desc: "Hike the famous volcano overlooking the Bay of Naples" },
    ],
  },
  {
    name: "Amalfi Coast",
    subtitle: "Coastal paradise · Days 1–3",
    image: "https://images.unsplash.com/photo-1768322264453-ff345b170a52?w=800&q=80",
    sites: [
      { name: "Positano Village", icon: Camera, desc: "Iconic pastel-colored cliffside village — best photos early morning or evening" },
      { name: "Villa Rufolo, Ravello", icon: Star, desc: "Stunning gardens with panoramic sea views. €8 entry, daily 9am–4:30pm" },
      { name: "Valle dei Mulini Hike", icon: Camera, desc: "1km trail to waterfalls through ruins of old paper mills — wear good shoes" },
      { name: "Amalfi Cathedral", icon: Church, desc: "Arab-Norman architecture reflecting Amalfi's medieval trading history" },
      { name: "Boat Tour", icon: Ship, desc: "Morning is best (calmer seas). €40–120/person. Private gives flexibility for caves and beaches" },
      { name: "Limoncello Tasting", icon: Wine, desc: "Buy direct from local producers along SS163 coastal road — free to €5" },
    ],
  },
  {
    name: "Tuscany / Chianti",
    subtitle: "Rolling hills & wine · Days 4–5",
    image: "https://images.unsplash.com/photo-1611264788618-39f1adb1342f?w=800&q=80",
    sites: [
      { name: "Tenuta Casanova", icon: Wine, desc: "5-star family-run estate — balsamic, olive oil + wine tasting. €35–60, book 1–2 weeks ahead" },
      { name: "Antinori nel Chianti Classico", icon: Wine, desc: "Stunning architecture — vineyard grows over the roof. €25–55, weekday mornings best" },
      { name: "Piazza del Campo, Siena", icon: Landmark, desc: "Medieval shell-shaped piazza — most atmospheric in the evening" },
      { name: "San Gimignano", icon: Camera, desc: "Medieval towers and award-winning gelato. Go morning before day-trippers arrive" },
      { name: "Chiantigiana Road (SR222)", icon: Camera, desc: "One of Italy's most scenic drives — stop at roadside cantinas for tastings" },
    ],
  },
  {
    name: "Florence",
    subtitle: "Renaissance masterpieces · Days 6–7",
    image: "https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?w=800&q=80",
    sites: [
      { name: "Uffizi Galleries", icon: Palette, desc: "Botticelli's Birth of Venus. €20, book 2–4 weeks ahead. Closed Mondays. Allow 3+ hrs" },
      { name: "Duomo + Dome Climb", icon: Church, desc: "Brunelleschi's dome — 463 steps, incredible views. €20 combined pass. Book dome slot in advance" },
      { name: "Accademia Gallery", icon: Palette, desc: "Michelangelo's David — more impressive in person than any photo. €16, book ahead" },
      { name: "Ponte Vecchio", icon: Landmark, desc: "Iconic bridge — dawn for empty photos, sunset for golden light" },
      { name: "Piazzale Michelangelo", icon: Camera, desc: "Panoramic sunset viewpoint — bring wine and snacks, everyone does" },
    ],
  },
  {
    name: "Rome",
    subtitle: "The Eternal City · Days 8–10",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
    sites: [
      { name: "Colosseum + Forum + Palatine Hill", icon: Landmark, desc: "€18 combo ticket. Book skip-the-line. 8:30am opening to beat crowds" },
      { name: "Vatican Museums + Sistine Chapel", icon: Palette, desc: "€20. Get 8am slot — go straight to Sistine Chapel first. Gallery of Maps is a highlight" },
      { name: "St. Peter's Basilica", icon: Church, desc: "Free entry, €8 dome climb. Arrive before 9am. Michelangelo's Pietà is to the right" },
      { name: "Trevi Fountain", icon: Star, desc: "Go 6–7am (nearly deserted) or 10pm (beautiful lighting). Two coins = return + love" },
      { name: "Pantheon", icon: Church, desc: "€5. Engineering marvel — when it rains, the floor drains perfectly through the oculus" },
      { name: "Trastevere", icon: Wine, desc: "Most charming neighborhood for dinner — cobblestone streets, ivy-covered buildings" },
    ],
  },
  {
    name: "Venice",
    subtitle: "Grand finale · Days 11–14",
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80",
    sites: [
      { name: "Grand Canal Vaporetto Ride", icon: Ship, desc: "Line 1 orientation ride — sit front or back. 45 min each way. Buy multi-day pass" },
      { name: "St. Mark's Basilica + Piazza", icon: Church, desc: "Free basilica, free online reservation. Before 9am or after 5pm for fewer crowds" },
      { name: "Doge's Palace", icon: Landmark, desc: "€25. 'Secret Itineraries' tour accesses rooms not open to general public" },
      { name: "Rialto Bridge + Market", icon: Landmark, desc: "Bridge at sunrise for photos. Market 7–11am for fresh lagoon seafood and produce" },
      { name: "Gondola Ride", icon: Star, desc: "€80–90 for 30 min. Official stands have fixed pricing. Late afternoon golden hour is perfect" },
      { name: "Murano Island", icon: Palette, desc: "Free glass-blowing demonstrations. Vaporetto covered by pass. Great for all ages" },
    ],
  },
];

interface OverviewProps {
  flights: Flight[];
  itinerary: ItineraryDay[];
  restaurants: Restaurant[];
  activities: Activity[];
  notes: Note[];
  onTabChange: (tab: TabId) => void;
}

export default function Overview({
  flights,
  itinerary,
  restaurants,
  activities,
  notes,
  onTabChange,
}: OverviewProps) {
  const [selectedDest, setSelectedDest] = useState<typeof destinations[number] | null>(null);
  const stats = [
    {
      icon: Plane,
      label: "Flights",
      value: flights.length,
      booked: flights.filter((f) => f.status === "booked").length,
      color: "text-navy",
      bg: "bg-navy/5",
      tab: "flights" as TabId,
    },
    {
      icon: Calendar,
      label: "Itinerary Days",
      value: itinerary.length,
      booked: null,
      color: "text-olive",
      bg: "bg-olive/5",
      tab: "itinerary" as TabId,
    },
    {
      icon: UtensilsCrossed,
      label: "Restaurants",
      value: restaurants.length,
      booked: null,
      color: "text-terracotta",
      bg: "bg-terracotta/5",
      tab: "restaurants" as TabId,
    },
    {
      icon: MapPin,
      label: "Activities",
      value: activities.length,
      booked: activities.filter((a) => a.booked).length,
      color: "text-gold-dark",
      bg: "bg-gold/5",
      tab: "activities" as TabId,
    },
    {
      icon: StickyNote,
      label: "Notes & Ideas",
      value: notes.length,
      booked: null,
      color: "text-italian-green",
      bg: "bg-italian-green/5",
      tab: "notes" as TabId,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Banner with Countdown */}
      <div className="relative rounded-2xl overflow-hidden h-[260px] sm:h-[280px]">
        <Image
          src="https://images.unsplash.com/photo-1746129252998-0a46bfe63551?w=1400&q=80"
          alt="Positano coastline"
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/50 to-navy/20" />
        <div className="relative h-full flex flex-col justify-center px-6 sm:px-10 max-w-md">
          <p className="text-terracotta-light text-xs font-medium uppercase tracking-widest mb-1">
            Aug 29 &ndash; Sept 12, 2026
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight mb-1">
            50th Birthday Italian Adventure
          </h2>
          <p className="text-white/60 text-sm mb-5">
            Naples awaits in&hellip;
          </p>
          <CountdownTimer variant="overlay" />
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <h3 className="font-serif text-lg font-semibold text-navy mb-3">
          Planning Progress
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <button
                key={stat.label}
                onClick={() => onTabChange(stat.tab)}
                className="bg-white rounded-xl border border-gray-100 p-4 card-hover text-left cursor-pointer"
              >
                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="font-serif text-2xl font-bold text-gray-800 tabular-nums">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-400">{stat.label}</div>
                {stat.booked !== null && stat.value > 0 && (
                  <div className="text-[11px] text-italian-green mt-1">
                    {stat.booked} booked
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trip Route */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-serif text-lg font-semibold text-navy mb-4">
          Trip Route
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {["Naples", "Amalfi Coast", "Tuscany / Chianti", "Florence", "Rome", "Venice"].map(
            (city, i, arr) => (
              <span key={city} className="flex items-center gap-2">
                <button
                  onClick={() => onTabChange("destinations")}
                  className="bg-terracotta/10 text-terracotta px-3 py-1 rounded-full text-sm font-medium hover:bg-terracotta/20 transition-colors cursor-pointer"
                >
                  {city}
                </button>
                {i < arr.length - 1 && (
                  <span className="text-gray-300">&rarr;</span>
                )}
              </span>
            )
          )}
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-cream rounded-lg p-3">
            <div className="text-xs font-medium text-olive mb-1">Week 1 &middot; Days 1–7</div>
            <p className="text-xs text-gray-600">
              Amalfi Coast &rarr; Tuscany/Chianti &rarr; Florence
            </p>
          </div>
          <div className="bg-cream rounded-lg p-3">
            <div className="text-xs font-medium text-olive mb-1">Week 2 &middot; Days 8–14</div>
            <p className="text-xs text-gray-600">
              Rome &rarr; Venice &rarr; Departure
            </p>
          </div>
        </div>
      </div>

      {/* Destinations Gallery */}
      <div>
        <h3 className="font-serif text-lg font-semibold text-navy mb-4">
          Our Destinations
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {destinations.map((dest) => (
            <button
              key={dest.name}
              onClick={() => setSelectedDest(dest)}
              className="group relative rounded-2xl overflow-hidden card-hover aspect-[4/3] text-left cursor-pointer"
            >
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="font-serif text-lg font-semibold text-white leading-tight">
                  {dest.name}
                </h4>
                <p className="text-white/70 text-xs mt-0.5">{dest.subtitle}</p>
              </div>
              <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-[10px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {dest.sites.length} sites
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Key Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h4 className="font-medium text-gray-700 mb-2">Alicia</h4>
          <p className="text-sm text-gray-400">Departing from LAX</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h4 className="font-medium text-gray-700 mb-2">Jamie</h4>
          <p className="text-sm text-gray-400">Departing from DFW</p>
        </div>
      </div>

      {/* Destination Detail Modal */}
      {selectedDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedDest(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-hidden">
            {/* Header image */}
            <div className="relative h-48">
              <Image
                src={selectedDest.image}
                alt={selectedDest.name}
                fill
                sizes="500px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <button
                onClick={() => setSelectedDest(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <div className="absolute bottom-4 left-5 right-5">
                <h2 className="font-serif text-2xl font-bold text-white">
                  {selectedDest.name}
                </h2>
                <p className="text-white/70 text-sm">{selectedDest.subtitle}</p>
              </div>
            </div>

            {/* Sites list */}
            <div className="p-5 overflow-y-auto max-h-[calc(85vh-12rem)]">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Must-See Sites
              </h3>
              <div className="space-y-3">
                {selectedDest.sites.map((site) => {
                  const Icon = site.icon;
                  return (
                    <div
                      key={site.name}
                      className="flex items-start gap-3 p-3 rounded-xl bg-cream hover:bg-terracotta/5 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-terracotta/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-terracotta" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 text-sm">
                          {site.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                          {site.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
