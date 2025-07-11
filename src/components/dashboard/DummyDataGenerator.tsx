import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DummyDataService } from '@/services/dummyDataService';
import { toast } from 'sonner';
import { Loader2, Zap } from 'lucide-react';

export const DummyDataGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDummyHours = async () => {
    setIsGenerating(true);
    
    try {
      const result = await DummyDataService.generateJulyHours();
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error || 'Failed to generate dummy data');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          AI Data Generator
        </CardTitle>
        <CardDescription>
          Generate realistic dummy hour allocations for July 2025 across your projects and team members.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleGenerateDummyHours}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate July Hours'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};