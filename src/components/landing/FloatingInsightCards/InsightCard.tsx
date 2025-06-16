
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
      className={`absolute z-30 insight-card ${styles.bg} backdrop-blur-sm border border-white/30 rounded-lg transition-all duration-300 hover:scale-105 hover:z-50 ${styles.shadow}`}
      style={{
        ...position,
        animationDelay,
        transform: `scale(${cardScale}) ${position.transform || ''}`,
        width: isOneLiner ? `${9 * cardScale}rem` : `${8.5 * cardScale}rem`,
        padding: `${Math.max(0.4, 0.6 * cardScale)}rem`,
        pointerEvents: 'auto',
        // Ensure cards don't overflow on smaller screens
        maxWidth: '200px'
      }}
    >
      {isOneLiner ? (
        // Compact one-liner layout
        <div className="flex items-center gap-2">
          <div className={`flex items-center justify-center rounded-md ${styles.iconBg} p-1.5 shadow-sm flex-shrink-0`}>
            <Icon 
              className={`${styles.iconColor}`}
              size={Math.max(12, Math.round(14 * cardScale))}
              strokeWidth={2.5}
            />
          </div>
          <div className={`text-xs font-semibold ${styles.numberColor} leading-tight`}>
            {insight.title}
          </div>
        </div>
      ) : (
        // Rich two-line layout with metrics
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center rounded-md ${styles.iconBg} p-1.5 shadow-sm flex-shrink-0`}>
              <Icon 
                className={`${styles.iconColor}`}
                size={Math.max(12, Math.round(15 * cardScale))}
                strokeWidth={2.5}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-bold ${styles.numberColor} leading-tight truncate`}>
                {insight.kpi || insight.title}
              </div>
            </div>
          </div>
          {insight.description && (
            <div className={`text-xs ${styles.textColor} font-medium pl-7 leading-tight`}>
              {insight.description}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
