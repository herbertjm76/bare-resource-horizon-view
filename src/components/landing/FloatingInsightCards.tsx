import React from "react";
import { getAllInsights } from "@/components/dashboard/insights/utils/insightAggregator";
import {
  Info,
  CircleCheck,
  CircleX,
  CirclePlus,
  CircleMinus,
  ArrowUp,
  ArrowDown,
  Users,
} from "lucide-react";

// ICONS: only use icons present in allowed list
const iconMap = {
  info: Info,
  critical: CircleX,
  warning: CircleMinus,
  success: CircleCheck,
  users: Users,
  plus: CirclePlus,
  up: ArrowUp,
  down: ArrowDown,
};

interface FloatingInsightCardsProps {
  utilizationRate: number;
  teamSize: number;
  activeProjects: number;
  timeRange: "week" | "month" | "quarter" | "year";
}

// Demo color mapping and number extraction
const colorMap = {
  critical: "text-red-500",
  warning: "text-yellow-500",
  success: "text-green-500",
  info: "text-indigo-500",
};

// Extract number/KPI from insight or fall back to demo metrics
function getInsightKPI(
  insight: any,
  { utilizationRate, teamSize, activeProjects }: { utilizationRate: number; teamSize: number; activeProjects: number }
) {
  // Look for % or # in strings (very basic extraction)
  const { description, title, category } = insight;
  const kpiMatch = description?.match(/(\d+(\.\d+)?%?)/)?.[0];
  if (kpiMatch) return kpiMatch;

  // Fallback: map common titles to hero metrics
  if (title?.toLowerCase().includes("utilization")) return utilizationRate + "%";
  if (title?.toLowerCase().includes("team")) return teamSize;
  if (title?.toLowerCase().includes("project")) return activeProjects;
  if (category?.toLowerCase().includes("team")) return teamSize;
  if (category?.toLowerCase().includes("project")) return activeProjects;
  return "—";
}

// Remove phrases/descriptions, keep succinct titles (max 3 words)
function getShortLabel(title: string) {
  // Usually these are short enough
  if (title.length <= 22) return title;
  // Take first 3 words of the title as label
  const parts = title.split(" ");
  return parts.slice(0, 3).join(" ");
}

const floatingPositions = [
  { top: "2%", left: "43%" },
  { top: "12%", right: "14%" },
  { top: "22%", left: "13%" },
  { top: "28%", right: "6%" },
  { bottom: "10%", left: "18%" },
  { bottom: "14%", right: "11%" },
  { top: "55%", left: "34%" },
  { bottom: "2%", left: "48%" },
  { top: "45%", right: "3%" },
];

export const FloatingInsightCards: React.FC<FloatingInsightCardsProps> = ({
  utilizationRate,
  teamSize,
  activeProjects,
  timeRange,
}) => {
  let insights: any[] = [];
  try {
    const timeRanges: any[] = ["week", "month", "quarter", "year"];
    const all: any[] = [];
    for (let r of timeRanges) {
      all.push(...getAllInsights(utilizationRate, teamSize, activeProjects, r));
    }
    insights = all.filter(
      (insight, idx, arr) =>
        arr.findIndex((i) => i.title === insight.title) === idx
    );
    if (insights.length < 9) {
      const repeat = [];
      let i = 0;
      while (repeat.length + insights.length < 9) {
        repeat.push(insights[i % insights.length]);
        i++;
      }
      insights = [...insights, ...repeat];
    }
    insights = insights.slice(0, 9);
  } catch {
    return null;
  }

  // Props to pass for extracting KPI numbers
  const heroMetrics = { utilizationRate, teamSize, activeProjects };

  return (
    <>
      {insights.map((insight, idx) => {
        // Icon/type/color
        const Icon = iconMap[insight.type] ?? Info;
        const color = colorMap[insight.type] || colorMap.info;

        // Condensed KPI + label
        const number = getInsightKPI(insight, heroMetrics);
        const shortLabel = getShortLabel(insight.title);

        return (
          <div
            key={insight.title + idx}
            className={`absolute z-20 w-40 min-h-20 transition-transform duration-300
              hover:scale-105 shadow-lg rounded-xl bg-white/95 border border-gray-100 flex flex-col items-center
              justify-center
              px-2 py-2`}
            style={{
              ...floatingPositions[idx],
              boxShadow: "0 4px 32px 0 rgba(120, 100, 240, 0.13)",
              pointerEvents: "auto",
            }}
          >
            {/* Icon */}
            <div className="mb-1 flex items-center justify-center">
              <Icon className={`w-7 h-7 ${color} drop-shadow`} />
            </div>
            {/* Big Number */}
            <div className="font-bold text-2xl md:text-3xl text-gray-900 mb-1 text-center">
              {number}
            </div>
            {/* Short Label */}
            <div className="text-xs font-semibold text-gray-500 text-center truncate px-1">
              {shortLabel}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default FloatingInsightCards;
