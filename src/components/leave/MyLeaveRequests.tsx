import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLeaveRequests } from '@/hooks/leave/useLeaveRequests';
import { usePermissions } from '@/hooks/usePermissions';
import { LeaveRequestCard } from './LeaveRequestCard';
import { EditLeaveDialog } from './EditLeaveDialog';
import { FileText } from 'lucide-react';
import { LeaveRequest } from '@/types/leave';

interface MyLeaveRequestsProps {
  memberId?: string;
}

export const MyLeaveRequests: React.FC<MyLeaveRequestsProps> = ({ memberId }) => {
  const { leaveRequests, isLoading, cancelLeaveRequest, refreshLeaveRequests } = useLeaveRequests(memberId);
  const { isAdmin } = usePermissions();
  const [editingRequest, setEditingRequest] = useState<LeaveRequest | null>(null);

  const handleEdit = (request: LeaveRequest) => {
    setEditingRequest(request);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            My Leave Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            My Leave Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {leaveRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No leave requests found</p>
              <p className="text-sm">Submit a leave application to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaveRequests.map((request) => (
                <LeaveRequestCard
                  key={request.id}
                  request={request}
                  onCancel={cancelLeaveRequest}
                  onEdit={handleEdit}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EditLeaveDialog
        request={editingRequest}
        open={!!editingRequest}
        onOpenChange={(open) => !open && setEditingRequest(null)}
        onSuccess={refreshLeaveRequests}
        isAdmin={isAdmin}
      />
    </>
  );
};
