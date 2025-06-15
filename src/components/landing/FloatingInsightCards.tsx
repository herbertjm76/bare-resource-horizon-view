
import React from "react";
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

// Updated color palette to match the reference image
const insightStyles = {
  blue: {
    bg: "bg-white",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    textColor: "text-gray-700",
    numberColor: "text-blue-600",
    shadow: "shadow-lg shadow-blue-200/30"
  },
  purple: {
    bg: "bg-white",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    textColor: "text-gray-700",
    numberColor: "text-purple-600",
    shadow: "shadow-lg shadow-purple-200/30"
  },
  green: {
    bg: "bg-white",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    textColor: "text-gray-700",
    numberColor: "text-green-600",
    shadow: "shadow-lg shadow-green-200/30"
  },
  orange: {
    bg: "bg-white",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    textColor: "text-gray-700",
    numberColor: "text-orange-600",
    shadow: "shadow-lg shadow-orange-200/30"
  },
  pink: {
    bg: "bg-white",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    textColor: "text-gray-700",
    numberColor: "text-pink-600",
    shadow: "shadow-lg shadow-pink-200/30"
  },
  red: {
    bg: "bg-white",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    textColor: "text-gray-700",
    numberColor: "text-red-600",
    shadow: "shadow-lg shadow-red-200/30"
  }
};

// Updated insights with your specified content
const predefinedInsights = [
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

// Fixed positioning - better spacing to prevent overlaps, especially at bottom
const getRandomPositions = () => [
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
    bottom: "-100px", 
    left: "15%", 
    transform: "translateY(100%) rotate(1deg)",
    scale: 1.05
  },
  { 
    bottom: "-80px", 
    right: "40%", 
    transform: "translateY(100%) rotate(-1deg)",
    scale: 0.9
  }
];

const animationDelays = [
  "0s", "0.3s", "0.6s", "0.9s", "1.2s", "1.5s"
];

interface FloatingInsightCardsProps {
  utilizationRate: number;
  teamSize: number;
  activeProjects: number;
  timeRange: "week" | "month" | "quarter" | "year";
  scale?: number;
}

export const FloatingInsightCards: React.FC<FloatingInsightCardsProps> = ({
  utilizationRate,
  teamSize,
  activeProjects,
  timeRange,
  scale = 1.0,
}) => {
  const positions = getRandomPositions();

  return (
    <>
      <style>{`
        @keyframes floatGently {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0% { box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
          50% { box-shadow: 0 12px 35px rgba(0,0,0,0.15); }
          100% { box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
        }
        .insight-card {
          animation: floatGently 4s ease-in-out infinite, shimmer 5s ease-in-out infinite;
        }
        .insight-card:hover {
          transform: scale(1.15) !important;
          z-index: 50 !important;
        }
      `}</style>
      {predefinedInsights.map((insight, idx) => {
        const Icon = insight.icon;
        const styles = insightStyles[insight.color as keyof typeof insightStyles];
        const position = positions[idx];
        const cardScale = position.scale * scale;
        const isOneLiner = !insight.hasSubtitle;

        return (
          <div
            key={insight.title + idx}
            className={`absolute z-30 insight-card ${styles.bg} backdrop-blur-sm border border-gray-200/60 rounded-2xl transition-all duration-500 hover:scale-125 hover:z-50 ${styles.shadow}`}
            style={{
              ...position,
              animationDelay: animationDelays[idx],
              transform: `scale(${cardScale}) ${position.transform || ''}`,
              width: isOneLiner ? `${8 * cardScale}rem` : `${10 * cardScale}rem`,
              minHeight: isOneLiner ? `${3 * cardScale}rem` : `${4 * cardScale}rem`,
              pointerEvents: 'auto',
              padding: isOneLiner ? `${0.75 * cardScale}rem` : `${1 * cardScale}rem`
            }}
          >
            {isOneLiner ? (
              // One-liner layout
              <div className="flex items-center gap-2">
                <div className={`flex items-center justify-center rounded-full ${styles.iconBg} p-1.5 shadow-sm flex-shrink-0`}>
                  <Icon 
                    className={`${styles.iconColor}`}
                    size={Math.round(16 * cardScale)}
                    strokeWidth={2.5}
                  />
                </div>
                <div className={`text-xs font-semibold ${styles.numberColor} leading-tight truncate`}>
                  {insight.title}
                </div>
              </div>
            ) : (
              // Two-line layout with subtitle
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center rounded-full ${styles.iconBg} p-2.5 shadow-sm`}>
                  <Icon 
                    className={`${styles.iconColor}`}
                    size={Math.round(20 * cardScale)}
                    strokeWidth={2.5}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={`text-xl font-bold ${styles.numberColor} leading-tight mb-1`}>
                    {insight.kpi}
                  </div>
                  <div className={`text-xs ${styles.textColor} leading-tight font-medium`}>
                    {insight.description}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default FloatingInsightCards;
