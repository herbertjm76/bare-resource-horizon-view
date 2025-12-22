import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface LeaveRequestCardSkeletonProps {
  showActions?: boolean;
}

export const LeaveRequestCardSkeleton: React.FC<LeaveRequestCardSkeletonProps> = ({ 
  showActions = false 
}) => {
  return (
    <Card className="transition-all">
      <CardContent className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
          {/* Member Info Skeleton */}
          <div className="flex items-center gap-3 lg:w-1/4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="min-w-0 space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>

          {/* Leave Details Skeleton */}
          <div className="flex-1 space-y-3">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Date and Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>

            {/* Remarks */}
            <Skeleton className="h-10 w-full rounded" />
          </div>

          {/* Actions Skeleton */}
          {showActions && (
            <div className="flex lg:flex-col gap-2 lg:w-auto">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
