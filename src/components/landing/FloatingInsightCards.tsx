
import React from "react";
import { getAllInsights } from "@/components/dashboard/insights/utils/insightAggregator";
import {
  TrendingUp,
  Users,
  Clock,
  Target,
  CheckCircle2,
  AlertTriangle,
  Activity,
  BarChart3,
} from "lucide-react";

// Refined color palette for better visual appeal
const insightStyles = {
  critical: {
    bg: "bg-gradient-to-br from-red-500 to-red-600",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    textColor: "text-red-700",
    numberColor: "text-red-600",
    shadow: "shadow-red-200/50"
  },
  warning: {
    bg: "bg-gradient-to-br from-amber-500 to-orange-500",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    textColor: "text-amber-700",
    numberColor: "text-amber-600",
    shadow: "shadow-amber-200/50"
  },
  success: {
    bg: "bg-gradient-to-br from-emerald-500 to-green-600",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    textColor: "text-emerald-700",
    numberColor: "text-emerald-600",
    shadow: "shadow-emerald-200/50"
  },
  info: {
    bg: "bg-gradient-to-br from-blue-500 to-indigo-600",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    textColor: "text-blue-700",
    numberColor: "text-blue-600",
    shadow: "shadow-blue-200/50"
  },
  default: {
    bg: "bg-gradient-to-br from-gray-500 to-slate-600",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    textColor: "text-gray-700",
    numberColor: "text-gray-600",
    shadow: "shadow-gray-200/50"
  }
};

const iconMap = {
  critical: AlertTriangle,
  warning: Clock,
  success: CheckCircle2,
  info: TrendingUp,
  users: Users,
  target: Target,
  activity: Activity,
  chart: BarChart3,
};

interface FloatingInsightCardsProps {
  utilizationRate: number;
  teamSize: number;
  activeProjects: number;
  timeRange: "week" | "month" | "quarter" | "year";
  scale?: number;
}

function getInsightKPI(
  insight: any,
  { utilizationRate, teamSize, activeProjects }: { utilizationRate: number; teamSize: number; activeProjects: number }
) {
  const { description, title, category } = insight;
  const kpiMatch = description?.match(/(\d+(\.\d+)?%?)/)?.[0];
  if (kpiMatch) return kpiMatch;
  if (title?.toLowerCase().includes("utilization")) return utilizationRate + "%";
  if (title?.toLowerCase().includes("team")) return teamSize;
  if (title?.toLowerCase().includes("project")) return activeProjects;
  if (category?.toLowerCase().includes("team")) return teamSize;
  if (category?.toLowerCase().includes("project")) return activeProjects;
  return "—";
}

function getDescriptiveText(insight: any) {
  const { title, type } = insight;
  if (type === "critical" && title?.toLowerCase().includes("utilization")) return "Team overbooked";
  if (type === "warning" && title?.toLowerCase().includes("capacity")) return "Capacity stretched";
  if (type === "success" && title?.toLowerCase().includes("project")) return "Projects on track";
  if (title?.toLowerCase().includes("team") || title?.toLowerCase().includes("member")) return "Active members";
  if (title?.toLowerCase().includes("project")) return "Active projects";
  if (title?.toLowerCase().includes("utilization")) return "Team utilization";
  return title?.length > 18 ? title.substring(0, 18) + "..." : title || "Metric";
}

// Better positioned cards that don't overlap the image
const floatingPositions = [
  // Top area - above image
  { top: "-80px", left: "10%", transform: "translateY(-100%)" },
  { top: "-80px", right: "10%", transform: "translateY(-100%)" },
  
  // Left side - positioned to not overlap
  { top: "15%", left: "-140px", transform: "translateX(-100%)" },
  { top: "50%", left: "-140px", transform: "translateY(-50%) translateX(-100%)" },
  
  // Right side - positioned to not overlap  
  { top: "15%", right: "-140px", transform: "translateX(100%)" },
  { top: "50%", right: "-140px", transform: "translateY(-50%) translateX(100%)" },
  
  // Bottom area - below image
  { bottom: "-80px", left: "15%", transform: "translateY(100%)" },
  { bottom: "-80px", right: "15%", transform: "translateY(100%)" },
];

const animationDelays = [
  "0s", "0.3s", "0.6s", "0.9s", "1.2s", "1.5s", "1.8s", "2.1s"
];

export const FloatingInsightCards: React.FC<FloatingInsightCardsProps> = ({
  utilizationRate,
  teamSize,
  activeProjects,
  timeRange,
  scale = 1.0,
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
    if (insights.length < 8) {
      const additional = [];
      let i = 0;
      while (additional.length + insights.length < 8) {
        const baseInsight = insights[i % insights.length];
        additional.push({
          ...baseInsight,
          title: baseInsight.title + " Trend",
          description: baseInsight.description.replace(/(\d+)/, (match) => 
            String(Math.max(1, parseInt(match) + Math.floor(Math.random() * 10) - 5))
          )
        });
        i++;
      }
      insights = [...insights, ...additional];
    }
    insights = insights.slice(0, 8);
  } catch {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes floatGently {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0% { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
          50% { box-shadow: 0 8px 30px rgba(0,0,0,0.12); }
          100% { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        }
        .insight-card {
          animation: floatGently 3s ease-in-out infinite, shimmer 4s ease-in-out infinite;
        }
      `}</style>
      {insights.map((insight, idx) => {
        const Icon = iconMap[insight.type] || iconMap.info;
        const styles = insightStyles[insight.type] || insightStyles.default;
        const kpi = getInsightKPI(insight, { utilizationRate, teamSize, activeProjects });
        const descriptiveText = getDescriptiveText(insight);
        const position = floatingPositions[idx] || floatingPositions[0];

        return (
          <div
            key={insight.title + idx}
            className={`absolute z-30 insight-card bg-white backdrop-blur-sm border border-white/40 rounded-xl p-4 transition-all duration-300 hover:scale-110 hover:z-40 ${styles.shadow}`}
            style={{
              ...position,
              animationDelay: animationDelays[idx],
              transform: `scale(${scale}) ${position.transform || ''}`,
              width: `${10 * scale}rem`,
              minHeight: `${4 * scale}rem`,
              pointerEvents: 'auto',
            }}
          >
            <div className="flex items-center gap-3">
              {/* Icon with gradient background */}
              <div className={`flex items-center justify-center rounded-full ${styles.iconBg} p-2`}>
                <Icon 
                  className={`${styles.iconColor}`}
                  size={Math.round(20 * scale)}
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className={`text-2xl font-bold ${styles.numberColor} leading-tight`}>
                  {kpi}
                </div>
                <div className={`text-xs ${styles.textColor} leading-tight mt-1`}>
                  {descriptiveText}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default FloatingInsightCards;
