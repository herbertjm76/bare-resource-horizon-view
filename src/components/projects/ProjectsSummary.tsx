
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Building2, Globe, AlertTriangle, CheckCircle } from 'lucide-react';

interface ProjectsSummaryProps {
  projects: any[];
}

export const ProjectsSummary: React.FC<ProjectsSummaryProps> = ({ projects }) => {
  // Calculate summary statistics
  const totalProjects = projects.length;
  
  // Status breakdown
  const statusStats = projects.reduce((acc, project) => {
    const status = project.status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activeProjects = (statusStats['In Progress'] || 0) + (statusStats['On-going'] || 0);
  const completedProjects = statusStats['Complete'] || statusStats['Completed'] || 0;
  const onHoldProjects = statusStats['On Hold'] || 0;
  const planningProjects = statusStats['Planning'] || statusStats['Not started'] || 0;

  // Country/Location breakdown
  const countryStats = projects.reduce((acc, project) => {
    const country = project.country || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCountries = Object.entries(countryStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  // Office breakdown
  const officeStats = projects.reduce((acc, project) => {
    const office = project.office?.name || 'Unassigned';
    acc[office] = (acc[office] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Profit calculations (where available)
  const projectsWithProfit = projects.filter(p => p.target_profit_percentage != null);
  const avgProfit = projectsWithProfit.length > 0 
    ? Math.round(projectsWithProfit.reduce((sum, p) => sum + (p.target_profit_percentage || 0), 0) / projectsWithProfit.length)
    : 0;

  // Risk assessment
  const riskProjects = onHoldProjects + planningProjects;
  const riskPercentage = totalProjects > 0 ? Math.round((riskProjects / totalProjects) * 100) : 0;

  return (
    <div className="mb-4 relative">
      {/* Glass morphism background container */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500" />
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />
        
        {/* Top highlight gradient */}
        <div className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(120%_30%_at_50%_0%,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_70%)]" />
        
        <div className="relative z-10 p-4">
          {/* Four rounded square cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Projects & Status */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-white/80">Total Projects</div>
                    <div className="text-xl font-bold text-white">{totalProjects}</div>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-3 w-3 text-green-300" />
                      <span className="text-white/90">Active</span>
                    </div>
                    <span className="font-medium text-white">{activeProjects}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="h-3 w-3 text-orange-300" />
                      <span className="text-white/90">Planning</span>
                    </div>
                    <span className="font-medium text-white">{planningProjects}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Performance */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-white/80">Avg Target Profit</div>
                    <div className="text-xl font-bold text-white">{avgProfit}%</div>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/90">Completed</span>
                    <span className="font-medium text-white">{completedProjects}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/90">On Hold</span>
                    <span className="font-medium text-white">{onHoldProjects}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Geographic Distribution */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <Globe className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-white/80">Countries</div>
                    <div className="text-xl font-bold text-white">{Object.keys(countryStats).length}</div>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  {topCountries.slice(0, 2).map(([country, count]) => (
                    <div key={country} className="flex items-center justify-between text-xs">
                      <span className="text-white/90">
                        {country === 'Unknown' ? 'Not specified' : country}
                      </span>
                      <span className="font-medium text-white">{count}</span>
                    </div>
                  ))}
                  
                  {Object.keys(countryStats).length > 2 && (
                    <div className="text-xs text-white/70">
                      +{Object.keys(countryStats).length - 2} more
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Office Distribution & Risk */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-white/80">Offices</div>
                    <div className="text-xl font-bold text-white">{Object.keys(officeStats).length}</div>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/90">Risk Level</span>
                    <Badge 
                      variant={riskPercentage > 30 ? "destructive" : riskPercentage > 15 ? "secondary" : "default"}
                      className={`text-xs px-2 py-0 ${
                        riskPercentage > 30 
                          ? 'bg-red-500/80 text-white border-red-400/50' 
                          : riskPercentage > 15
                          ? 'bg-orange-500/80 text-white border-orange-400/50'
                          : 'bg-green-500/80 text-white border-green-400/50'
                      }`}
                    >
                      {riskPercentage}%
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-white/70">
                    {riskPercentage > 30 
                      ? 'High risk projects' 
                      : riskPercentage > 15 
                      ? 'Moderate risk'
                      : 'Low risk portfolio'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
