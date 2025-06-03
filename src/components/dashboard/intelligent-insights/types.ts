
export interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  weekly_capacity?: number;
  job_title?: string;
}

export interface InsightItem {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionLabel?: string;
  onAction?: () => void;
  metric?: string;
  icon: {
    name: string;
    className: string;
  } | React.ReactNode;
}
