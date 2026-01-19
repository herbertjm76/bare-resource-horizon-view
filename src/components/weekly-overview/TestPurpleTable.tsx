
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { useProjectDisplayText } from '@/hooks/useProjectDisplayText';
import './css/test-purple-table.css';
import { logger } from '@/utils/logger';

interface TestPurpleTableProps {
  projects: any[];
}

export const TestPurpleTable: React.FC<TestPurpleTableProps> = ({ projects }) => {
  const { getDisplayText, getTooltipText } = useProjectDisplayText();
  logger.debug("TestPurpleTable - Rendering with projects:", projects);
  
  return (
    <div className="test-purple-wrapper">
      <div className="mb-4 p-4 bg-purple-100 border border-purple-300 rounded">
        <p className="text-purple-800 font-medium">
          🟣 TEST TABLE: This table should have a purple header. Projects count: {projects?.length || 0}
        </p>
      </div>
      
      <Table className="test-purple-table">
        <TableHeader className="test-purple-header">
          <TableRow className="test-purple-header-row">
            <TableHead className="test-purple-first-cell">
              TEAM MEMBER
            </TableHead>
            
            {projects.map((project) => (
              <TableHead key={project.id} className="test-purple-project-cell">
                <div className="test-purple-project-code" title={getTooltipText(project)}>
                  {getDisplayText(project)}
                </div>
              </TableHead>
            ))}
            
            <TableHead className="test-purple-cell">TOTAL</TableHead>
            <TableHead className="test-purple-cell">CAPACITY</TableHead>
            <TableHead className="test-purple-cell">UTILIZATION</TableHead>
            <TableHead className="test-purple-cell">LEAVE</TableHead>
            <TableHead className="test-purple-cell">REMARKS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>8</TableCell>
            <TableCell>6</TableCell>
            <TableCell>5</TableCell>
            <TableCell>32</TableCell>
            <TableCell>40</TableCell>
            <TableCell>80%</TableCell>
            <TableCell>0</TableCell>
            <TableCell>Working on feature</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jane Smith</TableCell>
            <TableCell>10</TableCell>
            <TableCell>8</TableCell>
            <TableCell>7</TableCell>
            <TableCell>35</TableCell>
            <TableCell>40</TableCell>
            <TableCell>87%</TableCell>
            <TableCell>5</TableCell>
            <TableCell>Code review</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
