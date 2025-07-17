
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, X, Expand, Minimize2, Calendar } from 'lucide-react';
import { WeekStartSelector } from '@/components/workload/WeekStartSelector';

interface WeekResourceHeaderProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
  weekLabel: string;
  filters: {
    office: string;
    searchTerm: string;
  };
  onFilterChange: (key: string, value: string) => void;
  activeFiltersCount: number;
  clearFilters: () => void;
  viewMode: 'compact' | 'expanded';
  onViewModeChange: (mode: 'compact' | 'expanded') => void;
}

export const WeekResourceHeader: React.FC<WeekResourceHeaderProps> = ({
  selectedWeek,
  onWeekChange,
  weekLabel,
  filters,
  onFilterChange,
  activeFiltersCount,
  clearFilters,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Main Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary flex items-center gap-3">
            <Calendar className="h-8 w-8 text-brand-violet" />
            Weekly Overview
          </h1>
          <p className="text-muted-foreground">
            View and manage weekly resource allocations for your team
          </p>
        </div>
      </div>
      
      {/* Enhanced Controls Section */}
      <Card className="p-4 bg-gradient-to-r from-white to-gray-50/50 border shadow-sm">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            {/* Week Selection */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <WeekStartSelector
                selectedWeek={selectedWeek}
                onWeekChange={onWeekChange}
              />
            </div>
            
            {/* Search */}
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="h-4 w-4 text-muted-foreground" />
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search members..."
                  value={filters.searchTerm}
                  onChange={(e) => onFilterChange('searchTerm', e.target.value)}
                  className="pl-8 h-9 text-sm"
                />
              </div>
            </div>
            
            {/* Office Filter */}
            <div className="flex items-center gap-2">
              <Select value={filters.office} onValueChange={(value) => onFilterChange('office', value)}>
                <SelectTrigger className="w-36 h-9 text-sm">
                  <SelectValue placeholder="Filter by office..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Offices</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* View Mode Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'compact' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onViewModeChange('compact')}
                className="h-9 px-3 text-sm"
              >
                <Minimize2 className="h-4 w-4 mr-1" />
                Compact
              </Button>
              <Button
                variant={viewMode === 'expanded' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onViewModeChange('expanded')}
                className="h-9 px-3 text-sm"
              >
                <Expand className="h-4 w-4 mr-1" />
                Expanded
              </Button>
            </div>
            
            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-brand-violet/10 text-brand-violet">
                  {activeFiltersCount} active
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-9 px-2 text-sm"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
