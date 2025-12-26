import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface CenteredTabItem {
  value: string;
  label: string;
  icon?: LucideIcon;
  disabled?: boolean;
}

interface CenteredTabsProps {
  value: string;
  onValueChange: (value: string) => void;
  tabs: CenteredTabItem[];
  children?: React.ReactNode;
  className?: string;
}

/**
 * Standardized centered tabs component for planning pages.
 * Uses theme-aware styling with gradient-start for active state.
 */
export function CenteredTabs({
  value,
  onValueChange,
  tabs,
  children,
  className,
}: CenteredTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className={cn("w-full", className)}>
      <div className="flex justify-center py-4 border-b border-border/50 bg-muted/30">
        <TabsList className="inline-flex h-11 items-center justify-center rounded-lg bg-background p-1 shadow-sm border border-border/60">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              disabled={tab.disabled}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-start data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              {tab.icon && <tab.icon className="h-4 w-4" />}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
}

export { TabsContent };
