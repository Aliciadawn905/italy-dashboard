export interface Flight {
  id: string;
  person: "Alicia" | "Jamie";
  direction: "outbound" | "return";
  from_city: string;
  to_city: string;
  date: string;
  airline: string;
  flight_number: string;
  status: "not_booked" | "researching" | "booked";
  notes: string;
  created_at: string;
}

export interface ItineraryDay {
  id: string;
  date: string;
  city: string;
  accommodation: string;
  notes: string;
  order: number;
  created_at: string;
}

export interface Restaurant {
  id: string;
  name: string;
  city: string;
  cuisine: string;
  price_range: "$" | "$$" | "$$$" | "$$$$";
  notes: string;
  link: string;
  favorited_by: string[];
  created_at: string;
}

export interface Activity {
  id: string;
  name: string;
  city: string;
  date: string;
  category: "tour" | "cooking" | "wine" | "museum" | "adventure" | "other";
  notes: string;
  link: string;
  booked: boolean;
  created_at: string;
}

export interface Note {
  id: string;
  category: "idea" | "packing" | "transport" | "budget" | "general";
  title: string;
  content: string;
  author: string;
  created_at: string;
}

export type TabId = "overview" | "flights" | "itinerary" | "restaurants" | "activities" | "notes";
