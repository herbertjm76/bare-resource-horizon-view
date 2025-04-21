
import { Link } from "react-router-dom"
import { LucideIcon } from "lucide-react"
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

interface NavigationItem {
  title: string
  url: string
  icon: LucideIcon
}

interface NavigationSection {
  label: string
  items: NavigationItem[]
}

interface SidebarNavigationProps {
  items: NavigationSection[]
  collapsed?: boolean
  onItemClick?: () => void
  currentPath: string
}

export const SidebarNavigation = ({ 
  items, 
  collapsed = false, 
  onItemClick,
  currentPath 
}: SidebarNavigationProps) => {
  return (
    <>
      {items.map((section) => (
        <div key={section.label} className="mb-2">
          <SidebarGroupLabel className="text-white/70 px-6 pt-6 pb-3">
            {collapsed ? "" : section.label}
          </SidebarGroupLabel>
          <SidebarContent>
            <SidebarMenu>
              {section.items.map((item) => {
                const isActive = currentPath === item.url;
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
                      tooltip={collapsed ? item.title : undefined}
                    >
                      <Link 
                        to={item.url} 
                        className="flex items-center gap-4 w-full"
                        onClick={onItemClick}
                      >
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
    </>
  )
}
