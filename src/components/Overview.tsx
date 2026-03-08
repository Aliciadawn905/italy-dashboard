"use client";

import Image from "next/image";
import CountdownTimer from "./CountdownTimer";
import { Flight, ItineraryDay, Restaurant, Activity, Note } from "@/lib/types";
import { Plane, Calendar, UtensilsCrossed, MapPin, StickyNote } from "lucide-react";

const destinations = [
  {
    name: "Naples",
    subtitle: "Where it begins",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80",
  },
  {
    name: "Amalfi Coast",
    subtitle: "Coastal paradise",
    image: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800&q=80",
  },
  {
    name: "Rome",
    subtitle: "The Eternal City",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
  },
  {
    name: "Tuscany",
    subtitle: "Rolling hills & wine",
    image: "https://images.unsplash.com/photo-1467803738586-46b7eb7b16a1?w=800&q=80",
  },
  {
    name: "Cinque Terre",
    subtitle: "Colorful villages",
    image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800&q=80",
  },
  {
    name: "Venice",
    subtitle: "Grand finale",
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80",
  },
];

interface OverviewProps {
  flights: Flight[];
  itinerary: ItineraryDay[];
  restaurants: Restaurant[];
  activities: Activity[];
  notes: Note[];
}

export default function Overview({
  flights,
  itinerary,
  restaurants,
  activities,
  notes,
}: OverviewProps) {
  const stats = [
    {
      icon: Plane,
      label: "Flights",
      value: flights.length,
      booked: flights.filter((f) => f.status === "booked").length,
      color: "text-navy",
      bg: "bg-navy/5",
    },
    {
      icon: Calendar,
      label: "Itinerary Days",
      value: itinerary.length,
      booked: null,
      color: "text-olive",
      bg: "bg-olive/5",
    },
    {
      icon: UtensilsCrossed,
      label: "Restaurants",
      value: restaurants.length,
      booked: null,
      color: "text-terracotta",
      bg: "bg-terracotta/5",
    },
    {
      icon: MapPin,
      label: "Activities",
      value: activities.length,
      booked: activities.filter((a) => a.booked).length,
      color: "text-gold-dark",
      bg: "bg-gold/5",
    },
    {
      icon: StickyNote,
      label: "Notes & Ideas",
      value: notes.length,
      booked: null,
      color: "text-italian-green",
      bg: "bg-italian-green/5",
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
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-gray-100 p-4 card-hover"
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
              </div>
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
                <span className="bg-terracotta/10 text-terracotta px-3 py-1 rounded-full text-sm font-medium">
                  {city}
                </span>
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
            <div
              key={dest.name}
              className="group relative rounded-2xl overflow-hidden card-hover aspect-[4/3]"
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
            </div>
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
    </div>
  );
}
