"use client";

import { useState, useEffect } from "react";
import { Euro, Pencil, Check, X } from "lucide-react";

interface BudgetRow {
  id: string;
  segment: string;
  nights: number;
  hotelPerNight: string;
  foodPerDay: string;
  attractions: string;
  transport: string;
}

interface TripWideCost {
  id: string;
  label: string;
  estimate: string;
}

const STORAGE_KEY = "italy_trip_budget";

const defaultWeek1: BudgetRow[] = [
  { id: "w1_1", segment: "Sorrento (La Tonnarella) ✓ booked", nights: 3, hotelPerNight: "757", foodPerDay: "100", attractions: "120", transport: "85" },
  { id: "w1_2", segment: "Amalfi/Marmorata ✓ booked", nights: 3, hotelPerNight: "830", foodPerDay: "100", attractions: "100", transport: "60" },
];

const defaultWeek2: BudgetRow[] = [
  { id: "w2_1", segment: "Rome", nights: 2, hotelPerNight: "200–350", foodPerDay: "70", attractions: "60", transport: "20" },
  { id: "w2_2", segment: "Lake Como (Bellagio) ✓ booked · Alicia solo", nights: 3, hotelPerNight: "320", foodPerDay: "80", attractions: "80", transport: "50" },
  { id: "w2_3", segment: "Venice (3 rooms)", nights: 2, hotelPerNight: "750–1,250 total", foodPerDay: "80", attractions: "50", transport: "30" },
];

const defaultTripWide: TripWideCost[] = [
  { id: "tw1", label: "Flights (roundtrip, per person)", estimate: "400–900" },
  { id: "tw2", label: "Travel insurance (per person)", estimate: "80–150" },
];

interface BudgetState {
  week1: BudgetRow[];
  week2: BudgetRow[];
  tripWide: TripWideCost[];
}

function parseRange(s: string): [number, number] {
  const parts = s.replace(/[^0-9–\-]/g, "").split(/[–\-]/);
  const low = parseInt(parts[0]) || 0;
  const high = parseInt(parts[1] || parts[0]) || low;
  return [low, high];
}

function segmentTotal(row: BudgetRow): [number, number] {
  const [hLow, hHigh] = parseRange(row.hotelPerNight);
  const [fLow, fHigh] = parseRange(row.foodPerDay);
  const [aLow, aHigh] = parseRange(row.attractions);
  const [tLow, tHigh] = parseRange(row.transport);
  const low = hLow * row.nights + fLow * row.nights + aLow + tLow;
  const high = hHigh * row.nights + fHigh * row.nights + aHigh + tHigh;
  return [low, high];
}

function BudgetTable({
  title,
  subtitle,
  rows,
  onEdit,
}: {
  title: string;
  subtitle: string;
  rows: BudgetRow[];
  onEdit: (id: string, field: string, value: string) => void;
}) {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (id: string, field: string, currentValue: string) => {
    setEditingCell(`${id}_${field}`);
    setEditValue(currentValue);
  };

  const saveEdit = (id: string, field: string) => {
    onEdit(id, field, editValue);
    setEditingCell(null);
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  let totalLow = 0;
  let totalHigh = 0;
  rows.forEach((r) => {
    const [l, h] = segmentTotal(r);
    totalLow += l;
    totalHigh += h;
  });

  const totalNights = rows.reduce((sum, r) => sum + r.nights, 0);

  const editableFields = [
    { key: "hotelPerNight", label: "Hotel/Night" },
    { key: "foodPerDay", label: "Food/Day" },
    { key: "attractions", label: "Attractions" },
    { key: "transport", label: "Transport" },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50">
        <h3 className="font-serif font-semibold text-navy">{title}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wider">
              <th className="text-left px-5 py-3 font-medium">Segment</th>
              <th className="text-center px-3 py-3 font-medium">Nights</th>
              {editableFields.map((f) => (
                <th key={f.key} className="text-center px-3 py-3 font-medium">
                  {f.label}
                </th>
              ))}
              <th className="text-right px-5 py-3 font-medium">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const [sLow, sHigh] = segmentTotal(row);
              return (
                <tr key={row.id} className="border-t border-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">
                    {row.segment}
                  </td>
                  <td className="text-center px-3 py-3 text-gray-600 tabular-nums">
                    {row.nights}
                  </td>
                  {editableFields.map((f) => {
                    const cellKey = `${row.id}_${f.key}`;
                    const val = row[f.key as keyof BudgetRow] as string;
                    const isEditing = editingCell === cellKey;
                    return (
                      <td key={f.key} className="text-center px-3 py-3">
                        {isEditing ? (
                          <div className="flex items-center gap-1 justify-center">
                            <input
                              className="w-20 border border-terracotta/30 rounded px-1.5 py-0.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-terracotta/50"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEdit(row.id, f.key);
                                if (e.key === "Escape") cancelEdit();
                              }}
                              autoFocus
                            />
                            <button
                              onClick={() => saveEdit(row.id, f.key)}
                              className="p-0.5"
                            >
                              <Check className="w-3 h-3 text-italian-green" />
                            </button>
                            <button onClick={cancelEdit} className="p-0.5">
                              <X className="w-3 h-3 text-gray-400" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(row.id, f.key, val)}
                            className="group inline-flex items-center gap-1 text-gray-600 hover:text-terracotta transition-colors cursor-pointer tabular-nums"
                          >
                            <span>€{val}</span>
                            <Pencil className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        )}
                      </td>
                    );
                  })}
                  <td className="text-right px-5 py-3 font-medium text-navy tabular-nums">
                    €{sLow.toLocaleString()}–{sHigh.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-100 bg-cream/50">
              <td className="px-5 py-3 font-semibold text-navy">Total</td>
              <td className="text-center px-3 py-3 text-gray-600 tabular-nums font-medium">
                {totalNights}
              </td>
              <td colSpan={4} className="text-right px-5 py-3">
                <span className="font-serif font-bold text-navy text-base tabular-nums">
                  €{totalLow.toLocaleString()}–{totalHigh.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400 ml-1">per person</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default function BudgetTracker() {
  const [budget, setBudget] = useState<BudgetState | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setBudget(JSON.parse(stored));
      } catch {
        setBudget({ week1: defaultWeek1, week2: defaultWeek2, tripWide: defaultTripWide });
      }
    } else {
      setBudget({ week1: defaultWeek1, week2: defaultWeek2, tripWide: defaultTripWide });
    }
  }, []);

  useEffect(() => {
    if (budget) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(budget));
    }
  }, [budget]);

  if (!budget) return null;

  const editRow = (week: "week1" | "week2", id: string, field: string, value: string) => {
    setBudget((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [week]: prev[week].map((r) =>
          r.id === id ? { ...r, [field]: value } : r
        ),
      };
    });
  };

  const editTripWide = (id: string, value: string) => {
    setBudget((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tripWide: prev.tripWide.map((t) =>
          t.id === id ? { ...t, estimate: value } : t
        ),
      };
    });
  };

  // Grand total
  let grandLow = 0;
  let grandHigh = 0;
  budget.week1.forEach((r) => {
    const [l, h] = segmentTotal(r);
    grandLow += l;
    grandHigh += h;
  });
  budget.week2.forEach((r) => {
    const [l, h] = segmentTotal(r);
    grandLow += l;
    grandHigh += h;
  });
  budget.tripWide.forEach((t) => {
    const [l, h] = parseRange(t.estimate);
    grandLow += l;
    grandHigh += h;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold text-navy">
          Budget Tracker
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Estimated costs per person — click any amount to edit
        </p>
      </div>

      <BudgetTable
        title="Week 1 — Sorrento + Amalfi/Marmorata"
        subtitle="Estimates per person"
        rows={budget.week1}
        onEdit={(id, field, value) => editRow("week1", id, field, value)}
      />

      <BudgetTable
        title="Week 2 — Rome, Lake Como (Alicia solo), Venice"
        subtitle="Estimates per person"
        rows={budget.week2}
        onEdit={(id, field, value) => editRow("week2", id, field, value)}
      />

      {/* Trip-wide costs */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="font-serif font-semibold text-navy">
            Trip-Wide Costs
          </h3>
        </div>
        <div className="px-5 py-3 space-y-2">
          {budget.tripWide.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-1.5"
            >
              <span className="text-sm text-gray-600">{item.label}</span>
              <TripWideEdit
                value={item.estimate}
                onSave={(val) => editTripWide(item.id, val)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Grand total */}
      <div className="bg-navy/5 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Euro className="w-5 h-5 text-navy" />
            <span className="font-serif font-semibold text-navy">
              Estimated Grand Total
            </span>
          </div>
          <div className="text-right">
            <div className="font-serif text-xl font-bold text-navy tabular-nums">
              €{grandLow.toLocaleString()}–{grandHigh.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">per person</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TripWideEdit({
  value,
  onSave,
}: {
  value: string;
  onSave: (val: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(value);

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-sm text-gray-400">€</span>
        <input
          className="w-24 border border-terracotta/30 rounded px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-terracotta/50"
          value={editVal}
          onChange={(e) => setEditVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSave(editVal);
              setEditing(false);
            }
            if (e.key === "Escape") setEditing(false);
          }}
          autoFocus
        />
        <button
          onClick={() => {
            onSave(editVal);
            setEditing(false);
          }}
          className="p-0.5"
        >
          <Check className="w-3.5 h-3.5 text-italian-green" />
        </button>
        <button onClick={() => setEditing(false)} className="p-0.5">
          <X className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        setEditVal(value);
        setEditing(true);
      }}
      className="group inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-terracotta transition-colors cursor-pointer tabular-nums"
    >
      <span>€{value}</span>
      <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
