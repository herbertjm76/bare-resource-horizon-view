
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
        width: `${3.5 * cardScale}rem`,
        height: `${3.5 * cardScale}rem`,
        padding: `${Math.max(0.2, 0.6 * cardScale)}rem`,
        pointerEvents: 'auto',
        // Enhanced shadow and backdrop for better depth and visibility
        boxShadow: `0 6px 20px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.1)`,
        backdropFilter: 'blur(10px)',
        // Perfect square aspect ratio
        aspectRatio: '1/1',
        maxWidth: '60px',
        maxHeight: '60px',
        minWidth: '40px',
        minHeight: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {isOneLiner ? (
        // Square layout for one-liner cards
        <div className="flex flex-col items-center gap-1 text-center w-full">
          <div className={`flex items-center justify-center rounded-lg ${styles.iconBg} p-1 shadow-sm`} style={{ aspectRatio: '1/1' }}>
            <Icon 
              className={`${styles.iconColor}`}
              size={Math.max(8, Math.round(10 * cardScale))}
              strokeWidth={2.5}
            />
          </div>
          <div className={`text-xs font-bold ${styles.numberColor} leading-tight`} style={{ fontSize: `${Math.max(6, 8 * cardScale)}px` }}>
            {insight.title}
          </div>
        </div>
      ) : (
        // Square layout for two-line cards
        <div className="flex flex-col items-center gap-1 text-center w-full h-full justify-center">
          <div className={`flex items-center justify-center rounded-lg ${styles.iconBg} p-1 shadow-sm`} style={{ aspectRatio: '1/1' }}>
            <Icon 
              className={`${styles.iconColor}`}
              size={Math.max(8, Math.round(12 * cardScale))}
              strokeWidth={2.5}
            />
          </div>
          <div className="space-y-0.5">
            <div className={`text-xs font-bold ${styles.numberColor} leading-tight`} style={{ fontSize: `${Math.max(6, 10 * cardScale)}px` }}>
              {insight.kpi || insight.title}
            </div>
            {insight.description && (
              <div className={`text-xs ${styles.textColor} font-medium leading-tight opacity-90`} style={{ fontSize: `${Math.max(5, 8 * cardScale)}px` }}>
                {insight.description}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
