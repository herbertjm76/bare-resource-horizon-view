
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
  console.log("FloatingInsightCards rendering with props:", { utilizationRate, teamSize, activeProjects, timeRange, scale });
  
  const positions = getRandomPositions();
  const animationDelays = getRandomAnimationDelays();

  console.log("Positions generated:", positions.length, "insights available:", predefinedInsights.length);

  // Don't render anything if no positions (mobile)
  if (positions.length === 0) {
    console.log("No positions available - mobile view detected");
    return null;
  }

  return (
    <>
      <style>{globalStyles}</style>
      {predefinedInsights.slice(0, positions.length).map((insight, idx) => {
        console.log("Rendering insight:", insight.title, "hasSubtitle:", insight.hasSubtitle);
        return (
          <InsightCard
            key={insight.title + idx}
            insight={insight}
            position={positions[idx]}
            animationDelay={animationDelays[idx]}
            scale={scale}
          />
        );
      })}
    </>
  );
};

export default FloatingInsightCards;
