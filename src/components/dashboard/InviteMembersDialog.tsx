
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTeamInvites } from '@/hooks/useTeamInvites';
import { toast } from 'sonner';

interface InviteMembersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string; // Add companyId prop
}

const InviteMembersDialog: React.FC<InviteMembersDialogProps> = ({
  isOpen,
  onClose,
  companyId,
}) => {
  const [emails, setEmails] = useState('');
  const { handleSendInvite, setInviteEmail, invLoading } = useTeamInvites(companyId);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emails.trim()) {
      toast.error("Please enter at least one email address");
      return;
    }
    
    const emailList = emails.split(',').map(email => email.trim()).filter(Boolean);
    let successCount = 0;
    
    for (const email of emailList) {
      setInviteEmail(email);
      const success = await handleSendInvite(e);
      if (success) successCount++;
    }
    
    if (successCount > 0) {
      toast.success(`Successfully sent ${successCount} invitation${successCount > 1 ? 's' : ''}`);
      setEmails('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Members</DialogTitle>
          <DialogDescription>
            Send invitations to join your team. Recipients will receive an email with instructions.
          </DialogDescription>
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
            <Button type="submit" disabled={invLoading || !emails.trim()} isLoading={invLoading}>
              Send Invites
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMembersDialog;
