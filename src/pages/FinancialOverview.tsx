
import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Target, PieChart } from 'lucide-react';

const FinancialOverview: React.FC = () => {
  return (
    <StandardLayout title="Financial Overview">
      <div className="space-y-6">
        {/* Key Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,847,500</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.5%</span> from last quarter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Total Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$426,750</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.3%</span> from last quarter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Profit Margin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15.8%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-yellow-600">-1.2%</span> from last quarter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">+3</span> new this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Financial Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Chart visualization will be implemented here
            </div>
          </CardContent>
        </Card>

        {/* Project Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Project Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Commercial Office Building</h4>
                  <p className="text-sm text-muted-foreground">COB-2024-001</p>
                </div>
                <div className="text-right">
                  <div className="font-medium">$145,000</div>
                  <div className="text-sm text-green-600">+$12,500 profit</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Residential Complex</h4>
                  <p className="text-sm text-muted-foreground">RES-2024-002</p>
                </div>
                <div className="text-right">
                  <div className="font-medium">$89,500</div>
                  <div className="text-sm text-red-600">-$3,200 loss</div>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Shopping Center Renovation</h4>
                  <p className="text-sm text-muted-foreground">SCR-2024-003</p>
                </div>
                <div className="text-right">
                  <div className="font-medium">$235,750</div>
                  <div className="text-sm text-green-600">+$45,200 profit</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StandardLayout>
  );
};

export default FinancialOverview;
