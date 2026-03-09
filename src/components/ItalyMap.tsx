"use client";

import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import type L from "leaflet";
import { Camera, Church, Landmark, Wine, Ship, Palette, Star } from "lucide-react";

interface Site {
  name: string;
  icon: React.ElementType;
  desc: string;
  lat: number;
  lng: number;
  image: string;
}

interface Destination {
  name: string;
  subtitle: string;
  lat: number;
  lng: number;
  color: string;
  order: number;
  sites: Site[];
}

const destinations: Destination[] = [
  {
    name: "Naples",
    subtitle: "Where it begins",
    lat: 40.8518,
    lng: 14.2681,
    color: "#C75B39",
    order: 1,
    sites: [
      { name: "Pompeii", icon: Landmark, desc: "Ancient Roman city preserved by volcanic ash", lat: 40.7508, lng: 14.4870, image: "https://images.unsplash.com/photo-1585395497913-1d4b0aabf498?w=400&q=80" },
      { name: "Spaccanapoli", icon: Church, desc: "Historic street cutting through the old city", lat: 40.8496, lng: 14.2555, image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&q=80" },
      { name: "Naples Archaeological Museum", icon: Landmark, desc: "World-class collection of Roman artifacts", lat: 40.8536, lng: 14.2504, image: "https://images.unsplash.com/photo-1580729068847-3d585c979948?w=400&q=80" },
      { name: "Castel dell'Ovo", icon: Landmark, desc: "Seaside castle with panoramic views", lat: 40.8282, lng: 14.2477, image: "https://images.unsplash.com/photo-1625989434571-3e3a61545a76?w=400&q=80" },
      { name: "Da Michele Pizzeria", icon: Star, desc: "Legendary birthplace of Margherita pizza", lat: 40.8497, lng: 14.2621, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80" },
      { name: "Mount Vesuvius", icon: Camera, desc: "Hike the famous volcano", lat: 40.8210, lng: 14.4260, image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&q=80" },
    ],
  },
  {
    name: "Amalfi Coast",
    subtitle: "Coastal paradise",
    lat: 40.6340,
    lng: 14.6027,
    color: "#1E3A5F",
    order: 2,
    sites: [
      { name: "Positano", icon: Camera, desc: "Pastel-colored cliffside village", lat: 40.6281, lng: 14.4849, image: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=400&q=80" },
      { name: "Ravello", icon: Star, desc: "Hilltop town with stunning gardens", lat: 40.6491, lng: 14.6117, image: "https://images.unsplash.com/photo-1612698093158-e07ac200d44e?w=400&q=80" },
      { name: "Path of the Gods", icon: Camera, desc: "Breathtaking coastal hiking trail", lat: 40.6310, lng: 14.5210, image: "https://images.unsplash.com/photo-1633321702518-7fecdafb94d5?w=400&q=80" },
      { name: "Amalfi Cathedral", icon: Church, desc: "9th-century Arab-Norman cathedral", lat: 40.6346, lng: 14.6024, image: "https://images.unsplash.com/photo-1625425423233-793ed66f5516?w=400&q=80" },
      { name: "Emerald Grotto", icon: Ship, desc: "Sea cave with emerald-green water", lat: 40.6267, lng: 14.5750, image: "https://images.unsplash.com/photo-1596627116790-af6f46dddbff?w=400&q=80" },
      { name: "Limoncello Tasting", icon: Wine, desc: "Famous lemon liqueur from local lemons", lat: 40.6310, lng: 14.4750, image: "https://images.unsplash.com/photo-1583577612013-4b03c2b88e8d?w=400&q=80" },
    ],
  },
  {
    name: "Rome",
    subtitle: "The Eternal City",
    lat: 41.9028,
    lng: 12.4964,
    color: "#CE2B37",
    order: 3,
    sites: [
      { name: "Colosseum", icon: Landmark, desc: "Iconic amphitheater of Imperial Rome", lat: 41.8902, lng: 12.4922, image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80" },
      { name: "Vatican & Sistine Chapel", icon: Palette, desc: "Michelangelo's masterpiece ceiling", lat: 41.9022, lng: 12.4539, image: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=400&q=80" },
      { name: "Trevi Fountain", icon: Star, desc: "Baroque fountain — throw a coin", lat: 41.9009, lng: 12.4833, image: "https://images.unsplash.com/photo-1525874684015-58379d421a52?w=400&q=80" },
      { name: "Roman Forum", icon: Landmark, desc: "Ruins of ancient government buildings", lat: 41.8925, lng: 12.4853, image: "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=400&q=80" },
      { name: "Trastevere", icon: Wine, desc: "Cobblestone streets and great restaurants", lat: 41.8817, lng: 12.4696, image: "https://images.unsplash.com/photo-1529260830199-42c24126f198?w=400&q=80" },
      { name: "Pantheon", icon: Church, desc: "Best-preserved ancient Roman building", lat: 41.8986, lng: 12.4769, image: "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?w=400&q=80" },
    ],
  },
  {
    name: "Tuscany",
    subtitle: "Rolling hills & wine",
    lat: 43.7696,
    lng: 11.2558,
    color: "#5C6B3C",
    order: 4,
    sites: [
      { name: "Florence Duomo", icon: Church, desc: "Brunelleschi's dome — 463 steps to the top", lat: 43.7731, lng: 11.2560, image: "https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?w=400&q=80" },
      { name: "Uffizi Gallery", icon: Palette, desc: "Botticelli's Birth of Venus", lat: 43.7677, lng: 11.2553, image: "https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=400&q=80" },
      { name: "Chianti Wine Region", icon: Wine, desc: "Vineyards and Tuscan farmhouse lunches", lat: 43.4700, lng: 11.2500, image: "https://images.unsplash.com/photo-1523528283115-9bf9b1699245?w=400&q=80" },
      { name: "Siena", icon: Landmark, desc: "Medieval piazza and Gothic cathedral", lat: 43.3188, lng: 11.3308, image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&q=80" },
      { name: "San Gimignano", icon: Camera, desc: "Medieval hilltop town famous for towers", lat: 43.4677, lng: 11.0434, image: "https://images.unsplash.com/photo-1595854341625-f2e12dbce3e8?w=400&q=80" },
      { name: "Val d'Orcia", icon: Camera, desc: "UNESCO cypress-lined roads", lat: 43.0620, lng: 11.5500, image: "https://images.unsplash.com/photo-1611264788618-39f1adb1342f?w=400&q=80" },
    ],
  },
  {
    name: "Cinque Terre",
    subtitle: "Colorful villages",
    lat: 44.1461,
    lng: 9.6563,
    color: "#D4A843",
    order: 5,
    sites: [
      { name: "Monterosso al Mare", icon: Camera, desc: "Largest village with the best beach", lat: 44.1461, lng: 9.6545, image: "https://images.unsplash.com/photo-1538098685723-0ceb8b083810?w=400&q=80" },
      { name: "Vernazza", icon: Ship, desc: "Most photogenic village with tiny harbor", lat: 44.1353, lng: 9.6843, image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=400&q=80" },
      { name: "Manarola", icon: Camera, desc: "Colorful houses — stunning at sunset", lat: 44.1069, lng: 9.7273, image: "https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=400&q=80" },
      { name: "Sentiero Azzurro", icon: Star, desc: "Coastal trail connecting all five villages", lat: 44.1270, lng: 9.6900, image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&q=80" },
      { name: "Corniglia", icon: Wine, desc: "Quiet hilltop village with vineyards", lat: 44.1194, lng: 9.7103, image: "https://images.unsplash.com/photo-1569949237615-e2defbeb5e96?w=400&q=80" },
      { name: "Riomaggiore", icon: Camera, desc: "Dramatic cliffside southernmost village", lat: 44.0990, lng: 9.7380, image: "https://images.unsplash.com/photo-1547985949-04b647f025d7?w=400&q=80" },
    ],
  },
  {
    name: "Venice",
    subtitle: "Grand finale",
    lat: 45.4408,
    lng: 12.3155,
    color: "#1E3A5F",
    order: 6,
    sites: [
      { name: "St. Mark's Basilica", icon: Church, desc: "Byzantine cathedral with golden mosaics", lat: 45.4345, lng: 12.3397, image: "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=400&q=80" },
      { name: "Grand Canal", icon: Ship, desc: "Ride the vaporetto past palaces", lat: 45.4375, lng: 12.3280, image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&q=80" },
      { name: "Rialto Bridge", icon: Landmark, desc: "Iconic stone bridge and market", lat: 45.4381, lng: 12.3358, image: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=400&q=80" },
      { name: "Doge's Palace", icon: Landmark, desc: "Gothic masterpiece of Venetian power", lat: 45.4336, lng: 12.3401, image: "https://images.unsplash.com/photo-1544413660-299165566b1d?w=400&q=80" },
      { name: "Murano & Burano", icon: Palette, desc: "Glass-blowing and rainbow houses", lat: 45.4585, lng: 12.3522, image: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=400&q=80" },
      { name: "Gondola at Sunset", icon: Star, desc: "Classic Venetian canal experience", lat: 45.4340, lng: 12.3360, image: "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?w=400&q=80" },
    ],
  },
];

const routePath: [number, number][] = destinations
  .sort((a, b) => a.order - b.order)
  .map((d) => [d.lat, d.lng]);

function FlyToDestination({ dest }: { dest: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (!dest) {
      map.flyTo([42.5, 12.5], 6, { duration: 1.2 });
      return;
    }
    const found = destinations.find((d) => d.name === dest);
    if (found) {
      map.flyTo([found.lat, found.lng], 10, { duration: 1.2 });
    }
  }, [dest, map]);
  return null;
}

export default function ItalyMap() {
  const [showSites, setShowSites] = useState(true);
  const [selectedDest, setSelectedDest] = useState<string | null>(null);
  const [leaflet, setLeaflet] = useState<typeof L | null>(null);

  useEffect(() => {
    import("leaflet").then((mod) => {
      const Leaf = mod.default;
      delete (Leaf.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      Leaf.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
      setLeaflet(Leaf);
    });
  }, []);

  const icons = useMemo(() => {
    if (!leaflet) return null;
    return {
      destination: (color: string) =>
        leaflet.divIcon({
          className: "",
          html: `<div style="
            width: 32px; height: 32px; border-radius: 50%;
            background: ${color}; border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          "></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -20],
        }),
      site: leaflet.divIcon({
        className: "",
        html: `<div style="
          width: 20px; height: 20px; border-radius: 50%;
          background: #D4A843; border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.25);
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -12],
      }),
    };
  }, [leaflet]);

  const center: [number, number] = [42.5, 12.5];

  if (!leaflet || !icons) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-semibold text-navy">
          Interactive Trip Map
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSites(!showSites)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              showSites
                ? "bg-gold/15 text-gold-dark"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {showSites ? "Hide Sites" : "Show Sites"}
          </button>
          {selectedDest && (
            <button
              onClick={() => setSelectedDest(null)}
              className="text-xs px-3 py-1.5 rounded-full bg-terracotta/10 text-terracotta font-medium"
            >
              Show All
            </button>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {destinations.map((dest) => (
          <button
            key={dest.name}
            onClick={() =>
              setSelectedDest(selectedDest === dest.name ? null : dest.name)
            }
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
              selectedDest === dest.name
                ? "ring-2 ring-offset-1"
                : "opacity-80 hover:opacity-100"
            }`}
            style={{
              backgroundColor: `${dest.color}15`,
              color: dest.color,
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: dest.color }}
            />
            {dest.name}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <MapContainer
          center={center}
          zoom={6}
          scrollWheelZoom={true}
          style={{ height: "500px", width: "100%" }}
          className="z-0"
        >
          <FlyToDestination dest={selectedDest} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Route polyline */}
          <Polyline
            positions={routePath}
            pathOptions={{
              color: "#C75B39",
              weight: 3,
              opacity: 0.6,
              dashArray: "8, 8",
            }}
          />

          {/* Destination markers */}
          {destinations
            .filter((d) => !selectedDest || selectedDest === d.name)
            .map((dest) => (
              <Marker
                key={dest.name}
                position={[dest.lat, dest.lng]}
                icon={icons.destination(dest.color)}
              >
                <Popup>
                  <div className="text-center min-w-[140px]">
                    <strong className="text-sm">{dest.name}</strong>
                    <br />
                    <span className="text-xs text-gray-500">
                      {dest.subtitle}
                    </span>
                    <br />
                    <span className="text-[10px] text-gray-400">
                      Stop #{dest.order} &middot; {dest.sites.length} sites
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* Site markers */}
          {showSites &&
            destinations
              .filter((d) => !selectedDest || selectedDest === d.name)
              .flatMap((dest) =>
                dest.sites.map((site) => (
                  <Marker
                    key={`${dest.name}-${site.name}`}
                    position={[site.lat, site.lng]}
                    icon={icons.site}
                  >
                    <Popup maxWidth={240} minWidth={200}>
                      <div style={{ margin: "-13px -20px -13px -20px", width: "240px" }}>
                        <img
                          src={site.image}
                          alt={site.name}
                          style={{
                            width: "100%",
                            height: "130px",
                            objectFit: "cover",
                            borderRadius: "8px 8px 0 0",
                            display: "block",
                          }}
                        />
                        <div style={{ padding: "10px 14px 12px" }}>
                          <div style={{ fontWeight: 600, fontSize: "14px", color: "#1a1a1a", marginBottom: "3px" }}>
                            {site.name}
                          </div>
                          <div style={{ fontSize: "12px", color: "#6b7280", lineHeight: "1.4", marginBottom: "6px" }}>
                            {site.desc}
                          </div>
                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              color: dest.color,
                              display: "inline-block",
                              padding: "2px 8px",
                              borderRadius: "999px",
                              backgroundColor: `${dest.color}15`,
                            }}
                          >
                            {dest.name}
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))
              )}
        </MapContainer>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="font-serif text-2xl font-bold text-terracotta tabular-nums">
            {destinations.length}
          </div>
          <div className="text-xs text-gray-400">Destinations</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="font-serif text-2xl font-bold text-navy tabular-nums">
            {destinations.reduce((sum, d) => sum + d.sites.length, 0)}
          </div>
          <div className="text-xs text-gray-400">Sites to Visit</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="font-serif text-2xl font-bold text-olive tabular-nums">
            15
          </div>
          <div className="text-xs text-gray-400">Days of Adventure</div>
        </div>
      </div>
    </div>
  );
}
