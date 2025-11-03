
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
      {
        title: "Weekly Rundown",
        url: "/weekly-rundown",
        icon: Presentation,
      },
    ],
  },
  {
    label: "PROJECT LIFECYCLE",
    items: [
      {
        title: "Projects",
        url: "/projects",
        icon: FolderKanban,
      },
      {
        title: "Resources",
        url: "/project-resourcing",
        icon: GanttChartSquare,
      },
      // {
      //   title: "Financials",
      //   url: "/financial-control",
      //   icon: DollarSign,
      // },
    ],
  },
  // {
  //   label: "FINANCIALS",
  //   items: [
  //     {
  //       title: "Financial Overview",
  //       url: "/financial-overview",
  //       icon: Receipt,
  //     },
  //     {
  //       title: "Project Profit Dashboard",
  //       url: "/project-profit-dashboard",
  //       icon: TrendingUp,
  //     },
  //     {
  //       title: "Project Billing",
  //       url: "/project-billing",
  //       icon: Receipt,
  //     },
  //     {
  //       title: "Aging Invoices",
  //       url: "/aging-invoices",
  //       icon: Clock,
  //     },
  //   ],
  // },
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
        title: "Help Center",
        url: "/help-center",
        icon: HelpCircle,
      },
    ],
  },
]
