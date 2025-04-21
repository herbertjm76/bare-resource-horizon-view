
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
      className="bg-[#6E59A5] border-r border-[#5d4b8e] pt-0 min-h-screen transition-[width] fixed left-0 top-0 bottom-0"
      style={{ marginTop: 0 }}
    >
      <SidebarContent className="p-0">
        <SidebarGroup>
          <div className="flex items-center justify-between px-4 py-4 h-[56px] border-b border-[#5d4b8e]">
            <span className="text-2xl font-bold text-white select-none">BareResource</span>
            <SidebarTrigger className="text-white bg-transparent hover:bg-[#5d4b8e]" />
          </div>
          
          {navigationItems.map((section) => (
            <div key={section.label} className="mb-1">
              <SidebarGroupLabel className="text-white/70 px-4 pt-6 pb-2">
                {collapsed ? "" : section.label}
              </SidebarGroupLabel>
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
                            hover:bg-[#5d4b8e]
                            rounded-none
                            px-4
                            py-2
                            flex
                            items-center
                            gap-3
                            transition-all
                            ${isActive ? "bg-[#5d4b8e] text-white" : ""}
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
              </SidebarGroupContent>
            </div>
          ))}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
