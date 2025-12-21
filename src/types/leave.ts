export interface LeaveType {
  id: string;
  company_id: string;
  name: string;
  code: string;
  requires_attachment: boolean;
  color: string;
  icon: string | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface LeaveRequest {
  id: string;
  company_id: string;
  member_id: string;
  leave_type_id: string;
  duration_type: 'full_day' | 'half_day_am' | 'half_day_pm';
  start_date: string;
  end_date: string;
  total_hours: number;
  remarks: string;
  manager_confirmed: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  attachment_url: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  leave_type?: LeaveType;
  member?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    email: string;
  };
  approver?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
  };
}

export interface LeaveFormData {
  leave_type_id: string;
  duration_type: 'full_day' | 'half_day_am' | 'half_day_pm';
  start_date: Date;
  end_date: Date;
  remarks: string;
  manager_confirmed: boolean;
  requested_approver_id?: string;
  attachment?: File;
}

export interface LeaveDigestSettings {
  id: string;
  company_id: string;
  digest_email: string;
  frequency: 'weekly' | 'monthly';
  send_day: number;
  is_enabled: boolean;
  last_sent_at: string | null;
  created_at: string;
  updated_at: string;
}
