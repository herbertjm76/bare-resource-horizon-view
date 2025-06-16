
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

// Positioning to match the reference image locations
export const getRandomPositions = (): CardPosition[] => {
  const isMobile = window.innerWidth < 640;
  const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
  
  if (isMobile) {
    // Don't show floating cards on mobile
    return [];
  }
  
  if (isTablet) {
    // Tablet positioning - matching reference image proportions
    return [
      // Top left area (utilization card)
      { top: '12%', left: '4%', scale: 0.8, transform: 'rotate(-2deg)' },
      // Top right area (trend chart)
      { top: '8%', right: '5%', scale: 0.85, transform: 'rotate(1deg)' },
      // Bottom left area (projects in progress)
      { bottom: '12%', left: '6%', scale: 0.8, transform: 'rotate(-1deg)' },
      // Bottom right area (on track status)
      { bottom: '15%', right: '8%', scale: 0.85, transform: 'rotate(2deg)' }
    ];
  }
  
  // Desktop positioning - matching reference image exactly
  return [
    // Top left area (87% utilization card position)
    { top: '15%', left: '3%', scale: 0.9, transform: 'rotate(-2deg)' },
    // Top right area (trend chart position)
    { top: '10%', right: '4%', scale: 0.95, transform: 'rotate(1deg)' },
    // Bottom left area (15 projects card position)
    { bottom: '18%', left: '5%', scale: 0.85, transform: 'rotate(-1deg)' },
    // Bottom right area (on track status position)
    { bottom: '20%', right: '6%', scale: 0.9, transform: 'rotate(2deg)' }
  ];
};

export const getRandomAnimationDelays = (): string[] => {
  return ['0.8s', '1.2s', '1.6s', '2.0s'];
};
