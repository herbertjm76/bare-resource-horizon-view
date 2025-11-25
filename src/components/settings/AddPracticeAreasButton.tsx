import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { addHKSPracticeAreas } from '@/scripts/addHKSPracticeAreas';

export const AddPracticeAreasButton = () => {
  const handleAdd = async () => {
    try {
      await addHKSPracticeAreas();
      toast.success('Practice areas added successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add practice areas');
    }
  };

  return (
    <Button onClick={handleAdd} variant="outline">
      Add HKS Practice Areas
    </Button>
  );
};
