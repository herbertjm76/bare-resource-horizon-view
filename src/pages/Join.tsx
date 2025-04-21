
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCompany } from '@/context/CompanyContext';
import JoinForm from './JoinForm';
import JoinHeader from './JoinHeader';
import JoinContainer from './JoinContainer';

const Join: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const { company } = useCompany();
  const { inviteCode } = useParams<{ inviteCode?: string }>();

  useEffect(() => {
    if (company) {
      setCompanyName(company.name);
    }
  }, [company]);

  return (
    <JoinContainer>
      <JoinHeader companyName={companyName} />
      <JoinForm
        companyName={companyName}
        company={company}
        inviteCode={inviteCode}
      />
    </JoinContainer>
  );
};

export default Join;
