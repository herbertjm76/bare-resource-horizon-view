
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface EmptyTeamStateProps {
  onAddMember: () => void;
}

export const EmptyTeamState: React.FC<EmptyTeamStateProps> = ({ onAddMember }) => {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center justify-center">
        <div className="text-center py-8">
          <p className="text-gray-700 mb-6">No team members found. Get started by adding your first team member.</p>
          <Button onClick={onAddMember}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
