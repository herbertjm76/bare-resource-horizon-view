
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { AppHeader } from '@/components/AppHeader';

const HEADER_HEIGHT = 64;

interface StandardLayoutProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  title?: string;
}

export const StandardLayout: React.FC<StandardLayoutProps> = ({ 
  children, 
  className = "bg-gray-50",
  contentClassName = "p-4 sm:p-8",
  title
}) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className={`w-full min-h-screen flex ${className}`}>
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col min-w-0 max-w-full">
          <AppHeader />
          <div style={{ height: HEADER_HEIGHT }} />
          <main className={`flex-1 overflow-auto ${contentClassName} min-w-0 max-w-full`}>
            {title && (
              <div className="mb-6">
                <div className="bg-card/50 border border-border rounded-lg shadow-sm">
                  <div className="text-center py-6">
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight" style={{ color: 'hsl(var(--theme-primary))' }}>
                      {title}
                    </h1>
                  </div>
                </div>
              </div>
            )}
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
