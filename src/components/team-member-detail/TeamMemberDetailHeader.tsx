
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User } from 'lucide-react';

export const TeamMemberDetailHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate('/team-members')}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Team Members
        </Button>
      </div>

      {/* Page Header - Standardized without member name to avoid redundancy */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-theme-primary/10">
            <User className="h-5 w-5 text-theme-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Team Member Profile
            </h1>
            <p className="text-muted-foreground">
              Performance insights and resource planning
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
