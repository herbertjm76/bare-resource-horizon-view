
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { HelpCircle, BookOpen, MessageCircle, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useCompany } from '@/context/CompanyContext';

const HEADER_HEIGHT = 56;

const Help = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { company } = useCompany();

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };
  
  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex">
        <DashboardSidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          <div style={{ height: HEADER_HEIGHT }} />
          <div className="flex-1 p-4 sm:p-8 bg-background">
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Modern Header Section */}
              <div className="space-y-6 mb-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="space-y-2">
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary flex items-center gap-3">
                      <HelpCircle className="h-8 w-8 text-brand-violet" />
                      Help & Support
                    </h1>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Need assistance?</h2>
                <p className="text-muted-foreground mb-4">
                  This page provides resources and support to help you use the platform effectively.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-md border p-4">
                    <h3 className="font-medium mb-2">Documentation</h3>
                    <p className="text-sm text-muted-foreground">
                      Browse our comprehensive guides and tutorials
                    </p>
                  </div>
                  <div className="rounded-md border p-4">
                    <h3 className="font-medium mb-2">Contact Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Reach out to our support team for assistance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Help;
