import { supabase } from '@/integrations/supabase/client';

interface DepartmentToAdd {
  name: string;
  icon: string;
}

export const populateDepartmentsFromTeamMembers = async () => {
  try {
    // Get current user's company
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();

    if (!profile?.company_id) throw new Error('No company found');

    // Get unique departments from profiles and invites
    const { data: profileDepts } = await supabase
      .from('profiles')
      .select('department')
      .eq('company_id', profile.company_id)
      .not('department', 'is', null);

    const { data: inviteDepts } = await supabase
      .from('invites')
      .select('department')
      .eq('company_id', profile.company_id)
      .not('department', 'is', null);

    // Combine and get unique department names
    const allDepts = new Set<string>();
    profileDepts?.forEach(p => p.department && allDepts.add(p.department));
    inviteDepts?.forEach(i => i.department && allDepts.add(i.department));

    // Get existing office departments
    const { data: existingDepts } = await supabase
      .from('office_departments')
      .select('name')
      .eq('company_id', profile.company_id);

    const existingNames = new Set(existingDepts?.map(d => d.name) || []);

    // Define icons for specific departments
    const iconMap: Record<string, string> = {
      'Administration': 'briefcase',
      'Health': 'heart-pulse',
      'HUB': 'home',
      'Information Technology': 'laptop',
      'Marketing': 'megaphone',
      'Enterprise': 'eye',
      'Mission Critical': 'share',
      'Hospitality': 'map',
      'Life Science': 'trending-up'
    };

    // Prepare departments to add
    const deptsToAdd: DepartmentToAdd[] = Array.from(allDepts)
      .filter(name => !existingNames.has(name))
      .map(name => ({
        name,
        icon: iconMap[name] || 'folder',
        company_id: profile.company_id
      }));

    if (deptsToAdd.length === 0) {
      return {
        success: true,
        message: 'All departments already exist',
        added: 0
      };
    }

    // Insert new departments
    const { error } = await supabase
      .from('office_departments')
      .insert(deptsToAdd);

    if (error) throw error;

    return {
      success: true,
      message: `Successfully added ${deptsToAdd.length} department(s)`,
      added: deptsToAdd.length,
      departments: deptsToAdd.map(d => d.name)
    };

  } catch (error) {
    console.error('Error populating departments:', error);
    throw error;
  }
};
