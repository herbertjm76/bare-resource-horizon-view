
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

// Positioning cards to overlap outside the image div margins
export const getRandomPositions = (): CardPosition[] => {
  const isMobile = window.innerWidth < 640;
  const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
  
  if (isMobile) {
    // Don't show floating cards on mobile
    return [];
  }
  
  if (isTablet) {
    // Tablet positioning - overlapping the image margins
    return [
      // Top left - overlapping from outside
      { top: '15%', left: '-5%', scale: 0.7, transform: 'rotate(-2deg)' },
      // Top right - overlapping from outside
      { top: '10%', right: '-8%', scale: 0.75, transform: 'rotate(3deg)' },
      // Bottom left - overlapping from outside
      { bottom: '20%', left: '-3%', scale: 0.7, transform: 'rotate(-1deg)' },
      // Bottom right - overlapping from outside
      { bottom: '15%', right: '-6%', scale: 0.75, transform: 'rotate(2deg)' }
    ];
  }
  
  // Desktop positioning - cards overlapping the image div margins
  return [
    // Top left - extending from outside the image area
    { top: '10%', left: '-8%', scale: 0.8, transform: 'rotate(-2deg)' },
    // Top right - extending from outside the image area
    { top: '5%', right: '-10%', scale: 0.85, transform: 'rotate(3deg)' },
    // Bottom left - extending from outside the image area
    { bottom: '25%', left: '-6%', scale: 0.75, transform: 'rotate(-1deg)' },
    // Bottom right - extending from outside the image area
    { bottom: '20%', right: '-8%', scale: 0.8, transform: 'rotate(2deg)' },
    // Middle left - overlapping the left margin
    { top: '40%', left: '-4%', scale: 0.7, transform: 'rotate(-3deg)' },
    // Middle right - overlapping the right margin
    { top: '50%', right: '-5%', scale: 0.75, transform: 'rotate(1deg)' }
  ];
};

export const getRandomAnimationDelays = (): string[] => {
  return ['0.8s', '1.2s', '1.6s', '2.0s', '2.4s', '2.8s'];
};
