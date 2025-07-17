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
  // Calculate bubble sizes based on project count (2x bigger sizes)
  const getBubbleSize = (count: number) => {
    if (count === 0) return 0;
    if (totalProjects === 0) return 80; // 2x bigger default
    const minSize = 70; // 2x bigger minimum (was 35)
    const maxSize = 120; // 2x bigger maximum (was 60)
    const ratio = count / Math.max(totalProjects, 1);
    return Math.max(minSize, Math.min(maxSize, minSize + (ratio * (maxSize - minSize))));
  };

  // Position bubbles with overlapping effect
  const bubblePositions = [
    { x: 45, y: 35 },  // Active - left
    { x: 75, y: 35 },  // Planning - center (overlapping)
    { x: 60, y: 55 }   // Complete - bottom center (overlapping)
  ];

  // Position text to avoid overlapping
  const textPositions = [
    { x: 40, y: 30 },  // Active - slightly offset
    { x: 80, y: 30 },  // Planning - slightly offset
    { x: 60, y: 60 }   // Complete - bottom
  ];

  return (
    <div className="relative w-full h-20 flex items-center justify-center">
      <svg width="160" height="70" viewBox="0 0 160 70" className="overflow-visible">
        {bubbleData.map((bubble, index) => {
          const size = getBubbleSize(bubble.count);
          const bubblePosition = bubblePositions[index];
          const textPosition = textPositions[index];
          
          return (
            <g key={bubble.label}>
              <circle
                cx={bubblePosition.x}
                cy={bubblePosition.y}
                r={size / 2}
                fill={bubble.color}
                stroke={bubble.color === '#FDFDFD' ? '#E5E7EB' : 'none'}
                strokeWidth={bubble.color === '#FDFDFD' ? 1 : 0}
                opacity="0.9"
                className="transition-all duration-300 hover:opacity-100"
              />
              {bubble.count > 0 && (
                <text
                  x={textPosition.x}
                  y={textPosition.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-xs font-bold ${bubble.textColor}`}
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