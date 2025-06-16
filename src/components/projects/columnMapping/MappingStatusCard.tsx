
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { PROJECT_FIELDS } from './types';

interface MappingStatusCardProps {
  mapping: Record<string, string>;
}

export const MappingStatusCard: React.FC<MappingStatusCardProps> = ({
  mapping
}) => {
  const isFieldMapped = (fieldValue: string) => {
    return Object.values(mapping).includes(fieldValue);
  };

  return (
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
  );
};
