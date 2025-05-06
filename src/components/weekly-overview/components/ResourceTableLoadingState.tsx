
import React from 'react';

export const ResourceTableLoadingState: React.FC = () => {
  return (
    <div className="border rounded-lg overflow-hidden p-6">
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-muted-foreground text-sm">Loading resources...</p>
      </div>
    </div>
  );
};
