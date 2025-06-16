
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PROJECT_FIELDS } from './types';

interface DataPreviewCardProps {
  headers: string[];
  sampleData: any[][];
  mapping: Record<string, string>;
}

export const DataPreviewCard: React.FC<DataPreviewCardProps> = ({
  headers,
  sampleData,
  mapping
}) => {
  const getFieldLabel = (fieldValue: string) => {
    return PROJECT_FIELDS.find(f => f.value === fieldValue)?.label || fieldValue;
  };

  return (
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
                        <div className={`${
                          mapping[cellIndex.toString()] ? 'bg-blue-50 border border-blue-200 rounded px-2 py-1' : ''
                        }`}>
                          {String(cell || '').substring(0, 50)}
                          {String(cell || '').length > 50 ? '...' : ''}
                        </div>
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
  );
};
