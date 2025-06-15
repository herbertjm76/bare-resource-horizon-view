
import React from "react";
import { FloatingInsightCardsProps } from "./types";
import { predefinedInsights, getRandomPositions, animationDelays } from "./constants";
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

  return (
    <>
      <style>{globalStyles}</style>
      {predefinedInsights.map((insight, idx) => (
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
