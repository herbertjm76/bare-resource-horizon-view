import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Skeleton for summary cards row
export const SummaryCardsSkeleton = () => (
  <div className="px-1.5 sm:px-2 py-2 border rounded-lg bg-gradient-to-br from-card to-accent/20">
    <div className="hidden sm:flex gap-2">
      {/* Week info card skeleton */}
      <div className="flex-shrink-0 w-[180px] h-[120px]">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>
      {/* Other cards */}
      {[1, 2, 3, 4].map((i) => (
        <div 
          key={i} 
          className="flex-shrink-0 w-[180px] h-[120px] opacity-0 animate-[cascadeUp_0.5s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards]"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
      ))}
    </div>
    {/* Mobile */}
    <div className="block sm:hidden h-[20vh] min-h-[120px]">
      <Skeleton className="w-full h-full rounded-lg" />
    </div>
  </div>
);

// Skeleton for available members row
export const AvailableMembersSkeleton = () => (
  <div className="p-3 border rounded-lg bg-card">
    <div className="flex items-center gap-2 mb-3">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-5 w-8 rounded-full" />
    </div>
    <div className="flex gap-3 overflow-hidden">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div 
          key={i} 
          className="flex flex-col items-center gap-1.5 opacity-0 animate-[cascadeUp_0.5s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards]"
          style={{ animationDelay: `${i * 30}ms` }}
        >
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  </div>
);

// Skeleton for controls bar
export const ControlsSkeleton = () => (
  <div className="flex items-center justify-between gap-2 p-2 border rounded-lg bg-card">
    <div className="flex items-center gap-2">
      <Skeleton className="h-9 w-[140px] rounded-md" />
      <Skeleton className="h-9 w-9 rounded-md" />
      <Skeleton className="h-9 w-9 rounded-md" />
    </div>
    <div className="flex items-center gap-2">
      <Skeleton className="h-9 w-24 rounded-md" />
      <Skeleton className="h-9 w-9 rounded-md" />
    </div>
  </div>
);

// Skeleton for table view
export const TableViewSkeleton = () => (
  <div className="border rounded-lg bg-card overflow-hidden">
    {/* Header */}
    <div className="flex border-b bg-muted/30 p-2 gap-2">
      <Skeleton className="h-8 w-[200px]" />
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-8 w-[100px]" />
      ))}
    </div>
    {/* Rows */}
    {[1, 2, 3, 4, 5, 6].map((row) => (
      <div 
        key={row} 
        className="flex border-b p-2 gap-2 opacity-0 animate-[cascadeUp_0.5s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards]"
        style={{ animationDelay: `${row * 50}ms` }}
      >
        <div className="flex items-center gap-2 w-[200px]">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        {[1, 2, 3, 4, 5].map((col) => (
          <Skeleton key={col} className="h-6 w-[100px]" />
        ))}
      </div>
    ))}
  </div>
);

// Skeleton for grid view
export const GridViewSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div 
        key={i} 
        className="opacity-0 animate-[cascadeUp_0.5s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards]"
        style={{ animationDelay: `${i * 60}ms` }}
      >
        <div className="border rounded-xl p-4 bg-card">
          <div className="flex items-center gap-3 mb-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="h-6 w-full rounded-lg mb-3" />
          <div className="space-y-1.5">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-10 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Complete page skeleton
export const WeeklyOverviewSkeleton = () => (
  <div className="space-y-4 p-4">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-7 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-9 w-9 rounded-md" />
    </div>

    {/* Summary cards */}
    <div 
      className="opacity-0 animate-[cascadeUp_0.5s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards]"
      style={{ animationDelay: '50ms' }}
    >
      <SummaryCardsSkeleton />
    </div>

    {/* Available members */}
    <div 
      className="opacity-0 animate-[cascadeUp_0.5s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards]"
      style={{ animationDelay: '150ms' }}
    >
      <AvailableMembersSkeleton />
    </div>

    {/* Controls */}
    <div 
      className="opacity-0 animate-[cascadeUp_0.5s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards]"
      style={{ animationDelay: '250ms' }}
    >
      <ControlsSkeleton />
    </div>

    {/* Table/Grid */}
    <div 
      className="opacity-0 animate-[cascadeUp_0.5s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards]"
      style={{ animationDelay: '350ms' }}
    >
      <TableViewSkeleton />
    </div>
  </div>
);

