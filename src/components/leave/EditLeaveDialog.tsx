import React, { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, differenceInBusinessDays, isBefore, startOfDay } from 'date-fns';
import { CalendarIcon, Save, Clock, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeaveAttachmentUpload } from './LeaveAttachmentUpload';
import { useLeaveTypes } from '@/hooks/leave/useLeaveTypes';
import { useLeaveRequests } from '@/hooks/leave/useLeaveRequests';
import { useProjectManagers } from '@/hooks/leave/useProjectManagers';
import { LeaveRequest } from '@/types/leave';
import { Card } from '@/components/ui/card';

interface EditLeaveDialogProps {
  request: LeaveRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  isAdmin?: boolean;
}

export const EditLeaveDialog: React.FC<EditLeaveDialogProps> = ({
  request,
  open,
  onOpenChange,
  onSuccess,
  isAdmin = false
}) => {
  const { leaveTypes, isLoading: isLoadingTypes } = useLeaveTypes();
  const { updateLeaveRequest, isSubmitting } = useLeaveRequests();
  const { projectManagers, isLoading: isLoadingPMs } = useProjectManagers();

  const [leaveTypeId, setLeaveTypeId] = useState('');
  const [durationType, setDurationType] = useState<'full_day' | 'half_day_am' | 'half_day_pm'>('full_day');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [remarks, setRemarks] = useState('');
  const [requestedApproverId, setRequestedApproverId] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [approverSearch, setApproverSearch] = useState('');

  // Populate form when request changes
  useEffect(() => {
    if (request && open) {
      setLeaveTypeId(request.leave_type_id);
      setDurationType(request.duration_type as 'full_day' | 'half_day_am' | 'half_day_pm');
      setStartDate(new Date(request.start_date));
      setEndDate(new Date(request.end_date));
      setRemarks(request.remarks);
      setRequestedApproverId(request.requested_approver_id || '');
      setAttachment(null);
      setErrors({});
    }
  }, [request, open]);

  const selectedLeaveType = useMemo(() => {
    return leaveTypes.find(lt => lt.id === leaveTypeId);
  }, [leaveTypes, leaveTypeId]);

  const requiresAttachment = useMemo(() => {
    if (!selectedLeaveType) return false;
    if (!selectedLeaveType.requires_attachment) return false;
    
    if (startDate && endDate && selectedLeaveType.code === 'sick') {
      const days = differenceInBusinessDays(endDate, startDate) + 1;
      return days > 1;
    }
    
    return selectedLeaveType.requires_attachment;
  }, [selectedLeaveType, startDate, endDate]);

  const totalDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return differenceInBusinessDays(endDate, startDate) + 1;
  }, [startDate, endDate]);

  const totalHours = useMemo(() => {
    if (totalDays === 0) return 0;
    return durationType === 'full_day' ? totalDays * 8 : totalDays * 4;
  }, [totalDays, durationType]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!leaveTypeId) {
      newErrors.leave_type_id = 'Please select a leave type';
    }
    if (!startDate) {
      newErrors.start_date = 'Start date is required';
    }
    if (!endDate) {
      newErrors.end_date = 'End date is required';
    }
    if (startDate && endDate && isBefore(endDate, startDate)) {
      newErrors.end_date = 'End date must be after start date';
    }
    if (!remarks?.trim()) {
      newErrors.remarks = 'Please provide a reason';
    }
    if (requiresAttachment && !attachment && !request?.attachment_url) {
      newErrors.attachment = 'Medical certificate required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !request) return;

    const success = await updateLeaveRequest(
      request.id,
      {
        leave_type_id: leaveTypeId,
        duration_type: durationType,
        start_date: startDate!,
        end_date: endDate!,
        remarks: remarks,
        requested_approver_id: requestedApproverId || undefined,
        attachment: attachment || undefined
      },
      isAdmin
    );

    if (success) {
      onOpenChange(false);
      onSuccess?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Leave Request</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Leave Type */}
          <div className="space-y-2">
            <Label>Leave Type</Label>
            <Select
              value={leaveTypeId}
              onValueChange={setLeaveTypeId}
              disabled={isLoadingTypes || isSubmitting}
            >
              <SelectTrigger className={cn(errors.leave_type_id && "border-destructive")}>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: type.color || '#3B82F6' }}
                      />
                      {type.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.leave_type_id && <p className="text-sm text-destructive">{errors.leave_type_id}</p>}
          </div>

          {/* Approver Selection */}
          <div className="space-y-2">
            <Label>Approving Manager</Label>
            <Select
              value={requestedApproverId}
              onValueChange={(value) => {
                setRequestedApproverId(value);
                setApproverSearch('');
              }}
              disabled={isLoadingPMs || isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select approving manager" />
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
                {projectManagers
                  .filter((approver) => {
                    const fullName = `${approver.first_name || ''} ${approver.last_name || ''}`.toLowerCase();
                    return fullName.includes(approverSearch.toLowerCase());
                  })
                  .map((approver) => (
                    <SelectItem key={approver.id} value={approver.id}>
                      {approver.first_name} {approver.last_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground",
                      errors.start_date && "border-destructive"
                    )}
                    disabled={isSubmitting}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'MMM d, yyyy') : 'Select'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errors.start_date && <p className="text-sm text-destructive">{errors.start_date}</p>}
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground",
                      errors.end_date && "border-destructive"
                    )}
                    disabled={isSubmitting}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'MMM d, yyyy') : 'Select'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => startDate ? isBefore(date, startDate) : false}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errors.end_date && <p className="text-sm text-destructive">{errors.end_date}</p>}
            </div>
          </div>

          {/* Duration Type */}
          <div className="space-y-2">
            <Label>Duration</Label>
            <div className="flex gap-2">
              {[
                { value: 'full_day', label: 'Full Day' },
                { value: 'half_day_am', label: 'Half (AM)' },
                { value: 'half_day_pm', label: 'Half (PM)' },
              ].map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={durationType === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDurationType(option.value as any)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Duration Summary */}
          {startDate && endDate && (
            <Card className="p-3 bg-muted/50">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">
                  {totalDays} {totalDays === 1 ? 'day' : 'days'} · {totalHours} hours
                </span>
              </div>
            </Card>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label>Reason</Label>
            <Textarea
              placeholder="Briefly describe why you're taking leave..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              disabled={isSubmitting}
              rows={3}
              className={cn(errors.remarks && "border-destructive")}
            />
            {errors.remarks && <p className="text-sm text-destructive">{errors.remarks}</p>}
          </div>

          {/* Attachment */}
          <LeaveAttachmentUpload
            file={attachment}
            onFileChange={setAttachment}
            required={requiresAttachment && !request?.attachment_url}
            disabled={isSubmitting}
            label={`Attachment ${requiresAttachment ? '(Required)' : '(Optional)'}`}
          />
          {request?.attachment_url && !attachment && (
            <p className="text-xs text-muted-foreground">
              Current attachment will be kept unless you upload a new one.
            </p>
          )}
          {errors.attachment && <p className="text-sm text-destructive">{errors.attachment}</p>}

          {/* Submit */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                'Saving...'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};