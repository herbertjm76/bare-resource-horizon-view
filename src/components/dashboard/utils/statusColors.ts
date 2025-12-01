
/**
 * Status badge color utility for consistent styling across the application
 * Uses brand colors (purple/violet, blue, magenta/fuchsia) for general items
 * Uses pastel colors (green, orange, yellow-orange, red) for status indicators
 */

type StatusStyle = {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  className: string;
  icon?: React.ComponentType<{ className?: string }>;
};

// Update the type to allow for string values beyond our defined statuses
type StatusType = 'active' | 'pre_registered' | 'invited' | 'pending' | string;

// Brand colors for general status items
export const getStatusStyle = (status: StatusType): StatusStyle => {
  switch (status) {
    case 'active':
      return {
        label: 'Active',
        variant: 'default',
        className: 'bg-theme-primary hover:bg-theme-primary/80 border-transparent text-white'
      };
    case 'pre_registered':
      return {
        label: 'Pre-registered',
        variant: 'secondary',
        className: 'bg-blue-500 hover:bg-blue-500/80 border-transparent text-white'
      };
    case 'invited':
      return {
        label: 'Invited',
        variant: 'secondary',
        className: 'bg-fuchsia-500 hover:bg-fuchsia-500/80 border-transparent text-white'
      };
    case 'pending':
      return {
        label: 'Pending',
        variant: 'secondary',
        className: 'bg-fuchsia-500 hover:bg-fuchsia-500/80 border-transparent text-white'
      };
    default:
      return {
        label: typeof status === 'string' ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown',
        variant: 'secondary',
        className: 'bg-gray-500 hover:bg-gray-500/80 border-transparent text-white'
      };
  }
};
