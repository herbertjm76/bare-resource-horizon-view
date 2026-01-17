
import React, { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTeamInvites } from '@/hooks/useTeamInvites';
import { toast } from 'sonner';
import { Invite } from './types';
import { supabase } from '@/integrations/supabase/client';

interface InviteMembersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  currentInvite?: Invite | null;
}

interface InviteeData {
  email: string;
  firstName: string;
  lastName: string;
  role: 'member' | 'admin';
}

const InviteMembersDialog: React.FC<InviteMembersDialogProps> = ({
  isOpen,
  onClose,
  companyId,
  currentInvite
}) => {
  const [invitees, setInvitees] = useState<InviteeData[]>([{ email: '', firstName: '', lastName: '', role: 'member' }]);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { handleSendInvite, setInviteEmail, invLoading } = useTeamInvites(companyId);

  useEffect(() => {
    if (currentInvite) {
      setInvitees([{
        email: currentInvite.email || '',
        firstName: currentInvite.first_name || '',
        lastName: currentInvite.last_name || '',
        role: (currentInvite.role as 'member' | 'admin') || 'member'
      }]);
      setIsEditing(true);
    } else {
      setInvitees([{ email: '', firstName: '', lastName: '', role: 'member' }]);
      setIsEditing(false);
    }
  }, [currentInvite, isOpen]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && currentInvite) {
      await handleUpdateInvite();
    } else {
      await handleSendInvites(e);
    }
  };

  const handleUpdateInvite = async () => {
    if (!currentInvite || !invitees[0]) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('invites')
        .update({
          email: invitees[0].email,
          first_name: invitees[0].firstName || null,
          last_name: invitees[0].lastName || null,
          role: invitees[0].role
        })
        .eq('id', currentInvite.id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Invite updated successfully');
      onClose();
    } catch (error: any) {
      toast.error('Failed to update invite: ' + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendInvites = async (e: React.FormEvent) => {
    const validInvitees = invitees.filter(inv => inv.email.trim());
    
    if (validInvitees.length === 0) {
      toast.error("Please enter at least one email address");
      return;
    }
    
    let successCount = 0;
    
    for (const invitee of validInvitees) {
      setInviteEmail(invitee.email.trim());
      const success = await handleSendInvite(e, invitee.firstName.trim(), invitee.lastName.trim(), invitee.role);
      if (success) successCount++;
    }
    
    if (successCount > 0) {
      toast.success(`Successfully sent ${successCount} invitation${successCount > 1 ? 's' : ''}`);
      setInvitees([{ email: '', firstName: '', lastName: '', role: 'member' }]);
      onClose();
    }
  };

  const addInvitee = () => {
    if (!isEditing) {
      setInvitees([...invitees, { email: '', firstName: '', lastName: '', role: 'member' }]);
    }
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
          <DialogTitle>{isEditing ? 'Edit Invite' : 'Invite Team Members'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update invitation details' 
              : 'Send invitations to join your team. Recipients will receive an email with instructions.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="space-y-4">
            {invitees.map((invitee, index) => (
              <div key={index} className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Email"
                    type="email"
                    value={invitee.email}
                    onChange={(e) => updateInvitee(index, 'email', e.target.value)}
                    className="col-span-3 sm:col-span-1"
                    disabled={isEditing && currentInvite?.status !== 'pending'}
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
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Role:</span>
                  <Select 
                    value={invitee.role} 
                    onValueChange={(value) => updateInvitee(index, 'role', value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
          {!isEditing && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={addInvitee}
              className="w-full"
            >
              Add Another
            </Button>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isUpdating || invLoading || !invitees.some(i => i.email.trim())}
            >
              {isEditing ? 'Update Invite' : 'Send Invites'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMembersDialog;