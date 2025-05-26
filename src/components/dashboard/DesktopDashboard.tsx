
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, TrendingUp, Clock, Target, AlertTriangle, DollarSign, Briefcase, Bot, MessageCircle } from 'lucide-react';
import { EnhancedInsights } from './EnhancedInsights';
import { Donut } from './Donut';
import { HolidayCard } from './HolidayCard';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogPortal } from "@/components/ui/dialog";
import { HerbieChat } from './HerbieChat';
import { ScrollArea } from "@/components/ui/scroll-area";
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface DesktopDashboardProps {
  teamMembers: any[];
  activeProjects: number;
  activeResources: number;
  utilizationTrends: {
    days7: number;
    days30: number;
    days90: number;
  };
  staffData: any[];
  mockData: any;
}

export const DesktopDashboard: React.FC<DesktopDashboardProps> = ({
  teamMembers,
  activeProjects,
  activeResources,
  utilizationTrends,
  staffData,
  mockData
}) => {
  const [isHerbieOpen, setIsHerbieOpen] = useState(false);

  const getUtilizationStatus = (rate: number) => {
    if (rate > 90) return { color: 'destructive', label: 'Overutilized' };
    if (rate > 80) return { color: 'default', label: 'High Utilization' };
    if (rate > 60) return { color: 'secondary', label: 'Healthy' };
    return { color: 'outline', label: 'Underutilized' };
  };

  const utilizationStatus = getUtilizationStatus(utilizationTrends.days7);

  // Separate staff by availability
  const overloadedStaff = staffData.filter(member => member.availability > 85);
  const availableStaff = staffData.filter(member => member.availability <= 85);

  return (
    <div className="space-y-8 p-6 relative">
      {/* CEO Priority 1: Executive Summary with 45-degree gradient */}
      <div 
        className="rounded-2xl p-4 border border-brand-violet/10"
        style={{
          background: 'linear-gradient(45deg, #6F4BF6 0%, #5669F7 55%, #E64FC4 100%)'
        }}
      >
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Executive Summary
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 mb-1">Team Utilization</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{utilizationTrends.days7}%</p>
                  <Badge variant={utilizationStatus.color as any} className="text-xs">
                    {utilizationStatus.label}
                  </Badge>
                </div>
                <div className="h-10 w-10 rounded-full bg-brand-violet/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-brand-violet" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 mb-1">Available Capacity</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">2,340h</p>
                  <p className="text-xs font-medium text-gray-500">Next 12 weeks</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 mb-1">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{activeProjects}</p>
                  <p className="text-xs font-medium text-gray-500">{(activeProjects / activeResources).toFixed(1)} per person</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 mb-1">Team Size</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{activeResources}</p>
                  <Badge variant="outline" className="text-xs">
                    {utilizationTrends.days7 > 85 ? 'Consider Hiring' : 'Stable'}
                  </Badge>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CEO Priority 2: Three Column Layout - Smart Insights, Staff Status & Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Smart Insights - Fixed Height with Scroll */}
        <div className="lg:col-span-1">
          <Card className="h-[400px] flex flex-col">
            <CardHeader className="pb-4 flex-shrink-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-brand-violet" />
                Smart Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <EnhancedInsights 
                teamMembers={teamMembers}
                activeProjects={activeProjects}
                utilizationRate={utilizationTrends.days7}
                utilizationTrends={utilizationTrends}
                staffMembers={staffData}
              />
            </CardContent>
          </Card>
        </div>

        {/* Staff Availability & Overloaded - Fixed Height with Scroll */}
        <div className="lg:col-span-1">
          <Card className="h-[400px] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-brand-violet" />
                Staff Status
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full">
                <div className="space-y-6 px-6 pb-6">
                  {/* Overloaded Staff */}
                  {overloadedStaff.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <h4 className="font-semibold text-red-700">Overloaded ({overloadedStaff.length})</h4>
                      </div>
                      <div className="space-y-3">
                        {overloadedStaff.map((member, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                            <div className="w-8 h-8 rounded-full bg-red-200 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-800">{member.name}</span>
                                <span className="text-red-600 font-semibold">{member.availability}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-red-100 rounded-full">
                                <div 
                                  className="h-1.5 rounded-full bg-red-500"
                                  style={{ width: `${Math.min(member.availability, 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Staff */}
                  {availableStaff.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-4 w-4 text-green-500" />
                        <h4 className="font-semibold text-green-700">Available ({availableStaff.length})</h4>
                      </div>
                      <div className="space-y-3">
                        {availableStaff.slice(0, 4).map((member, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                            <div className="w-8 h-8 rounded-full bg-green-200 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-800">{member.name}</span>
                                <span className="text-green-600 font-semibold">{member.availability}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-green-100 rounded-full">
                                <div 
                                  className="h-1.5 rounded-full bg-green-500"
                                  style={{ width: `${member.availability}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        {availableStaff.length > 4 && (
                          <p className="text-xs text-gray-500 text-center">
                            +{availableStaff.length - 4} more available
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Holidays */}
        <div className="lg:col-span-1">
          <HolidayCard />
        </div>
      </div>

      {/* CEO Priority 3: Analytics & Business Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <Donut 
              data={mockData.projectsByStatus} 
              title="Project Status" 
              colors={['#6F4BF6', '#5669F7', '#E64FC4']}
              height={200}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Donut 
              data={mockData.projectsByStage} 
              title="Project Stages"
              colors={['#6F4BF6', '#5669F7', '#E64FC4']}
              height={200}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Donut 
              data={mockData.projectsByRegion} 
              title="Regional Split"
              colors={['#6F4BF6', '#5669F7', '#E64FC4']}
              height={200}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Donut 
              data={mockData.projectInvoicesThisMonth} 
              title="Project Invoices This Month"
              colors={['#22C55E', '#F59E0B', '#EF4444']}
              height={200}
            />
          </CardContent>
        </Card>
      </div>

      {/* Floating Herbie Button with Custom Dialog */}
      <Dialog open={isHerbieOpen} onOpenChange={setIsHerbieOpen}>
        <DialogTrigger asChild>
          <Button 
            className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 group"
            style={{
              background: 'linear-gradient(45deg, #6F4BF6 0%, #5669F7 55%, #E64FC4 100%)'
            }}
          >
            <div className="flex flex-col items-center justify-center">
              <Bot className="h-6 w-6 text-white mb-0.5" />
              <span className="text-xs text-white font-medium">Herbie</span>
            </div>
            <div className="absolute -top-2 -right-2 bg-green-500 h-4 w-4 rounded-full animate-pulse" />
          </Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogPrimitive.Content
            className="fixed bottom-8 right-8 z-50 w-80 h-96 bg-background border rounded-lg shadow-lg p-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          >
            <DialogHeader className="p-4 pb-2">
              <DialogTitle className="flex items-center gap-2 text-sm">
                <Bot className="h-4 w-4 text-brand-violet" />
                Herbie
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden px-4 pb-4 h-[calc(100%-60px)]">
              <HerbieChat />
            </div>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </div>
  );
};
