import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { populateDepartmentsFromTeamMembers } from '@/scripts/populateDepartments';
import { useState } from 'react';
import { Building2 } from 'lucide-react';

export const PopulateDepartmentsButton = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePopulate = async () => {
    setIsProcessing(true);
    
    try {
      const result = await populateDepartmentsFromTeamMembers();
      
      if (result.added > 0) {
        toast.success(result.message, {
          description: `Added: ${result.departments?.join(', ')}`
        });
      } else {
        toast.info(result.message);
      }
      
      // Refresh the page to show updated count
      setTimeout(() => window.location.reload(), 1500);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to populate departments');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handlePopulate}
      disabled={isProcessing}
      variant="outline"
      size="sm"
    >
      <Building2 className="h-4 w-4 mr-2" />
      {isProcessing ? 'Syncing...' : 'Sync Departments'}
    </Button>
  );
};
