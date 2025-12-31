import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { matchPracticeAreasFromExcel, updatePracticeAreasInDatabase } from '@/scripts/matchPracticeAreas';
import { logger } from '@/utils/logger';

export const PracticeAreaMatcher = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setResults(null);

    try {
      // Parse Excel and extract mappings
      const mappings = await matchPracticeAreasFromExcel(file);
      
      logger.log('Extracted mappings:', mappings);
      toast.info(`Found ${mappings.length} people in Excel file`);

      // Update database
      const updateResults = await updatePracticeAreasInDatabase(mappings);
      
      setResults(updateResults);
      
      if (updateResults.updated > 0) {
        toast.success(`Updated ${updateResults.updated} team member(s)`);
      }
      
      if (updateResults.errors.length > 0) {
        toast.error(`${updateResults.errors.length} error(s) occurred`);
        logger.error('Errors:', updateResults.errors);
      }
      
      if (updateResults.skipped > 0) {
        toast.info(`Skipped ${updateResults.skipped} person(s) without practice area`);
      }
      
    } catch (error) {
      logger.error('Error:', error);
      toast.error('Failed to process Excel file');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Match Practice Areas from Excel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Upload an Excel file where Row A contains practice area labels and Row C contains person names.
            This will match and update team members' practice areas.
          </p>
          
          <label htmlFor="practice-area-file" className="cursor-pointer">
            <Button
              type="button"
              disabled={isProcessing}
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById('practice-area-file')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isProcessing ? 'Processing...' : 'Upload Excel File'}
            </Button>
          </label>
          
          <input
            id="practice-area-file"
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isProcessing}
          />
        </div>

        {results && (
          <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
            <p className="text-sm font-medium">Results:</p>
            <ul className="text-sm space-y-1">
              <li className="text-green-600">✓ Updated: {results.updated}</li>
              <li className="text-yellow-600">⊘ Skipped: {results.skipped}</li>
              <li className="text-red-600">✗ Errors: {results.errors.length}</li>
            </ul>
            
            {results.errors.length > 0 && (
              <details className="mt-2">
                <summary className="text-sm font-medium cursor-pointer">Show Errors</summary>
                <ul className="text-xs mt-2 space-y-1 text-red-600">
                  {results.errors.map((error: string, i: number) => (
                    <li key={i}>• {error}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
