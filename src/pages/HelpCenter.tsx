import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { useCompany } from '@/context/CompanyContext';
import { ProcessDiagram } from '@/components/workflow/ProcessDiagram';
import { ExcelImportDialog } from '@/components/projects/ExcelImportDialog';
import { toast } from 'sonner';
import { 
  HelpCircle, 
  BookOpen, 
  MessageCircle,
  Send,
  Mail,
  FileText,
  Play,
  ExternalLink,
  Search,
  BarChart3,
  Users,
  Calendar,
  Settings,
  AlertTriangle,
  Target
} from 'lucide-react';

// FAQ Data
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

const faqData: FAQItem[] = [
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
    id: "project-1",
    question: "How do I create and manage project stages?",
    answer: "In the Projects section, you can define project stages with specific durations, fees, and resource requirements. Stages help break down projects into manageable phases and track progress through the project lifecycle.",
    category: "Project Management",
    tags: ["project-stages", "project-setup", "workflow"]
  },
  {
    id: "settings-1",
    question: "How do I set up different office locations?",
    answer: "In Office Settings, you can configure multiple office locations with their own holidays, working schedules, and settings. This is useful for companies with teams in different cities or countries with varying holiday calendars.",
    category: "Settings & Configuration",
    tags: ["office-locations", "multi-office", "configuration"]
  }
];

const categories = [
  { name: "All", icon: Search, color: "bg-muted text-foreground" },
  { name: "Dashboard & Metrics", icon: BarChart3, color: "bg-blue-100 text-blue-700" },
  { name: "Team Management", icon: Users, color: "bg-green-100 text-green-700" },
  { name: "Resource Planning", icon: Calendar, color: "bg-purple-100 text-purple-700" },
  { name: "Project Management", icon: Target, color: "bg-red-100 text-red-700" },
  { name: "Settings & Configuration", icon: Settings, color: "bg-indigo-100 text-indigo-700" },
  { name: "Troubleshooting", icon: AlertTriangle, color: "bg-yellow-100 text-yellow-700" }
];

// Documentation sections
const documentationSections = [
  {
    title: "Getting Started",
    description: "Essential guides to help you begin using the platform",
    items: [
      { title: "Quick Start Guide", description: "Get up and running in 5 minutes" },
      { title: "Dashboard Overview", description: "Understanding your main workspace" },
      { title: "User Roles & Permissions", description: "Managing team access" }
    ]
  },
  {
    title: "Project Management",
    description: "Learn how to manage projects effectively",
    items: [
      { title: "Creating Projects", description: "Set up new projects with stages and timelines" },
      { title: "Project Stages", description: "Define and track project phases" },
      { title: "Project Resources", description: "Allocate team members and track utilization" }
    ]
  },
  {
    title: "Resource Planning",
    description: "Optimize your team's capacity and workload",
    items: [
      { title: "Team Workload Management", description: "Balance workload across your team" },
      { title: "Capacity Planning", description: "Forecast resource needs" },
      { title: "Annual Leave Management", description: "Track and manage time off" }
    ]
  }
];

const HelpCenter = () => {
  const { company } = useCompany();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [formData, setFormData] = useState({
    subject: '',
    priority: '',
    category: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Support request submitted successfully! We\'ll get back to you within 24 hours.');
    setFormData({ subject: '', priority: '', category: '', message: '' });
    setIsSubmitting(false);
  };

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
    return category ? category.color : "bg-muted text-foreground";
  };

  const supportChannels = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      contact: "support@bareresource.com",
      responseTime: "We aim to respond within 24 hours"
    }
  ];

  return (
    <StandardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <StandardizedPageHeader
          title="Help Center"
          description="Documentation, FAQs, support, and getting started guides all in one place"
          icon={HelpCircle}
        />

        <Tabs defaultValue="getting-started" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="getting-started" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Getting Started
            </TabsTrigger>
            <TabsTrigger value="documentation" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Documentation
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Contact Support
            </TabsTrigger>
          </TabsList>

          {/* Getting Started Tab */}
          <TabsContent value="getting-started" className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Get Started</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose how you'd like to begin: import existing data or follow our step-by-step workflow
              </p>
            </div>

            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Quick Start: Import Your Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Already have your data in Excel? Import your projects, team members, and allocations to get started quickly.
                </p>
                <div className="flex flex-wrap gap-3">
                  <ExcelImportDialog
                    trigger={
                      <Button variant="default">
                        <FileText className="h-4 w-4 mr-2" />
                        Import Excel File
                      </Button>
                    }
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Supported formats: .xlsx, .xls, .csv
                </div>
              </CardContent>
            </Card>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or follow the workflow</span>
              </div>
            </div>
            
            <ProcessDiagram />
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="documentation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Start Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  New to the platform? Start here for a comprehensive walkthrough of the key features.
                </p>
                <Button variant="outline">
                  <Play className="h-4 w-4 mr-2" />
                  Start Tutorial
                </Button>
              </CardContent>
            </Card>

            {documentationSections.map((section, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                        <FileText className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Video Tutorials
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-lg border p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                    <h4 className="font-medium mb-1">Dashboard Overview (5:30)</h4>
                    <p className="text-sm text-muted-foreground">Learn how to navigate the main dashboard</p>
                  </div>
                  <div className="rounded-lg border p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                    <h4 className="font-medium mb-1">Resource Planning (8:15)</h4>
                    <p className="text-sm text-muted-foreground">Master resource allocation</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
                    Additional Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-lg border p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                    <h4 className="font-medium mb-1">API Documentation</h4>
                    <p className="text-sm text-muted-foreground">Integration guides and API reference</p>
                  </div>
                  <div className="rounded-lg border p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                    <h4 className="font-medium mb-1">Release Notes</h4>
                    <p className="text-sm text-muted-foreground">What's new and updated</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
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
                            ? 'bg-primary text-primary-foreground' 
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

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedCategory === 'All' ? 'All Questions' : selectedCategory}
                </CardTitle>
                <Badge variant="outline" className="text-sm w-fit">
                  {filteredFAQs.length} {filteredFAQs.length === 1 ? 'Question' : 'Questions'}
                </Badge>
              </CardHeader>
              <CardContent>
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No questions found matching your search.</p>
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="space-y-4">
                    {filteredFAQs.map((faq) => {
                      const CategoryIcon = getCategoryIcon(faq.category);
                      return (
                        <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg">
                          <AccordionTrigger className="px-4 py-3 hover:no-underline">
                            <div className="flex items-start gap-3 text-left">
                              <CategoryIcon className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                              <div className="flex-1">
                                <h3 className="font-medium">{faq.question}</h3>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className={`text-xs ${getCategoryColor(faq.category)}`}>
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
                              <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <div className="grid gap-8 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Submit a Support Request</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Subject</label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Brief description of your issue"
                        required
                      />
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">Priority</label>
                        <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">Technical Issue</SelectItem>
                            <SelectItem value="billing">Billing Question</SelectItem>
                            <SelectItem value="feature">Feature Request</SelectItem>
                            <SelectItem value="training">Training/How-to</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Message</label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Please provide details about your issue or question..."
                        rows={6}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>Submitting...</>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Request
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Other Ways to Reach Us</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {supportChannels.map((channel, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <channel.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{channel.title}</h4>
                          <p className="text-sm text-muted-foreground mb-1">{channel.description}</p>
                          <p className="text-sm font-medium text-primary">{channel.contact}</p>
                          <p className="text-xs text-muted-foreground mt-1">{channel.responseTime}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {company && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Your Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Company</span>
                          <span className="font-medium">{company.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Plan</span>
                          <span className="font-medium">Professional</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Support Level</span>
                          <span className="font-medium text-green-600">Priority</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </StandardLayout>
  );
};

export default HelpCenter;
