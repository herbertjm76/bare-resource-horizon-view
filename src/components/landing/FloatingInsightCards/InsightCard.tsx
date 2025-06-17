
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
      className={`absolute z-30 insight-card ${styles.bg} backdrop-blur-md border border-white/40 rounded-xl transition-all duration-300 hover:scale-110 hover:z-50 ${styles.shadow}`}
      style={{
        ...position,
        animationDelay,
        transform: `scale(${cardScale}) ${position.transform || ''}`,
        width: `${12 * cardScale}rem`,
        height: `${6 * cardScale}rem`,
        padding: `${Math.max(0.75, 1.2 * cardScale)}rem`,
        pointerEvents: 'auto',
        // Enhanced shadow and backdrop for better depth and visibility
        boxShadow: `0 12px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1)`,
        backdropFilter: 'blur(20px)',
        // Rectangular aspect ratio
        aspectRatio: '2/1',
        maxWidth: '240px',
        maxHeight: '120px',
        minWidth: '180px',
        minHeight: '90px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}
    >
      {isOneLiner ? (
        // Horizontal layout for one-liner cards
        <div className="flex items-center gap-4 w-full">
          <div className={`flex items-center justify-center rounded-lg ${styles.iconBg} p-2.5 shadow-lg flex-shrink-0`}>
            <Icon 
              className={`${styles.iconColor}`}
              size={Math.max(16, Math.round(18 * cardScale))}
              strokeWidth={2.5}
            />
          </div>
          <div className={`text-sm font-bold ${styles.numberColor} leading-tight flex-1`}>
            {insight.title}
          </div>
        </div>
      ) : (
        // Horizontal layout for two-line cards
        <div className="flex items-center gap-4 w-full">
          <div className={`flex items-center justify-center rounded-lg ${styles.iconBg} p-2.5 shadow-lg flex-shrink-0`}>
            <Icon 
              className={`${styles.iconColor}`}
              size={Math.max(16, Math.round(20 * cardScale))}
              strokeWidth={2.5}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-base font-bold ${styles.numberColor} leading-tight mb-1`}>
              {insight.kpi || insight.title}
            </div>
            {insight.description && (
              <div className={`text-xs ${styles.textColor} font-medium leading-tight opacity-90`}>
                {insight.description}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
