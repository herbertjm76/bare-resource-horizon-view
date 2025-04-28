
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
          <SidebarGroupLabel className="text-white/70 px-4 pt-6 pb-2">
            {collapsed ? "" : section.label}
          </SidebarGroupLabel>
          <SidebarContent>
            <SidebarMenu>
              {section.items.map((item) => {
                const isActive = currentPath === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild
                      className={`
                        relative
                        text-white 
                        hover:text-white 
                        hover:bg-[#7d8086]/30
                        rounded-none
                        px-4
                        py-2
                        flex
                        items-center
                        gap-4
                        transition-all
                        text-sm
                        ${isActive ? "before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-brand-primary text-brand-primary" : ""}
                      `}
                      isActive={isActive}
                      tooltip={collapsed ? item.title : undefined}
                    >
                      <Link 
                        to={item.url} 
                        className="flex items-center gap-4 w-full"
                        onClick={onItemClick}
                      >
                        <item.icon className={`h-[22px] w-[22px] min-w-[22px] ${isActive ? "text-brand-primary" : ""}`} />
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

