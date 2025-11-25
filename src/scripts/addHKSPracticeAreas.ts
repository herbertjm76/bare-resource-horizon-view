import { supabase } from '@/integrations/supabase/client';

export const addHKSPracticeAreas = async () => {
  const practiceAreas = [
    'OPERATIONS',
    'BD+MARKETING',
    'IT/HR/LINE',
    'INTERNS',
    'HOSP./MASTERPLANNING',
    'LIFE SCIENCE',
    'BIM',
    'PROJ. ARCH',
    'PROJECT MANAGEMENT/ADMIN',
    'DESIGN (SG)',
    'DESIGN (INDIA)',
    'INTERIOR DESIGN',
    'MEDICAL PLANNING',
    'OUTSOURCING'
  ];

  // Get HKS company
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('name', 'HKS')
    .single();

  if (!company) {
    console.error('HKS company not found');
    return;
  }

  // Check existing practice areas
  const { data: existing } = await supabase
    .from('office_practice_areas')
    .select('name')
    .eq('company_id', company.id);

  const existingNames = existing?.map(p => p.name) || [];

  // Filter out already existing practice areas
  const newPracticeAreas = practiceAreas.filter(
    name => !existingNames.includes(name)
  );

  if (newPracticeAreas.length === 0) {
    console.log('All practice areas already exist');
    return;
  }

  // Insert new practice areas
  const { error } = await supabase
    .from('office_practice_areas')
    .insert(
      newPracticeAreas.map(name => ({
        name,
        company_id: company.id,
        icon: null
      }))
    );

  if (error) {
    console.error('Error adding practice areas:', error);
  } else {
    console.log(`Added ${newPracticeAreas.length} practice areas to HKS`);
  }
};
