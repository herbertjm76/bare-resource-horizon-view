import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Send, Download, Mail, MapPin, Users, Sparkles, CalendarCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface LeavePreview {
  id: string;
  memberName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  isNew: boolean;
  color: string;
}

interface HolidayPreview {
  id: string;
  name: string;
  date: string;
  endDate: string | null;
  location: string | null;
}

interface Location {
  id: string;
  city: string;
  code: string;
}

export const SendLeaveCalendarDialog: React.FC = () => {
  const { company } = useCompany();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Form state
  const [recipientEmail, setRecipientEmail] = useState('');
  const [sendMode, setSendMode] = useState<'new_only' | 'all'>('new_only');
  const [deliveryMode, setDeliveryMode] = useState<'bulk' | 'individual'>('bulk');
  const [includeLeaves, setIncludeLeaves] = useState(true);
  const [includeHolidays, setIncludeHolidays] = useState(true);
  const [locationFilter, setLocationFilter] = useState<string>('all');

  // Data state
  const [locations, setLocations] = useState<Location[]>([]);
  const [leavePreview, setLeavePreview] = useState<LeavePreview[]>([]);
  const [holidayPreview, setHolidayPreview] = useState<HolidayPreview[]>([]);

  // Load user email and locations
  useEffect(() => {
    const loadInitialData = async () => {
      if (!open || !company?.id) return;

      // Get current user email
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user?.email) {
        setRecipientEmail(userData.user.email);
      }

      // Load locations
      const { data: locData } = await supabase
        .from('office_locations')
        .select('id, city, code')
        .eq('company_id', company.id);

      if (locData) {
        setLocations(locData);
      }
    };

    loadInitialData();
  }, [open, company?.id]);

  // Load preview data
  useEffect(() => {
    const loadPreview = async () => {
      if (!open || !company?.id) return;

      setIsLoading(true);

      try {
        // Load leave requests
        if (includeLeaves) {
          let query = supabase
            .from('leave_requests')
            .select(`
              id,
              start_date,
              end_date,
              sent_to_calendar_at,
              member:profiles!leave_requests_member_id_fkey(
                first_name,
                last_name
              ),
              leave_type:leave_types(
                name,
                color
              )
            `)
            .eq('company_id', company.id)
            .eq('status', 'approved')
            .order('start_date', { ascending: true });

          if (sendMode === 'new_only') {
            query = query.is('sent_to_calendar_at', null);
          }

          const { data } = await query;

          const previews: LeavePreview[] = (data || [])
            .filter((lr: any) => lr.member && lr.leave_type)
            .map((lr: any) => ({
              id: lr.id,
              memberName: `${lr.member.first_name || ''} ${lr.member.last_name || ''}`.trim() || 'Unknown',
              leaveType: lr.leave_type.name,
              startDate: lr.start_date,
              endDate: lr.end_date,
              isNew: !lr.sent_to_calendar_at,
              color: lr.leave_type.color,
            }));

          setLeavePreview(previews);
        } else {
          setLeavePreview([]);
        }

        // Load holidays
        if (includeHolidays) {
          let query = supabase
            .from('office_holidays')
            .select(`
              id,
              name,
              date,
              end_date,
              location_id,
              office_location:office_locations(code)
            `)
            .eq('company_id', company.id)
            .order('date', { ascending: true });

          if (locationFilter && locationFilter !== 'all') {
            query = query.or(`location_id.eq.${locationFilter},location_id.is.null`);
          }

          const { data } = await query;

          const previews: HolidayPreview[] = (data || []).map((h: any) => ({
            id: h.id,
            name: h.name,
            date: h.date,
            endDate: h.end_date,
            location: h.office_location?.code || null,
          }));

          setHolidayPreview(previews);
        } else {
          setHolidayPreview([]);
        }
      } catch (error) {
        console.error('Error loading preview:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreview();
  }, [open, company?.id, sendMode, includeLeaves, includeHolidays, locationFilter]);

  const handleSend = async (downloadOnly: boolean) => {
    if (!recipientEmail && !downloadOnly) {
      toast.error('Please enter a recipient email');
      return;
    }

    if (!includeLeaves && !includeHolidays) {
      toast.error('Please include at least leaves or holidays');
      return;
    }

    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-leave-calendar', {
        body: {
          recipientEmail,
          sendMode,
          deliveryMode,
          includeLeaves,
          includeHolidays,
          locationFilter: locationFilter !== 'all' ? locationFilter : undefined,
          downloadOnly,
        },
      });

      if (error) throw error;

      if (downloadOnly && data.icsContent) {
        // Download ICS file
        const blob = new Blob([data.icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${company?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'Company'}_leave_calendar.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(`Downloaded calendar with ${data.leaveCount} leaves and ${data.holidayCount} holidays`);
      } else {
        toast.success(data.message || 'Calendar sent successfully!');
        setOpen(false);
      }
    } catch (error: any) {
      console.error('Error sending calendar:', error);
      toast.error(error.message || 'Failed to send calendar');
    } finally {
      setIsSending(false);
    }
  };

  const newLeaveCount = leavePreview.filter(l => l.isNew).length;
  const previouslySentCount = leavePreview.filter(l => !l.isNew).length;
  const totalEvents = leavePreview.length + holidayPreview.length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          Send Calendar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-primary" />
            Send Leave Calendar
          </DialogTitle>
          <DialogDescription>
            Send calendar invites with approved leaves and holidays.
            Events will auto-add to Outlook, Google Calendar, or Apple Calendar.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Include</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Approved Leaves</span>
                  </div>
                  <Switch
                    checked={includeLeaves}
                    onCheckedChange={setIncludeLeaves}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Office Holidays</span>
                  </div>
                  <Switch
                    checked={includeHolidays}
                    onCheckedChange={setIncludeHolidays}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Location Filter</Label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.city} ({loc.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {includeLeaves && (
                <div className="pt-2">
                  <Label className="text-sm font-medium mb-2 block">Send Mode</Label>
                  <RadioGroup value={sendMode} onValueChange={(v) => setSendMode(v as 'new_only' | 'all')}>
                    <div className="flex items-center space-x-2 rounded-lg border p-3">
                      <RadioGroupItem value="new_only" id="new_only" />
                      <Label htmlFor="new_only" className="flex-1 cursor-pointer text-sm">
                        New Only
                        <span className="text-muted-foreground ml-1">({newLeaveCount} new)</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-3 mt-2">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all" className="flex-1 cursor-pointer text-sm">
                        All Approved
                        <span className="text-muted-foreground ml-1">(updates existing)</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              <div className="pt-2">
                <Label className="text-sm font-medium mb-2 block">Delivery Mode</Label>
                <RadioGroup value={deliveryMode} onValueChange={(v) => setDeliveryMode(v as 'bulk' | 'individual')}>
                  <div className="flex items-center space-x-2 rounded-lg border p-3">
                    <RadioGroupItem value="bulk" id="bulk" />
                    <Label htmlFor="bulk" className="flex-1 cursor-pointer text-sm">
                      Single Calendar
                      <span className="text-muted-foreground ml-1 text-xs block">All events in one invite</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-3 mt-2">
                    <RadioGroupItem value="individual" id="individual" />
                    <Label htmlFor="individual" className="flex-1 cursor-pointer text-sm">
                      Individual Invites
                      <span className="text-muted-foreground ml-1 text-xs block">Separate email per event</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Preview ({totalEvents} events)</Label>
              {sendMode === 'all' && previouslySentCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  {previouslySentCount} previously sent will be updated
                </span>
              )}
            </div>
            <ScrollArea className="h-[150px] rounded-lg border p-3">
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : totalEvents === 0 ? (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                  No events to include. Adjust filters above.
                </div>
              ) : (
                <div className="space-y-2">
                  {leavePreview.map((leave) => (
                    <div
                      key={leave.id}
                      className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: leave.color }}
                        />
                        <span className="truncate">{leave.memberName}</span>
                        <span className="text-muted-foreground">-</span>
                        <span className="text-muted-foreground truncate">{leave.leaveType}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(leave.startDate), 'MMM d')}
                          {leave.startDate !== leave.endDate && ` - ${format(new Date(leave.endDate), 'MMM d')}`}
                        </span>
                        {leave.isNew && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {holidayPreview.map((holiday) => (
                    <div
                      key={holiday.id}
                      className="flex items-center justify-between rounded-md border border-dashed px-3 py-2 text-sm bg-muted/30"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base">🎉</span>
                        <span className="truncate">{holiday.name}</span>
                        {holiday.location && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {holiday.location}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {format(new Date(holiday.date), 'MMM d')}
                        {holiday.endDate && holiday.endDate !== holiday.date && ` - ${format(new Date(holiday.endDate), 'MMM d')}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Email input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Recipient Email
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => handleSend(true)}
            disabled={isSending || totalEvents === 0}
            className="flex-1 gap-2"
          >
            <Download className="h-4 w-4" />
            Download ICS
          </Button>
          <Button
            onClick={() => handleSend(false)}
            disabled={isSending || !recipientEmail || totalEvents === 0}
            className="flex-1 gap-2"
          >
            <Send className="h-4 w-4" />
            {isSending ? 'Sending...' : 'Send to Email'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
