
import React from "react";
import { getAllInsights } from "@/components/dashboard/insights/utils/insightAggregator";
import { Info, CircleCheck, CircleX, CirclePlus, CircleMinus, ArrowUp, ArrowDown, FilePlus, FileX } from "lucide-react";

// Available icons mapping to best-match Lucide icons in landing visuals
const iconMap = {
  info: Info,
  critical: CircleX,
  warning: CircleMinus,
  success: CircleCheck,
};

interface FloatingInsightCardsProps {
  // Realistic utilization/size/project values for insight generation
  utilizationRate: number;
  teamSize: number;
  activeProjects: number;
  timeRange: "week" | "month" | "quarter" | "year";
}

const floatingPositions = [
  // These percentages position the cards roughly around a dashboard image.
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
  timeRange
}) => {
  // We use getAllInsights to get a list (sorted) of all insight types, not just top 3.
  // We'll use round-robin of insight-generating logic (for demo purposes).
  let insights: any[] = [];
  try {
    // Simulate calling for 4 different ranges and combining results uniquely.
    const timeRanges: any[] = ["week", "month", "quarter", "year"];
    const all: any[] = [];
    for (let r of timeRanges) {
      all.push(...getAllInsights(utilizationRate, teamSize, activeProjects, r));
    }
    // Remove duplicates by title.
    insights = all.filter(
      (insight, idx, arr) =>
        arr.findIndex((i) => i.title === insight.title) === idx
    );
    // We want 9, if fewer, duplicate up to fill.
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

  return (
    <>
      {insights.map((insight, idx) => {
        // Use color scheme and shadow to float over dashboard image
        const Icon = iconMap[insight.type] ?? Info;
        return (
          <div
            key={insight.title + idx}
            className={`absolute z-20 w-56 max-w-xs min-h-14 transition-transform duration-300 
              hover:scale-105 shadow-lg rounded-xl bg-white/90 border border-gray-200
            `}
            style={{
              ...floatingPositions[idx],
              boxShadow: "0 4px 32px 0 rgba(120, 100, 240, 0.13)",
              pointerEvents: "auto",
            }}
          >
            <div className="flex p-3 gap-2 items-start">
              <div className="shrink-0 mt-1">
                <Icon className="w-5 h-5"
                  color={
                    insight.type === "critical"
                      ? "#f87171"
                      : insight.type === "warning"
                      ? "#eab308"
                      : insight.type === "success"
                      ? "#22c55e"
                      : "#6366f1"
                  }
                />
              </div>
              <div>
                <div className="font-semibold text-sm text-gray-900 mb-0.5">{insight.title}</div>
                <div className="text-xs text-gray-500">{insight.description}</div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default FloatingInsightCards;
