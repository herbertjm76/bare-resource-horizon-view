
import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Receipt, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ProjectBilling: React.FC = () => {
  const billingData = [
    {
      project: "Commercial Office Building",
      code: "COB-2024-001",
      stage: "Schematic Design",
      amount: 35000,
      status: "Ready to Bill",
      dueDate: "2024-01-15",
      invoiceNumber: null,
    },
    {
      project: "Residential Complex", 
      code: "RES-2024-002",
      stage: "Design Development",
      amount: 28500,
      status: "Billed",
      dueDate: "2024-01-20",
      invoiceNumber: "INV-2024-0012",
    },
    {
      project: "Shopping Center Renovation",
      code: "SCR-2024-003", 
      stage: "Construction Documents",
      amount: 52000,
      status: "Paid",
      dueDate: "2024-01-10",
      invoiceNumber: "INV-2024-0008",
    },
    {
      project: "Medical Center Extension",
      code: "MCE-2024-004",
      stage: "Planning",
      amount: 18000,
      status: "Overdue",
      dueDate: "2023-12-28",
      invoiceNumber: "INV-2023-0156",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Ready to Bill":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">{status}</Badge>;
      case "Billed":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">{status}</Badge>;
      case "Paid":
        return <Badge className="bg-green-100 text-green-800 border-green-200">{status}</Badge>;
      case "Overdue":
        return <Badge className="bg-red-100 text-red-800 border-red-200">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Ready to Bill":
        return <Receipt className="h-4 w-4 text-blue-600" />;
      case "Billed":
        return <Send className="h-4 w-4 text-yellow-600" />;
      case "Paid":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const totalReadyToBill = billingData
    .filter(item => item.status === "Ready to Bill")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalOutstanding = billingData
    .filter(item => item.status === "Billed" || item.status === "Overdue")
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <StandardLayout title="Project Billing">
      <div className="space-y-6">
        {/* Billing Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Ready to Bill
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalReadyToBill.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {billingData.filter(item => item.status === "Ready to Bill").length} items
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Send className="h-4 w-4" />
                Outstanding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalOutstanding.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {billingData.filter(item => item.status === "Billed" || item.status === "Overdue").length} invoices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${billingData.filter(item => item.status === "Overdue").reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {billingData.filter(item => item.status === "Overdue").length} overdue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Collected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${billingData.filter(item => item.status === "Paid").reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button>
                <Receipt className="h-4 w-4 mr-2" />
                Generate Invoices
              </Button>
              <Button variant="outline">
                <Send className="h-4 w-4 mr-2" />
                Send Reminders
              </Button>
              <Button variant="outline">
                View Payment Reports
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Billing Table */}
        <Card>
          <CardHeader>
            <CardTitle>Project Billing Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {billingData.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{item.project}</h4>
                      <p className="text-sm text-muted-foreground">{item.code} - {item.stage}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      {getStatusBadge(item.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="font-medium text-lg">${item.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Due Date</p>
                      <p className={`font-medium ${item.status === "Overdue" ? 'text-red-600' : ''}`}>
                        {new Date(item.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Invoice Number</p>
                      <p className="font-medium">{item.invoiceNumber || "Not Generated"}</p>
                    </div>
                    <div className="flex justify-end">
                      {item.status === "Ready to Bill" && (
                        <Button size="sm">Generate Invoice</Button>
                      )}
                      {item.status === "Billed" && (
                        <Button size="sm" variant="outline">Send Reminder</Button>
                      )}
                      {item.status === "Overdue" && (
                        <Button size="sm" variant="destructive">Follow Up</Button>
                      )}
                      {item.status === "Paid" && (
                        <Button size="sm" variant="outline" disabled>Completed</Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </StandardLayout>
  );
};

export default ProjectBilling;
