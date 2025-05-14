
import { supabase } from '@/integrations/supabase/client';
import { type FormState } from '../hooks/types/projectTypes';

export const isProjectInfoValid = (form: FormState) => {
  return (
    !!form.code &&
    !!form.name &&
    form.country && form.country !== 'none' &&
    !!form.profit &&
    form.status && form.status !== 'none' &&
    form.office && form.office !== 'none'
  );
};

export const checkProjectCodeUnique = async (code: string, companyId: string) => {
  if (!companyId || !code.trim()) {
    return true;
  }
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('code')
      .eq('code', code)
      .eq('company_id', companyId)
      .limit(1);
    
    if (error) {
      console.error("Error checking project code:", error);
      return false;
    }
    
    return !(data && data.length > 0);
  } catch (err) {
    console.error("Exception checking project code:", err);
    return false;
  }
};
