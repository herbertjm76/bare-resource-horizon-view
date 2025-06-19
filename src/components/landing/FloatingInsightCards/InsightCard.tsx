
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
      className={`absolute z-30 insight-card ${styles.bg} backdrop-blur-md border border-white/40 rounded-2xl transition-all duration-300 hover:scale-110 hover:z-50 ${styles.shadow}`}
      style={{
        ...position,
        animationDelay,
        transform: `scale(${cardScale}) ${position.transform || ''}`,
        width: `${14 * cardScale}rem`, // Increased width for better readability
        height: `${6 * cardScale}rem`, // Increased height for proper text spacing
        padding: '1.5rem', // Better padding for content
        pointerEvents: 'auto',
        // Enhanced visual depth
        boxShadow: `0 12px 40px rgba(0,0,0,0.15), 0 6px 16px rgba(0,0,0,0.10)`,
        backdropFilter: 'blur(20px)',
        // Better aspect ratio for readability
        aspectRatio: '2.3/1',
        maxWidth: '280px', // Increased for better text display
        maxHeight: '120px',
        minWidth: '220px', // Increased minimum size
        minHeight: '95px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}
    >
      {/* Improved layout with better spacing */}
      <div className="flex items-center gap-3.5 w-full">
        <div className={`flex items-center justify-center rounded-xl ${styles.iconBg} p-2.5 shadow-lg flex-shrink-0`}>
          <Icon 
            className={`${styles.iconColor}`}
            size={Math.max(18, Math.round(20 * cardScale))}
            strokeWidth={2.5}
          />
        </div>
        <div className={`text-sm font-bold ${styles.numberColor} leading-tight flex-1`}>
          {insight.title}
        </div>
      </div>
    </div>
  );
};
