
import React from "react";

interface StageHeaderProps {
  stageName: string;
  stageColor: string;
}

export const StageHeader: React.FC<StageHeaderProps> = ({
  stageName,
  stageColor,
}) => {
  return (
    <div 
      className="p-3 text-white"
      style={{ backgroundColor: stageColor }}
    >
      <h4 className="font-semibold">{stageName}</h4>
    </div>
  );
};
