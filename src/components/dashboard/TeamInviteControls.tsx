
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
  const [emails, setEmails] = useState('');
  const {
    handleSendInvite,
    setInviteEmail,
    invLoading
  } = useTeamInvites(undefined);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailList = emails.split(',').map(email => email.trim()).filter(Boolean);
    
    for (const email of emailList) {
      setInviteEmail(email);
      await handleSendInvite(e);
    }
    
    setEmails('');
  };

  return (
    <form onSubmit={handleInvite} className="flex items-center gap-2">
      <Input 
        type="text" 
        placeholder="Enter email addresses (comma-separated)" 
        value={emails} 
        onChange={e => setEmails(e.target.value)} 
        className="max-w-xs"
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
