
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
  contentClassName = "p-0",
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
              <div className="mb-4 lg:mb-6 px-6">
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
              </div>
            )}
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
