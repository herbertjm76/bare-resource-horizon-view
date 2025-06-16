
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
  const styles = insightStyles[insight.color as keyof typeof insightStyles] || insightStyles.blue;
  const cardScale = position.scale * scale;
  const isOneLiner = !insight.hasSubtitle;

  console.log("InsightCard rendering:", {
    title: insight.title,
    color: insight.color,
    stylesFound: !!styles,
    hasSubtitle: insight.hasSubtitle
  });

  return (
    <div
      className={`absolute z-30 insight-card ${styles.bg} backdrop-blur-md border border-white/40 rounded-2xl transition-all duration-300 hover:scale-110 hover:z-50 ${styles.shadow}`}
      style={{
        ...position,
        animationDelay,
        transform: `scale(${cardScale}) ${position.transform || ''}`,
        width: isOneLiner ? `${10 * cardScale}rem` : `${9.5 * cardScale}rem`,
        padding: `${Math.max(0.75, 1.0 * cardScale)}rem`,
        pointerEvents: 'auto',
        // Enhanced shadow and backdrop for better depth
        boxShadow: `0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)`,
        backdropFilter: 'blur(16px)',
        // Better responsive sizing
        maxWidth: isOneLiner ? '240px' : '220px',
        minWidth: '180px'
      }}
    >
      {isOneLiner ? (
        // Enhanced one-liner layout with better spacing
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center rounded-xl ${styles.iconBg} p-2.5 shadow-lg flex-shrink-0`}>
            <Icon 
              className={`${styles.iconColor}`}
              size={Math.max(16, Math.round(18 * cardScale))}
              strokeWidth={2.5}
            />
          </div>
          <div className={`text-sm font-bold ${styles.numberColor} leading-tight`}>
            {insight.title}
          </div>
        </div>
      ) : (
        // Enhanced two-line layout with better hierarchy
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center rounded-xl ${styles.iconBg} p-2.5 shadow-lg flex-shrink-0`}>
              <Icon 
                className={`${styles.iconColor}`}
                size={Math.max(16, Math.round(20 * cardScale))}
                strokeWidth={2.5}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-lg font-bold ${styles.numberColor} leading-tight truncate`}>
                {insight.kpi || insight.title}
              </div>
            </div>
          </div>
          {insight.description && (
            <div className={`text-sm ${styles.textColor} font-medium pl-1 leading-tight opacity-90`}>
              {insight.description}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
