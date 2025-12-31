import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import { logger } from '@/utils/logger';

interface PersonPracticeArea {
  name: string;
  practice_area: string | null;
  column_index: number;
}

export const matchPracticeAreasFromExcel = async (file: File): Promise<PersonPracticeArea[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Convert to array of arrays for easier processing
        const sheetData: any[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        logger.debug('First 10 rows of Excel:', sheetData.slice(0, 10));
        
        // Row A (index 0) should have practice area indicators
        // Row C (index 2) should have people names
        // But based on the parsed structure, it looks like:
        // Row 0-5 might be headers
        // Row 6 (index 6) might have grouping/practice area indicators  
        // Row 7 (index 7) has "03 Nov to 07 Nov 2025" followed by names
        
        // Find the row with names (contains "Sofie", "Catherine", etc.)
        let namesRowIndex = -1;
        let practiceAreaRowIndex = -1;
        
        for (let i = 0; i < Math.min(15, sheetData.length); i++) {
          const row = sheetData[i];
          if (row && row.some((cell: any) => 
            cell && typeof cell === 'string' && 
            (cell.includes('Sofie') || cell.includes('Catherine') || cell.includes('Nelima'))
          )) {
            namesRowIndex = i;
            // Practice area indicators are typically 1-2 rows above names
            practiceAreaRowIndex = i - 2;
            break;
          }
        }
        
        if (namesRowIndex === -1) {
          logger.error('Could not find names row');
          logger.debug('Sheet data:', sheetData.slice(0, 15));
          reject(new Error('Could not find row with person names'));
          return;
        }
        
        logger.debug('Names found at row:', namesRowIndex);
        logger.debug('Practice area indicators at row:', practiceAreaRowIndex);
        
        const namesRow = sheetData[namesRowIndex];
        const practiceAreaRow = sheetData[practiceAreaRowIndex] || [];
        
        logger.debug('Names row:', namesRow);
        logger.debug('Practice area row:', practiceAreaRow);
        
        const mappings: PersonPracticeArea[] = [];
        
        // Extract names and their practice areas
        let currentPracticeArea: string | null = null;
        
        for (let i = 0; i < namesRow.length; i++) {
          const name = namesRow[i];
          
          // Check if this column has a practice area indicator
          if (practiceAreaRow[i] && practiceAreaRow[i] !== '') {
            const indicator = String(practiceAreaRow[i]).trim();
            
            // Map common indicators to practice areas
            if (indicator.toLowerCase().includes('intern')) {
              currentPracticeArea = 'INTERNS';
            } else if (indicator === 'Interns' || indicator.toLowerCase() === 'interns') {
              currentPracticeArea = 'INTERNS';
            } else if (!isNaN(Number(indicator)) && Number(indicator) >= 1) {
              // Numbers might indicate groups - we'll keep the current practice area
              // unless it's the start of a new section
            }
          }
          
          // If we have a valid name (not empty, not a header like "Status", "FTE")
          if (name && typeof name === 'string' && name.trim() !== '' && 
              !['Status', 'FTE', 'CATEGORY', '03 Nov'].some(h => name.includes(h))) {
            const cleanName = name.trim();
            
            // Only add if it looks like a person name (has letters, not just numbers)
            if (/[a-zA-Z]/.test(cleanName) && cleanName.length > 1) {
              mappings.push({
                name: cleanName,
                practice_area: currentPracticeArea,
                column_index: i
              });
            }
          }
        }
        
        logger.debug('Extracted mappings:', mappings);
        resolve(mappings);
        
      } catch (error) {
        logger.error('Error parsing Excel:', error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      logger.error('FileReader error:', error);
      reject(error);
    };
    
    reader.readAsBinaryString(file);
  });
};

export const updatePracticeAreasInDatabase = async (mappings: PersonPracticeArea[]) => {
  const results = {
    updated: 0,
    skipped: 0,
    errors: [] as string[]
  };
  
  for (const mapping of mappings) {
    if (!mapping.practice_area) {
      results.skipped++;
      continue;
    }
    
    try {
      // Find the profile by name (first name or last name match)
      const names = mapping.name.split(' ');
      const firstName = names[0];
      const lastName = names.length > 1 ? names[names.length - 1] : null;
      
      // Try to find by first name and last name
      let query = supabase
        .from('profiles')
        .select('id, first_name, last_name, practice_area');
      
      if (lastName) {
        query = query.or(`first_name.ilike.%${firstName}%,last_name.ilike.%${lastName}%`);
      } else {
        query = query.or(`first_name.ilike.%${firstName}%,last_name.ilike.%${firstName}%`);
      }
      
      const { data: profiles, error: selectError } = await query;
      
      if (selectError) {
        results.errors.push(`Error finding ${mapping.name}: ${selectError.message}`);
        continue;
      }
      
      if (!profiles || profiles.length === 0) {
        results.errors.push(`No profile found for ${mapping.name}`);
        continue;
      }
      
      if (profiles.length > 1) {
        logger.debug(`Multiple profiles found for ${mapping.name}, updating all`);
      }
      
      // Update all matching profiles
      for (const profile of profiles) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ practice_area: mapping.practice_area })
          .eq('id', profile.id);
        
        if (updateError) {
          results.errors.push(`Error updating ${mapping.name}: ${updateError.message}`);
        } else {
          results.updated++;
          logger.debug(`Updated ${profile.first_name} ${profile.last_name} to ${mapping.practice_area}`);
        }
      }
      
    } catch (error) {
      results.errors.push(`Error processing ${mapping.name}: ${error}`);
    }
  }
  
  return results;
};
