
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ProjectAreaFormValues, ProjectArea } from "./projectAreaTypes";
import { colorPalette, ColorPicker } from './ColorPicker';

interface ProjectAreaFormProps {
  open: boolean;
  loading: boolean;
  editing: ProjectArea | null;
  form: UseFormReturn<ProjectAreaFormValues>;
  onSubmit: (values: ProjectAreaFormValues) => Promise<void>;
  onOpenChange: (open: boolean) => void;
}

const ProjectAreaForm: React.FC<ProjectAreaFormProps> = ({
  open,
  loading,
  editing,
  form,
  onSubmit,
  onOpenChange,
}) => {
  // Initialize with first color if no color is set
  React.useEffect(() => {
    if (!form.getValues('color') && !editing?.color) {
      form.setValue('color', colorPalette[0]);
    } else if (editing?.color) {
      // Make sure the editing color is set in the form
      form.setValue('color', editing.color);
    }
  }, [form, editing]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? 'Edit Project Area' : 'Add New Project Area'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area Code</FormLabel>
                  <FormControl>
                    <Input placeholder="NYC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="United States" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input placeholder="North America" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="New York" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <ColorPicker
                      selectedColor={field.value || colorPalette[0]}
                      onColorChange={(color) => field.onChange(color)}
                      className="mt-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-4">
              <Button type="submit" disabled={loading}>
                {editing ? 'Update Area' : 'Add Area'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectAreaForm;
