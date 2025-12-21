import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, differenceInBusinessDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { CalendarIcon, Send, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeaveTypeSelector } from './LeaveTypeSelector';
import { LeaveDurationSelector } from './LeaveDurationSelector';
import { LeaveAttachmentUpload } from './LeaveAttachmentUpload';
import { useLeaveTypes } from '@/hooks/leave/useLeaveTypes';
import { useLeaveRequests } from '@/hooks/leave/useLeaveRequests';
import { LeaveFormData } from '@/types/leave';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    
    // For sick leave, require attachment if > 1 day
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
      newErrors.start_date = 'Please select a start date';
    }

    if (!endDate) {
      newErrors.end_date = 'Please select an end date';
    }

    if (startDate && endDate && isBefore(endDate, startDate)) {
      newErrors.end_date = 'End date must be after start date';
    }

    if (startDate && isBefore(startDate, startOfDay(new Date()))) {
      newErrors.start_date = 'Start date cannot be in the past';
    }

    if (!formData.remarks?.trim()) {
      newErrors.remarks = 'Please provide remarks or reason for leave';
    }

    if (!formData.manager_confirmed) {
      newErrors.manager_confirmed = 'Please confirm you have discussed with your manager';
    }

    if (requiresAttachment && !attachment) {
      newErrors.attachment = 'Medical certificate is required for sick leave > 1 day';
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
      // Reset form
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          Leave Application Form
        </CardTitle>
        <CardDescription>
          Submit your leave request for approval by your project manager
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Leave Type */}
          <div className="space-y-2">
            <Label>Type of Absence <span className="text-destructive">*</span></Label>
            <LeaveTypeSelector
              leaveTypes={leaveTypes}
              value={formData.leave_type_id || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, leave_type_id: value }))}
              disabled={isLoadingTypes || isSubmitting}
            />
            {errors.leave_type_id && (
              <p className="text-sm text-destructive">{errors.leave_type_id}</p>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label>Duration <span className="text-destructive">*</span></Label>
            <LeaveDurationSelector
              value={formData.duration_type || 'full_day'}
              onChange={(value) => setFormData(prev => ({ ...prev, duration_type: value }))}
              disabled={isSubmitting}
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Date <span className="text-destructive">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                    disabled={isSubmitting}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : 'Select start date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => isBefore(date, startOfDay(new Date()))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.start_date && (
                <p className="text-sm text-destructive">{errors.start_date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>To Date <span className="text-destructive">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                    disabled={isSubmitting}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : 'Select end date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
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
              {errors.end_date && (
                <p className="text-sm text-destructive">{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* Summary */}
          {startDate && endDate && (
            <div className="p-4 bg-accent/30 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Duration:</span>{' '}
                {totalDays} working day{totalDays !== 1 ? 's' : ''} ({totalHours} hours)
              </p>
            </div>
          )}

          {/* Remarks */}
          <div className="space-y-2">
            <Label>Remarks <span className="text-destructive">*</span></Label>
            <Textarea
              placeholder="Please provide details about your leave request..."
              value={formData.remarks || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
              disabled={isSubmitting}
              rows={4}
            />
            {selectedLeaveType?.code === 'sick' && (
              <p className="text-xs text-muted-foreground">
                For sick leave, briefly describe your symptoms or condition
              </p>
            )}
            {errors.remarks && (
              <p className="text-sm text-destructive">{errors.remarks}</p>
            )}
          </div>

          {/* Manager Confirmation */}
          <div className="space-y-2">
            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <Checkbox
                id="manager_confirmed"
                checked={formData.manager_confirmed}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, manager_confirmed: checked as boolean }))
                }
                disabled={isSubmitting}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="manager_confirmed"
                  className="text-sm font-medium cursor-pointer"
                >
                  I confirm that I have informed and received confirmation from my project leader / studio head regarding my leave application
                </Label>
              </div>
            </div>
            {errors.manager_confirmed && (
              <p className="text-sm text-destructive">{errors.manager_confirmed}</p>
            )}
          </div>

          {/* Attachment */}
          {(requiresAttachment || selectedLeaveType?.requires_attachment) && (
            <div>
              <LeaveAttachmentUpload
                file={attachment}
                onFileChange={setAttachment}
                disabled={isSubmitting}
                required={requiresAttachment}
                label={
                  selectedLeaveType?.code === 'sick' 
                    ? 'Medical Certificate (required for sick leave > 1 day)' 
                    : 'Supporting Document'
                }
              />
              {errors.attachment && (
                <p className="text-sm text-destructive mt-1">{errors.attachment}</p>
              )}
            </div>
          )}

          {/* Info Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your leave request will be sent to your project manager for approval. 
              You will be notified once it has been reviewed.
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
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
                Submit Leave Request
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
