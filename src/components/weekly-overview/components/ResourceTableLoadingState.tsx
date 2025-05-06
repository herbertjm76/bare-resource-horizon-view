
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export const ResourceTableLoadingState: React.FC = () => {
  const [loadingTime, setLoadingTime] = useState<number>(0);
  const [showRetry, setShowRetry] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingTime(prev => prev + 1);
    }, 1000);

    // After 8 seconds, show retry button
    const retryTimer = setTimeout(() => {
      setShowRetry(true);
    }, 8000);

    return () => {
      clearInterval(timer);
      clearTimeout(retryTimer);
    };
  }, []);

  const handleRetry = () => {
    // Force reload the current page
    window.location.reload();
  };

  return (
    <div className="border rounded-lg overflow-hidden p-6">
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-muted-foreground text-sm mb-1">Loading resources... ({loadingTime}s)</p>
        
        {showRetry && (
          <div className="mt-4 text-center">
            <p className="text-amber-600 text-sm mb-2">This is taking longer than expected.</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry}
              className="flex items-center gap-1"
            >
              <RefreshCcw className="h-3 w-3 mr-1" /> Retry
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
