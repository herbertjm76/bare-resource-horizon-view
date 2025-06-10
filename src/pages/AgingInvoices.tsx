
import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, AlertTriangle, Phone, Mail } from 'lucide-react';

const AgingInvoices: React.FC = () => {
  const invoices = [
    {
      invoiceNumber: "INV-2023-0156",
      project: "Medical Center Extension",
      client: "City Medical Group",
      amount: 18000,
      daysOverdue: 18,
      agingBucket: "15-30 days",
      issueDate: "2023-12-28",
      lastContact: "2024-01-10",
    },
    {
      invoiceNumber: "INV-2024-0003",
      project: "Retail Plaza Design", 
      client: "Plaza Development LLC",
      amount: 32500,
      daysOverdue: 45,
      agingBucket: "30-60 days",
      issueDate: "2023-12-01",
      lastContact: "2024-01-05",
    },
    {
      invoiceNumber: "INV-2023-0142",
      project: "Corporate Headquarters",
      client: "TechCorp Industries",
      amount: 67500,
      daysOverdue: 75,
      agingBucket: "60-90 days", 
      issueDate: "2023-11-01",
      lastContact: "2023-12-20",
    },
    {
      invoiceNumber: "INV-2023-0128",
      project: "Warehouse Expansion",
      client: "Logistics Partners",
      amount: 125000,
      daysOverdue: 120,
      agingBucket: "90+ days",
      issueDate: "2023-09-26",
      lastContact: "2023-11-15",
    },
  ];

  const getAgingBadge = (bucket: string) => {
    switch (bucket) {
      case "15-30 days":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">{bucket}</Badge>;
      case "30-60 days":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">{bucket}</Badge>;
      case "60-90 days":
        return <Badge className="bg-red-100 text-red-800 border-red-200">{bucket}</Badge>;
      case "90+ days":
        return <Badge className="bg-red-200 text-red-900 border-red-300">{bucket}</Badge>;
      default:
        return <Badge variant="outline">{bucket}</Badge>;
    }
  };

  const getPriorityLevel = (daysOverdue: number) => {
    if (daysOverdue >= 90) return { level: "Critical", color: "text-red-600", progress: 100 };
    if (daysOverdue >= 60) return { level: "High", color: "text-red-500", progress: 80 };
    if (daysOverdue >= 30) return { level: "Medium", color: "text-orange-500", progress: 60 };
    return { level: "Low", color: "text-yellow-600", progress: 40 };
  };

  const totalOverdue = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const criticalInvoices = invoices.filter(inv => inv.daysOverdue >= 90);

  return (
    <StandardLayout title="Aging Invoices">
      <div className="space-y-6">
        {/* Aging Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Total Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${totalOverdue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{invoices.length} invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">30-60 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${invoices.filter(inv => inv.agingBucket === "30-60 days").reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {invoices.filter(inv => inv.agingBucket === "30-60 days").length} invoices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">60-90 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${invoices.filter(inv => inv.agingBucket === "60-90 days").reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {invoices.filter(inv => inv.agingBucket === "60-90 days").length} invoices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Critical (90+ Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${criticalInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">{criticalInvoices.length} invoices</p>
            </CardContent>
          </Card>
        </div>

        {/* Aging Analysis Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Aging Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Aging distribution chart will be implemented here
            </div>
          </CardContent>
        </Card>

        {/* Invoice Details */}
        <Card>
          <CardHeader>
            <CardTitle>Overdue Invoice Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoices.map((invoice, index) => {
                const priority = getPriorityLevel(invoice.daysOverdue);
                return (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{invoice.invoiceNumber}</h4>
                        <p className="text-sm text-muted-foreground">{invoice.project}</p>
                        <p className="text-sm text-muted-foreground">{invoice.client}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`h-4 w-4 ${priority.color}`} />
                        {getAgingBadge(invoice.agingBucket)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="font-medium text-lg">${invoice.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Days Overdue</p>
                        <p className={`font-medium ${priority.color}`}>{invoice.daysOverdue} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Issue Date</p>
                        <p className="font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Contact</p>
                        <p className="font-medium">{new Date(invoice.lastContact).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Priority</p>
                        <p className={`font-medium ${priority.color}`}>{priority.level}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Collection Priority</span>
                        <span>{priority.level}</span>
                      </div>
                      <Progress value={priority.progress} className="h-2" />
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-1" />
                        Call Client
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4 mr-1" />
                        Send Notice
                      </Button>
                      <Button size="sm">Update Status</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </StandardLayout>
  );
};

export default AgingInvoices;
