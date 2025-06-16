
import { TrendingUp, Users, Calendar, DollarSign, Target, CheckCircle } from "lucide-react";
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
    title: "$127K Revenue Pipeline",
    kpi: "$127K",
    description: "Next 30 days",
    icon: DollarSign,
    color: "yellow",
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

// Mobile-safe positions that stay within viewport bounds
export const getRandomPositions = (): CardPosition[] => {
  const isMobile = window.innerWidth < 640;
  const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
  
  if (isMobile) {
    // Don't show floating cards on mobile
    return [];
  }
  
  if (isTablet) {
    // Conservative positioning for tablets
    return [
      { top: '5%', left: '5%', scale: 0.7, transform: 'rotate(-2deg)' },
      { top: '15%', right: '5%', scale: 0.8, transform: 'rotate(1deg)' },
      { bottom: '25%', left: '8%', scale: 0.75, transform: 'rotate(-1deg)' },
      { bottom: '15%', right: '8%', scale: 0.7, transform: 'rotate(2deg)' },
      { top: '35%', left: '2%', scale: 0.65, transform: 'rotate(1deg)' },
      { top: '45%', right: '2%', scale: 0.7, transform: 'rotate(-1deg)' }
    ];
  }
  
  // Desktop positioning with better boundaries
  return [
    { top: '8%', left: '2%', scale: 0.85, transform: 'rotate(-3deg)' },
    { top: '12%', right: '5%', scale: 0.9, transform: 'rotate(2deg)' },
    { bottom: '30%', left: '5%', scale: 0.8, transform: 'rotate(-2deg)' },
    { bottom: '20%', right: '8%', scale: 0.85, transform: 'rotate(1deg)' },
    { top: '40%', left: '-2%', scale: 0.75, transform: 'rotate(2deg)' },
    { top: '50%', right: '2%', scale: 0.8, transform: 'rotate(-1deg)' }
  ];
};

export const getRandomAnimationDelays = (): string[] => {
  return ['0.8s', '1.2s', '1.6s', '2.0s', '2.4s', '2.8s'];
};
