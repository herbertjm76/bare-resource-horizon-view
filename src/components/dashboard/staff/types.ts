
export interface StaffMember {
  first_name: string;
  last_name: string;
  name: string;
  role: string;
  availability: number;
  avatar_url?: string;
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
}
