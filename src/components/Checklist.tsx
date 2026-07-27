"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckSquare, Square, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface ChecklistItem {
  id: string;
  text: string;
  category: string;
  priority: "high" | "medium" | "low";
  alicia: boolean;
  jamie: boolean;
  notes: string;
}

const STORAGE_KEY = "italy_trip_checklist_v2";

const priorityColors = {
  high: "bg-italian-red/10 text-italian-red",
  medium: "bg-gold/10 text-gold-dark",
  low: "bg-olive/10 text-olive",
};

const defaultChecklist: ChecklistItem[] = [
  // BOOKING — HIGH PRIORITY
  { id: "b1", text: "Set trip dates and buy flights", category: "Booking", priority: "high", alicia: false, jamie: false, notes: "8/29 – 9/12, 2026" },
  { id: "b2", text: "Book Uffizi Galleries tickets", category: "Booking", priority: "high", alicia: false, jamie: false, notes: "Book 2–4 weeks ahead minimum. Closed Mondays." },
  { id: "b3", text: "Book Vatican Museums tickets", category: "Booking", priority: "high", alicia: false, jamie: false, notes: "Get the 8am slot" },
  { id: "b4", text: "Book Colosseum skip-the-line tickets", category: "Booking", priority: "high", alicia: false, jamie: false, notes: "Combo ticket covers Forum + Palatine Hill" },
  { id: "b6", text: "Book Sorrento hotel (La Tonnarella) ✓", category: "Booking", priority: "high", alicia: true, jamie: true, notes: "BOOKED Aug 30–Sept 2, Suite Deluxe, €2,271 prepaid · Hotel: +39 081 878 11 53 · info@latonnarella.it" },
  { id: "b7", text: "Book Amalfi/Marmorata hotel ✓", category: "Booking", priority: "high", alicia: true, jamie: true, notes: "BOOKED Sept 2–5, Junior Suite, €2,490 prepaid NON-REFUNDABLE · Hotel: +39 089 877 777 · info@marmorata.it" },
  { id: "b9", text: "Book Rome hotel/apartment ✓", category: "Booking", priority: "high", alicia: true, jamie: true, notes: "BOOKED — Prestigious Penthouse Piazza Barberini (Marriott Homes & Villas), Sept 5–10, 4BR/3BA + terrace + hot tub, Via di San Nicola da Tolentino. Alicia departs Mon Sept 7, Jamie + kids through Thu Sept 10. TO DO: forward the Marriott confirmation email so conf #, total & cancellation terms get on file." },
  { id: "b10", text: "Book Venice hotels — Alicia's room ✓, kids' rooms still needed", category: "Booking", priority: "high", alicia: true, jamie: false, notes: "Alicia's room BOOKED Sept 10–12: Palazzetto Madonna (San Polo 2902), Deluxe Room, 2 adults, €987 + €18 city tax pay at hotel, free cancel until Sept 7 · Conf 12071XBBJM0000000623 · Hotel: +39 041 3071174. Rooms for the kids (23yo+21yo, 15yo) still to be booked." },
  { id: "b15a", text: "Book Bellagio hotel (Hotel Du Lac) ✓ — Alicia solo", category: "Booking", priority: "high", alicia: true, jamie: false, notes: "BOOKED Sept 7–10, Standard Double, €960 pay at hotel · Hotel: +39 031 950320 · info@bellagiohoteldulac.com" },
  { id: "b13", text: "Book birthday dinner restaurant", category: "Booking", priority: "high", alicia: false, jamie: false, notes: "Rome or Venice — make it special!" },
  { id: "b14", text: "Book gondola ride in Venice", category: "Booking", priority: "medium", alicia: false, jamie: false, notes: "Official stands have fixed pricing ~€80–90" },
  { id: "b15", text: "Book Doge's Palace (Venice)", category: "Booking", priority: "medium", alicia: false, jamie: false, notes: "" },

  // FLIGHTS
  { id: "f1", text: "Alicia: Book LAX → DFW → Naples (outbound 8/29)", category: "Flights", priority: "high", alicia: false, jamie: false, notes: "American or Delta. Connect through Dallas to travel together" },
  { id: "f2", text: "Jamie: Book DFW → Naples (outbound 8/29)", category: "Flights", priority: "high", alicia: false, jamie: false, notes: "American or Delta" },
  { id: "f3", text: "Alicia: Book Venice → DFW → LAX (return 9/12)", category: "Flights", priority: "high", alicia: false, jamie: false, notes: "Return through Dallas together" },
  { id: "f4", text: "Jamie: Book Venice → DFW (return 9/12)", category: "Flights", priority: "high", alicia: false, jamie: false, notes: "" },
  { id: "f5", text: "Coordinate same flights from DFW so you travel together", category: "Flights", priority: "high", alicia: false, jamie: false, notes: "" },

  // TRANSPORT
  { id: "t1", text: "Salerno → Roma Termini Frecciarossa for Sept 5 ✓", category: "Transport", priority: "high", alicia: true, jamie: true, notes: "BOOKED Jul 8 — Frecciarossa 8509, Salerno 09:11 → Roma Termini 10:40. Business Area Silenzio, carriage 2, seats 3D + 4D. PNR NLKYF5, €84 each. Taxi to Salerno CONFIRMED: 07:30 pickup, €120, driver Dino — WhatsApp him Sept 4 to reconfirm (+39 339 391 7300)." },
  { id: "t1b", text: "Roma Termini → Milano Centrale Frecciarossa for Sept 7 (Alicia solo) ✓", category: "Transport", priority: "high", alicia: true, jamie: false, notes: "BOOKED — Frecciarossa 9608, Roma Termini 06:50 → Milano Centrale 10:00. Business Area Silenzio, carriage 2, seat 3D. PNR N36HBN." },
  { id: "t1c", text: "Milano Centrale → Venezia S. Lucia Frecciarossa for Sept 10 (Alicia solo) ✓", category: "Transport", priority: "high", alicia: true, jamie: false, notes: "BOOKED — Frecciarossa 9731, Milano Centrale 13:45 → Venezia S. Lucia 16:12. Business, carriage 3, seat 9D. PNR N8AMY5." },
  { id: "t2", text: "Book Rome → Venice train for Jamie's family (Frecciarossa)", category: "Transport", priority: "medium", alicia: false, jamie: false, notes: "Date TBD based on when Jamie's family travels north" },
  { id: "t1a", text: "Send Annalisa @ La Tonnarella the IC 707 train # + 17:34 Napoli arrival ✓", category: "Transport", priority: "high", alicia: true, jamie: true, notes: "DONE Jun 19. Annalisa confirmed Jun 20: driver waits at arrival with 'Sorensen' sign · €170 charged to room folio (pay at checkout) · driver's # comes night before." },
  { id: "t1d", text: "Save Aug 30 transfer driver's phone number (arrives night of Aug 29)", category: "Transport", priority: "high", alicia: false, jamie: false, notes: "La Tonnarella reception will email/WhatsApp the driver's contact the night before. Save it on your phone immediately + add to Apple Wallet/Notes." },
  { id: "t3", text: "Sept 12 to VCE (Alicia solo): vaporetto + ATVO bus, or hotel water taxi", category: "Transport", priority: "high", alicia: false, jamie: false, notes: "Plan: ~09:00 vaporetto from San Tomà (3 min from hotel, no bridges) → Piazzale Roma → ~09:30 ATVO coach → VCE ~09:55. ~€20 total, nothing to pre-book. Splurge option: hotel arranges private water taxi from its OWN dock (€135-170 solo) — tell reception ≥24 hrs ahead, i.e. by Fri morning Sept 11. Flight: EI423 departs 12:15 PM." },
  { id: "t5", text: "Buy Rome transit pass (day-of)", category: "Transport", priority: "low", alicia: false, jamie: false, notes: "48hr or 72hr pass" },
  { id: "t6", text: "Buy Venice Vaporetto pass (day-of)", category: "Transport", priority: "low", alicia: false, jamie: false, notes: "€9.50/day, €35/72hrs" },

  // PRE-TRIP PREP
  { id: "p1", text: "Check passport validity (6+ months past return)", category: "Pre-Trip Prep", priority: "high", alicia: false, jamie: false, notes: "Must be valid through March 2027+" },
  { id: "p2", text: "Travel insurance", category: "Pre-Trip Prep", priority: "high", alicia: false, jamie: false, notes: "" },
  { id: "p3", text: "Notify bank/credit cards of travel", category: "Pre-Trip Prep", priority: "medium", alicia: false, jamie: false, notes: "" },
  { id: "p4", text: "Download offline maps for all cities", category: "Pre-Trip Prep", priority: "medium", alicia: false, jamie: false, notes: "Google Maps or Maps.me" },
  { id: "p5", text: "Download Trenitalia app", category: "Pre-Trip Prep", priority: "medium", alicia: false, jamie: false, notes: "Mobile tickets for trains" },
  { id: "p6", text: "Download Google Translate with Italian offline pack", category: "Pre-Trip Prep", priority: "low", alicia: false, jamie: false, notes: "" },
  { id: "p7", text: "Pack comfortable walking shoes — cobblestones everywhere", category: "Pre-Trip Prep", priority: "medium", alicia: false, jamie: false, notes: "" },
  { id: "p8", text: "Bring modest clothing for churches (shoulders + knees)", category: "Pre-Trip Prep", priority: "medium", alicia: false, jamie: false, notes: "" },
  { id: "p9", text: "Pack small daypack", category: "Pre-Trip Prep", priority: "low", alicia: false, jamie: false, notes: "" },

  // FAMILY WEEK 2
  { id: "fam1", text: "Share Rome/Venice itinerary with Jamie's family", category: "Family — Week 2", priority: "high", alicia: false, jamie: false, notes: "Send at least 2 weeks before" },
  { id: "fam2", text: "Book family dinner reservations (5+ seats)", category: "Family — Week 2", priority: "high", alicia: false, jamie: false, notes: "Rome and Venice" },
  { id: "fam3", text: "Confirm family flight/arrival details in Rome", category: "Family — Week 2", priority: "medium", alicia: false, jamie: false, notes: "" },
  { id: "fam4", text: "Research activities for 15-year-old", category: "Family — Week 2", priority: "medium", alicia: false, jamie: false, notes: "Murano glass-blowing, gondola ride, gelato tours" },
];

export default function Checklist() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    text: "",
    category: "Booking",
    priority: "medium" as "high" | "medium" | "low",
    notes: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        // Sync default item content (text/notes/priority) into stored items so
        // dashboard updates propagate, while preserving check state, custom
        // items, and removals.
        const parsed: ChecklistItem[] = JSON.parse(stored);
        const defaults = new Map(defaultChecklist.map((d) => [d.id, d]));
        setItems(
          parsed.map((item) => {
            const def = defaults.get(item.id);
            if (!def) return item;
            return {
              ...item,
              text: def.text,
              notes: def.notes,
              priority: def.priority,
              category: def.category,
              alicia: item.alicia || def.alicia,
              jamie: item.jamie || def.jamie,
            };
          })
        );
      } catch {
        setItems(defaultChecklist);
      }
    } else {
      setItems(defaultChecklist);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loaded]);

  const toggleCheck = useCallback((id: string, person: "alicia" | "jamie") => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [person]: !item[person] } : item
      )
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    const item: ChecklistItem = {
      id: `custom_${Date.now()}`,
      ...newItem,
      alicia: false,
      jamie: false,
    };
    setItems((prev) => [...prev, item]);
    setNewItem({ text: "", category: "Booking", priority: "medium", notes: "" });
    setShowAddForm(false);
  };

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const categories = [...new Set(items.map((i) => i.category))];
  const totalDone = items.filter((i) => i.alicia && i.jamie).length;
  const aliciaDone = items.filter((i) => i.alicia).length;
  const jamieDone = items.filter((i) => i.jamie).length;

  if (!loaded) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-semibold text-navy">
            Checklist
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Check off items for each person
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-2 bg-terracotta text-white rounded-lg text-sm font-medium hover:bg-terracotta-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Progress cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xs text-gray-400 mb-1">Both Done</div>
          <div className="font-serif text-2xl font-bold text-italian-green tabular-nums">
            {totalDone}
          </div>
          <div className="text-[11px] text-gray-400 tabular-nums">
            of {items.length}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xs text-terracotta font-medium mb-1">Alicia</div>
          <div className="font-serif text-2xl font-bold text-terracotta tabular-nums">
            {aliciaDone}
          </div>
          <div className="text-[11px] text-gray-400 tabular-nums">
            checked
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-xs text-navy font-medium mb-1">Jamie</div>
          <div className="font-serif text-2xl font-bold text-navy tabular-nums">
            {jamieDone}
          </div>
          <div className="text-[11px] text-gray-400 tabular-nums">
            checked
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Overall Progress</span>
          <span className="tabular-nums font-medium">
            {items.length > 0
              ? Math.round((totalDone / items.length) * 100)
              : 0}
            %
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-italian-green rounded-full transition-all duration-500"
            style={{
              width: `${items.length > 0 ? (totalDone / items.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Add form */}
      {showAddForm && (
        <form
          onSubmit={addItem}
          className="bg-white rounded-xl border border-gray-100 p-4 space-y-3"
        >
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30"
            placeholder="What needs to be done?"
            value={newItem.text}
            onChange={(e) => setNewItem({ ...newItem, text: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-terracotta/30"
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            >
              <option value="Booking">Booking</option>
              <option value="Flights">Flights</option>
              <option value="Transport">Transport</option>
              <option value="Pre-Trip Prep">Pre-Trip Prep</option>
              <option value="Family — Week 2">Family — Week 2</option>
              <option value="Packing">Packing</option>
              <option value="Other">Other</option>
            </select>
            <select
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-terracotta/30"
              value={newItem.priority}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  priority: e.target.value as "high" | "medium" | "low",
                })
              }
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30"
            placeholder="Notes (optional)"
            value={newItem.notes}
            onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-terracotta text-white rounded-lg text-sm font-medium hover:bg-terracotta-dark transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Categories */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const catItems = items.filter((i) => i.category === cat);
          const catBothDone = catItems.filter((i) => i.alicia && i.jamie).length;
          const isCollapsed = collapsedCategories.has(cat);

          return (
            <div key={cat}>
              <button
                onClick={() => toggleCategory(cat)}
                className="flex items-center gap-2 w-full text-left mb-2 cursor-pointer"
              >
                {isCollapsed ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                )}
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {cat}
                </h3>
                <span className="text-[11px] text-gray-400 tabular-nums">
                  {catBothDone}/{catItems.length}
                </span>
              </button>

              {!isCollapsed && (
                <div className="space-y-1.5">
                  {catItems.map((item) => {
                    const bothDone = item.alicia && item.jamie;
                    return (
                      <div
                        key={item.id}
                        className={`bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-start gap-3 ${
                          bothDone ? "opacity-60" : ""
                        }`}
                      >
                        {/* Task info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-sm ${
                                bothDone
                                  ? "text-gray-400 line-through"
                                  : "text-gray-800"
                              }`}
                            >
                              {item.text}
                            </span>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                                priorityColors[item.priority]
                              }`}
                            >
                              {item.priority}
                            </span>
                          </div>
                          {item.notes && (
                            <div className="text-[11px] text-gray-400 mt-0.5">
                              {item.notes}
                            </div>
                          )}
                        </div>

                        {/* Person checkboxes */}
                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            onClick={() => toggleCheck(item.id, "alicia")}
                            className="flex flex-col items-center gap-0.5 cursor-pointer group"
                            title="Alicia"
                          >
                            {item.alicia ? (
                              <CheckSquare className="w-5 h-5 text-terracotta" />
                            ) : (
                              <Square className="w-5 h-5 text-gray-300 group-hover:text-terracotta/50" />
                            )}
                            <span className="text-[9px] text-gray-400 font-medium">A</span>
                          </button>
                          <button
                            onClick={() => toggleCheck(item.id, "jamie")}
                            className="flex flex-col items-center gap-0.5 cursor-pointer group"
                            title="Jamie"
                          >
                            {item.jamie ? (
                              <CheckSquare className="w-5 h-5 text-navy" />
                            ) : (
                              <Square className="w-5 h-5 text-gray-300 group-hover:text-navy/50" />
                            )}
                            <span className="text-[9px] text-gray-400 font-medium">J</span>
                          </button>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-500" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
