import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { updatePracticeAreasFromMapping } from '@/scripts/processHKSPracticeAreas';
import { useState } from 'react';

export const UpdatePracticeAreasButton = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpdate = async () => {
    setIsProcessing(true);
    
    try {
      const results = await updatePracticeAreasFromMapping();
      
      console.log('Update results:', results);
      
      if (results.updated > 0) {
        toast.success(`Updated ${results.updated} team member(s) with practice areas`);
      }
      
      if (results.notFound.length > 0) {
        toast.warning(`Could not find ${results.notFound.length} team member(s): ${results.notFound.join(', ')}`);
        console.log('Not found:', results.notFound);
      }
      
      if (results.errors.length > 0) {
        toast.error(`${results.errors.length} error(s) occurred`);
        console.error('Errors:', results.errors);
      }
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update practice areas');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handleUpdate}
      disabled={isProcessing}
      variant="outline"
      size="sm"
    >
      {isProcessing ? 'Updating...' : 'Update Practice Areas from Excel'}
    </Button>
  );
};
