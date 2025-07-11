import { supabase } from "@/integrations/supabase/client";

export class DummyDataService {
  static async generateJulyHours(): Promise<{ success: boolean; message: string; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-dummy-hours', {
        body: {}
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error generating dummy hours:', error);
      return {
        success: false,
        message: 'Failed to generate dummy hours',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}