
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Check } from 'lucide-react';
import { PROJECT_FIELDS } from './types';
import { ConfidenceBadge } from './ConfidenceBadge';

interface ColumnMappingCardProps {
  headers: string[];
  mapping: Record<string, string>;
  onMappingChange: (columnIndex: string, projectField: string) => void;
  confidence?: Record<string, number>;
}

export const ColumnMappingCard: React.FC<ColumnMappingCardProps> = ({
  headers,
  mapping,
  onMappingChange,
  confidence
}) => {
  const isFieldMapped = (fieldValue: string) => {
    return Object.values(mapping).includes(fieldValue);
  };

  return (
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
              {confidence?.[index.toString()] && (
                <ConfidenceBadge confidence={confidence[index.toString()]} />
              )}
              <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>
            <Select
              value={mapping[index.toString()] || 'skip'}
              onValueChange={(value) => onMappingChange(index.toString(), value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select field..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="skip">-- Skip this column --</SelectItem>
                {PROJECT_FIELDS.map(field => (
                  <SelectItem 
                    key={field.value} 
                    value={field.value}
                    disabled={isFieldMapped(field.value) && mapping[index.toString()] !== field.value}
                  >
                    <div className="flex items-center gap-2">
                      {field.label}{field.required ? ' *' : ''}
                      {isFieldMapped(field.value) && mapping[index.toString()] === field.value && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
