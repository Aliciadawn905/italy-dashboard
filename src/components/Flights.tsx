"use client";

import { useState } from "react";
import { Flight } from "@/lib/types";
import { Plus, Plane, Trash2 } from "lucide-react";
import AddItemModal, {
  FormField,
  inputClass,
  selectClass,
  btnPrimary,
} from "./AddItemModal";

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

  const outbound = flights.filter((f) => f.direction === "outbound");
  const returnFlights = flights.filter((f) => f.direction === "return");

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

      {/* Outbound */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
          Outbound &middot; To Naples
        </h3>
        {outbound.length === 0 ? (
          <div className="text-sm text-gray-400 bg-cream rounded-xl p-4 text-center">
            No outbound flights added yet
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
          Return &middot; From Venice / Rome
        </h3>
        {returnFlights.length === 0 ? (
          <div className="text-sm text-gray-400 bg-cream rounded-xl p-4 text-center">
            No return flights added yet
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
