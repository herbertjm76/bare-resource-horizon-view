
export interface StaffMember {
  id?: string;
  first_name: string;
  last_name: string;
  name: string;
  role: string;
  availability: number;
  avatar_url?: string;
  email?: string;
  department?: string;
  location?: string;
  weekly_capacity?: number;
  isPending?: boolean;
}

export interface StaffStatusCardProps {
  staffData: StaffMember[];
}

export interface StaffSectionProps {
  title: string;
  icon: React.ReactNode;
  members: StaffMember[];
  colorScheme: 'red' | 'orange' | 'blue' | 'green';
  showLimit?: number;
  subtitle?: string;
  memberUtilizations?: Array<{
    memberId: string;
    memberName: string;
    utilizationRate: number;
  }>;
}

export interface StaffMemberCardProps {
  member: StaffMember;
  colorScheme: 'red' | 'orange' | 'blue' | 'green';
  onClick?: () => void;
}
