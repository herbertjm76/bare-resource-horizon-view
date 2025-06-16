
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
        width: isOneLiner ? `${8 * cardScale}rem` : `${7.5 * cardScale}rem`,
        height: isOneLiner ? `${4 * cardScale}rem` : `${5 * cardScale}rem`,
        padding: `${Math.max(0.75, 1.0 * cardScale)}rem`,
        pointerEvents: 'auto',
        // Enhanced shadow and backdrop for better depth
        boxShadow: `0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)`,
        backdropFilter: 'blur(16px)',
        // More square aspect ratio
        aspectRatio: isOneLiner ? '2/1' : '1.5/1',
        maxWidth: isOneLiner ? '200px' : '180px',
        minWidth: '160px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {isOneLiner ? (
        // Enhanced one-liner layout with better spacing for square format
        <div className="flex items-center gap-2.5 w-full">
          <div className={`flex items-center justify-center rounded-xl ${styles.iconBg} p-2 shadow-lg flex-shrink-0`}>
            <Icon 
              className={`${styles.iconColor}`}
              size={Math.max(14, Math.round(16 * cardScale))}
              strokeWidth={2.5}
            />
          </div>
          <div className={`text-xs font-bold ${styles.numberColor} leading-tight flex-1`}>
            {insight.title}
          </div>
        </div>
      ) : (
        // Enhanced two-line layout optimized for square format
        <div className="space-y-2 w-full h-full flex flex-col justify-center">
          <div className="flex items-center gap-2.5">
            <div className={`flex items-center justify-center rounded-xl ${styles.iconBg} p-2 shadow-lg flex-shrink-0`}>
              <Icon 
                className={`${styles.iconColor}`}
                size={Math.max(14, Math.round(18 * cardScale))}
                strokeWidth={2.5}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-base font-bold ${styles.numberColor} leading-tight truncate`}>
                {insight.kpi || insight.title}
              </div>
            </div>
          </div>
          {insight.description && (
            <div className={`text-xs ${styles.textColor} font-medium pl-1 leading-tight opacity-90`}>
              {insight.description}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
