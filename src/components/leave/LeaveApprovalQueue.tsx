import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Users,
  AlertCircle,
  FileText,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  RefreshCw,
} from 'lucide-react';
import { useLeaveApprovals } from '@/hooks/leave/useLeaveApprovals';
import { LeaveRequest } from '@/types/leave';
import { cn } from '@/lib/utils';
import { ReassignApproverDialog } from './ReassignApproverDialog';

type LeaveApprovalQueueProps = {
  active?: boolean;
};

export const LeaveApprovalQueue: React.FC<LeaveApprovalQueueProps> = ({ active }) => {
  const {
    pendingApprovals,
    allRequests,
    isLoading,
    isProcessing,
    canApprove,
    approveRequest,
    rejectRequest,
    reassignApprover,
    refreshApprovals,
  } = useLeaveApprovals();

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const handleRefresh = async () => {
    await refreshApprovals();
    setLastUpdated(new Date());
  };

  useEffect(() => {
    if (active) {
      handleRefresh();
    }
  }, [active]);

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [reassignDialogOpen, setReassignDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = async (request: LeaveRequest) => {
    await approveRequest(request.id);
  };

  const handleRejectClick = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setRejectionReason('');
    setRejectDialogOpen(true);
  };

  const handleReassignClick = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setReassignDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (selectedRequest) {
      const success = await rejectRequest(selectedRequest.id, rejectionReason);
      if (success) {
        setRejectDialogOpen(false);
        setSelectedRequest(null);
        setRejectionReason('');
      }
    }
  };

  const getMemberName = (request: LeaveRequest) => {
    if (!request.member) return 'Unknown';
    return `${request.member.first_name || ''} ${request.member.last_name || ''}`.trim() || request.member.email;
  };

  const getMemberInitials = (request: LeaveRequest) => {
    if (!request.member) return '?';
    const first = request.member.first_name?.charAt(0) || '';
    const last = request.member.last_name?.charAt(0) || '';
    return (first + last).toUpperCase() || request.member.email.charAt(0).toUpperCase();
  };

  const getDurationLabel = (durationType: string) => {
    switch (durationType) {
      case 'full_day': return 'Full Day';
      case 'half_day_am': return 'Half Day (AM)';
      case 'half_day_pm': return 'Half Day (PM)';
      default: return durationType;
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string; icon: React.ElementType }> = {
      pending: { label: 'Pending', className: 'bg-amber-100 text-amber-800', icon: AlertCircle },
      approved: { label: 'Approved', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800', icon: XCircle },
      cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-800', icon: XCircle }
    };
    const { label, className, icon: Icon } = config[status] || config.pending;
    return (
      <Badge className={cn("flex items-center gap-1", className)}>
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  if (!canApprove) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">
            You don't have permission to approve leave requests.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Only managers, admins, and leave administrators can approve requests.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Leave Approval Queue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const renderRequestCard = (request: LeaveRequest, showActions: boolean = false) => (
    <Card key={request.id} className="transition-all hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
          {/* Member Info */}
          <div className="flex items-center gap-3 lg:w-1/4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={request.member?.avatar_url || undefined} alt={getMemberName(request)} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {getMemberInitials(request)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium truncate">{getMemberName(request)}</p>
              <p className="text-sm text-muted-foreground truncate">{request.member?.email}</p>
            </div>
          </div>

          {/* Leave Details */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {request.leave_type && (
                <Badge 
                  variant="secondary" 
                  style={{ 
                    backgroundColor: `${request.leave_type.color}20`,
                    color: request.leave_type.color,
                    borderColor: request.leave_type.color
                  }}
                  className="border"
                >
                  {request.leave_type.name}
                </Badge>
              )}
              {getStatusBadge(request.status ?? 'pending')}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>
                  {format(new Date(request.start_date), 'MMM d')}
                  {request.start_date !== request.end_date && (
                    <> - {format(new Date(request.end_date), 'MMM d')}</>
                  )}
                  , {format(new Date(request.start_date), 'yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 shrink-0" />
                <span>{getDurationLabel(request.duration_type)} ({request.total_hours}h)</span>
              </div>
            </div>

            {request.remarks && (
              <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                "{request.remarks}"
              </p>
            )}

            {request.attachment_url && (
              <a 
                href={request.attachment_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <FileText className="w-4 h-4" />
                View Attachment
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {request.status === 'rejected' && request.rejection_reason && (
              <div className="p-2 bg-red-50 rounded text-sm text-red-700">
                <strong>Rejection reason:</strong> {request.rejection_reason}
              </div>
            )}

            {request.status === 'approved' && request.approver && (
              <p className="text-xs text-muted-foreground">
                Approved by {request.approver.first_name} {request.approver.last_name}
                {request.approved_at && <> on {format(new Date(request.approved_at), 'PPP')}</>}
              </p>
            )}
          </div>

          {/* Actions */}
          {showActions && (request.status ?? 'pending') === 'pending' && (
            <div className="flex lg:flex-col gap-2 lg:w-auto">
              <Button
                size="sm"
                onClick={() => handleApprove(request)}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRejectClick(request)}
                disabled={isProcessing}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleReassignClick(request)}
                disabled={isProcessing}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <UserCheck className="w-4 h-4 mr-1" />
                Reassign
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Tabs defaultValue="pending" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Pending
              {pendingApprovals.length > 0 && (
                <Badge variant="secondary" className="ml-1 bg-amber-100 text-amber-800">
                  {pendingApprovals.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              All Requests
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                Updated {format(lastUpdated, 'h:mm a')}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="gap-1.5"
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>

        <TabsContent value="pending">
          {pendingApprovals.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500 opacity-50" />
                <p className="text-muted-foreground">No pending leave requests</p>
                <p className="text-sm text-muted-foreground mt-2">
                  All caught up! New requests will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingApprovals.map((request) => renderRequestCard(request, true))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all">
          {allRequests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No leave requests found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {allRequests.map((request) => renderRequestCard(request, request.status === 'pending'))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Rejection Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this leave request from{' '}
              <strong>{selectedRequest && getMemberName(selectedRequest)}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Please explain why this request is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={isProcessing || !rejectionReason.trim()}
            >
              {isProcessing ? 'Rejecting...' : 'Reject Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reassign Dialog */}
      <ReassignApproverDialog
        open={reassignDialogOpen}
        onOpenChange={setReassignDialogOpen}
        request={selectedRequest}
        onReassign={reassignApprover}
        isProcessing={isProcessing}
      />
    </>
  );
};
