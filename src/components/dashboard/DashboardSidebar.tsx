
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
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar"

const navigationItems = [
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
    label: "RESOURCES",
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

export function DashboardSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  return (
    <Sidebar 
      className="bg-[#8E9196] border-r border-[#7d8086] pt-0 min-h-screen transition-[width] fixed left-0 top-0 bottom-0 w-[240px]"
      style={{ marginTop: 0 }}
    >
      <SidebarContent className="p-0">
        <SidebarGroup>
          <div className="flex items-center justify-between px-4 py-4 h-[56px] border-b border-[#7d8086]">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-white select-none">Bare<span className="text-[#6E59A5]">Resource</span></span>
            </div>
            <SidebarTrigger className="text-white bg-transparent hover:bg-[#7d8086]" />
          </div>
          
          {navigationItems.map((section) => (
            <div key={section.label} className="mb-1">
              <SidebarGroupLabel className="text-white/70 px-4 pt-6 pb-2">
                {collapsed ? "" : section.label}
              </SidebarGroupLabel>
              <SidebarContent>
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
                            rounded-none
                            px-4
                            py-2
                            flex
                            items-center
                            gap-3
                            transition-all
                            ${isActive ? "bg-[#7d8086] text-white" : ""}
                          `}
                          isActive={isActive}
                        >
                          <Link to={item.url} className="flex items-center gap-3 w-full">
                            <item.icon className="h-5 w-5" />
                            {!collapsed && <span>{item.title}</span>}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarContent>
            </div>
          ))}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
