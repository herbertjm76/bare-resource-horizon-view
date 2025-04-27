
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTeamInvites } from '@/hooks/useTeamInvites';

interface InviteMembersDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteMembersDialog: React.FC<InviteMembersDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [emails, setEmails] = useState('');
  const { handleSendInvite, setInviteEmail, invLoading } = useTeamInvites(undefined);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailList = emails.split(',').map(email => email.trim()).filter(Boolean);
    
    for (const email of emailList) {
      setInviteEmail(email);
      await handleSendInvite(e);
    }
    
    setEmails('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Members</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="emails" className="text-sm font-medium">
              Email Addresses
            </label>
            <Textarea
              id="emails"
              placeholder="Enter email addresses separated by commas"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-sm text-muted-foreground">
              You can enter multiple email addresses separated by commas
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={invLoading || !emails.trim()}>
              Send Invites
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMembersDialog;
