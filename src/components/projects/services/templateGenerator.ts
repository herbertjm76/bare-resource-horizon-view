
export class TemplateGenerator {
  static generateTemplate(): string {
    const headers = [
      'Project Code *',
      'Project Name *',
      'Status',
      'Country',
      'Target Profit %',
      'Currency',
      'Project Manager Name',
      'Office Name'
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

    return `${headers.join(',')}\n${sampleData.join(',')}`;
  }
}
