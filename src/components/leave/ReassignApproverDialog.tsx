import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, UserCheck } from 'lucide-react';
import { useProjectManagers } from '@/hooks/leave/useProjectManagers';
import { LeaveRequest } from '@/types/leave';

interface ReassignApproverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: LeaveRequest | null;
  onReassign: (requestId: string, newApproverId: string) => Promise<boolean>;
  isProcessing: boolean;
}

export const ReassignApproverDialog: React.FC<ReassignApproverDialogProps> = ({
  open,
  onOpenChange,
  request,
  onReassign,
  isProcessing
}) => {
  const { projectManagers, isLoading: isLoadingPMs } = useProjectManagers();
  const [selectedApproverId, setSelectedApproverId] = useState('');
  const [approverSearch, setApproverSearch] = useState('');

  const handleReassign = async () => {
    if (!request || !selectedApproverId) return;
    
    const success = await onReassign(request.id, selectedApproverId);
    if (success) {
      setSelectedApproverId('');
      setApproverSearch('');
      onOpenChange(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedApproverId('');
      setApproverSearch('');
    }
    onOpenChange(newOpen);
  };

  const currentApproverName = request?.requested_approver 
    ? `${request.requested_approver.first_name || ''} ${request.requested_approver.last_name || ''}`.trim()
    : 'Not assigned';

  // Filter out the current approver from the list
  const availableApprovers = projectManagers.filter(
    approver => approver.id !== request?.requested_approver_id
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Reassign Approver
          </DialogTitle>
          <DialogDescription>
            Select a new approver for this leave request. The current approver ({currentApproverName}) will no longer be able to approve this request.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>New Approving Manager</Label>
            <Select
              value={selectedApproverId}
              onValueChange={(value) => {
                setSelectedApproverId(value);
                setApproverSearch('');
              }}
              disabled={isLoadingPMs || isProcessing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select new approver" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={approverSearch}
                      onChange={(e) => setApproverSearch(e.target.value)}
                      className="pl-8"
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                {availableApprovers
                  .filter((approver) => {
                    const fullName = `${approver.first_name || ''} ${approver.last_name || ''}`.toLowerCase();
                    return fullName.includes(approverSearch.toLowerCase());
                  })
                  .map((approver) => (
                    <SelectItem key={approver.id} value={approver.id}>
                      {approver.first_name} {approver.last_name}
                    </SelectItem>
                  ))}
                {availableApprovers.filter((approver) => {
                  const fullName = `${approver.first_name || ''} ${approver.last_name || ''}`.toLowerCase();
                  return fullName.includes(approverSearch.toLowerCase());
                }).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">No approvers found</p>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReassign}
            disabled={isProcessing || !selectedApproverId}
          >
            {isProcessing ? 'Reassigning...' : 'Reassign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
