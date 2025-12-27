import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock, Calendar, BarChart3 } from 'lucide-react';

export const LoadingDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* First Row: Dashboard Cards with skeleton loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Team Utilization Loading */}
        <Card className="rounded-2xl bg-card border border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-gray-400 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
            <div className="flex items-center justify-center mb-6">
              <div className="w-32 h-16 bg-gray-100 rounded-full animate-pulse"></div>
            </div>
            <div className="flex justify-center mb-2">
              <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
            </div>
            <div className="text-center">
              <div className="h-3 bg-gray-100 rounded w-16 mx-auto animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        {/* Workload Loading */}
        <Card className="rounded-2xl bg-card border border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-gray-400 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4, 5].map(j => (
                      <div key={j} className="h-6 bg-gray-100 rounded flex-1 animate-pulse" style={{ animationDelay: `${(i + j) * 100}ms` }}></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Leave Loading */}
        <Card className="rounded-2xl bg-card border border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-gray-400 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
            <div className="h-32 bg-gray-100 rounded-lg mb-4 animate-pulse"></div>
            <div className="grid grid-cols-7 gap-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="h-3 bg-gray-200 rounded w-full animate-pulse" style={{ animationDelay: `${i * 50}ms` }}></div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Pipeline Loading */}
        <Card className="rounded-2xl bg-card border border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-gray-400 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-28 animate-pulse"></div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-6 bg-gray-100 rounded-full w-8 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row: Loading cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="rounded-2xl bg-card border border-border shadow-sm">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map(j => (
                  <div key={j} className="h-3 bg-gray-100 rounded w-full animate-pulse" style={{ animationDelay: `${(i + j) * 150}ms` }}></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading text */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2 text-gray-500">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Loading dashboard data...</span>
        </div>
      </div>
    </div>
  );
};