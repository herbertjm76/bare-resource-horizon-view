
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

// Positioned around the image border and extending outward
const floatingPositions = [
  // Top edge
  { top: "-8px", left: "15%", transform: "translateY(-100%)" },
  { top: "-8px", right: "20%", transform: "translateY(-100%)" },
  
  // Left edge  
  { top: "25%", left: "-8px", transform: "translateX(-100%)" },
  { bottom: "30%", left: "-8px", transform: "translateX(-100%)" },
  
  // Right edge
  { top: "20%", right: "-8px", transform: "translateX(100%)" },
  { bottom: "25%", right: "-8px", transform: "translateX(100%)" },
  
  // Bottom edge
  { bottom: "-8px", left: "25%", transform: "translateY(100%)" },
  { bottom: "-8px", right: "15%", transform: "translateY(100%)" },
];

// Enhanced animation delays for more staggered effect
const animationDelays = [
  "0s", "0.4s", "0.8s", "1.2s", "1.6s", "2.0s", "2.4s", "2.8s"
];

export const FloatingInsightCards: React.FC<FloatingInsightCardsProps> = ({
  utilizationRate,
  teamSize,
  activeProjects,
  timeRange,
}) => {
  let insights: any[] = [];
  try {
    // Get insights from multiple time ranges for more variety
    const timeRanges: any[] = ["week", "month", "quarter", "year"];
    const all: any[] = [];
    for (let r of timeRanges) {
      all.push(...getAllInsights(utilizationRate, teamSize, activeProjects, r));
    }
    
    // Remove duplicates by title
    insights = all.filter(
      (insight, idx, arr) =>
        arr.findIndex((i) => i.title === insight.title) === idx
    );
    
    // If we have fewer than 8 insights, repeat some with slight variations
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
    
    // Take exactly 8 insights for better coverage around the image
    insights = insights.slice(0, 8);
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

        const position = floatingPositions[idx] || floatingPositions[0];

        return (
          <div
            key={insight.title + idx}
            className={`absolute z-30 w-44 min-h-14 transition-all duration-500
              hover:scale-110 hover:z-40 rounded-2xl bg-white/95 backdrop-blur border border-gray-100 
              flex items-center gap-3 px-3 py-3 ${animationClass}`}
            style={{
              ...position,
              animationDelay: animationDelays[idx],
            }}
          >
            {/* Colored Icon Background */}
            <div className={`w-10 h-10 ${colors.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            
            {/* Content */}
            <div className="flex flex-col min-w-0 flex-1">
              {/* Large Number/KPI */}
              <div className={`text-xl font-bold ${colors.number} leading-tight`}>
                {kpi}
              </div>
              {/* Descriptive Text */}
              <div className="text-xs text-gray-600 leading-tight">
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
