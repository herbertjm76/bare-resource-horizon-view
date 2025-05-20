
import React from 'react';

export const ResourceTableLoadingState = () => (
  <div className="border rounded-lg overflow-hidden p-8">
    <div className="flex flex-col items-center justify-center text-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
      <h3 className="text-lg font-medium mb-1">Loading Resources</h3>
      <p className="text-muted-foreground">Please wait while we fetch the resource data...</p>
    </div>
  </div>
);
