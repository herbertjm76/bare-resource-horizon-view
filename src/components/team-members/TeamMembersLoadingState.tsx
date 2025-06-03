
import React from 'react';
import { Loader2 } from 'lucide-react';

export const TeamMembersLoadingState: React.FC = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Verifying permissions...</p>
      </div>
    </div>
  );
};
