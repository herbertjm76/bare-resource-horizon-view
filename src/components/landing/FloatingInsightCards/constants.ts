
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
    title: "15 Active Projects",
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

// More asymmetrical positioning that extends outside the image frame
export const getRandomPositions = (): CardPosition[] => {
  const isMobile = window.innerWidth < 640;
  const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
  
  if (isMobile) {
    // Don't show floating cards on mobile
    return [];
  }
  
  if (isTablet) {
    // Tablet positioning - more asymmetrical and extending outside
    return [
      // Top area - asymmetrical placement
      { top: '5%', left: '-8%', scale: 0.55, transform: 'rotate(-2deg)' },
      { top: '15%', right: '-12%', scale: 0.6, transform: 'rotate(3deg)' },
      // Middle area - off-center placement
      { top: '40%', left: '-15%', scale: 0.58, transform: 'rotate(1deg)' },
      // Bottom area - irregular spacing
      { bottom: '10%', right: '-10%', scale: 0.62, transform: 'rotate(-1deg)' }
    ];
  }
  
  // Desktop positioning - highly asymmetrical with overlap outside image
  return [
    // Top tier - scattered placement extending beyond frame
    { top: '2%', left: '-12%', scale: 0.65, transform: 'rotate(-2deg)' },
    { top: '18%', right: '-15%', scale: 0.7, transform: 'rotate(3deg)' },
    
    // Middle tier - irregular positioning outside frame
    { top: '32%', left: '-18%', scale: 0.6, transform: 'rotate(-1deg)' },
    { top: '55%', right: '-8%', scale: 0.68, transform: 'rotate(2deg)' },
    
    // Bottom tier - asymmetrical completion extending beyond boundaries
    { bottom: '25%', left: '-10%', scale: 0.63, transform: 'rotate(1deg)' },
    { bottom: '8%', right: '-20%', scale: 0.72, transform: 'rotate(-2deg)' }
  ];
};

export const getRandomAnimationDelays = (): string[] => {
  return ['0.8s', '1.2s', '1.6s', '2.0s', '2.4s', '2.8s'];
};
