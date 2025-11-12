import { 
  LayoutDashboard,
  Calendar,
  GanttChartSquare,
  FolderKanban,
  UserSquare2,
  Briefcase,
  Flag,
  HelpCircle,
  Presentation
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
        {
          title: "Weekly Rundown",
          url: `${baseUrl}/weekly-rundown`,
          icon: Presentation,
        },
      ],
    },
    {
      label: "PROJECT LIFECYCLE",
      items: [
        {
          title: "Projects",
          url: `${baseUrl}/projects`,
          icon: FolderKanban,
        },
        {
          title: "Resources",
          url: `${baseUrl}/project-resourcing`,
          icon: GanttChartSquare,
        },
      ],
    },
    {
      label: "RESOURCES",
      items: [
        {
          title: "Team Members",
          url: `${baseUrl}/team-members`,
          icon: UserSquare2,
        },
        {
          title: "Team Workload",
          url: `${baseUrl}/team-workload`,
          icon: Briefcase,
        },
        {
          title: "Team Annual Leave",
          url: `${baseUrl}/team-annual-leave`,
          icon: Calendar,
        },
      ],
    },
    {
      label: "SETTINGS",
      items: [
        {
          title: "Office Settings",
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
