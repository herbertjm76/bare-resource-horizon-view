
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { MessageCircle, Mail, Phone, Clock, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';

const HEADER_HEIGHT = 56;

const ContactSupport = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { company } = useCompany();
  const [formData, setFormData] = useState({
    subject: '',
    priority: '',
    category: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Support request submitted successfully! We\'ll get back to you within 24 hours.');
    setFormData({ subject: '', priority: '', category: '', message: '' });
    setIsSubmitting(false);
  };

  const supportChannels = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      contact: "support@bareresource.com",
      responseTime: "Within 24 hours"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Real-time assistance",
      contact: "Available in-app",
      responseTime: "Instant response"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak with our team",
      contact: "+1 (555) 123-4567",
      responseTime: "Business hours only"
    }
  ];

  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row">
        <div className="flex-shrink-0">
          <DashboardSidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
        </div>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div style={{ height: HEADER_HEIGHT }} />
          <div className="flex-1 p-4 sm:p-8 bg-background">
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Header Section */}
              <div className="space-y-6 mb-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="space-y-2">
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary flex items-center gap-3">
                      <MessageCircle className="h-8 w-8 text-brand-violet" />
                      Contact Support
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      Get help when you need it. We're here to support your success.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                {/* Contact Form */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Submit a Support Request</h3>
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
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
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
                </Card>

                {/* Support Channels */}
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Other Ways to Reach Us</h3>
                    <div className="space-y-4">
                      {supportChannels.map((channel, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <channel.icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{channel.title}</h4>
                            <p className="text-sm text-muted-foreground mb-1">{channel.description}</p>
                            <p className="text-sm font-medium text-blue-600">{channel.contact}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{channel.responseTime}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Support Hours */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-3">Support Hours</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday</span>
                        <span className="font-medium">10:00 AM - 2:00 PM EST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday</span>
                        <span className="text-muted-foreground">Closed</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <strong>Emergency Support:</strong> Critical issues are handled 24/7 for Enterprise customers.
                      </p>
                    </div>
                  </Card>

                  {/* Company Info */}
                  {company && (
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-3">Your Account</h3>
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
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ContactSupport;
