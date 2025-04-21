
import React from 'react';

interface JoinHeaderProps {
  companyName: string;
}

const JoinHeader: React.FC<JoinHeaderProps> = ({ companyName }) => (
  <>
    <h2 className="text-3xl font-bold text-white text-center mb-2">
      Join {companyName || 'Company'}
    </h2>
    <p className="text-white/80 text-center mb-6">
      Create an account to join the team or sign in to your account
    </p>
  </>
);

export default JoinHeader;
