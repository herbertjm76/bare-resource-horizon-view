
import { ExcelParser } from '@/components/projects/services/excelParser';
import { TeamImporter } from './teamImporter';
import type { ExcelParseResult, ImportResult } from './types';

export class TeamExcelProcessor {
  async parseExcelFile(file: File): Promise<ExcelParseResult> {
    return ExcelParser.parseExcelFile(file);
  }

  async importTeamMembers(
    data: any[], 
    columnMapping: Record<string, string>,
    onProgress?: (progress: number) => void
  ): Promise<ImportResult> {
    return TeamImporter.importTeamMembers(data, columnMapping, onProgress);
  }
}
