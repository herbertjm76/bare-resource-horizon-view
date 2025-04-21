
import React from 'react';
import { useJoinPage } from './useJoinPage';
import JoinMainSection from './JoinMainSection';

const Join: React.FC = () => {
  const { companyName, company, inviteCode } = useJoinPage();

  return (
    <JoinMainSection
      companyName={companyName}
      company={company}
      inviteCode={inviteCode}
    />
  );
};

export default Join;
