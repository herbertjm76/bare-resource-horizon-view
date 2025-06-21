
export class TemplateGenerator {
  static generateTemplate(): string {
    const headers = [
      'Project Code *',
      'Project Name *',
      'Status (optional)',
      'Country (optional)',
      'Target Profit % (optional)',
      'Currency (optional)',
      'Project Manager Name (optional)',
      'Office Name (optional)'
    ];

    const sampleData = [
      'PROJ-001',
      'Sample Project Alpha',
      'Planning',
      'United States',
      '15',
      'USD',
      'John Doe',
      'New York Office'
    ];

    const minimalSampleData = [
      'PROJ-002',
      'Minimal Project Example',
      '',
      '',
      '',
      '',
      '',
      ''
    ];

    return `${headers.join(',')}\n${sampleData.join(',')}\n${minimalSampleData.join(',')}`;
  }
}
