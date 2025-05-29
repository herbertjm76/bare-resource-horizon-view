
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Lock, Eye, FileText, Users, Database, Mail, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const HEADER_HEIGHT = 56;

const PrivacyPolicyContent = () => {
  const lastUpdated = "December 2024";

  return (
    <div className="flex-1 p-4 sm:p-8 bg-gradient-to-br from-white via-gray-50/30 to-gray-100/20">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-brand-violet/10 rounded-full">
              <Shield className="h-8 w-8 text-brand-violet" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-brand-primary">
              Privacy Policy
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We are committed to protecting your privacy and ensuring the security of your personal information.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>

        <ScrollArea className="h-[70vh]">
          <div className="space-y-6 pr-4">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-brand-violet" />
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  BareResource ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our resource management platform.
                </p>
                <p className="text-gray-700">
                  By using BareResource, you agree to the collection and use of information in accordance with this policy.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-brand-violet" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Personal Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Name, email address, and contact information</li>
                    <li>Job title, department, and organizational role</li>
                    <li>Profile information and preferences</li>
                    <li>Authentication credentials</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Business Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Company name, size, and industry</li>
                    <li>Project data and resource allocations</li>
                    <li>Team structure and organizational hierarchy</li>
                    <li>Usage patterns and platform analytics</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Technical Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>IP address, browser type, and device information</li>
                    <li>Log data and usage statistics</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Your Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-brand-violet" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Provide and maintain our resource management services</li>
                  <li>Process transactions and manage your account</li>
                  <li>Send important notifications and updates</li>
                  <li>Improve our platform and develop new features</li>
                  <li>Ensure security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                  <li>Provide customer support and technical assistance</li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Sharing and Disclosure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-brand-violet" />
                  Data Sharing and Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Service Providers:</strong> Trusted third-party vendors who assist in operating our platform</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                  <li><strong>With Consent:</strong> When you explicitly authorize such sharing</li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-brand-violet" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  We implement industry-standard security measures to protect your information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Encryption in transit and at rest</li>
                  <li>Regular security audits and assessments</li>
                  <li>Access controls and authentication requirements</li>
                  <li>Secure data centers with physical security measures</li>
                  <li>Employee training on data protection best practices</li>
                </ul>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-brand-violet" />
                  Your Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Depending on your location, you may have the following rights regarding your personal data:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Access:</strong> Request information about the data we hold about you</li>
                  <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data</li>
                  <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a structured format</li>
                  <li><strong>Restriction:</strong> Request limitation of processing in certain circumstances</li>
                  <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing</li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-brand-violet" />
                  Data Retention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. When data is no longer needed, we securely delete or anonymize it.
                </p>
              </CardContent>
            </Card>

            {/* Cookies and Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-brand-violet" />
                  Cookies and Tracking Technologies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  We use cookies and similar technologies to enhance your experience:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                </ul>
                <p className="text-gray-700">
                  You can control cookie settings through your browser preferences.
                </p>
              </CardContent>
            </Card>

            {/* International Transfers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-brand-violet" />
                  International Data Transfers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable data protection laws.
                </p>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-brand-violet" />
                  Children's Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Our service is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If we become aware of such collection, we will take steps to delete the information.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-brand-violet" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="text-gray-700"><strong>Email:</strong> privacy@bareresource.com</p>
                  <p className="text-gray-700"><strong>Address:</strong> [Your Company Address]</p>
                  <p className="text-gray-700"><strong>Response Time:</strong> We will respond to your request within 30 days</p>
                </div>
              </CardContent>
            </Card>

            {/* Changes to Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-brand-violet" />
                  Changes to This Privacy Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

const PrivacyPolicy = () => {
  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row bg-gradient-to-br from-gray-50 to-white">
        <div className="flex-shrink-0">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div style={{ height: HEADER_HEIGHT }} />
          <PrivacyPolicyContent />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PrivacyPolicy;
