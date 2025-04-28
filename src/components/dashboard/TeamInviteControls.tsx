
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TeamInviteControlsProps {
  onAdd: () => void;
}

const TeamInviteControls: React.FC<TeamInviteControlsProps> = ({
  onAdd
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={onAdd}>
        <Plus className="h-4 w-4 mr-2" />
        Add Member
      </Button>
    </div>
  );
};

export default TeamInviteControls;
