
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { HelpCircle, BookOpen, MessageCircle, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useCompany } from '@/context/CompanyContext';

const HEADER_HEIGHT = 56;

const Help = () => {
  const { company } = useCompany();
  
  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row">
        <div className="flex-shrink-0">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col">
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
                    <p className="text-muted-foreground text-lg">
                      Get the help you need to make the most of your platform
                    </p>
                  </div>
                  
                  {/* Quick Stats Cards */}
                  <div className="flex flex-wrap items-center gap-3">
                    <Card className="px-4 py-2 bg-gradient-to-r from-brand-violet/10 to-brand-violet/5 border-brand-violet/20">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-brand-violet" />
                        <div className="text-sm">
                          <span className="font-semibold text-brand-violet">Guides</span>
                          <span className="text-muted-foreground ml-1">Available</span>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-emerald-600" />
                        <div className="text-sm">
                          <span className="font-semibold text-emerald-600">Support</span>
                          <span className="text-muted-foreground ml-1">24/7</span>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <div className="text-sm">
                          <span className="font-semibold text-blue-600">Docs</span>
                          <span className="text-muted-foreground ml-1">Updated</span>
                        </div>
                      </div>
                    </Card>
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
