
import React from "react";

export const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      <span className="ml-2">Loading project data...</span>
    </div>
  );
};
