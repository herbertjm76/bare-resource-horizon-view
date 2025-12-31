
import { supabase } from '@/integrations/supabase/client';
import { type FormState } from '../hooks/types/projectTypes';
import { logger } from '@/utils/logger';

export const isProjectInfoValid = (form: FormState) => {
  logger.debug('Validating form:', form);
  
  // Only require code and name for minimal project creation
  const isValid = (
    !!form.code &&
    !!form.name
  );
  
  logger.debug('Form validation result:', {
    code: !!form.code,
    name: !!form.name,
    isValid
  });
  
  return isValid;
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
      logger.error("Error checking project code:", error);
      return false;
    }
    
    return !(data && data.length > 0);
  } catch (err) {
    logger.error("Exception checking project code:", err);
    return false;
  }
};
