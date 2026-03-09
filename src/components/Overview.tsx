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
    subtitle: "Coastal paradise",
    image: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800&q=80",
    sites: [
      { name: "Positano", icon: Camera, desc: "Iconic pastel-colored cliffside village with pebble beaches" },
      { name: "Ravello", icon: Star, desc: "Hilltop town with stunning gardens and Villa Rufolo" },
      { name: "Path of the Gods", icon: Camera, desc: "Breathtaking coastal hiking trail between Agerola and Positano" },
      { name: "Amalfi Cathedral", icon: Church, desc: "9th-century cathedral with Arab-Norman architecture" },
      { name: "Emerald Grotto", icon: Ship, desc: "Sea cave with emerald-green water illuminated by light" },
      { name: "Limoncello Tasting", icon: Wine, desc: "Sample the famous lemon liqueur made from local Sfusato lemons" },
    ],
  },
  {
    name: "Rome",
    subtitle: "The Eternal City",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
    sites: [
      { name: "Colosseum", icon: Landmark, desc: "Iconic amphitheater and symbol of Imperial Rome" },
      { name: "Vatican Museums & Sistine Chapel", icon: Palette, desc: "Michelangelo's masterpiece ceiling and vast art collections" },
      { name: "Trevi Fountain", icon: Star, desc: "Baroque fountain — throw a coin to guarantee your return" },
      { name: "Roman Forum", icon: Landmark, desc: "Ruins of ancient government buildings in the heart of Rome" },
      { name: "Trastevere", icon: Wine, desc: "Charming neighborhood with cobblestone streets and great restaurants" },
      { name: "Pantheon", icon: Church, desc: "Best-preserved ancient Roman building with its famous dome" },
    ],
  },
  {
    name: "Tuscany",
    subtitle: "Rolling hills & wine",
    image: "https://images.unsplash.com/photo-1611264788618-39f1adb1342f?w=800&q=80",
    sites: [
      { name: "Florence Cathedral (Duomo)", icon: Church, desc: "Brunelleschi's dome — climb 463 steps for incredible views" },
      { name: "Uffizi Gallery", icon: Palette, desc: "Botticelli's Birth of Venus and Renaissance masterpieces" },
      { name: "Chianti Wine Region", icon: Wine, desc: "Rolling vineyards, wine tastings, and Tuscan farmhouse lunches" },
      { name: "Siena & Piazza del Campo", icon: Landmark, desc: "Medieval shell-shaped piazza and Gothic cathedral" },
      { name: "San Gimignano", icon: Camera, desc: "Medieval hilltop town famous for its towers and gelato" },
      { name: "Val d'Orcia", icon: Camera, desc: "UNESCO landscape of cypress-lined roads and golden fields" },
    ],
  },
  {
    name: "Cinque Terre",
    subtitle: "Colorful villages",
    image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800&q=80",
    sites: [
      { name: "Monterosso al Mare", icon: Camera, desc: "Largest village with the best beach and old town charm" },
      { name: "Vernazza Harbor", icon: Ship, desc: "Most photogenic village with a tiny harbor and castle ruins" },
      { name: "Manarola", icon: Camera, desc: "Colorful houses stacked on cliffs — stunning at sunset" },
      { name: "Sentiero Azzurro Trail", icon: Star, desc: "Coastal hiking trail connecting all five villages" },
      { name: "Corniglia", icon: Wine, desc: "Quiet hilltop village surrounded by vineyards and terraces" },
      { name: "Riomaggiore", icon: Camera, desc: "Southernmost village with dramatic cliffside setting" },
    ],
  },
  {
    name: "Venice",
    subtitle: "Grand finale",
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80",
    sites: [
      { name: "St. Mark's Basilica", icon: Church, desc: "Byzantine cathedral with golden mosaics on Piazza San Marco" },
      { name: "Grand Canal by Vaporetto", icon: Ship, desc: "Ride the water bus past palaces, bridges, and gondolas" },
      { name: "Rialto Bridge & Market", icon: Landmark, desc: "Iconic stone bridge and centuries-old fish and produce market" },
      { name: "Doge's Palace", icon: Landmark, desc: "Gothic masterpiece and seat of Venetian power for 700 years" },
      { name: "Murano & Burano Islands", icon: Palette, desc: "Murano for glass-blowing, Burano for rainbow-colored houses" },
      { name: "Gondola Ride at Sunset", icon: Star, desc: "Classic Venetian experience through quiet canals" },
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
      {/* Countdown */}
      <div className="bg-cream rounded-2xl p-6">
        <h2 className="font-serif text-lg font-semibold text-navy mb-1">
          Countdown to Italy
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Naples awaits on August 29, 2026
        </p>
        <CountdownTimer />
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
          {["Naples", "Amalfi Coast", "Rome", "Tuscany", "Cinque Terre", "Venice"].map(
            (city, i, arr) => (
              <span key={city} className="flex items-center gap-2">
                <button
                  onClick={() => onTabChange("map")}
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
