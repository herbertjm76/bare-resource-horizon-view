
import { TrendingUp, Users, Calendar, Clock, Target, CheckCircle, AlertTriangle, DollarSign, UserCheck, Zap } from "lucide-react";
import { InsightData, CardPosition } from "./types";

export const predefinedInsights: InsightData[] = [
  {
    title: "150% Capacity Alert",
    kpi: "150%",
    description: "Sarah is overbooked",
    icon: AlertTriangle,
    color: "red",
    hasSubtitle: true
  },
  {
    title: "Peak Leave Week",
    kpi: "6 members",
    description: "Away next week",
    icon: Calendar,
    color: "orange",
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
    title: "5 Available Resources",
    kpi: "5 people",
    description: "Ready for allocation",
    icon: UserCheck,
    color: "green",
    hasSubtitle: true
  },
  {
    title: "Team Overload Warning",
    icon: Zap,
    color: "red",
    hasSubtitle: false
  },
  {
    title: "Fee Burn Alert!",
    kpi: "85%",
    description: "Budget consumed",
    icon: DollarSign,
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
