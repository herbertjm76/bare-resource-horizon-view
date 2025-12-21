import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, differenceInBusinessDays, isBefore, startOfDay, addDays } from 'date-fns';
import { CalendarIcon, Send, Info, Clock, Check, ChevronRight, Sparkles, Calendar as CalendarIconSolid, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeaveAttachmentUpload } from './LeaveAttachmentUpload';
import { useLeaveTypes } from '@/hooks/leave/useLeaveTypes';
import { useLeaveRequests } from '@/hooks/leave/useLeaveRequests';
import { LeaveFormData } from '@/types/leave';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface LeaveApplicationFormProps {
  onSuccess?: () => void;
}

// Quick date presets
const datePresets = [
  { label: 'Today', getDates: () => ({ start: new Date(), end: new Date() }) },
  { label: 'Tomorrow', getDates: () => ({ start: addDays(new Date(), 1), end: addDays(new Date(), 1) }) },
  { label: 'This Week', getDates: () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const friday = addDays(today, 5 - dayOfWeek);
    return { start: today, end: friday };
  }},
  { label: 'Next Week', getDates: () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const nextMonday = addDays(today, 8 - dayOfWeek);
    const nextFriday = addDays(nextMonday, 4);
    return { start: nextMonday, end: nextFriday };
  }},
];

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
  const [activeStep, setActiveStep] = useState(0);

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

  // Calculate completion percentage for progress indicator
  const completionSteps = useMemo(() => {
    const steps = [
      { label: 'Type', completed: !!formData.leave_type_id },
      { label: 'Dates', completed: !!startDate && !!endDate },
      { label: 'Details', completed: !!formData.remarks?.trim() && !!formData.manager_confirmed },
    ];
    return steps;
  }, [formData, startDate, endDate]);

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
      setActiveStep(0);
      onSuccess?.();
    }
  };

  const handleLeaveTypeSelect = (typeId: string) => {
    setFormData(prev => ({ ...prev, leave_type_id: typeId }));
    setTimeout(() => setActiveStep(1), 200);
  };

  const handleDatePreset = (preset: typeof datePresets[0]) => {
    const { start, end } = preset.getDates();
    setStartDate(start);
    setEndDate(end);
  };

  const getLeaveTypeIcon = (code: string) => {
    const icons: Record<string, string> = {
      annual: '🏖️',
      sick: '🏥',
      personal: '👤',
      maternity: '👶',
      paternity: '👨‍👧',
      bereavement: '🕯️',
      unpaid: '📋'
    };
    return icons[code] || '📅';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {completionSteps.map((step, index) => (
            <React.Fragment key={step.label}>
              <button
                type="button"
                onClick={() => setActiveStep(index)}
                className={cn(
                  "relative z-10 flex flex-col items-center gap-2 transition-all duration-200",
                  activeStep === index && "scale-110"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                    step.completed
                      ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                      : activeStep === index
                      ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step.completed ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={cn(
                  "text-xs font-medium transition-colors",
                  activeStep === index ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.label}
                </span>
              </button>
              {index < completionSteps.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 mx-2 transition-colors duration-300",
                  completionSteps[index].completed ? "bg-emerald-500" : "bg-muted"
                )} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Leave Type Selection */}
        {activeStep === 0 && (
          <div className="animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">What type of leave?</h3>
              </div>
              
              {isLoadingTypes ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {leaveTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleLeaveTypeSelect(type.id)}
                      className={cn(
                        "relative p-4 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.02] group",
                        formData.leave_type_id === type.id
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      <div className="flex flex-col gap-2">
                        <span className="text-2xl">{getLeaveTypeIcon(type.code)}</span>
                        <div>
                          <p className="font-medium text-sm">{type.name}</p>
                          <div 
                            className="w-8 h-1 rounded-full mt-1.5 transition-all group-hover:w-12"
                            style={{ backgroundColor: type.color || '#3B82F6' }}
                          />
                        </div>
                      </div>
                      {formData.leave_type_id === type.id && (
                        <div className="absolute top-2 right-2">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
              {errors.leave_type_id && (
                <p className="text-sm text-destructive">{errors.leave_type_id}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Date Selection */}
        {activeStep === 1 && (
          <div className="animate-fade-in">
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIconSolid className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">When are you taking leave?</h3>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-2">
                {datePresets.map((preset) => (
                  <Button
                    key={preset.label}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDatePreset(preset)}
                    className="rounded-full"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>

              {/* Date Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12",
                          !startDate && "text-muted-foreground",
                          errors.start_date && "border-destructive"
                        )}
                        disabled={isSubmitting}
                      >
                        <CalendarIcon className="mr-3 h-4 w-4" />
                        {startDate ? format(startDate, 'EEE, MMM d, yyyy') : 'Select start date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50 pointer-events-auto" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => isBefore(date, startOfDay(new Date()))}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12",
                          !endDate && "text-muted-foreground",
                          errors.end_date && "border-destructive"
                        )}
                        disabled={isSubmitting}
                      >
                        <CalendarIcon className="mr-3 h-4 w-4" />
                        {endDate ? format(endDate, 'EEE, MMM d, yyyy') : 'Select end date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50 pointer-events-auto" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => 
                          isBefore(date, startOfDay(new Date())) || 
                          (startDate ? isBefore(date, startDate) : false)
                        }
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {(errors.start_date || errors.end_date) && (
                <p className="text-sm text-destructive">
                  {errors.start_date || errors.end_date}
                </p>
              )}

              {/* Duration Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Duration per day</Label>
                <div className="flex gap-2">
                  {[
                    { value: 'full_day', label: 'Full Day', hours: 8 },
                    { value: 'half_day_am', label: 'Half Day (AM)', hours: 4 },
                    { value: 'half_day_pm', label: 'Half Day (PM)', hours: 4 },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={formData.duration_type === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, duration_type: option.value as any }))}
                      className="flex-1"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Summary Card */}
              {startDate && endDate && (
                <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Duration</p>
                        <p className="text-lg font-semibold">
                          {totalDays} {totalDays === 1 ? 'day' : 'days'} · {totalHours} hours
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {selectedLeaveType?.name || 'Leave'}
                    </Badge>
                  </div>
                </Card>
              )}

              <Button
                type="button"
                onClick={() => setActiveStep(2)}
                disabled={!startDate || !endDate}
                className="w-full"
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Details & Submit */}
        {activeStep === 2 && (
          <div className="animate-fade-in">
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Final Details</h3>
              </div>

              {/* Summary */}
              <Card className="p-4 bg-muted/50">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{selectedLeaveType ? getLeaveTypeIcon(selectedLeaveType.code) : '📅'}</span>
                  <div className="flex-1">
                    <p className="font-medium">{selectedLeaveType?.name || 'Leave'}</p>
                    <p className="text-sm text-muted-foreground">
                      {startDate && format(startDate, 'MMM d')} 
                      {endDate && startDate && endDate.getTime() !== startDate.getTime() && ` - ${format(endDate, 'MMM d')}`}
                      {startDate && `, ${format(startDate, 'yyyy')}`}
                      {' · '}{totalDays} {totalDays === 1 ? 'day' : 'days'}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveStep(0)}
                  >
                    Edit
                  </Button>
                </div>
              </Card>

              {/* Remarks */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Reason for Leave</Label>
                <Textarea
                  placeholder="Please provide a brief reason for your leave request..."
                  value={formData.remarks || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                  disabled={isSubmitting}
                  rows={3}
                  className={cn(
                    "resize-none",
                    errors.remarks && "border-destructive"
                  )}
                />
                {errors.remarks && (
                  <p className="text-sm text-destructive">{errors.remarks}</p>
                )}
              </div>

              {/* Attachment */}
              {(requiresAttachment || selectedLeaveType?.requires_attachment) && (
                <div className="space-y-2">
                  <LeaveAttachmentUpload
                    file={attachment}
                    onFileChange={setAttachment}
                    disabled={isSubmitting}
                    required={requiresAttachment}
                    label={
                      selectedLeaveType?.code === 'sick' 
                        ? 'Medical Certificate' 
                        : 'Supporting Document'
                    }
                  />
                  {errors.attachment && (
                    <p className="text-sm text-destructive">{errors.attachment}</p>
                  )}
                </div>
              )}

              {/* Manager Confirmation */}
              <div 
                className={cn(
                  "flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer",
                  formData.manager_confirmed 
                    ? "border-emerald-500 bg-emerald-500/5" 
                    : errors.manager_confirmed 
                    ? "border-destructive bg-destructive/5"
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => setFormData(prev => ({ ...prev, manager_confirmed: !prev.manager_confirmed }))}
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
                <div className="flex-1">
                  <Label
                    htmlFor="manager_confirmed"
                    className="text-sm font-medium cursor-pointer"
                  >
                    I've discussed this leave with my manager
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Confirm that you have informed your manager about this leave request
                  </p>
                </div>
              </div>

              {/* Info Note */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Your request will be sent to your project manager for approval. You'll be notified once it's reviewed.</span>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base"
                disabled={isSubmitting || isLoadingTypes}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Leave Request
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
