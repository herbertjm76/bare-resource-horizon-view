import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Clock, Calendar, X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { LeaveRequest } from '@/types/leave';
import { cn } from '@/lib/utils';

interface LeaveRequestCardProps {
  request: LeaveRequest;
  showMember?: boolean;
  onCancel?: (id: string) => void;
  isLoading?: boolean;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-800', icon: AlertCircle },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
  cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800', icon: X }
};

export const LeaveRequestCard: React.FC<LeaveRequestCardProps> = ({
  request,
  showMember = false,
  onCancel,
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

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Header with member info and status */}
            <div className="flex items-center gap-3 mb-3">
              {showMember && request.member && (
                <Avatar className="h-10 w-10">
                  <AvatarImage src={request.member.avatar_url || undefined} alt={getMemberName()} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getMemberInitials()}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex-1 min-w-0">
                {showMember && (
                  <p className="font-medium truncate">{getMemberName()}</p>
                )}
                <div className="flex items-center gap-2">
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
                  <Badge className={cn("flex items-center gap-1", status.color)}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Date and Duration */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(request.start_date), 'MMM d')}
                  {request.start_date !== request.end_date && (
                    <> - {format(new Date(request.end_date), 'MMM d, yyyy')}</>
                  )}
                  {request.start_date === request.end_date && (
                    <>, {format(new Date(request.start_date), 'yyyy')}</>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{getDurationLabel()} ({request.total_hours}h)</span>
              </div>
            </div>

            {/* Remarks */}
            {request.remarks && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {request.remarks}
              </p>
            )}

            {/* Rejection reason */}
            {request.status === 'rejected' && request.rejection_reason && (
              <div className="p-2 bg-red-50 rounded text-sm text-red-700">
                <strong>Reason:</strong> {request.rejection_reason}
              </div>
            )}

            {/* Approver info */}
            {request.status === 'approved' && request.approver && (
              <p className="text-xs text-muted-foreground">
                Approved by {request.approver.first_name} {request.approver.last_name}
                {request.approved_at && <> on {format(new Date(request.approved_at), 'PPP')}</>}
              </p>
            )}
          </div>

          {/* Actions */}
          {request.status === 'pending' && onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCancel(request.id)}
              disabled={isLoading}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
