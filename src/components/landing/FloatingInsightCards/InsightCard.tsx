
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
        width: `${9 * cardScale}rem`, // Slightly reduced for one-liners
        height: `${4 * cardScale}rem`, // Reduced height for one-line content
        padding: '1.2rem', // Reduced padding for compact look
        pointerEvents: 'auto',
        // Enhanced shadow and backdrop for better depth and visibility
        boxShadow: `0 8px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)`,
        backdropFilter: 'blur(16px)',
        // Optimized aspect ratio for one-liners
        aspectRatio: '2.25/1',
        maxWidth: '180px', // Reduced for one-liner content
        maxHeight: '80px',
        minWidth: '140px', // Minimum readable size
        minHeight: '62px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}
    >
      {/* Single line layout for all cards */}
      <div className="flex items-center gap-2.5 w-full">
        <div className={`flex items-center justify-center rounded-lg ${styles.iconBg} p-1.5 shadow-lg flex-shrink-0`}>
          <Icon 
            className={`${styles.iconColor}`}
            size={Math.max(14, Math.round(16 * cardScale))}
            strokeWidth={2.5}
          />
        </div>
        <div className={`text-xs font-bold ${styles.numberColor} leading-tight flex-1 line-clamp-1`}>
          {insight.title}
        </div>
      </div>
    </div>
  );
};
