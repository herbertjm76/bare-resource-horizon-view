import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIMappingResult {
  mappings: Record<string, string>;
  confidence: Record<string, number>;
  suggestions: string[];
}

export const useAIMapping = () => {
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiConfidence, setAiConfidence] = useState<Record<string, number>>({});

  const getAISuggestions = async (
    headers: string[], 
    sampleData: any[][]
  ): Promise<AIMappingResult | null> => {
    setIsLoadingAI(true);
    setAiSuggestions([]);
    setAiConfidence({});

    try {
      const { data, error } = await supabase.functions.invoke('import-excel-ai', {
        body: { headers, sampleData }
      });

      if (error) {
        console.error('AI mapping error:', error);
        toast.error('Failed to get AI suggestions');
        return null;
      }

      setAiSuggestions(data.suggestions || []);
      setAiConfidence(data.confidence || {});
      
      if (Object.keys(data.mappings).length > 0) {
        toast.success('AI mapping suggestions applied!');
      } else {
        toast.info('No automatic mappings found. Please map manually.');
      }

      return {
        mappings: data.mappings || {},
        confidence: data.confidence || {},
        suggestions: data.suggestions || []
      };
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      toast.error('Failed to analyze Excel file');
      return null;
    } finally {
      setIsLoadingAI(false);
    }
  };

  return {
    isLoadingAI,
    aiSuggestions,
    aiConfidence,
    getAISuggestions
  };
};
