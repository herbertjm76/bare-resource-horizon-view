
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OfficeSettingsErrorStateProps {
  isAuthorized: boolean;
  onNavigateToDashboard: () => void;
  onRefresh: () => void;
}

export const OfficeSettingsErrorState: React.FC<OfficeSettingsErrorStateProps> = ({
  isAuthorized,
  onNavigateToDashboard,
  onRefresh
}) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="p-6 rounded-lg border border-red-500/30 bg-red-500/10 max-w-lg">
        <div className="flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foreground">
              {!isAuthorized ? "Access Denied" : "No Company Data Found"}
            </h3>
            <p className="text-muted-foreground">
              {!isAuthorized 
                ? "You don't have permission to access this page. Only owners and admins can manage office settings."
                : "Unable to load company data. This could be because your account isn't associated with a company."}
            </p>
            <div className="flex gap-3 pt-2">
              <Button onClick={onNavigateToDashboard}>
                Go to Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={onRefresh}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" /> 
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
