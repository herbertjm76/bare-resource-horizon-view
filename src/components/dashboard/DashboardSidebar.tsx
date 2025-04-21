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
  ChevronRight,
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
  useSidebar,
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
        isInvite: true,
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

  // Main sidebar: solid midgray, text/icons all white, larger icons and better hover.
  return (
    <Sidebar
      className={`
        min-h-screen w-full p-0
        border-none 
        transition-[width]
        shadow-xl
        bg-[#8E9196]
        text-white
        relative
      `}
      data-gradient-sidebar
    >
      <SidebarContent className="p-0">
        {/* Company Logo and Collapse Button */}
        <div className="flex flex-col items-stretch w-full">
          <div
            className={`flex items-center justify-between gap-2 px-4 py-7 ${
              collapsed ? "justify-center px-2" : ""
            }`}
          >
            <div className={collapsed ? "w-full flex justify-center" : "flex items-center gap-3"}>
              <img
                src={LOGO_URL}
                alt="Company Logo"
                className={`shadow-lg rounded-full border-2 border-white/80 ${
                  collapsed ? "w-14 h-14" : "w-16 h-16"
                } bg-white object-cover duration-200`}
                style={{
                  minWidth: 56,
                  minHeight: 56,
                  maxWidth: 64,
                  maxHeight: 64,
                  objectFit: "cover",
                }}
              />
              {!collapsed && (
                <span
                  className="text-4xl font-extrabold tracking-wide whitespace-nowrap text-white"
                  style={{ letterSpacing: 1.5 }}
                >
                  BareResource
                </span>
              )}
            </div>
            <button
              onClick={toggleSidebar}
              className={`transition-colors rounded-full p-1 ml-2 ${
                collapsed ? "bg-white/30 hover:bg-white/60" : "bg-white/20 hover:bg-white/40"
              } text-white shadow-md focus:outline-none focus:ring-2 focus:ring-white`}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="w-9 h-9" />
              ) : (
                <ChevronLeft className="w-9 h-9" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        {navigationItems.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel
              className={`uppercase tracking-wide font-semibold text-sm mb-1 text-white/60 ${
                collapsed ? "hidden" : ""
              }`}
            >
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
                          text-2xl
                          hover:text-[#fff]
                          hover:bg-white/10
                          px-5 py-4
                          my-2
                          rounded-xl
                          flex
                          items-center
                          gap-6
                          transition-all
                          ease-in
                          group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0
                          ${isActive ? "bg-white/20 font-semibold shadow-inner" : ""}
                        `}
                        isActive={isActive}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {/* Invite Code button breaks to popup */}
                        {item.isInvite ? (
                          <button
                            type="button"
                            className={`
                              w-full flex items-center gap-6
                              group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center
                              focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:outline-none transition-shadow
                            `}
                            tabIndex={0}
                            onClick={(e) => {
                              e.preventDefault();
                              setInviteOpen(true);
                            }}
                          >
                            <item.icon
                              className={`${
                                collapsed ? "w-12 h-12" : "w-10 h-10"
                              } drop-shadow-sm flex-shrink-0 transition-all text-white`}
                              aria-hidden="true"
                            />
                            <span
                              className={`truncate group-data-[collapsible=icon]:hidden ${
                                collapsed ? "hidden" : ""
                              }`}
                            >
                              {item.title}
                            </span>
                          </button>
                        ) : (
                          <Link
                            to={item.url}
                            className={`
                              flex items-center gap-6 w-full
                              group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center
                              font-medium
                              transition-all
                            `}
                          >
                            <item.icon
                              className={`${
                                collapsed ? "w-12 h-12" : "w-10 h-10"
                              } drop-shadow-sm flex-shrink-0 transition-all text-white`}
                              aria-hidden="true"
                            />
                            <span
                              className={`truncate group-data-[collapsible=icon]:hidden ${
                                collapsed ? "hidden" : ""
                              }`}
                            >
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
      <div className="flex justify-end items-center px-4 py-6 md:block hidden">
        <SidebarTrigger className="text-white hover:bg-white/30" />
      </div>
      <InviteCodeDialog open={inviteOpen} onOpenChange={setInviteOpen} inviteUrl={inviteUrl || ""} />
    </Sidebar>
  );
}
