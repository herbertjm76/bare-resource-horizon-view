
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
    top: "-50px", 
    left: "12%", 
    transform: "translateY(-50%) rotate(-1.5deg)",
    scale: 1.1
  },
  { 
    top: "-45px", 
    right: "15%", 
    transform: "translateY(-50%) rotate(2deg)",
    scale: 0.9
  },
  { 
    top: "20%", 
    left: "-160px", 
    transform: "translateX(-100%) rotate(1deg)",
    scale: 1.2
  },
  { 
    top: "60%", 
    right: "-140px", 
    transform: "translateY(-50%) translateX(100%) rotate(-1.5deg)",
    scale: 0.8
  },
  { 
    bottom: "-90px", 
    left: "8%", 
    transform: "translateY(50%) rotate(1.5deg)",
    scale: 1.0
  },
  { 
    bottom: "-85px", 
    right: "20%", 
    transform: "translateY(50%) rotate(-2deg)",
    scale: 0.95
  }
];

export const animationDelays = [
  "0s", "0.4s", "0.8s", "1.2s", "1.6s", "2.0s"
];
