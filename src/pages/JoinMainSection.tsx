
import React from 'react';
import JoinHeader from './JoinHeader';
import JoinForm from './JoinForm';
import JoinContainer from './JoinContainer';
import JoinCompanyBadge from './JoinCompanyBadge';

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
  const [isSignup, setIsSignup] = React.useState(true);

  return (
    <JoinContainer>
      <JoinHeader companyName={companyName} isSignup={isSignup} />
      <JoinCompanyBadge 
        companyName={companyName}
        logoUrl={company?.logo_url}
      />
      <JoinForm
        companyName={companyName}
        company={company}
        inviteCode={inviteCode}
        onAuthModeChange={setIsSignup}
      />
    </JoinContainer>
  );
};

export default JoinMainSection;
