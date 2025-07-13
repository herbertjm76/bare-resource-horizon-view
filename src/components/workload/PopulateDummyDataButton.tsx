import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export const PopulateDummyDataButton = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePopulateData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-dummy-hours');
      
      if (error) {
        console.error('Error generating dummy hours:', error);
        toast({
          title: 'Error',
          description: 'Failed to generate dummy hours. Please try again.',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Success',
        description: data.message || 'Dummy hours generated successfully!',
      });
    } catch (error) {
      console.error('Error calling function:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePopulateData}
      disabled={isLoading}
      variant="outline"
      size="sm"
    >
      {isLoading ? 'Generating...' : 'Populate Dummy Hours'}
    </Button>
  );
};