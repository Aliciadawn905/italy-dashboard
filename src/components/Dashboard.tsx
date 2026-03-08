"use client";

import { useState } from "react";
import { TabId, Flight, ItineraryDay, Restaurant, Activity, Note } from "@/lib/types";
import { useSupabaseTable } from "@/hooks/useSupabase";
import Header from "@/components/Header";
import TabNav from "@/components/TabNav";
import Overview from "@/components/Overview";
import Flights from "@/components/Flights";
import Itinerary from "@/components/Itinerary";
import Restaurants from "@/components/Restaurants";
import Activities from "@/components/Activities";
import Notes from "@/components/Notes";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const flights = useSupabaseTable<Flight>("flights");
  const itinerary = useSupabaseTable<ItineraryDay>("itinerary");
  const restaurants = useSupabaseTable<Restaurant>("restaurants");
  const activities = useSupabaseTable<Activity>("activities");
  const notes = useSupabaseTable<Note>("notes");

  const isLoading =
    flights.loading ||
    itinerary.loading ||
    restaurants.loading ||
    activities.loading ||
    notes.loading;

  return (
    <div className="min-h-screen bg-warm-gray">
      <Header />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      {!isSupabaseConfigured() && (
        <div className="max-w-6xl mx-auto px-4 mt-4">
          <div className="bg-gold/10 border border-gold/30 rounded-lg px-4 py-3 text-sm text-gold-dark">
            Running in offline mode — data is saved to your browser.
            Connect Supabase for real-time sync between devices.
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <Overview
                flights={flights.data}
                itinerary={itinerary.data}
                restaurants={restaurants.data}
                activities={activities.data}
                notes={notes.data}
              />
            )}
            {activeTab === "flights" && (
              <Flights
                flights={flights.data}
                onAdd={flights.insert}
                onUpdate={flights.update}
                onRemove={flights.remove}
              />
            )}
            {activeTab === "itinerary" && (
              <Itinerary
                days={itinerary.data}
                onAdd={itinerary.insert}
                onUpdate={itinerary.update}
                onRemove={itinerary.remove}
              />
            )}
            {activeTab === "restaurants" && (
              <Restaurants
                restaurants={restaurants.data}
                onAdd={restaurants.insert}
                onUpdate={restaurants.update}
                onRemove={restaurants.remove}
              />
            )}
            {activeTab === "activities" && (
              <Activities
                activities={activities.data}
                onAdd={activities.insert}
                onUpdate={activities.update}
                onRemove={activities.remove}
              />
            )}
            {activeTab === "notes" && (
              <Notes
                notes={notes.data}
                onAdd={notes.insert}
                onUpdate={notes.update}
                onRemove={notes.remove}
              />
            )}
          </>
        )}
      </main>

      <footer className="border-t border-gray-100 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center">
          <p className="text-xs text-gray-400">
            Alicia & Jamie&apos;s 50th Birthday Italian Adventure &middot; Aug 29 – Sept 12, 2026
          </p>
        </div>
        <div className="italy-stripe" />
      </footer>
    </div>
  );
}
