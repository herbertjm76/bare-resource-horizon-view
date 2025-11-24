import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Upload, Pencil } from 'lucide-react';
import { PROJECT_FIELDS } from '../columnMapping/types';

interface DataPreviewStepProps {
  detectedData: any[];
  detectionType: 'people' | 'projects';
  onConfirm: (editedData: any[]) => void;
  onBack: () => void;
}

export const DataPreviewStep: React.FC<DataPreviewStepProps> = ({
  detectedData,
  detectionType,
  onConfirm,
  onBack
}) => {
  const [editableData, setEditableData] = useState<any[]>(detectedData);
  const [editingCell, setEditingCell] = useState<{ row: number; key: string } | null>(null);

  const handleCellChange = (rowIndex: number, key: string, value: string) => {
    const newData = [...editableData];
    newData[rowIndex] = { ...newData[rowIndex], [key]: value };
    setEditableData(newData);
  };

  const handleCellClick = (rowIndex: number, key: string) => {
    setEditingCell({ row: rowIndex, key });
  };

  const handleCellBlur = () => {
    setEditingCell(null);
  };

  const getColumns = () => {
    if (detectionType === 'projects') {
      return ['code', 'name', 'status', 'country', 'office_name', 'project_manager_name'];
    } else {
      return ['first_name', 'last_name', 'email', 'job_title', 'department', 'location'];
    }
  };

  const getColumnLabel = (key: string) => {
    if (detectionType === 'projects') {
      const field = PROJECT_FIELDS.find(f => f.value === key);
      return field?.label || key;
    }
    // For people - simple formatting
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const columns = getColumns();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Pencil className="h-5 w-5" />
          Review & Edit Data
        </h3>
        <p className="text-sm text-muted-foreground">
          Review the extracted data below. Click any cell to edit it before importing.
        </p>
      </div>

      <div className="border rounded-lg">
        <ScrollArea className="h-[400px]">
          <div className="p-4">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-background border-b">
                <tr>
                  <th className="text-left p-2 font-semibold min-w-[50px]">#</th>
                  {columns.map((key) => (
                    <th key={key} className="text-left p-2 font-semibold min-w-[150px]">
                      {getColumnLabel(key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {editableData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b hover:bg-muted/50">
                    <td className="p-2 text-muted-foreground">{rowIndex + 1}</td>
                    {columns.map((key) => (
                      <td key={key} className="p-2">
                        {editingCell?.row === rowIndex && editingCell?.key === key ? (
                          <Input
                            value={row[key] || ''}
                            onChange={(e) => handleCellChange(rowIndex, key, e.target.value)}
                            onBlur={handleCellBlur}
                            autoFocus
                            className="h-8"
                          />
                        ) : (
                          <div
                            onClick={() => handleCellClick(rowIndex, key)}
                            className="cursor-pointer hover:bg-muted/30 rounded px-2 py-1 min-h-[32px] flex items-center"
                          >
                            {row[key] || <span className="text-muted-foreground italic">empty</span>}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {editableData.length} {detectionType === 'projects' ? 'projects' : 'people'} ready to import
          </p>
          <Button onClick={() => onConfirm(editableData)}>
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </Button>
        </div>
      </div>
    </div>
  );
};
