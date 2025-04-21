
import React from 'react';
import JoinHeader from './JoinHeader';
import JoinForm from './JoinForm';
import JoinContainer from './JoinContainer';

interface JoinMainSectionProps {
  companyName: string;
  company: any;
  inviteCode?: string;
}

const JoinMainSection: React.FC<JoinMainSectionProps> = ({
  companyName,
  company,
  inviteCode
}) => {
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

export default JoinMainSection;
