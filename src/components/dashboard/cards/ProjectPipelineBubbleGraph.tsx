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

  // Position bubbles with maximum separation (no overlapping)
  const bubblePositions = [
    { x: 25, y: 30 },  // Active - far left
    { x: 95, y: 30 },  // Planning - far right  
    { x: 60, y: 75 }   // Complete - bottom center with more separation
  ];

  // Position text to match bubble positions
  const textPositions = [
    { x: 25, y: 30 },  // Active - centered on bubble
    { x: 95, y: 30 },  // Planning - centered on bubble
    { x: 60, y: 75 }   // Complete - centered on bubble
  ];

  return (
    <div className="relative w-full h-28 flex items-center justify-center">
      <svg width="160" height="90" viewBox="0 0 160 90" className="overflow-visible">
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