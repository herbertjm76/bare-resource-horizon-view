
import { 
  LayoutDashboard,
  Calendar,
  GanttChartSquare,
  FolderKanban,
  UserSquare2,
  Briefcase,
  Flag,
  HelpCircle,
  PieChart
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
        title: "Week Resourcing",
        url: "/week-resourcing",
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
        title: "Resource Planning",
        url: "/resource-planning",
        icon: PieChart,
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
        title: "Help",
        url: "/help",
        icon: HelpCircle,
      },
    ],
  },
]
