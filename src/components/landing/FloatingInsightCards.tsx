
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
  }
};

// Predefined insights matching the reference image plus 2 additional
const predefinedInsights = [
  {
    title: "Team Utilization",
    kpi: "87%",
    description: "Current capacity",
    icon: Users,
    color: "blue"
  },
  {
    title: "Active Projects",
    kpi: "15",
    description: "In progress",
    icon: Target,
    color: "purple"
  },
  {
    title: "Team Members",
    kpi: "12",
    description: "Available staff",
    icon: Users,
    color: "green"
  },
  {
    title: "Revenue Growth",
    kpi: "+23%",
    description: "This quarter",
    icon: TrendingUp,
    color: "orange"
  },
  {
    title: "Project Efficiency",
    kpi: "94%",
    description: "On-time delivery",
    icon: CheckCircle2,
    color: "pink"
  }
];

// Random positioning with more varied placement and sizes
const getRandomPositions = () => [
  { 
    top: "-120px", 
    left: "5%", 
    transform: "translateY(-100%) rotate(-3deg)",
    scale: 0.9
  },
  { 
    top: "-80px", 
    right: "8%", 
    transform: "translateY(-100%) rotate(2deg)",
    scale: 1.1
  },
  { 
    top: "10%", 
    left: "-160px", 
    transform: "translateX(-100%) rotate(-2deg)",
    scale: 0.85
  },
  { 
    top: "45%", 
    right: "-140px", 
    transform: "translateY(-50%) translateX(100%) rotate(1deg)",
    scale: 1.05
  },
  { 
    bottom: "-100px", 
    left: "20%", 
    transform: "translateY(100%) rotate(3deg)",
    scale: 0.95
  }
];

const animationDelays = [
  "0s", "0.4s", "0.8s", "1.2s", "1.6s"
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
          50% { transform: translateY(-10px); }
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

        return (
          <div
            key={insight.title + idx}
            className={`absolute z-30 insight-card ${styles.bg} backdrop-blur-sm border border-gray-200/60 rounded-2xl p-5 transition-all duration-500 hover:scale-125 hover:z-50 ${styles.shadow}`}
            style={{
              ...position,
              animationDelay: animationDelays[idx],
              transform: `scale(${cardScale}) ${position.transform || ''}`,
              width: `${11 * cardScale}rem`,
              minHeight: `${4.5 * cardScale}rem`,
              pointerEvents: 'auto',
            }}
          >
            <div className="flex items-center gap-4">
              {/* Icon with circular background */}
              <div className={`flex items-center justify-center rounded-full ${styles.iconBg} p-3 shadow-sm`}>
                <Icon 
                  className={`${styles.iconColor}`}
                  size={Math.round(22 * cardScale)}
                  strokeWidth={2.5}
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className={`text-2xl font-bold ${styles.numberColor} leading-tight mb-1`}>
                  {insight.kpi}
                </div>
                <div className={`text-sm ${styles.textColor} leading-tight font-medium`}>
                  {insight.description}
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
