"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";

function FitBounds({ bounds }: { bounds: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [32, 32], maxZoom: 10 });
    }
  }, [map, bounds]);
  return null;
}

interface RouteMapProps {
  waypoints: [number, number][][];
  labels: { name: string; lat: number; lng: number }[];
  modeColors: string[];
}

export default function RouteMap({ waypoints, labels, modeColors: segColors }: RouteMapProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [leaflet, setLeaflet] = useState<any>(null);

  useEffect(() => {
    import("leaflet").then((mod) => {
      const L = mod.default || mod;
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setLeaflet(L);
    });
  }, []);

  const allPoints = waypoints.flat();
  const center: [number, number] = allPoints.length
    ? [
        allPoints.reduce((s, p) => s + p[0], 0) / allPoints.length,
        allPoints.reduce((s, p) => s + p[1], 0) / allPoints.length,
      ]
    : [42.5, 12.5];

  const markers = useMemo(() => {
    if (!leaflet) return null;
    return labels.map((label, i) => {
      const isFirst = i === 0;
      const isLast = i === labels.length - 1;
      const color = isFirst ? "#1E3A5F" : isLast ? "#C75B39" : "#5C6B3C";
      const icon = leaflet.divIcon({
        className: "",
        html: `<div style="width:12px;height:12px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });
      return (
        <Marker key={label.name} position={[label.lat, label.lng]} icon={icon}>
          <Popup>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{label.name}</span>
          </Popup>
        </Marker>
      );
    });
  }, [leaflet, labels]);

  if (!leaflet) {
    return (
      <div className="flex items-center justify-center h-full bg-cream/50 rounded-xl">
        <div className="w-5 h-5 border-2 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
      </div>
    );
  }

  const colorToMode: Record<string, string> = {
    "#1E3A5F": "train",
    "#5C6B3C": "bus",
    "#C75B39": "ferry",
  };
  const dashPatterns: Record<string, string> = {
    train: "",
    bus: "8 6",
    ferry: "4 8",
  };

  return (
    <MapContainer
      center={center}
      zoom={7}
      scrollWheelZoom={false}
      dragging={true}
      zoomControl={false}
      style={{ height: "100%", width: "100%", borderRadius: 12 }}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FitBounds bounds={allPoints} />
      {waypoints.map((pts, i) => {
        const mode = colorToMode[segColors[i]] || "train";
        return (
          <Polyline
            key={i}
            positions={pts}
            pathOptions={{
              color: segColors[i] || "#C75B39",
              weight: 3,
              opacity: 0.8,
              dashArray: dashPatterns[mode],
            }}
          />
        );
      })}
      {markers}
    </MapContainer>
  );
}
