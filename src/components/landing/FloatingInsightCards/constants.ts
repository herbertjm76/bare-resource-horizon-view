
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

// Balanced positioning inspired by the reference image
export const getRandomPositions = (): CardPosition[] => {
  const isMobile = window.innerWidth < 640;
  const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
  
  if (isMobile) {
    // Don't show floating cards on mobile
    return [];
  }
  
  if (isTablet) {
    // Tablet positioning with better balance and spacing
    return [
      { top: '6%', left: '4%', scale: 0.8, transform: 'rotate(-3deg)' },
      { top: '12%', right: '6%', scale: 0.85, transform: 'rotate(2deg)' },
      { bottom: '35%', left: '8%', scale: 0.75, transform: 'rotate(-2deg)' },
      { bottom: '18%', right: '10%', scale: 0.8, transform: 'rotate(3deg)' },
      { top: '42%', left: '2%', scale: 0.7, transform: 'rotate(1deg)' },
      { top: '58%', right: '4%', scale: 0.75, transform: 'rotate(-2deg)' }
    ];
  }
  
  // Desktop positioning with improved balance matching reference image
  return [
    { top: '8%', left: '4%', scale: 0.9, transform: 'rotate(-3deg)' },
    { top: '6%', right: '8%', scale: 0.95, transform: 'rotate(2deg)' },
    { bottom: '38%', left: '3%', scale: 0.85, transform: 'rotate(-2deg)' },
    { bottom: '22%', right: '6%', scale: 0.9, transform: 'rotate(3deg)' },
    { top: '32%', left: '1%', scale: 0.8, transform: 'rotate(1deg)' },
    { top: '48%', right: '2%', scale: 0.85, transform: 'rotate(-2deg)' }
  ];
};

export const getRandomAnimationDelays = (): string[] => {
  return ['0.8s', '1.2s', '1.6s', '2.0s', '2.4s', '2.8s'];
};
