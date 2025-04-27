
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, UserPlus } from 'lucide-react';

interface TeamInviteControlsProps {
  onAdd: () => void;
  onCopyInvite: () => void;
}

const TeamInviteControls: React.FC<TeamInviteControlsProps> = ({
  onAdd,
  onCopyInvite
}) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onAdd}>
        <UserPlus className="h-4 w-4 mr-2" />
        Invite Member
      </Button>
      <Button variant="outline" onClick={onCopyInvite}>
        <Copy className="h-4 w-4 mr-2" />
        Copy Invite Link
      </Button>
    </div>
  );
};

export default TeamInviteControls;
