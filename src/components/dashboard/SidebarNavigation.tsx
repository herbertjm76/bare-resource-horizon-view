
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
      {items.map((section, index) => (
        <div key={section.label} className={`${index > 0 ? 'mt-8' : 'mt-2'}`}>
          <SidebarGroupLabel className="text-white/70 px-2 pt-4 pb-2">
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
                        hover:bg-white/10
                        rounded-none
                        px-2
                        py-2
                        flex
                        items-center
                        gap-3
                        transition-all
                        text-sm
                        relative
                        ${isActive ? "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-[#895CF7]" : ""}
                      `}
                      isActive={isActive}
                      tooltip={collapsed ? item.title : undefined}
                    >
                      <Link 
                        to={item.url} 
                        className="flex items-center gap-3 w-full"
                        onClick={onItemClick}
                      >
                        <item.icon className="h-5 w-5 min-w-5" />
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
  );
};
