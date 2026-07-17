"use client";

import { useState } from "react";
import { Activity } from "@/lib/types";
import { Plus, Trash2, ExternalLink, CheckCircle2, Circle, MapPin, Ticket } from "lucide-react";
import AddItemModal, {
  FormField,
  inputClass,
  selectClass,
  btnPrimary,
} from "./AddItemModal";

interface ActivitiesProps {
  activities: Activity[];
  onAdd: (activity: Omit<Activity, "id" | "created_at">) => void;
  onUpdate: (id: string, updates: Partial<Activity>) => void;
  onRemove: (id: string) => void;
}

const categoryLabels: Record<Activity["category"], string> = {
  tour: "Tour",
  cooking: "Cooking Class",
  wine: "Wine Tasting",
  museum: "Museum",
  adventure: "Adventure",
  other: "Other",
};

const categoryColors: Record<Activity["category"], string> = {
  tour: "bg-navy/10 text-navy",
  cooking: "bg-terracotta/10 text-terracotta",
  wine: "bg-italian-red/10 text-italian-red",
  museum: "bg-gold/10 text-gold-dark",
  adventure: "bg-olive/10 text-olive",
  other: "bg-gray-100 text-gray-600",
};

export default function Activities({
  activities,
  onAdd,
  onUpdate,
  onRemove,
}: ActivitiesProps) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    city: "",
    date: "",
    category: "tour" as Activity["category"],
    notes: "",
    link: "",
    booked: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    setShowModal(false);
    setForm({ name: "", city: "", date: "", category: "tour", notes: "", link: "", booked: false });
  };

  const categories = [...new Set(activities.map((a) => a.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold text-navy">
          Tours & Activities
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-terracotta text-white rounded-lg text-sm font-medium hover:bg-terracotta-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Activity
        </button>
      </div>

      {/* GetYourGuide quick-link banner */}
      <a
        href="https://www.getyourguide.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="block group bg-gradient-to-r from-terracotta/10 via-gold/10 to-italian-green/10 border border-terracotta/20 rounded-2xl p-4 hover:border-terracotta/40 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-terracotta/15 flex items-center justify-center shrink-0">
            <Ticket className="w-5 h-5 text-terracotta" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-gray-800 text-sm">
                Book skip-the-line tickets &amp; tours on GetYourGuide
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-terracotta/15 text-terracotta font-medium uppercase tracking-wide">
                Recommended
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Pre-book attractions across Italy &mdash; Colosseum, Vatican, Uffizi, Pompeii, boat tours, cooking classes
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-1 text-xs font-medium text-terracotta group-hover:underline">
            Browse
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </div>
      </a>

      {/* Confirmed bookings (hardcoded — booked outside the add-your-own list) */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
          Confirmed Bookings
        </h3>
        <div className="bg-italian-green/5 border border-italian-green/30 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-italian-green/15 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-italian-green" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-gray-800 text-sm">
                  Wine Tasting Experience with Villa Melzi Gardens
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-italian-red/10 text-italian-red">
                  Wine Tasting
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-terracotta/10 text-terracotta">
                  Alicia solo
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                Bellagio &middot; Tue Sept 8 &middot; 12:00 PM &middot; 2 hours &middot; wine tasting + Villa Melzi Gardens entry
              </div>
              <p className="text-sm text-gray-500 mt-1.5 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0 mt-0.5" />
                Meet at the wine bar, Salita Serbelloni 34 &mdash; arrive by 11:55. ~2-min walk from Hotel Du Lac.
              </p>
              <p className="text-xs text-gray-400 mt-1.5">
                GetYourGuide ref <span className="font-medium text-gray-500">GYGBLHKK529Q</span> &middot; PIN EZcwPyW@ &middot; e-tickets arrive by email ~Sept 2 (check spam &mdash; if missing by Sept 7 call Rigamonti Viaggi +39 329 097 3243) &middot; free cancel until Sept 1, 12:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-12 bg-cream rounded-2xl">
          <MapPin className="w-8 h-8 text-terracotta/40 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">
            No activities yet. Cooking classes? Wine tours? Pompeii?
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat}>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                {categoryLabels[cat]}
              </h3>
              <div className="space-y-2">
                {activities
                  .filter((a) => a.category === cat)
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="bg-white rounded-xl border border-gray-100 p-4 card-hover flex items-start gap-3"
                    >
                      <button
                        onClick={() =>
                          onUpdate(activity.id, { booked: !activity.booked })
                        }
                        className="mt-0.5 shrink-0"
                      >
                        {activity.booked ? (
                          <CheckCircle2 className="w-5 h-5 text-italian-green" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-medium ${
                              activity.booked
                                ? "text-gray-400 line-through"
                                : "text-gray-800"
                            }`}
                          >
                            {activity.name}
                          </span>
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full ${categoryColors[activity.category]}`}
                          >
                            {categoryLabels[activity.category]}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {[activity.city, activity.date].filter(Boolean).join(" · ")}
                        </div>
                        {activity.notes && (
                          <p className="text-sm text-gray-500 mt-1">
                            {activity.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {activity.link && (
                          <a
                            href={activity.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                          </a>
                        )}
                        <button
                          onClick={() => onRemove(activity.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddItemModal
        title="Add Activity"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit}>
          <FormField label="Activity Name">
            <input
              className={inputClass}
              placeholder="e.g., Pompeii Guided Tour"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="City">
              <input
                className={inputClass}
                placeholder="e.g., Naples"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </FormField>
            <FormField label="Category">
              <select
                className={selectClass}
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as Activity["category"],
                  })
                }
              >
                <option value="tour">Tour</option>
                <option value="cooking">Cooking Class</option>
                <option value="wine">Wine Tasting</option>
                <option value="museum">Museum</option>
                <option value="adventure">Adventure</option>
                <option value="other">Other</option>
              </select>
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
          <FormField label="Link">
            <input
              className={inputClass}
              placeholder="Booking URL or info page"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />
          </FormField>
          <FormField label="Notes">
            <textarea
              className={inputClass}
              rows={2}
              placeholder="Details, tips, costs..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </FormField>
          <button type="submit" className={btnPrimary}>
            Add Activity
          </button>
        </form>
      </AddItemModal>
    </div>
  );
}
