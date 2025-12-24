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
      case 'full_day': return 'Full';
      case 'half_day_am': return 'AM';
      case 'half_day_pm': return 'PM';
      default: return request.duration_type;
    }
  };

  const formatDateRange = () => {
    const start = new Date(request.start_date);
    const end = new Date(request.end_date);
    if (request.start_date === request.end_date) {
      return format(start, 'MMM d, yyyy');
    }
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  };

  return (
    <div className="group flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
      {/* Left: Avatar or Leave Type Color */}
      {showMember && request.member ? (
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={request.member.avatar_url || undefined} alt={getMemberName()} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
            {getMemberInitials()}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div 
          className="h-9 w-9 rounded-full shrink-0 flex items-center justify-center"
          style={{ backgroundColor: `${request.leave_type?.color}15` }}
        >
          <div 
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: request.leave_type?.color }}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
        {/* Primary Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {showMember && (
              <span className="font-medium text-sm truncate">{getMemberName()}</span>
            )}
            {request.leave_type && (
              <Badge 
                variant="outline" 
                className="text-xs px-1.5 py-0 h-5 shrink-0 border"
                style={{ 
                  backgroundColor: `${request.leave_type.color}10`,
                  color: request.leave_type.color,
                  borderColor: `${request.leave_type.color}40`
                }}
              >
                {request.leave_type.name}
              </Badge>
            )}
          </div>
          {request.remarks && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {request.remarks}
            </p>
          )}
        </div>

        {/* Date & Duration */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDateRange()}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {getDurationLabel()} · {request.total_hours}h
          </span>
        </div>
      </div>

      {/* Status Badge */}
      <Badge 
        variant="outline" 
        className={cn("text-xs px-2 py-0.5 h-6 shrink-0 border gap-1", status.color)}
      >
        <StatusIcon className="w-3 h-3" />
        {status.label}
      </Badge>

      {/* Actions */}
      {request.status === 'pending' && (onEdit || onCancel) && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onEdit(request)}
              disabled={isLoading}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
          {onCancel && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => onCancel(request.id)}
              disabled={isLoading}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}

      {/* Approval Info (compact) */}
      {request.status === 'pending' && request.requested_approver && (
        <span className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground shrink-0">
          <User className="h-3 w-3" />
          {request.requested_approver.first_name}
        </span>
      )}

      {/* Rejection reason tooltip-style */}
      {request.status === 'rejected' && request.rejection_reason && (
        <span className="hidden lg:block text-xs text-red-600 max-w-32 truncate" title={request.rejection_reason}>
          {request.rejection_reason}
        </span>
      )}
    </div>
  );
};
