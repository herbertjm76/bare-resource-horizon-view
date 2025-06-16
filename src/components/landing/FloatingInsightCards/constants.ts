
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

// Improved balanced positioning for floating cards
export const getRandomPositions = (): CardPosition[] => {
  const isMobile = window.innerWidth < 640;
  const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
  
  if (isMobile) {
    // Don't show floating cards on mobile
    return [];
  }
  
  if (isTablet) {
    // Balanced positioning for tablets with more spacing
    return [
      { top: '8%', left: '3%', scale: 0.75, transform: 'rotate(-2deg)' },
      { top: '18%', right: '5%', scale: 0.8, transform: 'rotate(1deg)' },
      { bottom: '35%', left: '6%', scale: 0.7, transform: 'rotate(-1deg)' },
      { bottom: '20%', right: '8%', scale: 0.75, transform: 'rotate(2deg)' },
      { top: '45%', left: '1%', scale: 0.65, transform: 'rotate(1deg)' },
      { top: '55%', right: '3%', scale: 0.7, transform: 'rotate(-1deg)' }
    ];
  }
  
  // Desktop positioning with improved balance and spacing
  return [
    { top: '10%', left: '3%', scale: 0.85, transform: 'rotate(-2deg)' },
    { top: '8%', right: '6%', scale: 0.9, transform: 'rotate(1deg)' },
    { bottom: '40%', left: '2%', scale: 0.8, transform: 'rotate(-1deg)' },
    { bottom: '25%', right: '4%', scale: 0.85, transform: 'rotate(2deg)' },
    { top: '35%', left: '1%', scale: 0.75, transform: 'rotate(1deg)' },
    { top: '50%', right: '1%', scale: 0.8, transform: 'rotate(-2deg)' }
  ];
};

export const getRandomAnimationDelays = (): string[] => {
  return ['0.8s', '1.2s', '1.6s', '2.0s', '2.4s', '2.8s'];
};
