import { 
  LayoutDashboard,
  Calendar,
  GanttChartSquare,
  FolderKanban,
  UserSquare2,
  Flag,
  HelpCircle,
  Layers,
  Activity,
  TrendingUp
} from "lucide-react"
import { Permission } from '@/hooks/usePermissions';

export interface NavigationItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  comingSoon?: boolean;
}

export interface NavigationSection {
  label: string;
  requiredPermission?: Permission;
  items: NavigationItem[];
}

export const getNavigationItems = (companySlug: string | null): NavigationSection[] => {
  const baseUrl = companySlug ? `/${companySlug}` : '';
  
  return [
    {
      label: "OVERVIEW",
      requiredPermission: 'view:overview',
      items: [
        {
          title: "Dashboard",
          url: `${baseUrl}/dashboard`,
          icon: LayoutDashboard,
        },
        {
          title: "Weekly Overview",
          url: `${baseUrl}/weekly-overview`,
          icon: Calendar,
        },
      ],
    },
    {
      label: "PLANNING",
      requiredPermission: 'view:scheduling',
      items: [
        {
          title: "Resource Scheduling",
          url: `${baseUrl}/resource-scheduling`,
          icon: GanttChartSquare,
        },
        {
          title: "Resource Planning",
          url: `${baseUrl}/resource-planning`,
          icon: TrendingUp,
        },
        {
          title: "Capacity Heatmap",
          url: `${baseUrl}/capacity-heatmap`,
          icon: Activity,
        },
      ],
    },
    {
      label: "PROJECTS",
      requiredPermission: 'view:projects',
      items: [
        {
          title: "All Projects",
          url: `${baseUrl}/projects`,
          icon: FolderKanban,
        },
        {
          title: "Pipeline",
          url: `${baseUrl}/pipeline`,
          icon: Layers,
        },
      ],
    },
    {
      label: "TEAM",
      requiredPermission: 'view:team',
      items: [
        {
          title: "Team Members",
          url: `${baseUrl}/team-members`,
          icon: UserSquare2,
        },
        {
          title: "Team Leave",
          url: `${baseUrl}/team-leave`,
          icon: Calendar,
        },
      ],
    },
    {
      label: "SETTINGS",
      requiredPermission: 'view:settings',
      items: [
        {
          title: "Company Settings",
          url: `${baseUrl}/office-settings`,
          icon: Flag,
        },
        {
          title: "Help Center",
          url: `${baseUrl}/help-center`,
          icon: HelpCircle,
        },
      ],
    },
  ];
};
