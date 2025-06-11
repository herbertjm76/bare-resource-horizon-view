
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';

interface TeamMemberDetailHeaderProps {
  memberData: any;
}

export const TeamMemberDetailHeader: React.FC<TeamMemberDetailHeaderProps> = ({
  memberData
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/team-members')}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Team
            </Button>
          </div>
        </div>
        
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary flex items-center gap-2 sm:gap-3">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-brand-violet flex-shrink-0" />
            <span className="break-words">
              {`${memberData.first_name || ''} ${memberData.last_name || ''}`.trim() || 'Team Member'}
            </span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Resource Planning & Allocation Overview
          </p>
        </div>
      </div>
    </div>
  );
};
