
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

// Redesigned positioning for better visual balance with the main image
export const getRandomPositions = (): CardPosition[] => {
  const isMobile = window.innerWidth < 640;
  const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
  
  if (isMobile) {
    // Don't show floating cards on mobile
    return [];
  }
  
  if (isTablet) {
    // Tablet positioning - closer to image with better balance
    return [
      // Top area - balanced on both sides
      { top: '8%', left: '2%', scale: 0.6, transform: 'rotate(-1deg)' },
      { top: '12%', right: '1%', scale: 0.65, transform: 'rotate(2deg)' },
      // Bottom area - symmetrical placement
      { bottom: '15%', left: '1%', scale: 0.6, transform: 'rotate(1deg)' },
      { bottom: '18%', right: '2%', scale: 0.65, transform: 'rotate(-2deg)' }
    ];
  }
  
  // Desktop positioning - better integration with the image
  return [
    // Top tier - balanced distribution
    { top: '5%', left: '3%', scale: 0.7, transform: 'rotate(-1deg)' },
    { top: '8%', right: '2%', scale: 0.75, transform: 'rotate(2deg)' },
    
    // Middle tier - side placement for depth
    { top: '35%', left: '1%', scale: 0.65, transform: 'rotate(-2deg)' },
    { top: '45%', right: '0%', scale: 0.7, transform: 'rotate(1deg)' },
    
    // Bottom tier - completing the frame
    { bottom: '20%', left: '2%', scale: 0.68, transform: 'rotate(1deg)' },
    { bottom: '25%', right: '1%', scale: 0.72, transform: 'rotate(-1deg)' }
  ];
};

export const getRandomAnimationDelays = (): string[] => {
  return ['0.8s', '1.2s', '1.6s', '2.0s', '2.4s', '2.8s'];
};
