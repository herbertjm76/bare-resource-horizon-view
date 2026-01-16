import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, isBefore, startOfDay, isWeekend, addDays } from 'date-fns';
import { CalendarIcon, Send, Clock, Search, AlertTriangle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeaveAttachmentUpload } from './LeaveAttachmentUpload';
import { useLeaveTypes } from '@/hooks/leave/useLeaveTypes';
import { useLeaveRequests } from '@/hooks/leave/useLeaveRequests';
import { useProjectManagers } from '@/hooks/leave/useProjectManagers';
import { usePermissions } from '@/hooks/usePermissions';
import { useCompanyId } from '@/hooks/useCompanyId';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LeaveFormData } from '@/types/leave';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface LeaveApplicationFormProps {
  onSuccess?: () => void;
}

export const LeaveApplicationForm: React.FC<LeaveApplicationFormProps> = ({ onSuccess }) => {
  const { leaveTypes, isLoading: isLoadingTypes } = useLeaveTypes();
  const { submitLeaveRequest, isSubmitting } = useLeaveRequests();
  const { projectManagers, isLoading: isLoadingPMs } = useProjectManagers();
  const { isAdmin } = usePermissions();
  const { companyId } = useCompanyId();

  // Fetch team members for "on behalf of" selector (admin only)
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['teamMembers', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, avatar_url')
        .eq('company_id', companyId)
        .order('first_name');
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId && isAdmin
  });

  const [formData, setFormData] = useState<Partial<LeaveFormData>>({
    leave_type_id: '',
    duration_type: 'full_day',
    remarks: '',
    manager_confirmed: false,
    requested_approver_id: ''
  });
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [attachment, setAttachment] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [approverSearch, setApproverSearch] = useState('');
  const [onBehalfOfId, setOnBehalfOfId] = useState<string>('');
  const [memberSearch, setMemberSearch] = useState('');

  const selectedLeaveType = useMemo(() => {
    return leaveTypes.find(lt => lt.id === formData.leave_type_id);
  }, [leaveTypes, formData.leave_type_id]);

  // Calculate business days (excluding weekends)
  const calculateBusinessDays = (start: Date, end: Date): number => {
    let count = 0;
    const current = new Date(start);
    while (current <= end) {
      if (!isWeekend(current)) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count;
  };

  const totalDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return calculateBusinessDays(startDate, endDate);
  }, [startDate, endDate]);

  const requiresAttachment = useMemo(() => {
    if (!selectedLeaveType) return false;
    if (!selectedLeaveType.requires_attachment) return false;
    
    if (startDate && endDate && selectedLeaveType.code === 'sick') {
      return totalDays > 1;
    }
    
    return selectedLeaveType.requires_attachment;
  }, [selectedLeaveType, startDate, endDate, totalDays]);

  const totalHours = useMemo(() => {
    if (totalDays === 0) return 0;
    return formData.duration_type === 'full_day' ? totalDays * 8 : totalDays * 4;
  }, [totalDays, formData.duration_type]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.leave_type_id) {
      newErrors.leave_type_id = 'Please select a leave type';
    }
    if (!formData.requested_approver_id) {
      newErrors.requested_approver_id = 'Please select an approving manager';
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
    if (startDate && isBefore(startDate, startOfDay(new Date()))) {
      newErrors.start_date = 'Cannot select past dates';
    }
    if (!formData.remarks?.trim()) {
      newErrors.remarks = 'Please provide a reason';
    }
    if (!formData.manager_confirmed) {
      newErrors.manager_confirmed = 'Please confirm manager discussion';
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

    const success = await submitLeaveRequest(
      {
        leave_type_id: formData.leave_type_id!,
        duration_type: formData.duration_type!,
        start_date: startDate!,
        end_date: endDate!,
        remarks: formData.remarks!,
        manager_confirmed: formData.manager_confirmed!,
        requested_approver_id: formData.requested_approver_id || undefined,
        attachment: attachment || undefined
      },
      onBehalfOfId || undefined
    );

    if (success) {
      setFormData({
        leave_type_id: '',
        duration_type: 'full_day',
        remarks: '',
        manager_confirmed: false,
        requested_approver_id: ''
      });
      setStartDate(undefined);
      setEndDate(undefined);
      setAttachment(null);
      setErrors({});
      setOnBehalfOfId('');
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md mx-auto">
      {/* Admin: Apply on behalf of */}
      {isAdmin && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Apply on behalf of (optional)
          </Label>
          <Select
            value={onBehalfOfId || '_self'}
            onValueChange={(value) => {
              setOnBehalfOfId(value === '_self' ? '' : value);
              setMemberSearch('');
            }}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Myself (default)" />
            </SelectTrigger>
            <SelectContent>
              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search team member..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="pl-8"
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <SelectItem value="_self">Myself (default)</SelectItem>
              {teamMembers
                .filter((member) => {
                  const fullName = `${member.first_name || ''} ${member.last_name || ''}`.toLowerCase();
                  return fullName.includes(memberSearch.toLowerCase()) || 
                         member.email.toLowerCase().includes(memberSearch.toLowerCase());
                })
                .map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={member.avatar_url || undefined} />
                        <AvatarFallback className="text-[10px]">
                          {(member.first_name?.charAt(0) || '') + (member.last_name?.charAt(0) || '')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{member.first_name} {member.last_name}</span>
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {onBehalfOfId && (
            <p className="text-xs text-muted-foreground">
              This leave request will be submitted for the selected team member.
            </p>
          )}
        </div>
      )}

      {/* Leave Type */}
      <div className="space-y-2">
        <Label>Leave Type</Label>
        <Select
          value={formData.leave_type_id}
          onValueChange={(value) => setFormData(prev => ({ ...prev, leave_type_id: value }))}
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
        <Label>Approving Manager <span className="text-destructive">*</span></Label>
        <Select
          value={formData.requested_approver_id}
          onValueChange={(value) => {
            setFormData(prev => ({ ...prev, requested_approver_id: value }));
            setApproverSearch('');
          }}
          disabled={isLoadingPMs || isSubmitting}
        >
          <SelectTrigger className={cn(errors.requested_approver_id && "border-destructive")}>
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
            {projectManagers.filter((approver) => {
              const fullName = `${approver.first_name || ''} ${approver.last_name || ''}`.toLowerCase();
              return fullName.includes(approverSearch.toLowerCase());
            }).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">No results found</p>
            )}
          </SelectContent>
        </Select>
        {errors.requested_approver_id && <p className="text-sm text-destructive">{errors.requested_approver_id}</p>}
        {projectManagers.length === 0 && !isLoadingPMs && (
          <Alert variant="destructive" className="mt-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No Approvers Available</AlertTitle>
            <AlertDescription>
              There are no active managers who can approve leave requests. Please contact your administrator to add approvers with owner, admin, or project manager roles.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Date Pickers */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
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
                disabled={(date) => isBefore(date, startOfDay(new Date()))}
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
                disabled={(date) => 
                  isBefore(date, startOfDay(new Date())) || 
                  (startDate ? isBefore(date, startDate) : false)
                }
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
              variant={formData.duration_type === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFormData(prev => ({ ...prev, duration_type: option.value as any }))}
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
          value={formData.remarks}
          onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
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
        required={requiresAttachment}
        disabled={isSubmitting}
        label={`Attachment ${requiresAttachment ? '(Required)' : '(Optional)'}`}
      />
      {errors.attachment && <p className="text-sm text-destructive">{errors.attachment}</p>}

      {/* Manager Confirmation */}
      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
        <Checkbox
          id="manager_confirmed"
          checked={formData.manager_confirmed}
          onCheckedChange={(checked) => 
            setFormData(prev => ({ ...prev, manager_confirmed: checked as boolean }))
          }
          disabled={isSubmitting}
        />
        <div className="space-y-1">
          <Label htmlFor="manager_confirmed" className="cursor-pointer text-sm">
            I have discussed this with my manager
          </Label>
          {errors.manager_confirmed && (
            <p className="text-sm text-destructive">{errors.manager_confirmed}</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
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
  );
};
