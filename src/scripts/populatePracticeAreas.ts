import { supabase } from '@/integrations/supabase/client';

interface PracticeAreaToAdd {
  name: string;
  icon: string;
}

export const populatePracticeAreasFromTeamMembers = async () => {
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

    // Get unique practice areas from profiles and invites
    const { data: profilePracticeAreas } = await supabase
      .from('profiles')
      .select('practice_area')
      .eq('company_id', profile.company_id)
      .not('practice_area', 'is', null);

    const { data: invitePracticeAreas } = await supabase
      .from('invites')
      .select('practice_area')
      .eq('company_id', profile.company_id)
      .not('practice_area', 'is', null);

    // Combine and get unique practice area names
    const allPracticeAreas = new Set<string>();
    profilePracticeAreas?.forEach(p => p.practice_area && allPracticeAreas.add(p.practice_area));
    invitePracticeAreas?.forEach(i => i.practice_area && allPracticeAreas.add(i.practice_area));

    // Get existing office practice areas
    const { data: existingPracticeAreas } = await supabase
      .from('office_practice_areas')
      .select('name')
      .eq('company_id', profile.company_id);

    const existingNames = new Set(existingPracticeAreas?.map(d => d.name) || []);

    // Define icons for specific practice areas
    const iconMap: Record<string, string> = {
      'Architecture': 'building-2',
      'Interior Design': 'palette',
      'Urban Planning': 'map',
      'Landscape Architecture': 'trees',
      'Engineering': 'wrench',
      'Sustainability': 'leaf',
      'Healthcare': 'heart-pulse',
      'Education': 'graduation-cap',
      'Residential': 'home',
      'Commercial': 'briefcase',
      'Hospitality': 'hotel',
      'Mixed-Use': 'layers'
    };

    // Prepare practice areas to add
    const practiceAreasToAdd: PracticeAreaToAdd[] = Array.from(allPracticeAreas)
      .filter(name => !existingNames.has(name))
      .map(name => ({
        name,
        icon: iconMap[name] || 'folder',
        company_id: profile.company_id
      }));

    if (practiceAreasToAdd.length === 0) {
      return {
        success: true,
        message: 'All practice areas already exist',
        added: 0
      };
    }

    // Insert new practice areas
    const { error } = await supabase
      .from('office_practice_areas')
      .insert(practiceAreasToAdd);

    if (error) throw error;

    return {
      success: true,
      message: `Successfully added ${practiceAreasToAdd.length} practice area(s)`,
      added: practiceAreasToAdd.length,
      practiceAreas: practiceAreasToAdd.map(d => d.name)
    };

  } catch (error) {
    console.error('Error populating practice areas:', error);
    throw error;
  }
};
