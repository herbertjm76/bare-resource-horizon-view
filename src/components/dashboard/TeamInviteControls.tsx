
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Send } from 'lucide-react';
import { useTeamInvites } from '@/hooks/useTeamInvites';

interface TeamInviteControlsProps {
  onAdd: () => void;
  onCopyInvite: () => void;
}

const TeamInviteControls: React.FC<TeamInviteControlsProps> = ({
  onAdd,
  onCopyInvite
}) => {
  const [email, setEmail] = useState('');
  const {
    handleSendInvite,
    setInviteEmail,
    invLoading
  } = useTeamInvites(undefined);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteEmail(email);
    const success = await handleSendInvite(e);
    if (success) {
      setEmail('');
    }
  };

  return (
    <form onSubmit={handleInvite} className="flex-1 flex items-center gap-2">
      <Input 
        type="email" 
        placeholder="Enter email address" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
      />
      <Button type="submit" disabled={invLoading}>
        <Send className="h-4 w-4 mr-2" />
        Invite Member
      </Button>
      
      <Button variant="outline" onClick={onCopyInvite}>
        <Copy className="h-4 w-4 mr-2" />
        Copy Invite Link
      </Button>
    </form>
  );
};

export default TeamInviteControls;
