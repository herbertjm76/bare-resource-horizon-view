import { TrendingUp, Users, Calendar, Clock, Target, CheckCircle } from "lucide-react";
import { InsightData, CardPosition } from "./types";

export const predefinedInsights: InsightData[] = [
  {
    title: "87% Team Utilization",
    kpi: "87%",
    description: "Optimal capacity",
    icon: TrendingUp,
    color: "green",
    hasSubtitle: true
  },
  {
    title: "12 Active Team Members",
    kpi: "12",
    description: "Available resources",
    icon: Users,
    color: "blue",
    hasSubtitle: true
  },
  {
    title: "15 Active Projects",
    kpi: "15",
    description: "In progress",
    icon: Target,
    color: "purple",
    hasSubtitle: true
  },
  {
    title: "On Track This Month",
    icon: CheckCircle,
    color: "green",
    hasSubtitle: false
  },
  {
    title: "Average Project: 3.2 Weeks",
    kpi: "3.2 weeks",
    description: "Delivery time",
    icon: Clock,
    color: "teal",
    hasSubtitle: true
  },
  {
    title: "Peak Capacity: Dec 15",
    kpi: "Dec 15",
    description: "Next bottleneck",
    icon: Calendar,
    color: "orange",
    hasSubtitle: true
  }
];

// Positioning to keep cards within the dashboard illustration bounds like the reference image
export const getRandomPositions = (): CardPosition[] => {
  const isMobile = window.innerWidth < 640;
  const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
  
  if (isMobile) {
    // Don't show floating cards on mobile
    return [];
  }
  
  if (isTablet) {
    // Tablet positioning - keeping cards closer to center within dashboard bounds
    return [
      // Top left - within dashboard area
      { top: '18%', left: '8%', scale: 0.75, transform: 'rotate(-2deg)' },
      // Top right - within dashboard area
      { top: '15%', right: '12%', scale: 0.8, transform: 'rotate(1deg)' },
      // Bottom left - within dashboard area
      { bottom: '20%', left: '10%', scale: 0.75, transform: 'rotate(-1deg)' },
      // Bottom right - within dashboard area
      { bottom: '25%', right: '15%', scale: 0.8, transform: 'rotate(2deg)' }
    ];
  }
  
  // Desktop positioning - matching reference image exactly, keeping within dashboard bounds
  return [
    // Top left area - positioned within the dashboard illustration
    { top: '20%', left: '8%', scale: 0.85, transform: 'rotate(-2deg)' },
    // Top right area - positioned within the dashboard illustration
    { top: '18%', right: '10%', scale: 0.9, transform: 'rotate(1deg)' },
    // Bottom left area - positioned within the dashboard illustration
    { bottom: '25%', left: '12%', scale: 0.8, transform: 'rotate(-1deg)' },
    // Bottom right area - positioned within the dashboard illustration
    { bottom: '30%', right: '15%', scale: 0.85, transform: 'rotate(2deg)' }
  ];
};

export const getRandomAnimationDelays = (): string[] => {
  return ['0.8s', '1.2s', '1.6s', '2.0s'];
};
