
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
              <SidebarMenuButton
                variant="default"
                asChild
              >
                <Link to={item.url} className="w-full">
                  <item.icon className="h-4 w-4 text-white" />
                  <span className="text-white">
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </div>
  )
}
