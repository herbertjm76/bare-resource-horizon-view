
import { 
  LayoutDashboard,
  Calendar,
  GanttChartSquare,
  FolderKanban,
  UserSquare2,
  Briefcase,
  Flag,
  HelpCircle,
  FileQuestion
} from "lucide-react"

export const navigationItems = [
  {
    label: "OVERVIEW",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Weekly Overview",
        url: "/weekly-overview",
        icon: Calendar,
      },
    ],
  },
  {
    label: "PROJECT MANAGEMENT",
    items: [
      {
        title: "Project Resourcing",
        url: "/project-resourcing",
        icon: GanttChartSquare,
      },
      {
        title: "All Projects",
        url: "/projects",
        icon: FolderKanban,
      },
    ],
  },
  {
    label: "RESOURCES",
    items: [
      {
        title: "Team Members",
        url: "/team-members",
        icon: UserSquare2,
      },
      {
        title: "Team Workload",
        url: "/team-workload",
        icon: Briefcase,
      },
      {
        title: "Team Annual Leave",
        url: "/team-annual-leave",
        icon: Calendar,
      },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      {
        title: "Office Settings",
        url: "/office-settings",
        icon: Flag,
      },
      {
        title: "FAQ",
        url: "/faq",
        icon: FileQuestion,
      },
      {
        title: "Help",
        url: "/help",
        icon: HelpCircle,
      },
    ],
  },
]
