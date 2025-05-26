
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
  colorScheme: 'red' | 'blue' | 'green';
  showLimit?: number;
  subtitle?: string;
}

export interface StaffMemberCardProps {
  member: StaffMember;
  colorScheme: 'red' | 'blue' | 'green';
  onClick?: () => void;
}
