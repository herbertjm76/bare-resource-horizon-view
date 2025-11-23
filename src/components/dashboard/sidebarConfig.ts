import { 
  LayoutDashboard,
  Calendar,
  GanttChartSquare,
  FolderKanban,
  UserSquare2,
  Flag,
  HelpCircle,
  TrendingUp,
  Layers
} from "lucide-react"

export const getNavigationItems = (companySlug: string | null) => {
  const baseUrl = companySlug ? `/${companySlug}` : '';
  
  return [
    {
      label: "OVERVIEW",
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
      items: [
        {
          title: "Schedule",
          url: `${baseUrl}/resource-scheduling`,
          icon: GanttChartSquare,
        },
        {
          title: "Timeline",
          url: `${baseUrl}/timeline`,
          icon: GanttChartSquare,
          comingSoon: true,
        },
        {
          title: "Capacity Planning",
          url: `${baseUrl}/capacity-planning`,
          icon: TrendingUp,
          comingSoon: true,
        },
      ],
    },
    {
      label: "PROJECTS",
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
      items: [
        {
          title: "Team Members",
          url: `${baseUrl}/team-members`,
          icon: UserSquare2,
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
