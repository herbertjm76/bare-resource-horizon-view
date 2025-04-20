
import { 
  LayoutDashboard,
  CalendarDays,
  CalendarRange,
  Users,
  Clock,
  ScrollText,
  Settings,
  FolderKanban,
  GanttChartSquare,
  UserSquare2,
} from "lucide-react"
import { Link } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const navigationItems = [
  {
    label: "Overview",
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
    label: "Resource Planning",
    items: [
      {
        title: "Weekly Planning",
        url: "/weekly-planning",
        icon: CalendarRange,
      },
      {
        title: "Resource Allocation",
        url: "/resource-allocation",
        icon: Users,
      },
      {
        title: "Capacity Planning",
        url: "/capacity-planning",
        icon: Clock,
      },
    ],
  },
  {
    label: "Resources",
    items: [
      {
        title: "Team Members",
        url: "/team-members",
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
    label: "Projects",
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
    label: "System",
    items: [
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
]

export function DashboardSidebar() {
  return (
    <Sidebar 
      className="backdrop-blur-lg 
        bg-[hsl(210,15%,20%)] 
        bg-opacity-80
        border-r 
        border-[hsl(210,10%,30%)]"
    >
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-4 py-2">
            <p className="text-lg font-semibold text-[hsl(210,10%,90%)]">Bare Resource</p>
            <SidebarTrigger className="md:hidden text-[hsl(210,10%,90%)] hover:bg-[hsl(210,10%,30%)]" />
          </div>
          {navigationItems.map((section) => (
            <div key={section.label} className="mb-6">
              <SidebarGroupLabel className="text-[hsl(210,10%,70%)]">{section.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className="text-[hsl(210,10%,80%)] hover:text-[hsl(210,10%,90%)] hover:bg-[hsl(210,10%,30%)] rounded-md"
                      >
                        <Link to={item.url} className="flex items-center gap-2 w-full p-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </div>
          ))}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
