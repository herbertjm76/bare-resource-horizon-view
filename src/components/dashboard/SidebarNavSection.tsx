
import { Link } from "react-router-dom"
import {
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { NavigationSection } from "./navigation"

interface SidebarNavSectionProps {
  section: NavigationSection
}

export function SidebarNavSection({ section }: SidebarNavSectionProps) {
  return (
    <div className="mb-6">
      <SidebarGroupLabel className="text-white/70">
        {section.label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {section.items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link to={item.url} className="w-full">
                <SidebarMenuButton className="text-white hover:text-white hover:bg-white/10">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </div>
  )
}
