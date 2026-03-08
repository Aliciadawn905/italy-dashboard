"use client";

import { TabId } from "@/lib/types";
import {
  LayoutDashboard,
  Plane,
  Calendar,
  UtensilsCrossed,
  MapPin,
  StickyNote,
} from "lucide-react";

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "flights", label: "Flights", icon: Plane },
  { id: "itinerary", label: "Itinerary", icon: Calendar },
  { id: "restaurants", label: "Restaurants", icon: UtensilsCrossed },
  { id: "activities", label: "Tours & Activities", icon: MapPin },
  { id: "notes", label: "Ideas & Notes", icon: StickyNote },
];

interface TabNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto py-1 -mb-px scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-terracotta/10 text-terracotta"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
