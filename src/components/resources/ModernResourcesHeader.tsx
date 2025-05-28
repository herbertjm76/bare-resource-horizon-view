
import React from 'react';
import { Calendar, Filter, Search, BarChart3, Users, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from './filters/SearchInput';
import { FilterButton } from './filters/FilterButton';
import { MonthYearSelector } from './filters/MonthYearSelector';

interface ModernResourcesHeaderProps {
  title: string;
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterContent: React.ReactNode;
  activeFiltersCount: number;
  onClearFilters: () => void;
  totalProjects?: number;
  totalResources?: number;
  timeRange?: string;
}

export const ModernResourcesHeader: React.FC<ModernResourcesHeaderProps> = ({
  title,
  selectedMonth,
  onMonthChange,
  searchTerm,
  onSearchChange,
  filterContent,
  activeFiltersCount,
  onClearFilters,
  totalProjects = 0,
  totalResources = 0,
  timeRange = "30 days"
}) => {
  return (
    <div className="space-y-6 mb-6">
      {/* Main Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-brand-violet" />
            {title}
          </h1>
          <p className="text-muted-foreground text-lg">
            Visualize and manage project resource allocation across your timeline
          </p>
        </div>
        
        {/* Quick Stats Cards */}
        <div className="flex flex-wrap items-center gap-3">
          <Card className="px-4 py-2 bg-gradient-to-r from-brand-violet/10 to-brand-violet/5 border-brand-violet/20">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-brand-violet" />
              <div className="text-sm">
                <span className="font-semibold text-brand-violet">{totalResources}</span>
                <span className="text-muted-foreground ml-1">Resources</span>
              </div>
            </div>
          </Card>
          
          <Card className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-600" />
              <div className="text-sm">
                <span className="font-semibold text-emerald-600">{totalProjects}</span>
                <span className="text-muted-foreground ml-1">Projects</span>
              </div>
            </div>
          </Card>
          
          <Card className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div className="text-sm">
                <span className="font-semibold text-blue-600">{timeRange}</span>
                <span className="text-muted-foreground ml-1">View</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Enhanced Controls Section */}
      <Card className="p-4 bg-gradient-to-r from-white to-gray-50/50 border shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          {/* Date Selection */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <MonthYearSelector 
              selectedDate={selectedMonth} 
              onDateChange={onMonthChange}
            />
          </div>
          
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <Search className="h-4 w-4 text-muted-foreground" />
            <SearchInput
              value={searchTerm}
              onChange={onSearchChange}
              className="flex-1"
              placeholder="Search projects or resources..."
            />
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <FilterButton
              activeFiltersCount={activeFiltersCount}
              filterContent={filterContent}
              onClearFilters={onClearFilters}
              buttonText="Advanced Filters"
            />
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-brand-violet/10 text-brand-violet">
                {activeFiltersCount} active
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
