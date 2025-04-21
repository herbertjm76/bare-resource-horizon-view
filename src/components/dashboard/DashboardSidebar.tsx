
import { 
  LayoutDashboard,
  CalendarDays,
  CalendarRange,
  Users,
  Clock,
  ScrollText,
  FolderKanban,
  GanttChartSquare,
  UserSquare2,
  Flag
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
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
  useSidebar
} from "@/components/ui/sidebar"

// Menu items:
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
        title: "Office Settings",
        url: "/office-settings",
        icon: Flag,
      },
    ],
  },
]

export function DashboardSidebar() {
  const { state } = useSidebar();
  const location = useLocation();

  return (
    <Sidebar 
      className="backdrop-blur-lg 
        bg-sidebar 
        bg-opacity-80
        border-r 
        border-sidebar-border
        pt-0
        "
      style={{ marginTop: 0 }}
    >
      {/* Add margin-top to push sidebar below header */}
      <div style={{ marginTop: 56 }} className="md:mt-0" />
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-4 py-2">
            <p className="text-2xl font-bold">
              <span className="text-white">Bare</span>
              <span className="bg-gradient-to-r from-[#9b87f5] via-[#1EAEDB] to-[#D946EF] bg-clip-text text-transparent">Resource</span>
            </p>
            <SidebarTrigger className="md:hidden text-sidebar-foreground hover:bg-sidebar-accent" />
          </div>
          {navigationItems.map((section) => (
            <div key={section.label} className="mb-6">
              <SidebarGroupLabel className="text-sidebar-foreground/70">{section.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className={`
                            text-sidebar-foreground/80 
                            hover:text-sidebar-foreground 
                            hover:bg-sidebar-accent 
                            rounded-md
                            flex
                            items-center
                            gap-3
                            transition-all
                            group-data-[collapsible=icon]:justify-center
                            group-data-[collapsible=icon]:px-0
                            group-data-[collapsible=icon]:py-2
                          `}
                          isActive={isActive}
                        >
                          <Link to={item.url} className={`
                            flex items-center gap-2 w-full p-2
                            transition-all
                            group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center
                          `}>
                            <item.icon 
                              className={`
                                h-5 w-5
                                group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7
                                transition-all
                              `}
                            />
                            {/* Only show label if sidebar expanded */}
                            <span className="truncate group-data-[collapsible=icon]:hidden">
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </div>
          ))}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
