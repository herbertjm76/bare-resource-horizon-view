
import {
  TrendingUp,
  Users,
  Clock,
  Target,
  CheckCircle2,
  AlertTriangle,
  Activity,
  BarChart3,
  DollarSign,
  Calendar,
  UserPlus,
  Briefcase,
} from "lucide-react";
import { InsightData, CardPosition } from "./types";

export const predefinedInsights: InsightData[] = [
  {
    title: "Project Overrun Alert",
    kpi: "3 projects",
    description: "Behind schedule",
    icon: AlertTriangle,
    color: "red",
    hasSubtitle: true
  },
  {
    title: "Available Next Week",
    kpi: "8 staff",
    description: "Ready for projects",
    icon: Users,
    color: "green",
    hasSubtitle: true
  },
  {
    title: "September Capacity",
    kpi: "85%",
    description: "Well utilized",
    icon: Target,
    color: "blue",
    hasSubtitle: true
  },
  {
    title: "Fee burn this month: 87%",
    kpi: "",
    description: "",
    icon: DollarSign,
    color: "orange",
    hasSubtitle: false
  },
  {
    title: "Projects completed: 12",
    kpi: "",
    description: "",
    icon: CheckCircle2,
    color: "green",
    hasSubtitle: false
  },
  {
    title: "Peak period: Oct-Nov",
    kpi: "",
    description: "",
    icon: Calendar,
    color: "purple",
    hasSubtitle: false
  }
];

export const getRandomPositions = (): CardPosition[] => [
  { 
    top: "-40px", 
    left: "18%", 
    transform: "translateY(-50%) rotate(-2deg)",
    scale: 1.1
  },
  { 
    top: "-30px", 
    right: "8%", 
    transform: "translateY(-50%) rotate(1deg)",
    scale: 0.85
  },
  { 
    top: "25%", 
    left: "-140px", 
    transform: "translateX(-100%) rotate(-1deg)",
    scale: 1.3
  },
  { 
    top: "55%", 
    right: "-120px", 
    transform: "translateY(-50%) translateX(100%) rotate(2deg)",
    scale: 0.75
  },
  { 
    bottom: "-80px", 
    left: "5%", 
    transform: "translateY(50%) rotate(1deg)",
    scale: 1.05
  },
  { 
    bottom: "-80px", 
    right: "15%", 
    transform: "translateY(50%) rotate(-1deg)",
    scale: 0.9
  }
];

export const animationDelays = [
  "0s", "0.3s", "0.6s", "0.9s", "1.2s", "1.5s"
];
