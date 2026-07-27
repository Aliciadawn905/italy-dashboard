"use client";

import { useState } from "react";
import { Restaurant } from "@/lib/types";
import { Plus, Heart, Trash2, ExternalLink, UtensilsCrossed, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import AddItemModal, {
  FormField,
  inputClass,
  selectClass,
  btnPrimary,
} from "./AddItemModal";

interface FoodRec {
  name: string;
  category: string;
  price: string;
  mustTry: string;
  vibe: string;
  reservation: boolean;
  booked?: string; // reservation details when confirmed
}

interface CityFood {
  city: string;
  week: string;
  recs: FoodRec[];
}

const foodGuide: CityFood[] = [
  {
    city: "Sorrento / Amalfi Coast",
    week: "Week 1 — Relaxing",
    recs: [
      { name: "Vesuvio Panoramic Restaurant (Hotel Mediterraneo, Sorrento)", category: "Fine Dining", price: "€€€", mustTry: "Terrace tasting menù", vibe: "Rooftop terrace over the Gulf of Naples with Vesuvius views — sunset-to-stars dinner.", reservation: true, booked: "Mon Aug 31, 21:30 · 2 people · Outdoor Terrace Table, tasting menù · Experience confirmed (TheFork)" },
      { name: "Lo Scoglio (Marina del Cantone)", category: "Fine Dining", price: "€€€", mustTry: "Spaghetti alle vongole", vibe: "Seafood temple on the water. Perfect for a relaxed long lunch.", reservation: true },
      { name: "Da Adolfo (Positano)", category: "Beach Restaurant", price: "€€", mustTry: "Fresh grilled fish", vibe: "Boat-access only! Take the free red-pennant boat. Utterly relaxing.", reservation: false },
      { name: "Villa Maria Restaurant (Ravello)", category: "Fine Dining", price: "€€€", mustTry: "Tasting menu with local wine", vibe: "Elegant terrace overlooking the valley. Perfect for a special dinner.", reservation: true },
      { name: "Bar dell'Hotel Caruso (Ravello)", category: "Bar", price: "€€", mustTry: "Aperol Spritz with infinity pool views", vibe: "Ultimate relaxation aperitivo spot", reservation: false },
      { name: "Sfogliatella + pizza fritta in Amalfi town", category: "Street Food", price: "€", mustTry: "Sfogliatella (flaky pastry)", vibe: "Casual wandering and tasting", reservation: false },
    ],
  },
  {
    city: "Rome",
    week: "Week 2 — Family Sightseeing",
    recs: [
      { name: "Da Enzo al 29 (Trastevere)", category: "Trattoria", price: "€€", mustTry: "Cacio e pepe + carbonara", vibe: "Tiny, perfect Roman trattoria. The family will love it.", reservation: false },
      { name: "Roscioli (Campo de' Fiori)", category: "Wine Bar", price: "€€", mustTry: "Charcuterie board + house wines", vibe: "Part deli, part wine bar, part restaurant. Extraordinary.", reservation: true },
      { name: "Pizzarium (Prati, near Vatican)", category: "Street Food", price: "€", mustTry: "Pizza al taglio (by the slice)", vibe: "Rome's best pizza. Perfect quick lunch after the Vatican.", reservation: false },
      { name: "Grazia & Graziella (Trastevere)", category: "Trattoria", price: "€€", mustTry: "Pasta all'amatriciana", vibe: "Family-run, cash only, soul of Rome. The kids will love it.", reservation: false },
      { name: "Fatamorgana (near Navona)", category: "Gelato", price: "€", mustTry: "Creative seasonal flavors", vibe: "Best creative gelato in Rome", reservation: false },
      { name: "Aperitivo in Campo de' Fiori", category: "Bar", price: "€€", mustTry: "Negroni or Aperol Spritz around 6–7pm", vibe: "Classic Roman evening ritual. People watching at its finest.", reservation: false },
    ],
  },
  {
    city: "Venice",
    week: "Week 2 — Family Sightseeing",
    recs: [
      { name: "Alle Testiere", category: "Fine Dining", price: "€€€", mustTry: "Tasting menu — only 22 seats", vibe: "Venice's best small seafood restaurant. Reserve 2+ weeks ahead.", reservation: true },
      { name: "Osteria Al Squero (Dorsoduro)", category: "Wine Bar", price: "€€", mustTry: "Cicchetti + prosecco by the canal", vibe: "In front of a gondola workshop. Most charming bacaro in Venice.", reservation: false },
      { name: "Cantina Do Mori (near Rialto)", category: "Wine Bar", price: "€€", mustTry: "Stand-up cicchetti + prosecco", vibe: "Venice's oldest wine bar since 1462. Tiny, authentic, unforgettable.", reservation: false },
      { name: "Trattoria alla Madonna", category: "Trattoria", price: "€€", mustTry: "Risotto al nero di seppia (squid ink)", vibe: "Old-school Venetian. Best for families. Big portions.", reservation: false },
      { name: "Cicchetti bar hop in Cannaregio", category: "Experience", price: "€€", mustTry: "Small plates + ombra at 5–6 bars in a row", vibe: "The local way to eat dinner in Venice. Fun for the whole family.", reservation: false },
      { name: "Suso (near Rialto)", category: "Gelato", price: "€", mustTry: "Pistachio or seasonal fruit", vibe: "Best gelato in Venice", reservation: false },
    ],
  },
];

const recPriceColors: Record<string, string> = {
  "€": "text-italian-green",
  "€€": "text-olive",
  "€€€": "text-gold-dark",
};

interface RestaurantsProps {
  restaurants: Restaurant[];
  onAdd: (restaurant: Omit<Restaurant, "id" | "created_at">) => void;
  onUpdate: (id: string, updates: Partial<Restaurant>) => void;
  onRemove: (id: string) => void;
}

const priceColors: Record<string, string> = {
  $: "text-italian-green",
  $$: "text-olive",
  $$$: "text-gold-dark",
  $$$$: "text-terracotta",
};

export default function Restaurants({
  restaurants,
  onAdd,
  onUpdate,
  onRemove,
}: RestaurantsProps) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    city: "",
    cuisine: "",
    price_range: "$$" as Restaurant["price_range"],
    notes: "",
    link: "",
    favorited_by: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    setShowModal(false);
    setForm({ name: "", city: "", cuisine: "", price_range: "$$", notes: "", link: "", favorited_by: [] });
  };

  const toggleFavorite = (restaurant: Restaurant, person: string) => {
    const favs = restaurant.favorited_by || [];
    const newFavs = favs.includes(person)
      ? favs.filter((f) => f !== person)
      : [...favs, person];
    onUpdate(restaurant.id, { favorited_by: newFavs });
  };

  const cities = [...new Set(restaurants.map((r) => r.city).filter(Boolean))];

  const [showGuide, setShowGuide] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold text-navy">Food & Drink</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-terracotta text-white rounded-lg text-sm font-medium hover:bg-terracotta-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Restaurant
        </button>
      </div>

      {/* Recommended Dining Guide */}
      <div>
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center gap-2 mb-3 cursor-pointer"
        >
          {showGuide ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            Dining Guide by City
          </h3>
        </button>

        {showGuide && (
          <div className="space-y-4">
            {foodGuide.map((city) => (
              <div key={city.city} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-serif font-semibold text-navy text-sm">{city.city}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-olive/10 text-olive font-medium">
                    {city.week}
                  </span>
                </div>
                <div className="space-y-2">
                  {city.recs.map((rec) => (
                    <div key={rec.name} className="bg-cream rounded-lg p-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-800 text-xs">{rec.name}</span>
                        <span className={`text-[10px] font-medium ${recPriceColors[rec.price] || "text-gray-500"}`}>
                          {rec.price}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                          {rec.category}
                        </span>
                        {rec.booked ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-italian-green text-white font-medium uppercase tracking-wide">
                            Booked
                          </span>
                        ) : rec.reservation ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-italian-red/10 text-italian-red font-medium">
                            Reserve
                          </span>
                        ) : null}
                      </div>
                      {rec.booked && (
                        <p className="text-[11px] text-italian-green font-medium mt-1">
                          ✓ {rec.booked}
                        </p>
                      )}
                      <p className="text-[11px] text-gray-500 mt-1">
                        <span className="font-medium text-terracotta">Must try:</span> {rec.mustTry}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5 italic">{rec.vibe}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User's Saved Restaurants */}
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
        Your Saved Restaurants
      </h3>

      {restaurants.length === 0 ? (
        <div className="text-center py-12 bg-cream rounded-2xl">
          <UtensilsCrossed className="w-8 h-8 text-terracotta/40 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">
            No restaurants yet. Start adding your favorites!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {cities.length > 0 &&
            cities.map((city) => (
              <div key={city}>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  {city}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {restaurants
                    .filter((r) => r.city === city)
                    .map((restaurant) => (
                      <RestaurantCard
                        key={restaurant.id}
                        restaurant={restaurant}
                        onToggleFavorite={toggleFavorite}
                        onRemove={onRemove}
                      />
                    ))}
                </div>
              </div>
            ))}
          {restaurants.filter((r) => !r.city).length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                City TBD
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {restaurants
                  .filter((r) => !r.city)
                  .map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      onToggleFavorite={toggleFavorite}
                      onRemove={onRemove}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      <AddItemModal
        title="Add Restaurant"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit}>
          <FormField label="Name">
            <input
              className={inputClass}
              placeholder="e.g., Da Michele"
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
            <FormField label="Cuisine">
              <input
                className={inputClass}
                placeholder="e.g., Pizza, Seafood"
                value={form.cuisine}
                onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
              />
            </FormField>
          </div>
          <FormField label="Price Range">
            <select
              className={selectClass}
              value={form.price_range}
              onChange={(e) =>
                setForm({
                  ...form,
                  price_range: e.target.value as Restaurant["price_range"],
                })
              }
            >
              <option value="$">$ — Budget</option>
              <option value="$$">$$ — Moderate</option>
              <option value="$$$">$$$ — Upscale</option>
              <option value="$$$$">$$$$ — Fine Dining</option>
            </select>
          </FormField>
          <FormField label="Link">
            <input
              className={inputClass}
              placeholder="Google Maps or website URL"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />
          </FormField>
          <FormField label="Notes">
            <textarea
              className={inputClass}
              rows={2}
              placeholder="Must try the pasta! Reservation needed..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </FormField>
          <button type="submit" className={btnPrimary}>
            Add Restaurant
          </button>
        </form>
      </AddItemModal>
    </div>
  );
}

function RestaurantCard({
  restaurant,
  onToggleFavorite,
  onRemove,
}: {
  restaurant: Restaurant;
  onToggleFavorite: (r: Restaurant, person: string) => void;
  onRemove: (id: string) => void;
}) {
  const favs = restaurant.favorited_by || [];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 card-hover">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800">{restaurant.name}</span>
            <span className={`text-xs font-medium ${priceColors[restaurant.price_range]}`}>
              {restaurant.price_range}
            </span>
          </div>
          {restaurant.cuisine && (
            <span className="text-xs text-gray-400">{restaurant.cuisine}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {restaurant.link && (
            <a
              href={restaurant.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </a>
          )}
          <button
            onClick={() => onRemove(restaurant.id)}
            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>

      {restaurant.notes && (
        <p className="text-sm text-gray-500 mb-3">{restaurant.notes}</p>
      )}

      <div className="flex items-center gap-2">
        {["Alicia", "Jamie"].map((person) => (
          <button
            key={person}
            onClick={() => onToggleFavorite(restaurant, person)}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
              favs.includes(person)
                ? "bg-italian-red/10 text-italian-red"
                : "bg-gray-50 text-gray-400 hover:bg-gray-100"
            }`}
          >
            <Heart
              className={`w-3 h-3 ${favs.includes(person) ? "fill-current" : ""}`}
            />
            {person}
          </button>
        ))}
      </div>
    </div>
  );
}
