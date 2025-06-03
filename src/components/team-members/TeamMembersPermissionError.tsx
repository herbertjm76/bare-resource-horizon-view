
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface TeamMembersPermissionErrorProps {
  permissionError?: string;
  onRetry: () => Promise<void>;
}

export const TeamMembersPermissionError: React.FC<TeamMembersPermissionErrorProps> = ({
  permissionError,
  onRetry
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            {permissionError || 'You do not have permission to access this page'}
          </AlertDescription>
        </Alert>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
          <Button onClick={onRetry}>
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
};
