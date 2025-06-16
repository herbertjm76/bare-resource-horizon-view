
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

// Positioning cards to extend beyond the main visual area for dynamic effect
export const getRandomPositions = (): CardPosition[] => {
  const isMobile = window.innerWidth < 640;
  const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
  
  if (isMobile) {
    // Don't show floating cards on mobile
    return [];
  }
  
  if (isTablet) {
    // Tablet positioning - extending beyond dashboard bounds
    return [
      // Far top left - extending beyond
      { top: '5%', left: '2%', scale: 0.7, transform: 'rotate(-3deg)' },
      // Far top right - extending beyond
      { top: '8%', right: '1%', scale: 0.75, transform: 'rotate(2deg)' },
      // Far bottom left - extending beyond
      { bottom: '10%', left: '1%', scale: 0.7, transform: 'rotate(-2deg)' },
      // Far bottom right - extending beyond
      { bottom: '5%', right: '3%', scale: 0.75, transform: 'rotate(3deg)' }
    ];
  }
  
  // Desktop positioning - cards extending well beyond the main visual area
  return [
    // Far top left - well outside the dashboard area
    { top: '8%', left: '1%', scale: 0.8, transform: 'rotate(-3deg)' },
    // Far top right - well outside the dashboard area
    { top: '12%', right: '2%', scale: 0.85, transform: 'rotate(2deg)' },
    // Far bottom left - well outside the dashboard area
    { bottom: '15%', left: '2%', scale: 0.75, transform: 'rotate(-2deg)' },
    // Far bottom right - well outside the dashboard area
    { bottom: '8%', right: '1%', scale: 0.8, transform: 'rotate(3deg)' }
  ];
};

export const getRandomAnimationDelays = (): string[] => {
  return ['0.8s', '1.2s', '1.6s', '2.0s'];
};
