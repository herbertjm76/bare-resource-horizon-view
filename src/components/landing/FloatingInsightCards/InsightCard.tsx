
import React from "react";
import { InsightData, CardPosition } from "./types";
import { insightStyles } from "./styles";

interface InsightCardProps {
  insight: InsightData;
  position: CardPosition;
  animationDelay: string;
  scale: number;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  position,
  animationDelay,
  scale,
}) => {
  const Icon = insight.icon;
  const styles = insightStyles[insight.color as keyof typeof insightStyles];
  const cardScale = position.scale * scale;
  const isOneLiner = !insight.hasSubtitle;

  return (
    <div
      className={`absolute z-30 insight-card ${styles.bg} backdrop-blur-sm border border-gray-200/60 rounded-2xl transition-all duration-500 hover:scale-125 hover:z-50 ${styles.shadow}`}
      style={{
        ...position,
        animationDelay,
        transform: `scale(${cardScale}) ${position.transform || ''}`,
        width: isOneLiner ? `${12 * cardScale}rem` : `${10 * cardScale}rem`,
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
          <div className={`text-xs font-semibold ${styles.numberColor} leading-tight flex-1`}>
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
};
