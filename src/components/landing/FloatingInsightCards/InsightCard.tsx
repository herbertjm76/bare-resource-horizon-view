
import React from "react";
import { InsightData, CardPosition } from "./types";
import { insightStyles } from "./styles";
import { logger } from '@/utils/logger';

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

  logger.debug("InsightCard rendering:", {
    title: insight.title,
    color: insight.color,
    stylesFound: !!styles,
    hasSubtitle: insight.hasSubtitle
  });

  return (
    <div
      className={`absolute z-30 insight-card ${styles.bg} backdrop-blur-xl border border-white/20 rounded-3xl transition-all duration-500 hover:scale-110 hover:z-50 ${styles.shadow}`}
      style={{
        ...position,
        animationDelay,
        transform: `scale(${cardScale}) ${position.transform || ''}`,
        width: `${14 * cardScale}rem`,
        height: `${6 * cardScale}rem`,
        padding: '1.5rem',
        pointerEvents: 'auto',
        // Liquid glass effect
        background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.5) 100%)',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        boxShadow: `
          0 8px 32px rgba(0,0,0,0.12),
          0 2px 8px rgba(0,0,0,0.08),
          inset 0 1px 0 rgba(255,255,255,0.2),
          inset 0 -1px 0 rgba(0,0,0,0.1)
        `,
        border: '1px solid rgba(255,255,255,0.18)',
        aspectRatio: '2.3/1',
        maxWidth: '280px',
        maxHeight: '120px',
        minWidth: '220px',
        minHeight: '95px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}
    >
      {/* Improved layout with better spacing */}
      <div className="flex items-center gap-3.5 w-full">
        <div className={`flex items-center justify-center rounded-2xl ${styles.iconBg} backdrop-blur-sm p-2.5 shadow-lg flex-shrink-0`}
             style={{
               background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
               border: '1px solid rgba(255,255,255,0.1)'
             }}>
          <Icon 
            className={`${styles.iconColor}`}
            size={Math.max(18, Math.round(20 * cardScale))}
            strokeWidth={1}
            fill="currentColor"
          />
        </div>
        <div className={`text-base font-bold ${styles.numberColor} leading-tight flex-1 drop-shadow-sm`}>
          {insight.title}
        </div>
      </div>
    </div>
  );
};
