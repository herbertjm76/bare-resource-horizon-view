
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
import { Input } from "@/components/ui/input";
import { useTeamInvites } from '@/hooks/useTeamInvites';
import { toast } from 'sonner';

interface InviteMembersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
}

interface InviteeData {
  email: string;
  firstName: string;
  lastName: string;
}

const InviteMembersDialog: React.FC<InviteMembersDialogProps> = ({
  isOpen,
  onClose,
  companyId,
}) => {
  const [invitees, setInvitees] = useState<InviteeData[]>([{ email: '', firstName: '', lastName: '' }]);
  const { handleSendInvite, setInviteEmail, invLoading } = useTeamInvites(companyId);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const validInvitees = invitees.filter(inv => inv.email.trim());
    
    if (validInvitees.length === 0) {
      toast.error("Please enter at least one email address");
      return;
    }
    
    let successCount = 0;
    
    for (const invitee of validInvitees) {
      setInviteEmail(invitee.email.trim());
      const success = await handleSendInvite(e, invitee.firstName.trim(), invitee.lastName.trim());
      if (success) successCount++;
    }
    
    if (successCount > 0) {
      toast.success(`Successfully sent ${successCount} invitation${successCount > 1 ? 's' : ''}`);
      setInvitees([{ email: '', firstName: '', lastName: '' }]);
      onClose();
    }
  };

  const addInvitee = () => {
    setInvitees([...invitees, { email: '', firstName: '', lastName: '' }]);
  };

  const updateInvitee = (index: number, field: keyof InviteeData, value: string) => {
    const newInvitees = [...invitees];
    newInvitees[index] = { ...newInvitees[index], [field]: value };
    setInvitees(newInvitees);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Invite Team Members</DialogTitle>
          <DialogDescription>
            Send invitations to join your team. Recipients will receive an email with instructions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="space-y-4">
            {invitees.map((invitee, index) => (
              <div key={index} className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Email"
                  type="email"
                  value={invitee.email}
                  onChange={(e) => updateInvitee(index, 'email', e.target.value)}
                  className="col-span-3 sm:col-span-1"
                />
                <Input
                  placeholder="First Name"
                  value={invitee.firstName}
                  onChange={(e) => updateInvitee(index, 'firstName', e.target.value)}
                  className="col-span-3 sm:col-span-1"
                />
                <Input
                  placeholder="Last Name"
                  value={invitee.lastName}
                  onChange={(e) => updateInvitee(index, 'lastName', e.target.value)}
                  className="col-span-3 sm:col-span-1"
                />
              </div>
            ))}
          </div>
          <Button 
            type="button" 
            variant="outline" 
            onClick={addInvitee}
            className="w-full"
          >
            Add Another
          </Button>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={invLoading || !invitees.some(i => i.email.trim())}>
              Send Invites
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMembersDialog;
