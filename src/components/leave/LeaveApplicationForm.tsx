import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, differenceInBusinessDays, isBefore, startOfDay } from 'date-fns';
import { CalendarIcon, Send, Info, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeaveTypeSelector } from './LeaveTypeSelector';
import { LeaveDurationSelector } from './LeaveDurationSelector';
import { LeaveAttachmentUpload } from './LeaveAttachmentUpload';
import { useLeaveTypes } from '@/hooks/leave/useLeaveTypes';
import { useLeaveRequests } from '@/hooks/leave/useLeaveRequests';
import { LeaveFormData } from '@/types/leave';
import { Badge } from '@/components/ui/badge';

interface LeaveApplicationFormProps {
  onSuccess?: () => void;
}

export const LeaveApplicationForm: React.FC<LeaveApplicationFormProps> = ({ onSuccess }) => {
  const { leaveTypes, isLoading: isLoadingTypes } = useLeaveTypes();
  const { submitLeaveRequest, isSubmitting } = useLeaveRequests();

  const [formData, setFormData] = useState<Partial<LeaveFormData>>({
    leave_type_id: '',
    duration_type: 'full_day',
    remarks: '',
    manager_confirmed: false
  });
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [attachment, setAttachment] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedLeaveType = useMemo(() => {
    return leaveTypes.find(lt => lt.id === formData.leave_type_id);
  }, [leaveTypes, formData.leave_type_id]);

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
    return formData.duration_type === 'full_day' ? totalDays * 8 : totalDays * 4;
  }, [totalDays, formData.duration_type]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.leave_type_id) {
      newErrors.leave_type_id = 'Please select a leave type';
    }
    if (!startDate) {
      newErrors.start_date = 'Required';
    }
    if (!endDate) {
      newErrors.end_date = 'Required';
    }
    if (startDate && endDate && isBefore(endDate, startDate)) {
      newErrors.end_date = 'End date must be after start date';
    }
    if (startDate && isBefore(startDate, startOfDay(new Date()))) {
      newErrors.start_date = 'Cannot be in the past';
    }
    if (!formData.remarks?.trim()) {
      newErrors.remarks = 'Please provide a reason';
    }
    if (!formData.manager_confirmed) {
      newErrors.manager_confirmed = 'Please confirm';
    }
    if (requiresAttachment && !attachment) {
      newErrors.attachment = 'Medical certificate required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = await submitLeaveRequest({
      leave_type_id: formData.leave_type_id!,
      duration_type: formData.duration_type!,
      start_date: startDate!,
      end_date: endDate!,
      remarks: formData.remarks!,
      manager_confirmed: formData.manager_confirmed!,
      attachment: attachment || undefined
    });

    if (success) {
      setFormData({
        leave_type_id: '',
        duration_type: 'full_day',
        remarks: '',
        manager_confirmed: false
      });
      setStartDate(undefined);
      setEndDate(undefined);
      setAttachment(null);
      setErrors({});
      onSuccess?.();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Leave Type & Duration Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Leave Type
            </Label>
            <LeaveTypeSelector
              leaveTypes={leaveTypes}
              value={formData.leave_type_id || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, leave_type_id: value }))}
              disabled={isLoadingTypes || isSubmitting}
            />
            {errors.leave_type_id && (
              <p className="text-xs text-destructive">{errors.leave_type_id}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Duration
            </Label>
            <LeaveDurationSelector
              value={formData.duration_type || 'full_day'}
              onChange={(value) => setFormData(prev => ({ ...prev, duration_type: value }))}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Date Range - Compact Inline */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Period
          </Label>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex-1 justify-start text-left font-normal h-9",
                    !startDate && "text-muted-foreground",
                    errors.start_date && "border-destructive"
                  )}
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                  {startDate ? format(startDate, 'MMM d, yyyy') : 'From'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  disabled={(date) => isBefore(date, startOfDay(new Date()))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex-1 justify-start text-left font-normal h-9",
                    !endDate && "text-muted-foreground",
                    errors.end_date && "border-destructive"
                  )}
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                  {endDate ? format(endDate, 'MMM d, yyyy') : 'To'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50" align="end">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date) => 
                    isBefore(date, startOfDay(new Date())) || 
                    (startDate ? isBefore(date, startDate) : false)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Duration Badge */}
            {startDate && endDate && (
              <Badge variant="secondary" className="shrink-0 gap-1">
                <Clock className="h-3 w-3" />
                {totalDays}d · {totalHours}h
              </Badge>
            )}
          </div>
          {(errors.start_date || errors.end_date) && (
            <p className="text-xs text-destructive">
              {errors.start_date || errors.end_date}
            </p>
          )}
        </div>

        {/* Remarks - Compact */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Reason
          </Label>
          <Textarea
            placeholder="Brief reason for your leave request..."
            value={formData.remarks || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
            disabled={isSubmitting}
            rows={2}
            className="resize-none text-sm"
          />
          {errors.remarks && (
            <p className="text-xs text-destructive">{errors.remarks}</p>
          )}
        </div>

        {/* Attachment - Only when needed */}
        {(requiresAttachment || selectedLeaveType?.requires_attachment) && (
          <div className="space-y-1.5">
            <LeaveAttachmentUpload
              file={attachment}
              onFileChange={setAttachment}
              disabled={isSubmitting}
              required={requiresAttachment}
              label={
                selectedLeaveType?.code === 'sick' 
                  ? 'Medical Certificate' 
                  : 'Attachment'
              }
            />
            {errors.attachment && (
              <p className="text-xs text-destructive">{errors.attachment}</p>
            )}
          </div>
        )}

        {/* Manager Confirmation - Compact */}
        <div 
          className={cn(
            "flex items-start gap-3 p-3 rounded-lg border bg-muted/30 transition-colors",
            errors.manager_confirmed && "border-destructive bg-destructive/5"
          )}
        >
          <Checkbox
            id="manager_confirmed"
            checked={formData.manager_confirmed}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, manager_confirmed: checked as boolean }))
            }
            disabled={isSubmitting}
            className="mt-0.5"
          />
          <Label
            htmlFor="manager_confirmed"
            className="text-sm leading-snug cursor-pointer"
          >
            I've discussed this leave with my manager
          </Label>
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>Your request will be sent to your project manager for approval.</span>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || isLoadingTypes}
        >
          {isSubmitting ? (
            'Submitting...'
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Request
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
