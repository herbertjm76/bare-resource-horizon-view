
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OfficeSettingsLoadingStateProps {
  authLoading: boolean;
  error: string | null;
  isAuthorized: boolean;
}

export const OfficeSettingsLoadingState: React.FC<OfficeSettingsLoadingStateProps> = ({ 
  authLoading, 
  error,
  isAuthorized
}) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          {authLoading && !isAuthorized ? "Verifying access..." : "Loading company data..."}
        </p>
        {error && (
          <div className="text-sm text-red-500 mt-2 max-w-md text-center">
            {error}
            <Button 
              variant="link" 
              className="ml-2 p-0 h-auto" 
              onClick={() => window.location.reload()}
            >
              Reload page
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
