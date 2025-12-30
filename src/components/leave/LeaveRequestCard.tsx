import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Clock, Calendar, X, CheckCircle, XCircle, AlertCircle, Pencil, User, CalendarCheck } from 'lucide-react';
import { LeaveRequest } from '@/types/leave';
import { cn } from '@/lib/utils';

interface LeaveRequestCardProps {
  request: LeaveRequest;
  showMember?: boolean;
  onCancel?: (id: string) => void;
  onEdit?: (request: LeaveRequest) => void;
  isLoading?: boolean;
  isAdmin?: boolean;
}

const statusConfig: Record<
  string,
  { label: string; className: string; icon: React.ElementType }
> = {
  pending: {
    label: 'Pending',
    className: 'bg-muted text-muted-foreground border-border',
    icon: AlertCircle,
  },
  approved: {
    label: 'Approved',
    className: 'bg-primary/10 text-primary border-primary/20',
    icon: CheckCircle,
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
    icon: XCircle,
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-muted text-muted-foreground border-border',
    icon: X,
  },
};

export const LeaveRequestCard: React.FC<LeaveRequestCardProps> = ({
  request,
  showMember = false,
  onCancel,
  onEdit,
  isLoading = false,
  isAdmin = false
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
    <article className="group rounded-xl border bg-card p-4 transition-shadow hover:shadow-md">
      {/* Header */}
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "h-7 px-2.5 text-xs font-medium gap-1.5",
                status.className
              )}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              {status.label}
            </Badge>

            {request.leave_type && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: request.leave_type.color || undefined }}
                  aria-hidden
                />
                <span className="truncate">{request.leave_type.name}</span>
              </div>
            )}
          </div>

          {showMember && request.member && (
            <div className="mt-2 flex items-center gap-2 min-w-0">
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarImage src={request.member.avatar_url || undefined} alt={getMemberName()} />
                <AvatarFallback className="bg-primary/10 text-primary text-[11px] font-medium">
                  {getMemberInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{getMemberName()}</div>
              </div>
            </div>
          )}
        </div>

        {/* Show edit/cancel for pending requests OR for admin on any status */}
        {(request.status === 'pending' || (isAdmin && request.status !== 'cancelled')) && (onEdit || onCancel) && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => onEdit(request)}
                disabled={isLoading}
              >
                <Pencil className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
            )}
            {onCancel && request.status === 'pending' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-destructive hover:text-destructive"
                onClick={() => onCancel(request.id)}
                disabled={isLoading}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
            )}
          </div>
        )}
      </header>

      {/* Inset summary (single, readable block) */}
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
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Dates</div>
            {(() => {
              const start = new Date(request.start_date);
              const end = new Date(request.end_date);
              const isSingleDay = request.start_date === request.end_date;
              const leaveColor = request.leave_type?.color || 'hsl(var(--primary))';
              
              const DateTile = ({ date }: { date: Date }) => (
                <div
                  className="flex flex-col items-center justify-center h-11 w-10 rounded-lg border-2 bg-background text-center"
                  style={{ borderColor: leaveColor }}
                >
                  <span className="text-[9px] uppercase text-muted-foreground leading-none">
                    {format(date, 'EEE')}
                  </span>
                  <span className="text-base font-bold leading-tight">{format(date, 'd')}</span>
                  <span className="text-[8px] text-muted-foreground leading-none">{format(date, 'MMM')}</span>
                </div>
              );
              
              return (
                <div className="flex items-center justify-center gap-2">
                  <DateTile date={start} />
                  {!isSingleDay && (
                    <>
                      <span className="text-muted-foreground text-lg">→</span>
                      <DateTile date={end} />
                    </>
                  )}
                </div>
              );
            })()}
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Duration</div>
            <Badge 
              variant="secondary" 
              className="text-xs font-semibold px-2 py-0.5 w-fit"
              style={{ backgroundColor: `${request.leave_type?.color}20`, color: request.leave_type?.color }}
            >
              {(() => {
                const hours = request.total_hours || 0;
                if (hours < 8) return `${hours}h`;
                const days = hours / 8;
                return days === 1 ? '1 Day' : `${days % 1 === 0 ? days : days.toFixed(1)} Days`;
              })()}
            </Badge>
          </div>
        </div>

        {request.remarks && (
          <div className="mt-3 pt-3 border-t">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground text-center">Notes</div>
            <p className="mt-1 text-xs text-muted-foreground text-center break-words">
              {request.remarks}
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      {request.status === 'approved' && (request as any).sent_to_calendar_at && (
        <footer className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <CalendarCheck className="h-3.5 w-3.5 text-primary" />
          <span>Sent to calendar on {format(new Date((request as any).sent_to_calendar_at), 'MMM d, yyyy')}</span>
        </footer>
      )}

      {request.status === 'pending' && request.requested_approver && (
        <footer className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          <span>Awaiting approval from {request.requested_approver.first_name}</span>
        </footer>
      )}

      {request.status === 'rejected' && request.rejection_reason && (
        <footer className="mt-3 rounded-lg border border-destructive/20 bg-destructive/10 p-2.5">
          <div className="text-[10px] uppercase tracking-wider text-destructive text-center">Rejection reason</div>
          <p className="mt-1 text-xs text-destructive text-center break-words">
            {request.rejection_reason}
          </p>
        </footer>
      )}
    </article>
  );
};
