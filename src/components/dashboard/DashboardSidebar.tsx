
import React, { useState } from "react";
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
  Code,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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
} from "@/components/ui/sidebar";
import { InviteCodeDialog } from "./InviteCodeDialog";

// --- TEMP LOGO -- //
const LOGO_URL = "/placeholder.svg";

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
      {
        title: "Invite Code",
        url: "#",
        icon: Code,
        isInvite: true
      },
    ],
  },
];

export function DashboardSidebar({ inviteUrl }: { inviteUrl?: string }) {
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  // Invite Code Dialog
  const [inviteOpen, setInviteOpen] = useState(false);

  // Main gradient sidebar
  return (
    <Sidebar 
      className={`
        min-h-screen w-full p-0
        border-none 
        transition-[width]
        shadow-xl
        bg-gradient-to-br from-[#9b87f5] via-[#1EAEDB] to-[#D946EF]
        bg-fixed
        relative
      `}
      data-gradient-sidebar
    >
      <SidebarContent className="p-0">
        {/* Company Logo and Collapse Button */}
        <div className="flex flex-col items-stretch w-full">
          <div className={`flex items-center justify-between gap-2 px-4 py-7 ${collapsed ? "justify-center px-2" : ""}`}>
            <div className={collapsed ? "w-full flex justify-center" : "flex items-center gap-3"}>
              <img
                src={LOGO_URL}
                alt="Company Logo"
                className={`material-symbols-outlined shadow-lg rounded-full border-2 border-white/70 ${collapsed ? "w-11 h-11" : "w-10 h-10"} bg-white object-cover duration-200`}
                style={{ minWidth: 40, minHeight: 40, maxWidth: 44, maxHeight: 44, objectFit: "cover" }}
              />
              {!collapsed && (
                <span
                  className="text-2xl font-extrabold text-white drop-shadow bare-logo-shadow tracking-wide"
                  style={{ letterSpacing: 1.5 }}
                >
                  BareResource
                </span>
              )}
            </div>
            <button
              onClick={toggleSidebar}
              className={`transition-colors rounded-full p-1 ml-2 ${collapsed
                ? "bg-white/20 hover:bg-purple-400/60"
                : "bg-white/10 hover:bg-purple-300/40"
              } text-white`}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="w-6 h-6" />
              ) : (
                <ChevronLeft className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        {navigationItems.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel className={`text-white/70 uppercase tracking-wide font-semibold text-xs mb-1 ${collapsed ? "hidden" : ""}`}>
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
                          text-white/90 
                          text-base
                          hover:text-white
                          hover:bg-white/12
                          px-3 py-2
                          my-1
                          rounded-xl
                          flex
                          items-center
                          gap-3
                          transition-all
                          ease-in
                          group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0
                          ${isActive ? "bg-white/20 shadow-inner text-white font-bold" : ""}
                        `}
                        isActive={isActive}
                      >
                        {/* Handle Invite Code special: open dialog on click */}
                        {item.isInvite ? (
                          <button
                            type="button"
                            className={`
                              w-full flex items-center gap-4
                              group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center
                              focus-visible:ring-2 focus-visible:ring-pink-300 transition-shadow`}
                            tabIndex={0}
                            onClick={(e) => { e.preventDefault(); setInviteOpen(true); }}
                          >
                            <item.icon
                              className={`
                                ${collapsed ? "w-8 h-8" : "w-7 h-7"}
                                drop-shadow-sm
                                flex-shrink-0
                                transition-all
                              `}
                            />
                            <span className={`truncate group-data-[collapsible=icon]:hidden ${collapsed ? "hidden" : ""}`}>
                              {item.title}
                            </span>
                          </button>
                        ) : (
                          <Link
                            to={item.url}
                            className={`
                              flex items-center gap-4 w-full
                              group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center
                              font-medium
                              transition-all
                            `}
                          >
                            <item.icon
                              className={`
                                ${collapsed ? "w-8 h-8" : "w-7 h-7"}
                                drop-shadow-sm
                                flex-shrink-0
                                transition-all
                              `}
                            />
                            <span className={`truncate group-data-[collapsible=icon]:hidden ${collapsed ? "hidden" : ""}`}>
                              {item.title}
                            </span>
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      {/* Sidebar collapse/expand affordance always visible on wide screens */}
      <div className="flex justify-end items-center px-2 py-4 md:block hidden">
        <SidebarTrigger className="text-white hover:bg-white/20" />
      </div>
      {/* Invite Code Dialog */}
      <InviteCodeDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        inviteUrl={inviteUrl || ""}
      />
    </Sidebar>
  );
}
