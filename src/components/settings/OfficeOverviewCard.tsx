
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { useCompany } from '@/context/CompanyContext';
import { useOfficeSettings } from '@/context/officeSettings';

export const OfficeOverviewCard: React.FC = () => {
  const { company } = useCompany();
  const { 
    departments = [], 
    roles = [], 
    locations = [], 
    projectAreas = [] 
  } = useOfficeSettings();

  const getMetrics = () => {
    return [
      {
        title: "Departments",
        value: departments.length,
        badgeText: departments.length > 0 ? "Active" : "Setup Needed",
        badgeColor: departments.length > 0 ? "green" : "orange"
      },
      {
        title: "Roles", 
        value: roles.length,
        badgeText: roles.length > 0 ? "Configured" : "Setup Needed",
        badgeColor: roles.length > 0 ? "blue" : "orange"
      },
      {
        title: "Locations",
        value: locations.length,
        badgeText: locations.length > 1 ? "Multi-Site" : locations.length === 1 ? "Single Site" : "Setup Needed",
        badgeColor: locations.length > 1 ? "green" : locations.length === 1 ? "blue" : "orange"
      },
      {
        title: "Project Areas",
        value: projectAreas.length,
        badgeText: projectAreas.length > 0 ? "Defined" : "Setup Needed",
        badgeColor: projectAreas.length > 0 ? "green" : "orange"
      }
    ];
  };

  const getBadgeVariant = (color?: string) => {
    switch (color) {
      case 'red': return 'destructive';
      case 'orange': return 'secondary';
      case 'green': return 'default';
      case 'blue': return 'outline';
      default: return 'outline';
    }
  };

  const getBadgeBackgroundColor = (badgeColor?: string) => {
    switch (badgeColor) {
      case 'green': return 'bg-green-500/80 border-green-400/40';
      case 'red': return 'bg-red-500/80 border-red-400/40';
      case 'orange': return 'bg-orange-500/80 border-orange-400/40';
      case 'blue': return 'bg-blue-500/80 border-blue-400/40';
      default: return 'bg-white/20 border-white/30';
    }
  };

  const metrics = getMetrics();

  return (
    <div 
      className="rounded-3xl p-5 border-2"
      style={{
        background: 'linear-gradient(to right, #eef2ff, #fdf2ff)',
        borderImage: 'linear-gradient(to right, #eef2ff, #fdf2ff) 1',
        borderColor: 'transparent'
      }}
    >
      <div className="flex flex-wrap gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="flex-1 min-w-0">
            <Card className="bg-white/90 border border-zinc-300 rounded-xl transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-4">
                <div className="text-center">
                  {/* Title - gray-800, medium weight */}
                  <Typography variant="body-sm" className="font-medium text-gray-800 mb-2">
                    {metric.title}
                  </Typography>
                  
                  {/* Value - bold, 4xl, gray-900 */}
                  <div className="text-4xl font-bold text-gray-900 mb-3">
                    {metric.value}
                  </div>
                  
                  {/* Colored status pill */}
                  <Badge 
                    variant={getBadgeVariant(metric.badgeColor)} 
                    className={`text-xs text-white backdrop-blur-sm ${getBadgeBackgroundColor(metric.badgeColor)}`}
                  >
                    {metric.badgeText}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
