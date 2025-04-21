
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
  const collapsed = state === "collapsed";

  return (
    <Sidebar 
      className={`
        backdrop-blur-lg 
        bg-[#8E9196]        /* Standardized grey background */
        bg-opacity-100
        border-r 
        border-[#7d8086]
        pt-0
        min-h-screen
        transition-[width]
      `}
      style={{ marginTop: 0 }}
    >
      {/* Margin for space below (now handled by main layout) */}
      <SidebarContent className="p-0">
        <SidebarGroup>
          <div className="flex items-center justify-between px-2 py-4">
            <span className="text-2xl font-bold text-white select-none" style={{ color: "#fff" }}>Bare</span>
            <SidebarTrigger className="md:hidden text-white bg-transparent hover:bg-[#7d8086]" />
          </div>
          {navigationItems.map((section) => (
            <div key={section.label} className="mb-1">
              <SidebarGroupLabel className="text-white/70">{collapsed ? "" : section.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className={`
                            text-white 
                            hover:text-white 
                            hover:bg-[#7d8086]
                            rounded-lg
                            flex
                            items-center
                            gap-3
                            transition-all
                            group-data-[collapsible=icon]:justify-center
                            group-data-[collapsible=icon]:px-0
                            group-data-[collapsible=icon]:py-3
                            ${isActive ? "bg-[#7d8086]! text-white" : ""}
                          `}
                          isActive={isActive}
                        >
                          <Link to={item.url} className={`
                            flex items-center gap-2 w-full
                            transition-all
                            group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center
                          `}>
                            <item.icon 
                              className={`
                                transition-all
                                ${collapsed ? "h-8 w-8" : "h-6 w-6"}   /* LARGER ICONS WHEN COLLAPSED */
                                group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8
                              `}
                            />
                            {/* Only show label if sidebar expanded */}
                            <span className={`truncate group-data-[collapsible=icon]:hidden ${collapsed ? "hidden" : ""}`}>
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
      {/* Sidebar trigger in collapsed state (show always for easy access) */}
      <div className="flex justify-end px-2 pb-4 md:block hidden">
        <SidebarTrigger className="text-white hover:bg-[#7d8086]" />
      </div>
    </Sidebar>
  )
}
