
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

// Enhanced color mapping with background colors for icons
const colorMap = {
  critical: { 
    iconBg: "bg-red-500", 
    text: "text-red-600", 
    number: "text-red-600" 
  },
  warning: { 
    iconBg: "bg-yellow-500", 
    text: "text-yellow-600", 
    number: "text-yellow-600" 
  },
  success: { 
    iconBg: "bg-green-500", 
    text: "text-green-600", 
    number: "text-green-600" 
  },
  info: { 
    iconBg: "bg-blue-500", 
    text: "text-blue-600", 
    number: "text-blue-600" 
  },
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

// Generate descriptive text based on insight
function getDescriptiveText(insight: any, kpi: string) {
  const { title, description, type } = insight;
  
  // Create descriptive text based on the insight
  if (type === "critical" && title?.toLowerCase().includes("utilization")) {
    return "Team overbooked";
  }
  if (type === "warning" && title?.toLowerCase().includes("capacity")) {
    return "Capacity stretched";
  }
  if (type === "success" && title?.toLowerCase().includes("project")) {
    return "Projects on track";
  }
  if (title?.toLowerCase().includes("team") || title?.toLowerCase().includes("member")) {
    return "Active team members";
  }
  if (title?.toLowerCase().includes("project")) {
    return "Active projects";
  }
  if (title?.toLowerCase().includes("utilization")) {
    return "Team utilization";
  }
  
  // Fallback to a shortened version of the title
  return title?.length > 20 ? title.substring(0, 20) + "..." : title || "Metric";
}

const floatingPositions = [
  { top: "8%", left: "5%" },
  { top: "15%", right: "8%" },
  { top: "35%", left: "2%" },
  { top: "45%", right: "12%" },
  { bottom: "25%", left: "8%" },
  { bottom: "15%", right: "5%" },
  { top: "60%", left: "45%" },
  { bottom: "8%", left: "35%" },
  { top: "25%", right: "2%" },
];

// Enhanced animation delays for more staggered effect
const animationDelays = [
  "0s", "0.3s", "0.6s", "0.9s", "1.2s", "1.5s", "1.8s", "2.1s", "2.4s"
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
      <style>{`
        @keyframes floatBig {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.02); }
        }
        
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(15px) scale(0.98); }
        }
        
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        
        @keyframes pulse {
          0%, 100% { box-shadow: 0 4px 32px 0 rgba(120, 100, 240, 0.13); }
          50% { box-shadow: 0 8px 40px 0 rgba(120, 100, 240, 0.25); }
        }
        
        .float-animation {
          animation: floatBig 2.5s ease-in-out infinite, pulse 3s ease-in-out infinite;
        }
        
        .float-animation-reverse {
          animation: floatReverse 3s ease-in-out infinite, pulse 3.5s ease-in-out infinite;
        }
        
        .float-slow {
          animation: floatSlow 3.5s ease-in-out infinite, pulse 4s ease-in-out infinite;
        }
      `}</style>
      {insights.map((insight, idx) => {
        // Icon/type/color
        const Icon = iconMap[insight.type] ?? Info;
        const colors = colorMap[insight.type] || colorMap.info;

        // KPI and descriptive text
        const kpi = getInsightKPI(insight, heroMetrics);
        const descriptiveText = getDescriptiveText(insight, kpi);

        // Different animation classes for variety
        const animationClass = idx % 3 === 0 ? 'float-animation' : 
                             idx % 3 === 1 ? 'float-animation-reverse' : 
                             'float-slow';

        return (
          <div
            key={insight.title + idx}
            className={`absolute z-20 w-48 min-h-16 transition-all duration-500
              hover:scale-110 hover:z-30 rounded-2xl bg-white/95 border border-gray-100 
              flex items-center gap-3 px-4 py-3 ${animationClass}`}
            style={{
              ...floatingPositions[idx],
              animationDelay: animationDelays[idx],
            }}
          >
            {/* Colored Icon Background */}
            <div className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            
            {/* Content */}
            <div className="flex flex-col min-w-0 flex-1">
              {/* Large Number/KPI */}
              <div className={`text-2xl font-bold ${colors.number} leading-tight`}>
                {kpi}
              </div>
              {/* Descriptive Text */}
              <div className="text-sm text-gray-600 leading-tight">
                {descriptiveText}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default FloatingInsightCards;
