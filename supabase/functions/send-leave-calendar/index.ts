import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";
import { encode as base64Encode } from "https://deno.land/std@0.190.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendCalendarRequest {
  recipientEmail: string;
  sendMode: 'new_only' | 'all';
  includeLeaves: boolean;
  includeHolidays: boolean;
  locationFilter?: string;
  downloadOnly?: boolean;
}

interface LeaveRequest {
  id: string;
  calendar_uid: string;
  start_date: string;
  end_date: string;
  duration_type: string;
  total_hours: number;
  remarks: string;
  sent_to_calendar_at: string | null;
  member: {
    first_name: string | null;
    last_name: string | null;
    email: string;
    location: string | null;
  };
  leave_type: {
    name: string;
    color: string;
  };
}

interface Holiday {
  id: string;
  name: string;
  date: string;
  end_date: string | null;
  location_id: string | null;
  office_location?: {
    city: string;
    code: string;
  } | null;
}

// Generate ICS date format (YYYYMMDD for all-day events)
function formatICSDate(dateStr: string): string {
  return dateStr.replace(/-/g, '');
}

// Generate ICS datetime format for half-day events
function formatICSDateTime(dateStr: string, time: string): string {
  const date = dateStr.replace(/-/g, '');
  return `${date}T${time}`;
}

// Add one day for ICS all-day event end dates (exclusive)
function addOneDay(dateStr: string): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
}

// Generate a deterministic UID for holidays
function generateHolidayUID(holiday: Holiday, companyId: string): string {
  const baseStr = `${companyId}-holiday-${holiday.id}`;
  return `${baseStr.replace(/[^a-zA-Z0-9-]/g, '')}@staffin.app`;
}

// Generate UID for leave requests
function generateLeaveUID(leaveRequest: LeaveRequest): string {
  return `${leaveRequest.calendar_uid}@staffin.app`;
}

function generateICSFile(
  leaveRequests: LeaveRequest[],
  holidays: Holiday[],
  companyId: string,
  companyName: string
): string {
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//StaffIn//Leave Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${companyName} Leave Calendar
X-WR-TIMEZONE:UTC
`;

  // Add leave request events
  for (const leave of leaveRequests) {
    const memberName = `${leave.member.first_name || ''} ${leave.member.last_name || ''}`.trim() || leave.member.email;
    const uid = generateLeaveUID(leave);
    const summary = `${memberName} - ${leave.leave_type.name}`;
    const description = leave.remarks ? `Remarks: ${leave.remarks}` : '';
    
    if (leave.duration_type === 'full_day') {
      // All-day event(s)
      const startDate = formatICSDate(leave.start_date);
      const endDate = formatICSDate(addOneDay(leave.end_date));
      
      icsContent += `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${now}
DTSTART;VALUE=DATE:${startDate}
DTEND;VALUE=DATE:${endDate}
SUMMARY:${summary}
DESCRIPTION:${description}
STATUS:CONFIRMED
TRANSP:OPAQUE
END:VEVENT
`;
    } else {
      // Half-day event
      const date = formatICSDate(leave.start_date);
      const startTime = leave.duration_type === 'half_day_am' ? '080000' : '130000';
      const endTime = leave.duration_type === 'half_day_am' ? '120000' : '170000';
      
      icsContent += `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${now}
DTSTART:${date}T${startTime}
DTEND:${date}T${endTime}
SUMMARY:${summary} (${leave.duration_type === 'half_day_am' ? 'AM' : 'PM'})
DESCRIPTION:${description}
STATUS:CONFIRMED
TRANSP:OPAQUE
END:VEVENT
`;
    }
  }

  // Add holiday events
  for (const holiday of holidays) {
    const uid = generateHolidayUID(holiday, companyId);
    const locationSuffix = holiday.office_location ? ` (${holiday.office_location.code})` : '';
    const summary = `🎉 ${holiday.name}${locationSuffix}`;
    
    const startDate = formatICSDate(holiday.date);
    const endDateStr = holiday.end_date || holiday.date;
    const endDate = formatICSDate(addOneDay(endDateStr));
    
    icsContent += `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${now}
DTSTART;VALUE=DATE:${startDate}
DTEND;VALUE=DATE:${endDate}
SUMMARY:${summary}
DESCRIPTION:Office Holiday
STATUS:CONFIRMED
TRANSP:TRANSPARENT
END:VEVENT
`;
  }

  icsContent += 'END:VCALENDAR';
  return icsContent;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    // Get authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Create Supabase client with user's token
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Create admin client for updates
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get user's company
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("Failed to get user");
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', userData.user.id)
      .single();

    if (profileError || !profile?.company_id) {
      throw new Error("Failed to get user profile");
    }

    const companyId = profile.company_id;

    // Get company name
    const { data: company } = await supabase
      .from('companies')
      .select('name')
      .eq('id', companyId)
      .single();

    const companyName = company?.name || 'Company';

    const body: SendCalendarRequest = await req.json();
    const { recipientEmail, sendMode, includeLeaves, includeHolidays, locationFilter, downloadOnly } = body;

    console.log('Processing calendar request:', { sendMode, includeLeaves, includeHolidays, locationFilter, downloadOnly });

    let leaveRequests: LeaveRequest[] = [];
    let holidays: Holiday[] = [];

    // Fetch approved leave requests
    if (includeLeaves) {
      let query = supabase
        .from('leave_requests')
        .select(`
          id,
          calendar_uid,
          start_date,
          end_date,
          duration_type,
          total_hours,
          remarks,
          sent_to_calendar_at,
          member:profiles!leave_requests_member_id_fkey(
            first_name,
            last_name,
            email,
            location
          ),
          leave_type:leave_types(
            name,
            color
          )
        `)
        .eq('company_id', companyId)
        .eq('status', 'approved');

      // Filter by send mode
      if (sendMode === 'new_only') {
        query = query.is('sent_to_calendar_at', null);
      }

      // Filter by location if specified
      if (locationFilter) {
        query = query.eq('member.location', locationFilter);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching leave requests:', error);
        throw new Error('Failed to fetch leave requests');
      }

      leaveRequests = (data || []).filter(lr => lr.member && lr.leave_type) as LeaveRequest[];
      console.log(`Found ${leaveRequests.length} leave requests`);
    }

    // Fetch office holidays
    if (includeHolidays) {
      let query = supabase
        .from('office_holidays')
        .select(`
          id,
          name,
          date,
          end_date,
          location_id,
          office_location:office_locations(
            city,
            code
          )
        `)
        .eq('company_id', companyId);

      // Filter by location if specified
      if (locationFilter) {
        query = query.or(`location_id.eq.${locationFilter},location_id.is.null`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching holidays:', error);
        throw new Error('Failed to fetch holidays');
      }

      holidays = (data || []) as Holiday[];
      console.log(`Found ${holidays.length} holidays`);
    }

    // Generate ICS file
    const icsContent = generateICSFile(leaveRequests, holidays, companyId, companyName);

    // If download only, return the ICS content
    if (downloadOnly) {
      return new Response(JSON.stringify({ 
        success: true,
        icsContent,
        leaveCount: leaveRequests.length,
        holidayCount: holidays.length
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send email with ICS attachment
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const resend = new Resend(resendApiKey);

    const leaveCount = leaveRequests.length;
    const holidayCount = holidays.length;
    const totalEvents = leaveCount + holidayCount;

    // Create email body
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">📅 ${companyName} Leave Calendar</h2>
        <p>Attached is the calendar file containing:</p>
        <ul>
          ${includeLeaves ? `<li><strong>${leaveCount}</strong> approved leave request${leaveCount !== 1 ? 's' : ''}</li>` : ''}
          ${includeHolidays ? `<li><strong>${holidayCount}</strong> office holiday${holidayCount !== 1 ? 's' : ''}</li>` : ''}
        </ul>
        <p><strong>Total events:</strong> ${totalEvents}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 14px;">
          To add these events to your calendar, download the attached .ics file and open it with your calendar application (Outlook, Google Calendar, Apple Calendar, etc.).
        </p>
        <p style="color: #666; font-size: 14px;">
          If you've imported previous calendar files, the events will be updated (not duplicated) thanks to unique event IDs.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">Sent from StaffIn</p>
      </div>
    `;

    const { error: emailError } = await resend.emails.send({
      from: "StaffIn <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: `${companyName} Leave Calendar - ${totalEvents} Event${totalEvents !== 1 ? 's' : ''}`,
      html: emailHtml,
      attachments: [
        {
          filename: `${companyName.replace(/[^a-zA-Z0-9]/g, '_')}_leave_calendar.ics`,
          content: base64Encode(new TextEncoder().encode(icsContent)),
        },
      ],
    });

    if (emailError) {
      console.error('Error sending email:', emailError);
      throw new Error(`Failed to send email: ${emailError.message}`);
    }

    console.log('Email sent successfully to:', recipientEmail);

    // Update sent_to_calendar_at for all included leave requests
    if (leaveRequests.length > 0) {
      const leaveIds = leaveRequests.map(lr => lr.id);
      const { error: updateError } = await supabaseAdmin
        .from('leave_requests')
        .update({ sent_to_calendar_at: new Date().toISOString() })
        .in('id', leaveIds);

      if (updateError) {
        console.error('Error updating sent_to_calendar_at:', updateError);
        // Don't throw - email was sent successfully
      } else {
        console.log(`Updated sent_to_calendar_at for ${leaveIds.length} leave requests`);
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: `Calendar sent to ${recipientEmail}`,
      leaveCount,
      holidayCount,
      totalEvents
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error in send-leave-calendar:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
