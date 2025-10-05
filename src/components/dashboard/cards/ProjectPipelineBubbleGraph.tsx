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

  // Position bubbles with extreme separation (maximum spacing)
  const bubblePositions = [
    { x: 15, y: 25 },  // Active - extreme left
    { x: 105, y: 25 }, // Planning - extreme right  
    { x: 60, y: 85 }   // Complete - far bottom
  ];

  // Position text to match bubble positions
  const textPositions = [
    { x: 15, y: 25 },  // Active - centered on bubble
    { x: 105, y: 25 }, // Planning - centered on bubble
    { x: 60, y: 85 }   // Complete - centered on bubble
  ];

  return (
    <div className="relative w-full h-32 flex items-center justify-center">
      <svg width="180" height="100" viewBox="0 0 180 100" className="overflow-visible">
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
                stroke={bubble.color.includes('--card') ? 'hsl(var(--border))' : 'none'}
                strokeWidth={bubble.color.includes('--card') ? 1.5 : 0}
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