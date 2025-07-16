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
  // Calculate bubble sizes based on project count (smaller sizes)
  const getBubbleSize = (count: number) => {
    if (count === 0) return 0;
    if (totalProjects === 0) return 30;
    const minSize = 25;
    const maxSize = 45;
    const ratio = count / Math.max(totalProjects, 1);
    return Math.max(minSize, Math.min(maxSize, minSize + (ratio * (maxSize - minSize))));
  };

  // Position bubbles side by side without overlapping
  const bubblePositions = [
    { x: 35, y: 35 },  // Active - left
    { x: 80, y: 35 },  // Planning - center
    { x: 125, y: 35 }  // Complete - right
  ];

  return (
    <div className="relative w-full h-20 flex items-center justify-center">
      <svg width="160" height="70" viewBox="0 0 160 70" className="overflow-visible">
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