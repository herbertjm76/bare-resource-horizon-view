
import React from "react";
import { FloatingInsightCardsProps } from "./types";
import { predefinedInsights, getRandomPositions, getRandomAnimationDelays } from "./constants";
import { globalStyles } from "./styles";
import { InsightCard } from "./InsightCard";

export const FloatingInsightCards: React.FC<FloatingInsightCardsProps> = ({
  utilizationRate,
  teamSize,
  activeProjects,
  timeRange,
  scale = 1.0,
}) => {
  const positions = getRandomPositions();
  const animationDelays = getRandomAnimationDelays();

  // Don't render anything if no positions (mobile)
  if (positions.length === 0) {
    return null;
  }

  return (
    <>
      <style>{globalStyles}</style>
      {predefinedInsights.slice(0, positions.length).map((insight, idx) => (
        <InsightCard
          key={insight.title + idx}
          insight={insight}
          position={positions[idx]}
          animationDelay={animationDelays[idx]}
          scale={scale}
        />
      ))}
    </>
  );
};

export default FloatingInsightCards;
