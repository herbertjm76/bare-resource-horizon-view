
import { LucideIcon } from 'lucide-react';

export interface InsightData {
  title: string;
  description: string;
  type: 'critical' | 'warning' | 'success' | 'info';
  icon: LucideIcon;
  priority: number;
  category: string;
}
