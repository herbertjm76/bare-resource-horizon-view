
import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EditableProjectField } from './EditableProjectField';

interface EditProjectFormProps {
  projectId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EditProjectForm: React.FC<EditProjectFormProps> = ({
  projectId,
  onSuccess,
  onCancel
}) => {
  const form = useForm();
  const [isLoading, setIsLoading] = React.useState(false);
  const [project, setProject] = React.useState<any>(null);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) {
        toast.error('Failed to load project');
        onCancel();
        return;
      }

      setProject(data);
      form.reset(data);
    };

    fetchProject();
  }, [projectId]);

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          name: values.name,
          code: values.code,
          target_profit_percentage: values.target_profit_percentage,
          country: values.country,
          current_stage: values.current_stage,
        })
        .eq('id', projectId);

      if (error) throw error;
      onSuccess();
    } catch (error: any) {
      toast.error('Failed to update project', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!project) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Code</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="target_profit_percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Profit %</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};
