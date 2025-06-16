
import {
  Calendar,
  Users,
  TrendingUp,
  AlertTriangle,
  Clock,
  BarChart3,
  Target,
  DollarSign,
} from "lucide-react";
import { InsightData, CardPosition } from "./types";

export const predefinedInsights: InsightData[] = [
  {
    title: "Real-time Availability",
    kpi: "8 staff free",
    description: "Next week capacity",
    icon: Users,
    color: "emerald",
    hasSubtitle: true
  },
  {
    title: "Project Overruns",
    kpi: "3 alerts",
    description: "Behind schedule",
    icon: AlertTriangle,
    color: "red",
    hasSubtitle: true
  },
  {
    title: "87% Fee Burn Rate",
    kpi: "",
    description: "",
    icon: DollarSign,
    color: "orange",
    hasSubtitle: false
  },
  {
    title: "Team Utilization: 85%",
    kpi: "",
    description: "",
    icon: Target,
    color: "blue",
    hasSubtitle: false
  },
  {
    title: "Peak Season Alert",
    kpi: "Oct-Dec",
    description: "High demand period",
    icon: TrendingUp,
    color: "purple",
    hasSubtitle: true
  },
  {
    title: "15 Active Projects",
    kpi: "",
    description: "",
    icon: BarChart3,
    color: "teal",
    hasSubtitle: false
  }
];

export const getRandomPositions = (): CardPosition[] => [
  { 
    top: "-40px", 
    left: "8%", 
    transform: "translateY(-50%) rotate(-1deg)",
    scale: 0.9
  },
  { 
    top: "-35px", 
    right: "12%", 
    transform: "translateY(-50%) rotate(1.5deg)",
    scale: 0.85
  },
  { 
    top: "25%", 
    left: "-120px", 
    transform: "translateX(-100%) rotate(0.5deg)",
    scale: 0.95
  },
  { 
    top: "65%", 
    right: "-110px", 
    transform: "translateY(-50%) translateX(100%) rotate(-1deg)",
    scale: 0.8
  },
  { 
    bottom: "-20px", 
    left: "15%", 
    transform: "translateY(30%) rotate(1deg)",
    scale: 0.88
  },
  { 
    bottom: "-20px", 
    right: "18%", 
    transform: "translateY(30%) rotate(-1.5deg)",
    scale: 0.92
  }
];

// Generate random, staggered animation delays
export const getRandomAnimationDelays = (): string[] => {
  const baseDelays = [0.2, 0.8, 1.4, 2.1, 2.7, 3.5];
  const randomizedDelays = baseDelays.map(delay => {
    // Add random variation of ±0.3 seconds to each delay
    const variation = (Math.random() - 0.5) * 0.6;
    return Math.max(0, delay + variation);
  });
  
  return randomizedDelays.map(delay => `${delay.toFixed(1)}s`);
};
