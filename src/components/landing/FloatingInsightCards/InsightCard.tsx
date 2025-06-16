
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
        width: `${7 * cardScale}rem`,
        height: `${7 * cardScale}rem`,
        padding: `${Math.max(0.75, 1.2 * cardScale)}rem`,
        pointerEvents: 'auto',
        // Enhanced shadow and backdrop for better depth and visibility
        boxShadow: `0 12px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1)`,
        backdropFilter: 'blur(20px)',
        // Perfect square aspect ratio
        aspectRatio: '1/1',
        maxWidth: '180px',
        maxHeight: '180px',
        minWidth: '140px',
        minHeight: '140px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {isOneLiner ? (
        // Square layout for one-liner cards
        <div className="flex flex-col items-center gap-3 text-center w-full">
          <div className={`flex items-center justify-center rounded-xl ${styles.iconBg} p-3 shadow-lg`} style={{ aspectRatio: '1/1' }}>
            <Icon 
              className={`${styles.iconColor}`}
              size={Math.max(18, Math.round(20 * cardScale))}
              strokeWidth={2.5}
            />
          </div>
          <div className={`text-sm font-bold ${styles.numberColor} leading-tight`}>
            {insight.title}
          </div>
        </div>
      ) : (
        // Square layout for two-line cards
        <div className="flex flex-col items-center gap-3 text-center w-full h-full justify-center">
          <div className={`flex items-center justify-center rounded-xl ${styles.iconBg} p-3 shadow-lg`} style={{ aspectRatio: '1/1' }}>
            <Icon 
              className={`${styles.iconColor}`}
              size={Math.max(18, Math.round(22 * cardScale))}
              strokeWidth={2.5}
            />
          </div>
          <div className="space-y-1">
            <div className={`text-base font-bold ${styles.numberColor} leading-tight`}>
              {insight.kpi || insight.title}
            </div>
            {insight.description && (
              <div className={`text-sm ${styles.textColor} font-medium leading-tight opacity-90`}>
                {insight.description}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
