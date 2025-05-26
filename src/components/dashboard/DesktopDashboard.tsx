
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, TrendingUp, Clock, Target, AlertTriangle, DollarSign, Briefcase, Bot, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    if (rate > 90) return { color: 'destructive', label: 'At Capacity' };
    if (rate > 65) return { color: 'default', label: 'Optimally Allocated' };
    return { color: 'outline', label: 'Ready for Projects' };
  };

  const utilizationStatus = getUtilizationStatus(utilizationTrends.days7);

  // Get profile image URL or return default based on gender
  const getProfileImage = (member: any) => {
    // Check if member has a profile image
    if (member.profile_image_url) {
      return member.profile_image_url;
    }
    
    // Use placeholder images as defaults based on name patterns
    // This is a simple approach - in a real app you'd have gender info or user uploads
    const firstName = (member.first_name || '').toLowerCase();
    const isFemale = firstName.includes('melody') || firstName.includes('sarah') || firstName.includes('emma') || firstName.includes('lisa');
    
    if (isFemale) {
      return 'https://images.unsplash.com/photo-1494790108755-2616c86b8e73?w=150&h=150&fit=crop&crop=face';
    } else {
      return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face';
    }
  };

  // Get initials for avatar fallback
  const getInitials = (member: any) => {
    const first = member.first_name || '';
    const last = member.last_name || '';
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  // Updated staff categorization with better thresholds
  const atCapacityStaff = staffData.filter(member => member.availability > 90);
  const optimalStaff = staffData.filter(member => member.availability > 65 && member.availability <= 90);
  const readyStaff = staffData.filter(member => member.availability <= 65);

  console.log('Staff categorization:', {
    atCapacity: atCapacityStaff,
    optimal: optimalStaff,
    ready: readyStaff,
    allStaff: staffData
  });

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

        {/* Staff Availability & Status - Fixed Height with Scroll */}
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
                  {/* At Capacity Staff (>90%) */}
                  {atCapacityStaff.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <h4 className="font-semibold text-red-700">At Capacity ({atCapacityStaff.length})</h4>
                      </div>
                      <div className="space-y-3">
                        {atCapacityStaff.map((member, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              <AvatarImage src={getProfileImage(member)} alt={`${member.first_name} ${member.last_name}`} />
                              <AvatarFallback className="bg-red-200 text-red-800 text-sm">
                                {getInitials(member)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-800">
                                  {member.first_name} {member.last_name}
                                </span>
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

                  {/* Optimally Allocated Staff (66-90%) */}
                  {optimalStaff.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-4 w-4 text-blue-500" />
                        <h4 className="font-semibold text-blue-700">Optimally Allocated ({optimalStaff.length})</h4>
                      </div>
                      <div className="space-y-3">
                        {optimalStaff.map((member, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              <AvatarImage src={getProfileImage(member)} alt={`${member.first_name} ${member.last_name}`} />
                              <AvatarFallback className="bg-blue-200 text-blue-800 text-sm">
                                {getInitials(member)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-800">
                                  {member.first_name} {member.last_name}
                                </span>
                                <span className="text-blue-600 font-semibold">{member.availability}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-blue-100 rounded-full">
                                <div 
                                  className="h-1.5 rounded-full bg-blue-500"
                                  style={{ width: `${member.availability}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ready for Projects Staff (≤65%) */}
                  {readyStaff.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-4 w-4 text-green-500" />
                        <h4 className="font-semibold text-green-700">
                          Ready for Projects ({readyStaff.length})
                          <span className="text-xs font-normal text-gray-500 ml-1">
                            available for new work
                          </span>
                        </h4>
                      </div>
                      <div className="space-y-3">
                        {readyStaff.slice(0, 4).map((member, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              <AvatarImage src={getProfileImage(member)} alt={`${member.first_name} ${member.last_name}`} />
                              <AvatarFallback className="bg-green-200 text-green-800 text-sm">
                                {getInitials(member)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-800">
                                  {member.first_name} {member.last_name}
                                </span>
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
                        {readyStaff.length > 4 && (
                          <p className="text-xs text-gray-500 text-center">
                            +{readyStaff.length - 4} more available
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
