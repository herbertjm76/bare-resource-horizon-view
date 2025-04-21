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
  Flag,
  ChevronLeft,
  ChevronRight
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
import { Button } from "@/components/ui/button"

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
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  return (
    <Sidebar 
      className="bg-[#8E9196] border-r border-[#7d8086] pt-0 min-h-screen transition-all duration-300 fixed left-0 top-0 bottom-0 z-40"
      style={{ marginTop: 0, width: collapsed ? '80px' : '280px' }}
    >
      <SidebarContent className="p-0">
        <SidebarGroup>
          <div className="flex items-center justify-between px-6 py-4 h-[64px] border-b border-[#7d8086]">
            <div className="flex items-center gap-2">
              {!collapsed ? (
                <span className="text-2xl font-bold select-none">
                  <span className="text-[#8E9196]">Bare</span>
                  <span className="bg-gradient-to-r from-[#6E59A5] via-[#9b87f5] to-[#D946EF] bg-clip-text text-transparent">Resource</span>
                </span>
              ) : (
                <span className="text-2xl font-bold select-none">
                  <span className="bg-gradient-to-r from-[#6E59A5] via-[#9b87f5] to-[#D946EF] bg-clip-text text-transparent">B</span>
                </span>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className="text-white hover:bg-[#7d8086] h-10 w-10 p-2 rounded-full"
            >
              {collapsed ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
            </Button>
          </div>
          
          {navigationItems.map((section) => (
            <div key={section.label} className="mb-2">
              <SidebarGroupLabel className="text-white/70 px-6 pt-6 pb-3">
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
                            px-6
                            py-4
                            flex
                            items-center
                            gap-4
                            transition-all
                            text-base
                            ${isActive ? "bg-[#6E59A5] text-white" : ""}
                          `}
                          isActive={isActive}
                        >
                          <Link to={item.url} className="flex items-center gap-4 w-full">
                            <item.icon className="h-6 w-6" />
                            {!collapsed && <span className="font-medium">{item.title}</span>}
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
