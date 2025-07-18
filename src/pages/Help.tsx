
import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { HelpCircle, BookOpen, MessageCircle, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Help = () => {
  return (
    <StandardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <StandardizedPageHeader
          title="Help & Support"
          description="Resources and guidance to help you use the platform effectively"
          icon={HelpCircle}
        />

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
    </StandardLayout>
  );
};

export default Help;
