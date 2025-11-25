import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';

// Manual mapping based on the Excel structure for HKS
// This maps column positions to practice areas based on the Project Status Matrix
const PRACTICE_AREA_MAPPING: Record<string, string> = {
  // Operations group (Sofie, Catherine, Nelima, Jessica, Raksha, Thoang, Saori, Bona, Thuy) - columns 3-11
  'Sofie': 'OPERATIONS',
  'Catherine': 'BD+MARKETING',  
  'Nelima': 'OPERATIONS',
  'Jessica': 'BD+MARKETING',
  'Raksha': 'BD+MARKETING',
  'Thoang': 'BD+MARKETING',
  'Saori': 'BD+MARKETING',
  'Bona': 'BD+MARKETING',
  'Thuy': 'BD+MARKETING',
  
  // IT/HR/Admin group (KC, Meetu) - columns 12-13
  'KC': 'IT/HR/LINE',
  'Meetu': 'IT/HR/LINE',
  
  // Interns group (Andre, Harshita, Zaw, Phyo, Pearl) - columns 14-18
  'Andre': 'INTERNS',
  'Harshita': 'INTERNS',
  'Zaw': 'INTERNS',
  'Phyo': 'INTERNS',
  'Pearl': 'INTERNS',
  
  // LINE (Dwight) - column 19
  'Dwight': 'LINE',
  
  // Hospitality/Masterplanning (Stephane, Robert, Herbert, Kay) - columns 21-24
  'Stephane': 'HOSP./MASTERPLANNING',
  'Robert': 'HOSP./MASTERPLANNING',
  'Herbert': 'HOSP./MASTERPLANNING',
  'Kay': 'HOSP./MASTERPLANNING',
  
  // Life Science (Manon, Agung, Adinya, Phoo) - columns 26-29
  'Manon': 'LIFE SCIENCE',
  'Agung': 'LIFE SCIENCE',
  'Adinya': 'LIFE SCIENCE',
  'Phoo': 'LIFE SCIENCE',
  
  // BIM (David M, Nisa, Neha, Brinda, Reza, Kelvin, Praneet) - columns 31-37
  'David M': 'BIM',
  'Nisa': 'BIM',
  'Neha': 'BIM',
  'Brinda': 'BIM',
  'Reza': 'BIM',
  'Kelvin': 'BIM',
  'Praneet': 'BIM',
  
  // Project Arch (Gordon, Louis, Owen, Dalia, Jiake, Claire, Brooks, Siva, Carmen, Ying) - columns 39-48
  'Gordon': 'PROJ. ARCH',
  'Louis': 'PROJ. ARCH',
  'Owen': 'PROJ. ARCH',
  'Dalia': 'PROJ. ARCH',
  'Jiake': 'PROJ. ARCH',
  'Claire': 'PROJ. ARCH',
  'Brooks': 'PROJ. ARCH',
  'Siva': 'PROJ. ARCH',
  'Carmen': 'PROJ. ARCH',
  'Ying': 'PROJ. ARCH',
  
  // Project Management/Admin (Akansha, Mantavya, Saumya, Amrita, Divya, Arghya, Daniel) - columns 49-55
  'Akansha': 'PROJECT MANAGEMENT/ADMIN',
  'Mantavya': 'PROJECT MANAGEMENT/ADMIN',
  'Saumya': 'PROJECT MANAGEMENT/ADMIN',
  'Amrita': 'PROJECT MANAGEMENT/ADMIN',
  'Divya': 'PROJECT MANAGEMENT/ADMIN',
  'Arghya': 'PROJECT MANAGEMENT/ADMIN',
  'Daniel': 'PROJECT MANAGEMENT/ADMIN',
  
  // Amy and Lucas appear to be new hires - need to determine
  'Amy': 'PROJECT MANAGEMENT/ADMIN',
  'Lucas': 'PROJECT MANAGEMENT/ADMIN',
  
  // Design (SG) (Christina, Joey, Jo Wee, Michael, Glen, Xu Qi, Li Ji, Yuning, Noe Noe, Magdalene) - columns 57-66
  'Christina': 'DESIGN (SG)',
  'Joey': 'DESIGN (SG)',
  'Jo Wee': 'DESIGN (SG)',
  'Michael': 'DESIGN (SG)',
  'Glen': 'DESIGN (SG)',
  'Xu Qi': 'DESIGN (SG)',
  'Li Ji': 'DESIGN (SG)',
  'Yuning': 'DESIGN (SG)',
  'Noe Noe': 'DESIGN (SG)',
  'Magdalene': 'DESIGN (SG)',
  
  // Design (India) (Suman, Grace, Vic, Lawrence, Lynette, Siong Min, Chi Kwan) - columns 68-74
  'Suman': 'DESIGN (INDIA)',
  'Grace': 'DESIGN (INDIA)',
  'Vic': 'DESIGN (INDIA)',
  'Lawrence': 'DESIGN (INDIA)',
  'Lynette': 'DESIGN (INDIA)',
  'Siong Min': 'DESIGN (INDIA)',
  'Chi Kwan': 'DESIGN (INDIA)',
  
  // Interior Design (Majesty, Vivian) - columns 76-77
  'Majesty': 'INTERIOR DESIGN',
  'Vivian': 'INTERIOR DESIGN',
  
  // Medical Planning (Anshul, Chu Yao) - columns 79-80
  'Anshul': 'MEDICAL PLANNING',
  'Chu Yao': 'MEDICAL PLANNING',
  
  // Helios appears multiple times - Outsourcing
  'Helios': 'OUTSOURCING',
};

export const updatePracticeAreasFromMapping = async () => {
  const results = {
    updated: 0,
    skipped: 0,
    notFound: [] as string[],
    errors: [] as string[]
  };
  
  for (const [name, practiceArea] of Object.entries(PRACTICE_AREA_MAPPING)) {
    try {
      // Parse name - handle cases like "David M", "Jo Wee", etc.
      const nameParts = name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null;
      
      // Build query to find matching profiles
      let query = supabase
        .from('profiles')
        .select('id, first_name, last_name, practice_area');
      
      if (lastName) {
        // Try exact match first
        query = query.or(`and(first_name.ilike.${firstName},last_name.ilike.${lastName}),and(first_name.ilike.${firstName}%,last_name.ilike.${lastName}%)`);
      } else {
        // Only first name
        query = query.or(`first_name.ilike.${firstName},first_name.ilike.${firstName}%`);
      }
      
      const { data: profiles, error: selectError } = await query;
      
      if (selectError) {
        console.error(`Error finding ${name}:`, selectError);
        results.errors.push(`${name}: ${selectError.message}`);
        continue;
      }
      
      if (!profiles || profiles.length === 0) {
        console.log(`No profile found for ${name}`);
        results.notFound.push(name);
        continue;
      }
      
      // If multiple matches, try to find the best match
      let profileToUpdate = profiles[0];
      if (profiles.length > 1) {
        // Try to find exact match
        const exactMatch = profiles.find(p => 
          p.first_name?.toLowerCase() === firstName.toLowerCase() &&
          (lastName ? p.last_name?.toLowerCase() === lastName.toLowerCase() : true)
        );
        if (exactMatch) {
          profileToUpdate = exactMatch;
        }
      }
      
      // Update the profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ practice_area: practiceArea })
        .eq('id', profileToUpdate.id);
      
      if (updateError) {
        console.error(`Error updating ${name}:`, updateError);
        results.errors.push(`${name}: ${updateError.message}`);
      } else {
        console.log(`✓ Updated ${profileToUpdate.first_name} ${profileToUpdate.last_name} → ${practiceArea}`);
        results.updated++;
      }
      
    } catch (error) {
      console.error(`Error processing ${name}:`, error);
      results.errors.push(`${name}: ${error}`);
    }
  }
  
  return results;
};
