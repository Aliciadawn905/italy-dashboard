"use client";

import { useState } from "react";
import { ItineraryDay } from "@/lib/types";
import {
  Plus,
  MapPin,
  Trash2,
  Home,
  Sun,
  Sunset,
  Moon,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import AddItemModal, {
  FormField,
  inputClass,
  btnPrimary,
} from "./AddItemModal";

interface SuggestedDay {
  day: number;
  city: string;
  who: string;
  morning: string;
  afternoon: string;
  evening: string;
}

const suggestedItinerary: SuggestedDay[] = [
  {
    day: 1,
    city: "Amalfi Coast",
    who: "Alicia & Jamie",
    morning: "Arrive Naples, transfer to Positano/Ravello",
    afternoon: "Check in, settle, explore the area",
    evening: "Evening stroll, first seafood dinner",
  },
  {
    day: 2,
    city: "Amalfi Coast",
    who: "Alicia & Jamie",
    morning: "Full rest day — beach club at La Tonnarella",
    afternoon: "Sorrento old-town stroll, long lunch",
    evening: "✓ BOOKED 21:30 — Vesuvio Panoramic Restaurant, Hotel Mediterraneo Sorrento (terrace tasting menù for 2)",
  },
  {
    day: 3,
    city: "Amalfi Coast",
    who: "Alicia & Jamie",
    morning: "BOOKED: Positano & Amalfi boat trip — hotel pickup, starts 10:30 AM (~8 hrs)",
    afternoon: "On the water — Amalfi + Positano visits, swim stops, onboard prosecco & limoncello",
    evening: "Back at La Tonnarella ~6:30 PM · rest (the optional pizza/pasta class was dropped in favor of the boat day)",
  },
  {
    day: 4,
    city: "Amalfi Coast",
    who: "Alicia & Jamie",
    morning: "BOOKED: 9:30 AM taxi to Ravello Art Hotel Marmorata (€200 cash, arranged by Sandra)",
    afternoon: "Lunch in Amalfi town (5-min walk), Duomo, check in from 2 PM",
    evening: "Terrace evening at the Marmorata",
  },
  {
    day: 5,
    city: "Amalfi Coast",
    who: "Alicia & Jamie",
    morning: "Ferry to Positano · optional flat Nocelle stretch of Path of the Gods (bus up + down)",
    afternoon: "Positano lunch + wander, early ferry back, Marmorata sea deck + shower",
    evening: "REQUESTED 7:45 PM — Sensi, Amalfi (1 Michelin star, tasting menù) — awaiting confirmation",
  },
  {
    day: 6,
    city: "Amalfi Coast",
    who: "Alicia & Jamie",
    morning: "Villa Rufolo (Ravello) — bus or taxi up, tickets at the gate",
    afternoon: "Villa Cimbrone gardens + Terrace of Infinity",
    evening: "Hotel or walk-in dinner · pack for the 7:30 AM departure",
  },
  {
    day: 7,
    city: "Rome",
    who: "Alicia & Jamie → family",
    morning: "7:30 AM Dino's van to Salerno (€120 cash) · Frecciarossa 8509 9:11 AM → Termini 10:40 AM",
    afternoon: "Check in Penthouse Piazza Barberini · family arrives",
    evening: "BOOKED: Rome food tour dinner with the family (Jamie's booking)",
  },
  {
    day: 8,
    city: "Rome",
    who: "Full group",
    morning: "Colosseum + Roman Forum",
    afternoon: "Palatine Hill",
    evening: "Dinner in Trastevere",
  },
  {
    day: 9,
    city: "Rome",
    who: "Full group",
    morning: "Vatican Museums + Sistine Chapel (8am slot)",
    afternoon: "St. Peter's Basilica + dome climb",
    evening: "Castel Sant'Angelo walk",
  },
  {
    day: 10,
    city: "Rome",
    who: "Full group",
    morning: "Trevi Fountain (early), Pantheon",
    afternoon: "Piazza Navona, Campo de' Fiori",
    evening: "Final Rome dinner — birthday celebration option",
  },
  {
    day: 11,
    city: "Venice",
    who: "Full group",
    morning: "Train Rome → Venice",
    afternoon: "Arrive, Vaporetto Line 1 orientation ride",
    evening: "First Venice wander",
  },
  {
    day: 12,
    city: "Venice",
    who: "Full group",
    morning: "Piazza San Marco, St. Mark's Basilica, Doge's Palace",
    afternoon: "Rialto Bridge + market",
    evening: "Gondola ride (birthday splurge!)",
  },
  {
    day: 13,
    city: "Venice",
    who: "Full group",
    morning: "BOOKED: 9:30 AM La Fenice Opera House entry + audio guide (Campo S. Fantin)",
    afternoon: "BOOKED: 1:30 PM lunch at Trattoria Dona Onesta (Dorsoduro) · then Cannaregio cicchetti stroll",
    evening: "Final celebratory dinner",
  },
  {
    day: 14,
    city: "Venice",
    who: "Full group",
    morning: "Last Venice stroll",
    afternoon: "Depart from Venice Marco Polo Airport",
    evening: "",
  },
];

const cityColors: Record<string, string> = {
  "Amalfi Coast": "bg-terracotta/10 text-terracotta",
  "Rome": "bg-navy/10 text-navy",
  "Venice": "bg-italian-green/10 text-italian-green",
};

interface ItineraryProps {
  days: ItineraryDay[];
  onAdd: (day: Omit<ItineraryDay, "id" | "created_at">) => void;
  onUpdate: (id: string, updates: Partial<ItineraryDay>) => void;
  onRemove: (id: string) => void;
}

export default function Itinerary({ days, onAdd, onUpdate, onRemove }: ItineraryProps) {
  const [showModal, setShowModal] = useState(false);
  const [showSuggested, setShowSuggested] = useState(true);
  const [showCustom, setShowCustom] = useState(true);
  const [form, setForm] = useState({
    date: "",
    city: "",
    accommodation: "",
    notes: "",
    order: days.length,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...form, order: days.length });
    setShowModal(false);
    setForm({ date: "", city: "", accommodation: "", notes: "", order: 0 });
  };

  const sorted = [...days].sort((a, b) => {
    if (a.date && b.date) return a.date.localeCompare(b.date);
    return a.order - b.order;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold text-navy">Itinerary</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-terracotta text-white rounded-lg text-sm font-medium hover:bg-terracotta-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Day
        </button>
      </div>

      {/* Suggested 14-Day Plan */}
      <div>
        <button
          onClick={() => setShowSuggested(!showSuggested)}
          className="flex items-center gap-2 mb-3 cursor-pointer"
        >
          {showSuggested ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Suggested 14-Day Plan
          </h3>
        </button>

        {showSuggested && (
          <div className="space-y-2">
            {suggestedItinerary.map((day) => (
              <div
                key={day.day}
                className="bg-white rounded-xl border border-gray-100 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta font-serif font-bold text-sm tabular-nums">
                      {day.day}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="font-medium text-gray-800">
                        {day.city}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          cityColors[day.city] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {day.who}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="flex items-start gap-1.5">
                        <Sun className="w-3 h-3 text-gold mt-0.5 shrink-0" />
                        <span className="text-gray-600">{day.morning}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <Sunset className="w-3 h-3 text-terracotta mt-0.5 shrink-0" />
                        <span className="text-gray-600">{day.afternoon}</span>
                      </div>
                      {day.evening && (
                        <div className="flex items-start gap-1.5">
                          <Moon className="w-3 h-3 text-navy mt-0.5 shrink-0" />
                          <span className="text-gray-600">{day.evening}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom/User-Added Days */}
      {sorted.length > 0 && (
        <div>
          <button
            onClick={() => setShowCustom(!showCustom)}
            className="flex items-center gap-2 mb-3 cursor-pointer"
          >
            {showCustom ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Your Custom Days
            </h3>
          </button>

          {showCustom && (
            <div className="space-y-3">
              {sorted.map((day, i) => (
                <div
                  key={day.id}
                  className="bg-white rounded-xl border border-gray-100 p-5 card-hover"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-olive/10 flex items-center justify-center text-olive font-serif font-bold text-sm">
                          {i + 1}
                        </div>
                        {i < sorted.length - 1 && (
                          <div className="w-px h-6 bg-gray-200 mt-1" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-800">
                            {day.city || "City TBD"}
                          </span>
                          {day.date && (
                            <span className="text-xs text-gray-400">
                              {new Date(day.date + "T12:00:00").toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          )}
                        </div>
                        {day.accommodation && (
                          <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                            <Home className="w-3 h-3" />
                            {day.accommodation}
                          </div>
                        )}
                        {day.notes && (
                          <p className="text-sm text-gray-500 mt-1">{day.notes}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemove(day.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <AddItemModal
        title="Add Itinerary Day"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit}>
          <FormField label="Date">
            <input
              type="date"
              className={inputClass}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </FormField>
          <FormField label="City">
            <input
              className={inputClass}
              placeholder="e.g., Naples, Positano, Rome"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </FormField>
          <FormField label="Accommodation">
            <input
              className={inputClass}
              placeholder="Hotel name, Airbnb, etc."
              value={form.accommodation}
              onChange={(e) => setForm({ ...form, accommodation: e.target.value })}
            />
          </FormField>
          <FormField label="Notes">
            <textarea
              className={inputClass}
              rows={3}
              placeholder="Plans for the day, must-see spots..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </FormField>
          <button type="submit" className={btnPrimary}>
            Add Day
          </button>
        </form>
      </AddItemModal>
    </div>
  );
}
