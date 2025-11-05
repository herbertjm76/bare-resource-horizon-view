
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TEAM_MEMBER_FIELDS } from './types';

interface TeamColumnMappingCardProps {
  headers: string[];
  mapping: Record<string, string>;
  onMappingChange: (columnIndex: string, field: string) => void;
  confidence?: Record<string, number>;
}

export const TeamColumnMappingCard: React.FC<TeamColumnMappingCardProps> = ({
  headers,
  mapping,
  onMappingChange,
  confidence = {}
}) => {
  const isFieldMapped = (fieldValue: string) => {
    return Object.values(mapping).includes(fieldValue);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Column Mapping</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {headers.map((header, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{header}</span>
                {confidence[index] && (
                  <Badge variant="secondary" className="text-xs">
                    {Math.round(confidence[index] * 100)}% confident
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex-1">
              <Select
                value={mapping[index] || 'skip'}
                onValueChange={(value) => onMappingChange(String(index), value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skip">Skip this column</SelectItem>
                  {TEAM_MEMBER_FIELDS.map(field => (
                    <SelectItem 
                      key={field.value} 
                      value={field.value}
                      disabled={isFieldMapped(field.value) && mapping[index] !== field.value}
                    >
                      {field.label} {field.required && '*'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
