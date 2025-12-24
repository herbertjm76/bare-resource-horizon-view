import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  AlertCircle,
  FileText,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  Check,
  X,
  MoreHorizontal,
} from 'lucide-react';
import { useLeaveApprovals } from '@/hooks/leave/useLeaveApprovals';
import { LeaveRequest } from '@/types/leave';
import { cn } from '@/lib/utils';
import { ReassignApproverDialog } from './ReassignApproverDialog';
import { LeaveRequestCardSkeleton } from './LeaveRequestCardSkeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
      case 'full_day': return 'Full';
      case 'half_day_am': return 'AM';
      case 'half_day_pm': return 'PM';
      default: return durationType;
    }
  };

  const getStatusConfig = (status: string) => {
    const config: Record<string, { label: string; className: string; icon: React.ElementType }> = {
      pending: { label: 'Pending', className: 'bg-amber-500/10 text-amber-600 border-amber-200', icon: AlertCircle },
      approved: { label: 'Approved', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-200', icon: CheckCircle },
      rejected: { label: 'Rejected', className: 'bg-red-500/10 text-red-600 border-red-200', icon: XCircle },
      cancelled: { label: 'Cancelled', className: 'bg-muted text-muted-foreground border-border', icon: XCircle }
    };
    return config[status] || config.pending;
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (startDate === endDate) {
      return format(start, 'MMM d');
    }
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-10 w-64" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

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

  const renderApprovalCard = (request: LeaveRequest, showActions: boolean = false) => {
    const statusConfig = getStatusConfig(request.status ?? 'pending');
    const StatusIcon = statusConfig.icon;
    const isPending = (request.status ?? 'pending') === 'pending';

    return (
      <article key={request.id} className="group rounded-xl border bg-card p-4 transition-shadow hover:shadow-md">
        <header className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={request.member?.avatar_url || undefined} alt={getMemberName(request)} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {getMemberInitials(request)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{getMemberName(request)}</div>
              <div className="text-xs text-muted-foreground truncate">{request.member?.email}</div>
            </div>
          </div>

          {showActions && isPending ? (
            <div className="flex items-center gap-1 shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-3 gap-1.5"
                onClick={() => handleApprove(request)}
                disabled={isProcessing}
              >
                <Check className="h-4 w-4" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="h-8 px-3 gap-1.5"
                onClick={() => handleRejectClick(request)}
                disabled={isProcessing}
              >
                <X className="h-4 w-4" />
                Reject
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8" disabled={isProcessing}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleReassignClick(request)}>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Reassign approver
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Badge
              variant="outline"
              className={cn("h-7 px-2.5 text-xs font-medium gap-1.5", statusConfig.className)}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              {statusConfig.label}
            </Badge>
          )}
        </header>

        {/* Single inset block (reduces fragmentation) */}
        <section className="mt-4 rounded-lg border bg-muted/30 p-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Type</div>
              <div className="mt-1 flex items-center justify-center gap-2 text-sm font-medium">
                {request.leave_type ? (
                  <>
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: request.leave_type.color || undefined }}
                      aria-hidden
                    />
                    <span className="truncate max-w-[14rem]">{request.leave_type.name}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </div>
            </div>

            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Dates</div>
              <div className="mt-1 flex items-center justify-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDateRange(request.start_date, request.end_date)}</span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Duration</div>
              <div className="mt-1 flex items-center justify-center gap-1.5">
                {(() => {
                  const days = (request.total_hours || 0) / 8;
                  const fullDays = Math.floor(days);
                  const hasHalf = days % 1 >= 0.5;
                  return (
                    <>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: Math.min(fullDays, 5) }).map((_, i) => (
                          <div key={i} className="h-5 w-5 rounded bg-primary/80" />
                        ))}
                        {hasHalf && <div className="h-5 w-2.5 rounded-l bg-primary/50" />}
                        {fullDays > 5 && <span className="text-xs text-muted-foreground ml-1">+{fullDays - 5}</span>}
                      </div>
                      <span className="text-sm font-medium ml-1.5">{days % 1 === 0 ? days : days.toFixed(1)}d</span>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          {request.remarks && (
            <div className="mt-3 pt-3 border-t">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground text-center">Notes</div>
              <p className="mt-1 text-xs text-muted-foreground text-center break-words">{request.remarks}</p>
            </div>
          )}
        </section>

        {(request.status === 'approved' && request.approver) ||
        (request.status === 'rejected' && request.rejection_reason) ||
        request.attachment_url ? (
          <footer className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            {request.attachment_url && (
              <a
                href={request.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-primary transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                Attachment
                <ExternalLink className="h-3 w-3" />
              </a>
            )}

            {request.status === 'approved' && request.approver && (
              <span className="inline-flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-primary" />
                Approved by {request.approver.first_name}
              </span>
            )}

            {request.status === 'rejected' && request.rejection_reason && (
              <span className="inline-flex items-center gap-1 text-destructive">
                <XCircle className="h-3.5 w-3.5" />
                <span className="truncate max-w-[18rem]">{request.rejection_reason}</span>
              </span>
            )}
          </footer>
        ) : null}
      </article>
    );
  };

  return (
    <>
      <Tabs defaultValue="pending" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <TabsList className="h-9">
            <TabsTrigger value="pending" className="text-sm gap-1.5 px-3">
              <AlertCircle className="w-3.5 h-3.5" />
              Pending
              {pendingApprovals.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 bg-amber-100 text-amber-700 text-xs">
                  {pendingApprovals.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all" className="text-sm gap-1.5 px-3">
              <FileText className="w-3.5 h-3.5" />
              All
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                {format(lastUpdated, 'h:mm a')}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-8 px-2 gap-1.5"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>

        <TabsContent value="pending" className="mt-0">
          {pendingApprovals.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <CheckCircle className="w-10 h-10 mx-auto mb-3 text-emerald-500/50" />
                <p className="text-muted-foreground text-sm">No pending requests</p>
                <p className="text-xs text-muted-foreground mt-1">
                  All caught up!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {pendingApprovals.map((request) => renderApprovalCard(request, true))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-0">
          {allRequests.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-muted-foreground text-sm">No leave requests found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {allRequests.map((request) => renderApprovalCard(request, request.status === 'pending'))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Rejection Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Rejecting request from <strong>{selectedRequest && getMemberName(selectedRequest)}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="py-3">
            <Label htmlFor="rejection-reason" className="text-sm">Reason</Label>
            <Textarea
              id="rejection-reason"
              placeholder="Please explain why..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              className="mt-1.5"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRejectDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRejectConfirm}
              disabled={isProcessing || !rejectionReason.trim()}
            >
              {isProcessing ? 'Rejecting...' : 'Reject'}
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
