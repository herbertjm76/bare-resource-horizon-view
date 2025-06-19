
import { AlertTriangle, UserCheck, Calendar } from "lucide-react";
import { InsightData, CardPosition } from "./types";

export const predefinedInsights: InsightData[] = [
  {
    title: "Sarah 150% Overbooked",
    icon: AlertTriangle,
    color: "red",
    hasSubtitle: false
  },
  {
    title: "5 Available Resources",
    icon: UserCheck,
    color: "green",
    hasSubtitle: false
  },
  {
    title: "6 People Away Next Week",
    icon: Calendar,
    color: "orange",
    hasSubtitle: false
  }
];

// Positioning to match the reference image exactly
export const getRandomPositions = (): CardPosition[] => {
  const isMobile = window.innerWidth < 640;
  const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
  
  if (isMobile) {
    // Don't show floating cards on mobile
    return [];
  }
  
  if (isTablet) {
    // Tablet positioning - matching reference image layout
    return [
      // Top left - "Sarah 150% Overbooked" (red alert card)
      { top: '12%', left: '-15%', scale: 0.75, transform: 'rotate(-2deg)' },
      // Top right - "5 Available Resources" (green card)
      { top: '18%', right: '-12%', scale: 0.7, transform: 'rotate(1.5deg)' },
      // Bottom right - "6 People Away Next Week" (orange card)
      { bottom: '20%', right: '-8%', scale: 0.72, transform: 'rotate(-1deg)' }
    ];
  }
  
  // Desktop positioning - exactly matching the reference image
  return [
    // Top left - "Sarah 150% Overbooked" (red alert card like "110% Capacity")
    { top: '8%', left: '-12%', scale: 0.8, transform: 'rotate(-2deg)' },
    // Top right - "5 Available Resources" (green card like "3 Weeks Free")
    { top: '15%', right: '-10%', scale: 0.75, transform: 'rotate(1.5deg)' },
    // Bottom right - "6 People Away Next Week" (orange card like "75% Fee Burn Alert")
    { bottom: '18%', right: '-8%', scale: 0.78, transform: 'rotate(-1deg)' }
  ];
};

export const getRandomAnimationDelays = (): string[] => {
  return ['0.8s', '1.2s', '1.6s'];
};
