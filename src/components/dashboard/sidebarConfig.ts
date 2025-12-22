import { 
  LayoutDashboard,
  Calendar,
  GanttChartSquare,
  FolderKanban,
  UserSquare2,
  Flag,
  HelpCircle,
  Layers
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
      label: "RESOURCE SCHEDULING",
      requiredPermission: 'view:scheduling',
      items: [
        {
          title: "Schedule",
          url: `${baseUrl}/resource-scheduling`,
          icon: GanttChartSquare,
        },
      ],
    },
    {
      label: "PROJECTS",
      requiredPermission: 'view:projects',
      items: [
        {
          title: "Projects",
          url: `${baseUrl}/projects`,
          icon: FolderKanban,
        },
        {
          title: "Pipeline",
          url: `${baseUrl}/pipeline`,
          icon: Layers,
          comingSoon: true,
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
          title: "Team Workload",
          url: `${baseUrl}/team-workload`,
          icon: GanttChartSquare,
        },
        {
          title: "Annual Leave",
          url: `${baseUrl}/team-annual-leave`,
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
