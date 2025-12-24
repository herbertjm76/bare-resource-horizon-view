import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Clock, Calendar, X, CheckCircle, XCircle, AlertCircle, Pencil, User } from 'lucide-react';
import { LeaveRequest } from '@/types/leave';
import { cn } from '@/lib/utils';

interface LeaveRequestCardProps {
  request: LeaveRequest;
  showMember?: boolean;
  onCancel?: (id: string) => void;
  onEdit?: (request: LeaveRequest) => void;
  isLoading?: boolean;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'bg-amber-500/10 text-amber-600 border-amber-200', icon: AlertCircle },
  approved: { label: 'Approved', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-500/10 text-red-600 border-red-200', icon: XCircle },
  cancelled: { label: 'Cancelled', color: 'bg-muted text-muted-foreground border-border', icon: X }
};

export const LeaveRequestCard: React.FC<LeaveRequestCardProps> = ({
  request,
  showMember = false,
  onCancel,
  onEdit,
  isLoading = false
}) => {
  const status = statusConfig[request.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  const getMemberName = () => {
    if (!request.member) return 'Unknown';
    return `${request.member.first_name || ''} ${request.member.last_name || ''}`.trim() || request.member.email;
  };

  const getMemberInitials = () => {
    if (!request.member) return '?';
    const first = request.member.first_name?.charAt(0) || '';
    const last = request.member.last_name?.charAt(0) || '';
    return (first + last).toUpperCase() || request.member.email.charAt(0).toUpperCase();
  };

  const getDurationLabel = () => {
    switch (request.duration_type) {
      case 'full_day': return 'Full Day';
      case 'half_day_am': return 'Half Day (AM)';
      case 'half_day_pm': return 'Half Day (PM)';
      default: return request.duration_type;
    }
  };

  const formatDateRange = () => {
    const start = new Date(request.start_date);
    const end = new Date(request.end_date);
    if (request.start_date === request.end_date) {
      return format(start, 'EEE, MMM d');
    }
    return `${format(start, 'MMM d')} → ${format(end, 'MMM d')}`;
  };

  return (
    <div className="group rounded-xl border bg-card p-4 hover:shadow-md transition-all duration-200">
      {/* Header Row - Status + Actions */}
      <div className="flex items-center justify-between mb-3">
        <Badge 
          variant="outline" 
          className={cn("text-xs px-2.5 py-1 gap-1.5 font-medium", status.color)}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          {status.label}
        </Badge>

        {request.status === 'pending' && (onEdit || onCancel) && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs gap-1"
                onClick={() => onEdit(request)}
                disabled={isLoading}
              >
                <Pencil className="h-3 w-3" />
                Edit
              </Button>
            )}
            {onCancel && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs gap-1 text-destructive hover:text-destructive"
                onClick={() => onCancel(request.id)}
                disabled={isLoading}
              >
                <X className="h-3 w-3" />
                Cancel
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Main Content - Centered with Inset Boxes */}
      <div className="space-y-3">
        {/* Member Info (if shown) */}
        {showMember && request.member && (
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50">
            <Avatar className="h-8 w-8">
              <AvatarImage src={request.member.avatar_url || undefined} alt={getMemberName()} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {getMemberInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{getMemberName()}</span>
          </div>
        )}

        {/* Leave Type & Duration Row */}
        <div className="grid grid-cols-2 gap-2">
          {/* Leave Type Box */}
          <div className="p-3 rounded-lg bg-muted/40 text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Type</div>
            {request.leave_type && (
              <div className="flex items-center justify-center gap-1.5">
                <div 
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: request.leave_type.color }}
                />
                <span className="text-sm font-medium">{request.leave_type.name}</span>
              </div>
            )}
          </div>

          {/* Duration Box */}
          <div className="p-3 rounded-lg bg-muted/40 text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Duration</div>
            <div className="flex items-center justify-center gap-1.5 text-sm font-medium">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              {request.total_hours}h
            </div>
          </div>
        </div>

        {/* Date Box */}
        <div className="p-3 rounded-lg bg-muted/40 text-center">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Dates</div>
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{formatDateRange()}</span>
            <span className="text-xs text-muted-foreground">({getDurationLabel()})</span>
          </div>
        </div>

        {/* Remarks (if any) */}
        {request.remarks && (
          <div className="p-3 rounded-lg bg-muted/40">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 text-center">Notes</div>
            <p className="text-xs text-muted-foreground text-center">{request.remarks}</p>
          </div>
        )}

        {/* Approver or Rejection Info */}
        {request.status === 'pending' && request.requested_approver && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1">
            <User className="h-3 w-3" />
            <span>Awaiting approval from {request.requested_approver.first_name}</span>
          </div>
        )}

        {request.status === 'rejected' && request.rejection_reason && (
          <div className="p-2.5 rounded-lg bg-red-50 border border-red-100">
            <div className="text-[10px] uppercase tracking-wider text-red-600 mb-1 text-center">Rejection Reason</div>
            <p className="text-xs text-red-600 text-center">{request.rejection_reason}</p>
          </div>
        )}
      </div>
    </div>
  );
};
