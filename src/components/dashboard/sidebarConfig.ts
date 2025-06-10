
import { 
  LayoutDashboard,
  Calendar,
  GanttChartSquare,
  FolderKanban,
  UserSquare2,
  Briefcase,
  Flag,
  HelpCircle,
  FileQuestion,
  User,
  BookOpen,
  MessageCircle,
  DollarSign,
  TrendingUp,
  Receipt,
  Clock
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
  // {
  //   label: "FINANCIALS",
  //   items: [
  //     {
  //       title: "Financial Overview",
  //       url: "/financial-overview",
  //       icon: DollarSign,
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
        title: "My Profile",
        url: "/profile",
        icon: User,
      },
      {
        title: "Office Settings",
        url: "/office-settings",
        icon: Flag,
      },
    ],
  },
  {
    label: "SUPPORT",
    items: [
      {
        title: "Documentation",
        url: "/documentation",
        icon: BookOpen,
      },
      {
        title: "FAQ",
        url: "/faq",
        icon: FileQuestion,
      },
      {
        title: "Contact Support",
        url: "/contact-support",
        icon: MessageCircle,
      },
      {
        title: "Help",
        url: "/help",
        icon: HelpCircle,
      },
    ],
  },
]
