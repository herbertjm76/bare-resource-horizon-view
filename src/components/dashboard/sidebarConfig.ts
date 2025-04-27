import { 
  LayoutDashboard,
  CalendarDays,
  BarChart2,  // Using bar-chart-2 for overview as suggested
  Users,
  LayoutList,  // Using layout-list for overview
  ScrollText,
  FolderKanban,
  GanttChartSquare,
  UserSquare2,
  Flag
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
        title: "Calendar",
        url: "/calendar",
        icon: CalendarDays,
      },
    ],
  },
  {
    label: "RESOURCE PLANNING",
    items: [
      {
        title: "Weekly Overview",  // Changed from "Weekly Planning"
        url: "/weekly-planning",
        icon: LayoutList,  // Changed icon to layout-list
      },
      {
        title: "Resource Allocation",
        url: "/resource-allocation",
        icon: Users,
      },
      {
        title: "Overview",  // Changed from "Capacity Planning"
        url: "/capacity-planning",
        icon: BarChart2,  // Changed icon to bar-chart-2
      },
    ],
  },
  {
    label: "RESOURCES",
    items: [
      {
        title: "Team Members",
        url: "/team-members",  // Updated URL to match the new route
        icon: UserSquare2,
      },
      {
        title: "Skills & Roles",
        url: "/skills-roles",
        icon: ScrollText,
      },
    ],
  },
  {
    label: "PROJECTS",
    items: [
      {
        title: "All Projects",
        url: "/projects",
        icon: FolderKanban,
      },
      {
        title: "Project Resourcing",
        url: "/project-resourcing",
        icon: GanttChartSquare,
      },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      {
        title: "Office Settings",
        url: "/office-settings",
        icon: Flag,
      },
    ],
  },
]
