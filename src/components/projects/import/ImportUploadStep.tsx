
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, Download, Image, Loader2, CheckCircle2, UserPlus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCompany } from '@/context/CompanyContext';

interface ExtractedPerson {
  first_name: string;
  last_name: string;
  email?: string | null;
  job_title?: string | null;
  department?: string | null;
  location?: string | null;
  employment_type?: string | null;
  status: 'new' | 'exists';
  existingEmail?: string;
}

interface ImportUploadStepProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>, orientation: 'columns' | 'rows') => void;
  onDownloadTemplate: () => void;
}

export const ImportUploadStep: React.FC<ImportUploadStepProps> = ({
  onFileUpload,
  onDownloadTemplate
}) => {
  const { company } = useCompany();
  const [orientation, setOrientation] = useState<'columns' | 'rows'>('columns');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedPeople, setExtractedPeople] = useState<ExtractedPerson[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFileUpload(event, orientation);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setIsProcessing(true);
    setExtractedPeople([]);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;

        const { data, error } = await supabase.functions.invoke('extract-team-from-image', {
          body: { imageData: base64 }
        });

        if (error) throw error;

        if (data.error) {
          toast.error(data.error);
          return;
        }

        setExtractedPeople(data.people || []);
        toast.success(`Extracted ${data.total} people (${data.new} new, ${data.existing} existing)`);
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('Error extracting from image:', error);
      toast.error('Failed to extract names from image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaste = async (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        event.preventDefault();
        const blob = items[i].getAsFile();
        if (!blob) continue;

        setIsProcessing(true);
        setExtractedPeople([]);

        try {
          const reader = new FileReader();
          reader.onload = async () => {
            const base64 = reader.result as string;

            const { data, error } = await supabase.functions.invoke('extract-team-from-image', {
              body: { imageData: base64 }
            });

            if (error) throw error;

            if (data.error) {
              toast.error(data.error);
              return;
            }

            setExtractedPeople(data.people || []);
            toast.success(`Extracted ${data.total} people (${data.new} new, ${data.existing} existing)`);
          };
          reader.readAsDataURL(blob);
        } catch (error: any) {
          console.error('Error extracting from image:', error);
          toast.error('Failed to extract names from image');
        } finally {
          setIsProcessing(false);
        }
        break;
      }
    }
  };

  const handleImportTeam = async () => {
    if (!company?.id) return;

    const newPeople = extractedPeople.filter(p => p.status === 'new');
    if (newPeople.length === 0) {
      toast.info('No new members to import');
      return;
    }

    setIsImporting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const invites = newPeople.map(person => ({
        company_id: company.id,
        first_name: person.first_name,
        last_name: person.last_name,
        email: person.email,
        job_title: person.job_title,
        department: person.department,
        location: person.location,
        code: Math.random().toString(36).substring(2, 15),
        created_by: user.id,
        invitation_type: 'pre_registered',
        status: 'pending'
      }));

      const { error } = await supabase.from('invites').insert(invites);

      if (error) throw error;

      toast.success(`Successfully imported ${newPeople.length} new team members!`);
      setExtractedPeople([]);
      onDownloadTemplate(); // Trigger refresh/close
    } catch (error: any) {
      console.error('Error importing members:', error);
      toast.error('Failed to import members');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="excel" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="excel">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel Import
          </TabsTrigger>
          <TabsTrigger value="screenshot">
            <Image className="h-4 w-4 mr-2" />
            Screenshot Import
          </TabsTrigger>
        </TabsList>

        <TabsContent value="excel" className="space-y-4 mt-4">
          <div className="text-sm text-muted-foreground">
            Upload an Excel file containing project data. For best results, use our template or ensure your data format matches.
          </div>

          <div className="border rounded-lg p-4 bg-muted/30">
            <Label className="text-sm font-medium mb-3 block">Data Orientation</Label>
            <RadioGroup value={orientation} onValueChange={(v) => setOrientation(v as 'columns' | 'rows')}>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="columns" id="columns" />
                <Label htmlFor="columns" className="font-normal cursor-pointer">
                  Columns (Standard) - Headers in first row, data below
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rows" id="rows" />
                <Label htmlFor="rows" className="font-normal cursor-pointer">
                  Rows (Transposed) - Headers in first column, data to the right
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex justify-center mb-4">
            <Button
              variant="outline"
              onClick={onDownloadTemplate}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Template
            </Button>
          </div>
          
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Upload Excel File</p>
              <p className="text-sm text-muted-foreground">
                Supported formats: .xlsx, .xls, .csv
              </p>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
                id="excel-upload"
              />
              <label htmlFor="excel-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="screenshot" className="space-y-4 mt-4">
          <div className="text-sm text-muted-foreground">
            Upload or paste a screenshot with team member names. AI will extract and match them with existing members.
          </div>

          <div 
            className="border-2 border-dashed rounded-lg p-8 text-center"
            onPaste={handlePaste}
            tabIndex={0}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="screenshot-upload"
              disabled={isProcessing}
            />
            <label htmlFor="screenshot-upload" className="cursor-pointer">
              {isProcessing ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Extracting names from image...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Image className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to upload or paste screenshot</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB • Ctrl+V to paste</p>
                </div>
              )}
            </label>
          </div>

          {extractedPeople.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Extracted People ({extractedPeople.length})</h3>
                <Button
                  onClick={handleImportTeam}
                  disabled={isImporting || extractedPeople.filter(p => p.status === 'new').length === 0}
                  size="sm"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Import {extractedPeople.filter(p => p.status === 'new').length} New
                    </>
                  )}
                </Button>
              </div>

              <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
                {extractedPeople.map((person, index) => (
                  <div key={index} className="p-3 flex items-start justify-between hover:bg-muted/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {person.first_name} {person.last_name}
                        </p>
                        {person.status === 'exists' && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                        {person.email && <p>Email: {person.email}</p>}
                        {person.job_title && <p>Role: {person.job_title}</p>}
                        {person.employment_type && <p>Type: {person.employment_type}</p>}
                        {person.department && <p>Sector: {person.department}</p>}
                        {person.location && <p>Location: {person.location}</p>}
                      </div>
                    </div>
                    <div className="text-xs">
                      {person.status === 'exists' ? (
                        <span className="text-green-600 font-medium">Already in team</span>
                      ) : (
                        <span className="text-primary font-medium">Will be added</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
