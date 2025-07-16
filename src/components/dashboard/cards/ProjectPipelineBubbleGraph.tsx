import React from 'react';

interface BubbleData {
  label: string;
  count: number;
  color: string;
  textColor: string;
}

interface ProjectPipelineBubbleGraphProps {
  bubbleData: BubbleData[];
  totalProjects: number;
}

export const ProjectPipelineBubbleGraph: React.FC<ProjectPipelineBubbleGraphProps> = ({
  bubbleData,
  totalProjects
}) => {
  // Calculate bubble sizes based on project count
  const getBubbleSize = (count: number) => {
    if (totalProjects === 0) return 60;
    const minSize = 40;
    const maxSize = 100;
    const ratio = count / totalProjects;
    return Math.max(minSize, Math.min(maxSize, minSize + (ratio * (maxSize - minSize))));
  };

  // Position bubbles with overlapping effect
  const bubblePositions = [
    { x: 20, y: 20 }, // Active - top left
    { x: 60, y: 40 }, // Planning - center right (overlapping)
    { x: 35, y: 70 }  // Complete - bottom center (overlapping)
  ];

  return (
    <div className="relative w-full h-32 flex items-center justify-center">
      <svg width="160" height="120" viewBox="0 0 160 120" className="overflow-visible">
        {bubbleData.map((bubble, index) => {
          const size = getBubbleSize(bubble.count);
          const position = bubblePositions[index];
          
          return (
            <g key={bubble.label}>
              <circle
                cx={position.x}
                cy={position.y}
                r={size / 2}
                fill={bubble.color}
                opacity="0.9"
                className="transition-all duration-300 hover:opacity-100"
              />
              {bubble.count > 0 && (
                <text
                  x={position.x}
                  y={position.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-sm font-bold ${bubble.textColor}`}
                  fill="currentColor"
                >
                  {bubble.count}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};