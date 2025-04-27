
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Send } from 'lucide-react';
import InviteMembersDialog from './InviteMembersDialog';

interface TeamInviteControlsProps {
  onAdd: () => void;
  onCopyInvite: () => void;
}

const TeamInviteControls: React.FC<TeamInviteControlsProps> = ({
  onCopyInvite
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => setIsDialogOpen(true)}>
        <Send className="h-4 w-4 mr-2" />
        Invite Member
      </Button>
      
      <Button variant="outline" onClick={onCopyInvite}>
        <Copy className="h-4 w-4 mr-2" />
        Copy Invite Link
      </Button>

      <InviteMembersDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
};

export default TeamInviteControls;
