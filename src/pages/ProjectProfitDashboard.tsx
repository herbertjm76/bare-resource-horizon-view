
import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

const ProjectProfitDashboard: React.FC = () => {
  const projects = [
    {
      name: "Commercial Office Building",
      code: "COB-2024-001",
      budgetedProfit: 25000,
      actualProfit: 12500,
      profitMargin: 8.6,
      status: "On Track",
      variance: -50.0,
    },
    {
      name: "Residential Complex",
      code: "RES-2024-002", 
      budgetedProfit: 15000,
      actualProfit: -3200,
      profitMargin: -3.6,
      status: "At Risk",
      variance: -121.3,
    },
    {
      name: "Shopping Center Renovation",
      code: "SCR-2024-003",
      budgetedProfit: 35000,
      actualProfit: 45200,
      profitMargin: 19.2,
      status: "Exceeding",
      variance: 29.1,
    },
    {
      name: "Medical Center Extension",
      code: "MCE-2024-004",
      budgetedProfit: 42000,
      actualProfit: 41800,
      profitMargin: 16.7,
      status: "On Track",
      variance: -0.5,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Exceeding":
        return <Badge className="bg-green-100 text-green-800 border-green-200">{status}</Badge>;
      case "On Track":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">{status}</Badge>;
      case "At Risk":
        return <Badge className="bg-red-100 text-red-800 border-red-200">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (variance < -10) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
  };

  return (
    <StandardLayout title="Project Profit Dashboard">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Budgeted Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(117000).toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Actual Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(96300).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">-17.7%</span> variance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Profit Margin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10.2%</div>
              <p className="text-xs text-muted-foreground">Across all projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Projects at Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">1</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Profit Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Profit Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Profit trend chart will be implemented here
            </div>
          </CardContent>
        </Card>

        {/* Project Profit Table */}
        <Card>
          <CardHeader>
            <CardTitle>Project Profit Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">{project.code}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getVarianceIcon(project.variance)}
                      {getStatusBadge(project.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Budgeted Profit</p>
                      <p className="font-medium">${project.budgetedProfit.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Actual Profit</p>
                      <p className={`font-medium ${project.actualProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${project.actualProfit.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Profit Margin</p>
                      <p className={`font-medium ${project.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {project.profitMargin}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Variance</p>
                      <p className={`font-medium ${project.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {project.variance > 0 ? '+' : ''}{project.variance.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Profit Progress</span>
                      <span>{Math.abs(project.actualProfit / project.budgetedProfit * 100).toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={Math.min(Math.abs(project.actualProfit / project.budgetedProfit * 100), 100)} 
                      className="h-2"
                    />
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

export default ProjectProfitDashboard;
