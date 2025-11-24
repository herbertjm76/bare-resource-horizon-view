
import { ExcelParser } from './excelParser';
import { ProjectImporter } from './projectImporter';
import { TemplateGenerator } from './templateGenerator';
import type { ExcelParseResult, ImportResult } from './types';

export class ExcelProcessor {
  async parseExcelFile(file: File, options?: { orientation?: 'columns' | 'rows' }): Promise<ExcelParseResult> {
    return ExcelParser.parseExcelFile(file, options);
  }

  async importProjects(
    data: any[], 
    columnMapping: Record<string, string>,
    onProgress?: (progress: number) => void
  ): Promise<ImportResult> {
    return ProjectImporter.importProjects(data, columnMapping, onProgress);
  }

  generateTemplate(): string {
    return TemplateGenerator.generateTemplate();
  }
}

// Re-export types for backward compatibility
export type { ExcelParseResult, ImportResult } from './types';
