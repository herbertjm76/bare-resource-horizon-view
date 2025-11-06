import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Users, FolderKanban } from 'lucide-react';

interface DetectionTypeStepProps {
  onDetect: (type: 'people' | 'projects', examples: string[], explanation: string) => void;
  onCancel: () => void;
}

export const DetectionTypeStep: React.FC<DetectionTypeStepProps> = ({
  onDetect,
  onCancel
}) => {
  const [detectionType, setDetectionType] = useState<'people' | 'projects'>('projects');
  const [examplesInput, setExamplesInput] = useState('');
  const [explanation, setExplanation] = useState('');

  const handleDetect = () => {
    const examples = examplesInput
      .split(',')
      .map(e => e.trim())
      .filter(e => e.length > 0);
    onDetect(detectionType, examples, explanation);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">What would you like to detect?</h3>
        <RadioGroup value={detectionType} onValueChange={(v) => setDetectionType(v as 'people' | 'projects')}>
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-secondary/50 cursor-pointer">
            <RadioGroupItem value="projects" id="projects" />
            <Label htmlFor="projects" className="flex items-center gap-2 cursor-pointer flex-1">
              <FolderKanban className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Project Codes & Names</div>
                <div className="text-sm text-muted-foreground">Detect project identifiers and titles</div>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-secondary/50 cursor-pointer">
            <RadioGroupItem value="people" id="people" />
            <Label htmlFor="people" className="flex items-center gap-2 cursor-pointer flex-1">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">People Names</div>
                <div className="text-sm text-muted-foreground">Detect person names from the data</div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="examples">Examples (optional)</Label>
        <Input
          id="examples"
          placeholder={detectionType === 'people' ? "John Doe, Jane Smith" : "PRJ-001, 00120.068"}
          value={examplesInput}
          onChange={(e) => setExamplesInput(e.target.value)}
          className="mt-2"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Separate multiple examples with commas. This helps AI identify similar patterns.
        </p>
      </div>

      <div>
        <Label htmlFor="explanation">Additional Instructions for AI (optional)</Label>
        <Textarea
          id="explanation"
          placeholder={detectionType === 'people' ? "e.g., Names are in the first column, ignore column headers" : "e.g., Project codes start with 'PRJ', names are after the dash"}
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          className="mt-2 min-h-20"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Provide additional context to help AI understand your data structure better.
        </p>
      </div>

      <div className="flex gap-2">
        <Button onClick={onCancel} variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleDetect} className="flex-1">
          Detect with AI
        </Button>
      </div>
    </div>
  );
};
