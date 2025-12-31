
import React from "react";
import { FloatingInsightCardsProps } from "./types";
import { predefinedInsights, getRandomPositions, getRandomAnimationDelays } from "./constants";
import { globalStyles } from "./styles";
import { InsightCard } from "./InsightCard";
import { logger } from "@/utils/logger";

export const FloatingInsightCards: React.FC<FloatingInsightCardsProps> = ({
  utilizationRate,
  teamSize,
  activeProjects,
  timeRange,
  scale = 1.0,
}) => {
  logger.debug("FloatingInsightCards rendering with props:", { utilizationRate, teamSize, activeProjects, timeRange, scale });
  
  const positions = getRandomPositions();
  const animationDelays = getRandomAnimationDelays();

  logger.debug("Positions generated:", positions.length, "insights available:", predefinedInsights.length);

  // Don't render anything if no positions (mobile)
  if (positions.length === 0) {
    logger.debug("No positions available - mobile view detected");
    return null;
  }

  // Show exactly 3 cards to match the reference image
  const cardsToShow = predefinedInsights.slice(0, 3);

  return (
    <>
      <style>{globalStyles}</style>
      {cardsToShow.map((insight, idx) => {
        logger.debug("Rendering insight:", insight.title, "hasSubtitle:", insight.hasSubtitle);
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
