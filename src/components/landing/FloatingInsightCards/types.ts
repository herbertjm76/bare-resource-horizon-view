
import { LucideIcon } from "lucide-react";

export interface InsightData {
  title: string;
  kpi: string;
  description: string;
  icon: LucideIcon;
  color: string;
  hasSubtitle: boolean;
}

export interface InsightStyles {
  bg: string;
  iconBg: string;
  iconColor: string;
  textColor: string;
  numberColor: string;
  shadow: string;
}

export interface CardPosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  transform: string;
  scale: number;
}

export interface FloatingInsightCardsProps {
  utilizationRate: number;
  teamSize: number;
  activeProjects: number;
  timeRange: "week" | "month" | "quarter" | "year";
  scale?: number;
}
