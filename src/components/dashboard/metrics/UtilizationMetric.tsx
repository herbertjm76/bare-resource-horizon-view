
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UtilizationMetricProps {
  periods: readonly ['7 Days', '30 Days', '90 Days'];
  utilizationRate: {
    week: number;
    month: number;
    quarter: number;
  };
}

export const UtilizationMetric = ({ periods, utilizationRate }: UtilizationMetricProps) => {
  return (
    <Card className="col-span-6">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-700">Resource Utilization Trends</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between gap-4">
        {periods.map((period) => (
          <div key={period} className="text-center">
            <div className="mb-2 text-sm text-gray-600">{period}</div>
            <div className="relative h-24 w-24">
              <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-100"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-blue-500"
                  strokeWidth="8"
                  strokeDasharray={`${utilizationRate[period === '7 Days' ? 'week' : period === '30 Days' ? 'month' : 'quarter'] * 2.51327} 251.327`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-900">
                  {utilizationRate[period === '7 Days' ? 'week' : period === '30 Days' ? 'month' : 'quarter']}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
