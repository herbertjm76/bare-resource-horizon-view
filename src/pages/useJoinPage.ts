
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCompany } from '@/context/CompanyContext';

export function useJoinPage() {
  const [companyName, setCompanyName] = useState('');
  const { company } = useCompany();
  const { inviteCode } = useParams<{ inviteCode?: string }>();

  useEffect(() => {
    if (company) {
      setCompanyName(company.name);
    }
  }, [company]);

  return {
    companyName,
    company,
    inviteCode,
  };
}
