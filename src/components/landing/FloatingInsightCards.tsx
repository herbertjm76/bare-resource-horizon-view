
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

// Custom color palette, based on uploaded circles and site indicators
const circleColorMap = {
  purple: "#8f88ff",
  yellow: "#fee086",
  coral: "#ee9090",
  blue: "#5ca7fa",
  green: "#8adb7d",     // site secondary greenish, for 'success'
  orange: "#feb265",     // friendly warning
  gray: "#9198af",       // muted
};

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

/**
 * Map insight types ("critical", etc.) to circle indicator colors in line with your screenshot
 * (blue: info, yellow: warn, coral: crit, purple: default, green: success)
 */
const colorMap = {
  critical: { 
    iconBg: circleColorMap.coral, 
    text: "text-[#d23451]",         // deeper for text
    number: "text-[#d23451]", 
  },
  warning: { 
    iconBg: circleColorMap.yellow, 
    text: "text-[#a07c30]",
    number: "text-[#a07c30]",
  },
  success: { 
    iconBg: circleColorMap.green, 
    text: "text-[#39945d]",
    number: "text-[#39945d]",
  },
  info: { 
    iconBg: circleColorMap.purple, 
    text: "text-[#7a69f1]", // vivid purple
    number: "text-[#7a69f1]",
  },
  // For rare types
  default: { 
    iconBg: circleColorMap.gray, 
    text: "text-[#43474f]",     
    number: "text-[#43474f]",
  },
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

function getDescriptiveText(insight: any, kpi: string) {
  const { title, description, type } = insight;
  if (type === "critical" && title?.toLowerCase().includes("utilization")) return "Team overbooked";
  if (type === "warning" && title?.toLowerCase().includes("capacity")) return "Capacity stretched";
  if (type === "success" && title?.toLowerCase().includes("project")) return "Projects on track";
  if (title?.toLowerCase().includes("team") || title?.toLowerCase().includes("member")) return "Active team members";
  if (title?.toLowerCase().includes("project")) return "Active projects";
  if (title?.toLowerCase().includes("utilization")) return "Team utilization";
  return title?.length > 20 ? title.substring(0, 20) + "..." : title || "Metric";
}

// Neatly around image border: points distributed at corners/mid-edges
const floatingPositions = [
  // Top left
  { top: "-32px", left: "0", transform: "translateY(-100%)" },
  // Top center
  { top: "-32px", left: "50%", transform: "translate(-50%, -100%)" },
  // Top right
  { top: "-32px", right: "0", transform: "translateY(-100%)" },
  // Right center
  { top: "50%", right: "-30px", transform: "translateY(-50%) translateX(100%)" },
  // Bottom right
  { bottom: "-32px", right: "0", transform: "translateY(100%)" },
  // Bottom center
  { bottom: "-32px", left: "50%", transform: "translate(-50%, 100%)" },
  // Bottom left
  { bottom: "-32px", left: "0", transform: "translateY(100%)" },
  // Left center
  { top: "50%", left: "-30px", transform: "translateY(-50%) translateX(-100%)" },
];
// More gently staggered delays
const animationDelays = [
  "0s", "0.2s", "0.4s", "0.6s", "0.8s", "1.0s", "1.2s", "1.4s"
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

  const heroMetrics = { utilizationRate, teamSize, activeProjects };

  // Anim tweaks: softer float, lighter drop
  return (
    <>
      <style>{`
        @keyframes floatSoft {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-12px) scale(1.015); }
        }
        @keyframes pulseLight {
          0%, 100% { box-shadow: 0 2px 18px 0 rgba(120,100,240,0.10);}
          50% { box-shadow: 0 8px 30px 0 rgba(120,100,240,0.14);}
        }
        .float-soft {
          animation: floatSoft 2.4s ease-in-out infinite, pulseLight 3s ease-in-out infinite;
        }
      `}</style>
      {insights.map((insight, idx) => {
        const Icon = iconMap[insight.type] ?? Info;
        const colors = colorMap[insight.type] || colorMap.default;
        const kpi = getInsightKPI(insight, { utilizationRate, teamSize, activeProjects });
        const descriptiveText = getDescriptiveText(insight, kpi);

        const position = floatingPositions[idx] || floatingPositions[0];

        // scale set to 1.2 in Hero
        // style: clean white card, shadow, circle bg for icon, centered
        return (
          <div
            key={insight.title + idx}
            className="absolute z-30 transition-all duration-500 hover:scale-105 hover:z-40 rounded-2xl bg-white/95 backdrop-blur border border-gray-100 flex items-center gap-3 px-4 py-3 float-soft shadow-md"
            style={{
              ...position,
              animationDelay: animationDelays[idx],
              transform: `scale(${scale}) ${position.transform ? position.transform : ''}`,
              width: `${11 * scale}rem`,
              minHeight: `${3.8 * scale}rem`,
              boxShadow: "0 2px 26px 0 rgba(140,120,250,0.07)", // very soft
              pointerEvents: 'auto',
            }}
          >
            {/* Circular Colored Icon */}
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: `${2.6 * scale}rem`,
                height: `${2.6 * scale}rem`,
                background: colors.iconBg,
                marginLeft: '0.1rem'
              }}
            >
              <Icon 
                className="text-white"
                style={{
                  width: `${1.4 * scale}rem`,
                  height: `${1.4 * scale}rem`,
                }}
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1 pl-1" style={{marginLeft: `${0.3 * scale}rem`}}>
              <div
                className={`${colors.number} font-bold leading-tight`}
                style={{
                  fontSize: `${1.27 * scale}rem`,
                  lineHeight: 1.21,
                }}
              >
                {kpi}
              </div>
              <div
                className="text-xs text-gray-600 leading-tight"
                style={{
                  fontSize: `${0.80 * scale}rem`,
                }}
              >
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
