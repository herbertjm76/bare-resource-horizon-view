
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { logger } from '@/utils/logger';

type JoinCompany = {
  id: string;
  name: string;
  subdomain: string;
  logo_url?: string | null;
} | null;

export function useJoinPage() {
  const [companyName, setCompanyName] = useState('');
  const [resolvedCompany, setResolvedCompany] = useState<JoinCompany>(null);

  const { company: contextCompany } = useCompany();
  const { companySlug, inviteCode } = useParams<{ companySlug: string; inviteCode?: string }>();

  useEffect(() => {
    // Prefer CompanyContext when available (authenticated flows)
    if (contextCompany) {
      setResolvedCompany(contextCompany as any);
      setCompanyName(contextCompany.name);
      return;
    }

    // Public join pages may not have CompanyContext populated; resolve by slug.
    const slug = (companySlug || '').trim();
    if (!slug) return;

    let cancelled = false;

    (async () => {
      try {
        const { data, error } = await supabase.rpc('get_company_by_subdomain', {
          subdomain_param: slug,
        });

        if (cancelled) return;

        if (error) {
          logger.warn('useJoinPage: failed to resolve company by subdomain', error);
          setResolvedCompany(null);
          setCompanyName('');
          return;
        }

        const c = data?.[0];
        setResolvedCompany(c ? ({ ...c, subdomain: c.subdomain } as any) : null);
        setCompanyName(c?.name ?? '');
      } catch (e) {
        if (!cancelled) {
          logger.warn('useJoinPage: unexpected error resolving company', e);
          setResolvedCompany(null);
          setCompanyName('');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [contextCompany, companySlug]);

  return {
    companyName,
    company: resolvedCompany,
    companySlug,
    inviteCode,
  };
}

