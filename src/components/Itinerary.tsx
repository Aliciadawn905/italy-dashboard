"use client";

import { useState } from "react";
import { ItineraryDay } from "@/lib/types";
import { Plus, MapPin, Trash2, Home } from "lucide-react";
import AddItemModal, {
  FormField,
  inputClass,
  btnPrimary,
} from "./AddItemModal";

interface ItineraryProps {
  days: ItineraryDay[];
  onAdd: (day: Omit<ItineraryDay, "id" | "created_at">) => void;
  onUpdate: (id: string, updates: Partial<ItineraryDay>) => void;
  onRemove: (id: string) => void;
}

export default function Itinerary({ days, onAdd, onUpdate, onRemove }: ItineraryProps) {
  const [showModal, setShowModal] = useState(false);
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

      {sorted.length === 0 ? (
        <div className="text-center py-12 bg-cream rounded-2xl">
          <MapPin className="w-8 h-8 text-terracotta/40 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">
            No itinerary days yet. Start planning your route!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((day, i) => (
            <div
              key={day.id}
              className="bg-white rounded-xl border border-gray-100 p-5 card-hover"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta font-serif font-bold text-sm">
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
