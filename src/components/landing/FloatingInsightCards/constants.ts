
import { TrendingUp, Users, Calendar, Clock, Target, CheckCircle, AlertTriangle, DollarSign, UserCheck, Zap } from "lucide-react";
import { InsightData, CardPosition } from "./types";

export const predefinedInsights: InsightData[] = [
  {
    title: "Sarah 150% Overbooked",
    icon: AlertTriangle,
    color: "red",
    hasSubtitle: false
  },
  {
    title: "6 People Away Next Week",
    icon: Calendar,
    color: "orange",
    hasSubtitle: false
  },
  {
    title: "15 Active Projects Running",
    icon: Target,
    color: "purple",
    hasSubtitle: false
  },
  {
    title: "5 Available Resources",
    icon: UserCheck,
    color: "green",
    hasSubtitle: false
  },
  {
    title: "Team Overload Warning",
    icon: Zap,
    color: "red",
    hasSubtitle: false
  },
  {
    title: "85% Budget Burned",
    icon: DollarSign,
    color: "orange",
    hasSubtitle: false
  }
];

// Balanced asymmetrical positioning with better visual hierarchy
export const getRandomPositions = (): CardPosition[] => {
  const isMobile = window.innerWidth < 640;
  const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
  
  if (isMobile) {
    // Don't show floating cards on mobile
    return [];
  }
  
  if (isTablet) {
    // Tablet positioning - strategic asymmetrical placement
    return [
      // Top tier - creating visual flow
      { top: '8%', left: '-10%', scale: 0.65, transform: 'rotate(-1.5deg)' },
      { top: '20%', right: '-12%', scale: 0.7, transform: 'rotate(2deg)' },
      // Middle tier - balanced asymmetry
      { top: '45%', left: '-14%', scale: 0.68, transform: 'rotate(0.5deg)' },
      // Bottom tier - completing the composition
      { bottom: '15%', right: '-8%', scale: 0.72, transform: 'rotate(-1deg)' }
    ];
  }
  
  // Desktop positioning - sophisticated asymmetrical composition
  return [
    // Top tier - establishing visual hierarchy
    { top: '5%', left: '-8%', scale: 0.7, transform: 'rotate(-1.5deg)' },
    { top: '22%', right: '-10%', scale: 0.75, transform: 'rotate(2deg)' },
    
    // Middle tier - creating visual balance
    { top: '38%', left: '-12%', scale: 0.68, transform: 'rotate(-0.5deg)' },
    { top: '58%', right: '-6%', scale: 0.73, transform: 'rotate(1.5deg)' },
    
    // Bottom tier - completing the visual story
    { bottom: '28%', left: '-6%', scale: 0.69, transform: 'rotate(0.8deg)' },
    { bottom: '12%', right: '-14%', scale: 0.76, transform: 'rotate(-1.2deg)' }
  ];
};

export const getRandomAnimationDelays = (): string[] => {
  return ['0.8s', '1.2s', '1.6s', '2.0s', '2.4s', '2.8s'];
};
