import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Search, 
  BarChart3, 
  Users, 
  Calendar, 
  Settings, 
  AlertTriangle,
  TrendingUp,
  Clock,
  Target,
  HelpCircle
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

const faqData: FAQItem[] = [
  // Dashboard & Metrics
  {
    id: "dashboard-1",
    question: "What does team utilization percentage mean?",
    answer: "Team utilization shows how much of your team's capacity is currently allocated to projects. It's calculated based on individual member allocations divided by their total capacity for the selected time period. Over 90% indicates at capacity, 66-90% is optimal, and under 65% means ready for new projects.",
    category: "Dashboard & Metrics",
    tags: ["utilization", "capacity", "metrics"]
  },
  {
    id: "dashboard-2",
    question: "How is available capacity calculated?",
    answer: "Available capacity is calculated by taking your team's total capacity for the selected time period minus their current allocations. If the number is negative, it means your team is over capacity. The calculation adjusts based on the time range selected (week, month, quarter, etc.).",
    category: "Dashboard & Metrics",
    tags: ["capacity", "calculations", "time-range"]
  },
  {
    id: "dashboard-3",
    question: "Why does the Executive Summary show different data for different time ranges?",
    answer: "The Executive Summary dynamically adjusts based on your selected time range. When you switch from 'This Week' to 'This Month' or 'This Quarter', all metrics including utilization, capacity, and project data are recalculated for that specific period to give you accurate insights.",
    category: "Dashboard & Metrics",
    tags: ["time-range", "executive-summary", "data"]
  },
  {
    id: "dashboard-4",
    question: "What's the difference between 'At Capacity', 'Optimally Allocated', and 'Ready for Projects' staff?",
    answer: "At Capacity (>90%): Team members who are fully booked or overallocated. Optimally Allocated (66-90%): Team members with good workload balance. Ready for Projects (≤65%): Team members available for new work assignments.",
    category: "Dashboard & Metrics",
    tags: ["staff-status", "allocation", "workload"]
  },

  // Team Management
  {
    id: "team-1",
    question: "What's the difference between active team members and pre-registered members?",
    answer: "Active team members are full users who can log in and manage their own profiles. Pre-registered members are placeholder entries created by administrators for resource planning before the person joins the team or gets full access.",
    category: "Team Management",
    tags: ["team-members", "pre-registered", "user-types"]
  },
  {
    id: "team-2",
    question: "How do I invite new team members?",
    answer: "Go to Team Members page and click 'Invite Member'. You can send email invitations or create pre-registered entries for planning purposes. Pre-registered members can be converted to full users when they accept invitations.",
    category: "Team Management",
    tags: ["invitations", "onboarding", "team-setup"]
  },
  {
    id: "team-3",
    question: "Can I set different working hours for different team members?",
    answer: "Yes, each team member can have a custom weekly capacity. The default is 40 hours per week, but you can adjust this in their profile to reflect part-time schedules, different working arrangements, or local variations.",
    category: "Team Management",
    tags: ["working-hours", "capacity", "part-time"]
  },

  // Resource Planning
  {
    id: "resource-1",
    question: "How do I allocate team members to projects?",
    answer: "Use the Project Resourcing or Week Resourcing views to assign team members to projects. You can set specific hours per week and duration. The system will track utilization and warn you about over-allocation.",
    category: "Resource Planning",
    tags: ["allocation", "project-assignment", "scheduling"]
  },
  {
    id: "resource-2",
    question: "What happens when someone is allocated more than their capacity?",
    answer: "The system will show their utilization as over 100% and mark them as 'At Capacity' with warning indicators. You'll see negative available capacity in reports, helping you identify when to redistribute work or consider hiring.",
    category: "Resource Planning",
    tags: ["over-allocation", "capacity-warnings", "workload-management"]
  },
  {
    id: "resource-3",
    question: "How do I handle annual leave and holidays in resource planning?",
    answer: "Set up office holidays in Office Settings and individual annual leave in Team Annual Leave. The system will automatically reduce available capacity during these periods and show holiday indicators in the resource views.",
    category: "Resource Planning",
    tags: ["annual-leave", "holidays", "time-off"]
  },

  // Time Tracking & Reporting
  {
    id: "time-1",
    question: "How do I switch between different time periods for reporting?",
    answer: "Use the time range selector in the dashboard header. You can view data for This Week, This Month, This Quarter, 6 Months, or This Year. All metrics and charts will automatically update to reflect the selected period.",
    category: "Time Tracking & Reporting",
    tags: ["time-range", "reporting", "analytics"]
  },
  {
    id: "time-2",
    question: "Why do utilization percentages change when I change the time range?",
    answer: "Utilization is calculated based on allocations within the selected time period. A team member might be 100% utilized this week but only 60% over the entire month if they have lighter weeks ahead. This gives you both short-term and long-term planning insights.",
    category: "Time Tracking & Reporting",
    tags: ["utilization-calculation", "time-periods", "planning"]
  },

  // Project Management
  {
    id: "project-1",
    question: "How do I create and manage project stages?",
    answer: "In the Projects section, you can define project stages with specific durations, fees, and resource requirements. Stages help break down projects into manageable phases and track progress through the project lifecycle.",
    category: "Project Management",
    tags: ["project-stages", "project-setup", "workflow"]
  },
  {
    id: "project-2",
    question: "Can I track project profitability and rates?",
    answer: "Yes, you can set hourly rates for different roles and track project fees. The system calculates project profitability based on allocated hours and rates, helping you understand which projects and team configurations are most profitable.",
    category: "Project Management",
    tags: ["profitability", "rates", "financial-tracking"]
  },

  // Settings & Configuration
  {
    id: "settings-1",
    question: "How do I set up different office locations?",
    answer: "In Office Settings, you can configure multiple office locations with their own holidays, working schedules, and settings. This is useful for companies with teams in different cities or countries with varying holiday calendars.",
    category: "Settings & Configuration",
    tags: ["office-locations", "multi-office", "configuration"]
  },
  {
    id: "settings-2",
    question: "How do I customize roles and departments?",
    answer: "Use the Office Settings to define custom roles (like Senior Architect, Project Manager, etc.) and departments. These help organize your team and can be used for reporting and rate calculations.",
    category: "Settings & Configuration",
    tags: ["roles", "departments", "customization"]
  },

  // Troubleshooting
  {
    id: "trouble-1",
    question: "Why are my dashboard metrics not updating?",
    answer: "Dashboard metrics update automatically when you change allocations or time ranges. If data seems stale, try refreshing the page. Check that your team members have proper allocations and that the selected time range includes relevant data.",
    category: "Troubleshooting",
    tags: ["dashboard-issues", "data-refresh", "metrics"]
  },
  {
    id: "trouble-2",
    question: "Some team members aren't showing in resource planning. Why?",
    answer: "Check that team members are properly invited and have accepted their invitations. Pre-registered members will show in planning views, but inactive or uninvited members might not appear. Verify their status in the Team Members section.",
    category: "Troubleshooting",
    tags: ["missing-members", "team-status", "visibility"]
  },
  {
    id: "trouble-3",
    question: "Utilization calculations seem incorrect. How do I debug this?",
    answer: "Utilization is based on project allocations divided by weekly capacity, adjusted for the selected time period. Check individual member allocations in Project Resourcing, verify their weekly capacity in their profile, and ensure the time range matches your expectations.",
    category: "Troubleshooting",
    tags: ["utilization-debugging", "calculations", "data-verification"]
  }
];

const categories = [
  { name: "All", icon: Search, color: "bg-gray-100 text-gray-700" },
  { name: "Dashboard & Metrics", icon: BarChart3, color: "bg-blue-100 text-blue-700" },
  { name: "Team Management", icon: Users, color: "bg-green-100 text-green-700" },
  { name: "Resource Planning", icon: Calendar, color: "bg-purple-100 text-purple-700" },
  { name: "Time Tracking & Reporting", icon: Clock, color: "bg-orange-100 text-orange-700" },
  { name: "Project Management", icon: Target, color: "bg-red-100 text-red-700" },
  { name: "Settings & Configuration", icon: Settings, color: "bg-indigo-100 text-indigo-700" },
  { name: "Troubleshooting", icon: AlertTriangle, color: "bg-yellow-100 text-yellow-700" }
];

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.icon : Search;
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : "bg-gray-100 text-gray-700";
  };

  return (
    <StandardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <StandardizedPageHeader
          title="Frequently Asked Questions"
          description="Find answers to common questions about resource planning and project management"
          icon={HelpCircle}
        >
          <Badge variant="outline" className="text-sm">
            {filteredFAQs.length} {filteredFAQs.length === 1 ? 'Question' : 'Questions'}
          </Badge>
        </StandardizedPageHeader>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search FAQs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search questions, answers, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.name;
                
                return (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isSelected 
                        ? 'bg-brand-violet text-white' 
                        : `${category.color} hover:opacity-80`
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Accordion */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedCategory === 'All' ? 'All Questions' : selectedCategory}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No questions found matching your search.</p>
                <p className="text-sm mt-2">Try adjusting your search terms or selecting a different category.</p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFAQs.map((faq) => {
                  const CategoryIcon = getCategoryIcon(faq.category);
                  
                  return (
                    <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-start gap-3 text-left">
                          <CategoryIcon className="h-5 w-5 mt-0.5 text-brand-violet flex-shrink-0" />
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground">
                              {faq.question}
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getCategoryColor(faq.category)}`}
                              >
                                {faq.category}
                              </Badge>
                              {faq.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="pl-8">
                          <p className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                          {faq.tags.length > 2 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {faq.tags.slice(2).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Still need help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-md border p-4">
                <h3 className="font-medium mb-2">Contact Support</h3>
                <p className="text-sm text-muted-foreground">
                  Can't find what you're looking for? Reach out to our support team for personalized assistance.
                </p>
              </div>
              <div className="rounded-md border p-4">
                <h3 className="font-medium mb-2">Video Tutorials</h3>
                <p className="text-sm text-muted-foreground">
                  Check out our video guides for step-by-step walkthroughs of key features and workflows.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StandardLayout>
  );
};

export default FAQ;
