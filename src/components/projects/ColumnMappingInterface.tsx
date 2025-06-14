
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Check } from 'lucide-react';

interface ColumnMappingInterfaceProps {
  headers: string[];
  sampleData: any[][];
  onMappingComplete: (mapping: Record<string, string>) => void;
  onCancel: () => void;
}

const PROJECT_FIELDS = [
  { value: 'code', label: 'Project Code', required: true },
  { value: 'name', label: 'Project Name', required: true },
  { value: 'status', label: 'Status', required: false },
  { value: 'country', label: 'Country', required: false },
  { value: 'current_stage', label: 'Current Stage', required: false },
  { value: 'target_profit_percentage', label: 'Target Profit %', required: false },
  { value: 'currency', label: 'Currency', required: false }
];

export const ColumnMappingInterface: React.FC<ColumnMappingInterfaceProps> = ({
  headers,
  sampleData,
  onMappingComplete,
  onCancel
}) => {
  const [mapping, setMapping] = useState<Record<string, string>>({});

  const handleMappingChange = (columnIndex: string, projectField: string) => {
    setMapping(prev => ({
      ...prev,
      [columnIndex]: projectField
    }));
  };

  const handleComplete = () => {
    // Validate that required fields are mapped
    const requiredFields = PROJECT_FIELDS.filter(field => field.required);
    const mappedFields = Object.values(mapping);
    
    const missingRequired = requiredFields.filter(field => 
      !mappedFields.includes(field.value)
    );

    if (missingRequired.length > 0) {
      alert(`Please map the following required fields: ${missingRequired.map(f => f.label).join(', ')}`);
      return;
    }

    onMappingComplete(mapping);
  };

  const getFieldLabel = (fieldValue: string) => {
    return PROJECT_FIELDS.find(f => f.value === fieldValue)?.label || fieldValue;
  };

  const isFieldMapped = (fieldValue: string) => {
    return Object.values(mapping).includes(fieldValue);
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600">
        Map your Excel columns to project fields. Required fields are marked with an asterisk (*).
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column Mapping */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Column Mapping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {headers.map((header, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium min-w-0 flex-1 truncate">
                    {header}
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </div>
                <Select
                  value={mapping[index.toString()] || ''}
                  onValueChange={(value) => handleMappingChange(index.toString(), value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select field..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">-- Skip this column --</SelectItem>
                    {PROJECT_FIELDS.map(field => (
                      <SelectItem 
                        key={field.value} 
                        value={field.value}
                        disabled={isFieldMapped(field.value) && mapping[index.toString()] !== field.value}
                      >
                        {field.label}{field.required ? ' *' : ''}
                        {isFieldMapped(field.value) && mapping[index.toString()] === field.value && (
                          <Check className="h-4 w-4 ml-2 text-green-600" />
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Preview of the first few rows:
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {headers.map((header, index) => (
                        <th key={index} className="text-left p-2 min-w-[100px]">
                          <div className="space-y-1">
                            <div className="font-medium">{header}</div>
                            {mapping[index.toString()] && (
                              <div className="text-xs text-blue-600">
                                → {getFieldLabel(mapping[index.toString()])}
                              </div>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="p-2 text-gray-700">
                            {String(cell || '').substring(0, 50)}
                            {String(cell || '').length > 50 ? '...' : ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Field Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mapping Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {PROJECT_FIELDS.map(field => (
              <div
                key={field.value}
                className={`p-2 rounded text-sm flex items-center gap-2 ${
                  isFieldMapped(field.value)
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : field.required
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-gray-50 text-gray-600 border border-gray-200'
                }`}
              >
                {isFieldMapped(field.value) ? (
                  <Check className="h-4 w-4" />
                ) : field.required ? (
                  <span className="text-red-500">*</span>
                ) : (
                  <div className="w-4 h-4" />
                )}
                <span className="text-xs">{field.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Back
        </Button>
        <Button onClick={handleComplete}>
          Start Import
        </Button>
      </div>
    </div>
  );
};
