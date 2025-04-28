
/**
 * Status badge color utility for consistent styling across the application
 */

type StatusStyle = {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  className: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type StatusType = 'active' | 'pre_registered' | 'invited' | 'pending';

// Consistent color palette for status badges
export const getStatusStyle = (status: StatusType): StatusStyle => {
  switch (status) {
    case 'active':
      return {
        label: 'Active',
        variant: 'default',
        className: 'bg-[#D946EF] hover:bg-[#D946EF]/80 border-transparent text-white'
      };
    case 'pre_registered':
      return {
        label: 'Pre-registered',
        variant: 'secondary',
        className: 'bg-[#5669F7] hover:bg-[#5669F7]/80 border-transparent text-white'
      };
    case 'invited':
      return {
        label: 'Invited',
        variant: 'secondary',
        className: 'bg-[#8E9196] hover:bg-[#8E9196]/80 border-transparent text-white'
      };
    case 'pending':
      return {
        label: 'Pending',
        variant: 'secondary',
        className: 'bg-[#8E9196] hover:bg-[#8E9196]/80 border-transparent text-white'
      };
    default:
      return {
        label: status.charAt(0).toUpperCase() + status.slice(1),
        variant: 'secondary',
        className: 'bg-[#8E9196] hover:bg-[#8E9196]/80 border-transparent text-white'
      };
  }
};
