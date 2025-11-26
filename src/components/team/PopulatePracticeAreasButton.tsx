import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { populatePracticeAreasFromTeamMembers } from '@/scripts/populatePracticeAreas';
import { useState } from 'react';
import { Lightbulb } from 'lucide-react';

export const PopulatePracticeAreasButton = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePopulate = async () => {
    setIsProcessing(true);
    
    try {
      const result = await populatePracticeAreasFromTeamMembers();
      
      if (result.added > 0) {
        toast.success(result.message, {
          description: `Added: ${result.practiceAreas?.join(', ')}`
        });
      } else {
        toast.info(result.message);
      }
      
      // Refresh the page to show updated count
      setTimeout(() => window.location.reload(), 1500);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to populate practice areas');
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
      <Lightbulb className="h-4 w-4 mr-2" />
      {isProcessing ? 'Syncing...' : 'Sync Practice Areas'}
    </Button>
  );
};
