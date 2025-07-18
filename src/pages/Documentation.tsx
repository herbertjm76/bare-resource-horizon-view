
import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { BookOpen, ExternalLink, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Documentation = () => {
  const documentationSections = [
    {
      title: "Getting Started",
      description: "Learn the basics of resource planning and project management",
      items: [
        "Setting up your first project",
        "Adding team members",
        "Understanding resource allocation",
        "Managing weekly schedules"
      ]
    },
    {
      title: "Project Management",
      description: "Master project creation, stages, and resource planning",
      items: [
        "Creating and configuring projects",
        "Setting up project stages",
        "Managing project fees and rates",
        "Resource allocation strategies"
      ]
    },
    {
      title: "Team Management",
      description: "Effectively manage your team and their workloads",
      items: [
        "Inviting team members",
        "Setting roles and permissions",
        "Managing annual leave",
        "Tracking team utilization"
      ]
    },
    {
      title: "Office Settings",
      description: "Configure your workspace for optimal productivity",
      items: [
        "Setting up project areas",
        "Configuring office locations",
        "Managing departments and roles",
        "Holiday calendar setup"
      ]
    }
  ];

  return (
    <StandardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <StandardizedPageHeader
          title="Documentation"
          description="Comprehensive guides to help you master resource planning"
          icon={BookOpen}
        />

        {/* Quick Start Card */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Quick Start Guide</h3>
              <p className="text-muted-foreground mb-4">
                New to the platform? Start here to get up and running in minutes.
              </p>
              <div className="flex items-center text-blue-600 hover:text-blue-700 cursor-pointer">
                <span className="font-medium">Begin tutorial</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          </div>
        </Card>

        {/* Documentation Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          {documentationSections.map((section, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
              <p className="text-muted-foreground mb-4">{section.description}</p>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center gap-2 text-sm hover:text-blue-600 cursor-pointer">
                    <ChevronRight className="h-3 w-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Video Tutorials Section */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Video Tutorials</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="aspect-video bg-gray-200 rounded mb-3 flex items-center justify-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-4 border-l-white border-y-2 border-y-transparent ml-1"></div>
                </div>
              </div>
              <h4 className="font-medium mb-1">Platform Overview</h4>
              <p className="text-sm text-muted-foreground">5 min walkthrough</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="aspect-video bg-gray-200 rounded mb-3 flex items-center justify-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-4 border-l-white border-y-2 border-y-transparent ml-1"></div>
                </div>
              </div>
              <h4 className="font-medium mb-1">Resource Planning</h4>
              <p className="text-sm text-muted-foreground">8 min tutorial</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="aspect-video bg-gray-200 rounded mb-3 flex items-center justify-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-4 border-l-white border-y-2 border-y-transparent ml-1"></div>
                </div>
              </div>
              <h4 className="font-medium mb-1">Team Management</h4>
              <p className="text-sm text-muted-foreground">6 min guide</p>
            </div>
          </div>
        </Card>

        {/* External Resources */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Additional Resources</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div>
                <h4 className="font-medium">Best Practices Guide</h4>
                <p className="text-sm text-muted-foreground">Industry-standard resource planning strategies</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div>
                <h4 className="font-medium">API Documentation</h4>
                <p className="text-sm text-muted-foreground">Technical reference for developers</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div>
                <h4 className="font-medium">Release Notes</h4>
                <p className="text-sm text-muted-foreground">Latest updates and new features</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </Card>
      </div>
    </StandardLayout>
  );
};

export default Documentation;
