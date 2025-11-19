
import React from 'react';

interface JoinHeaderProps {
  companyName: string;
  isSignup: boolean;
}

const JoinHeader: React.FC<JoinHeaderProps> = ({ companyName, isSignup }) => (
  <>
    <h2 className="text-3xl font-bold text-white text-center mb-2">
      {isSignup ? `Join ${companyName || 'Company'}` : `Welcome to ${companyName || 'Company'}`}
    </h2>
    <p className="text-white/80 text-center mb-6">
      {isSignup ? 'Create an account to join the team' : 'Sign in to your account'}
    </p>
  </>
);

export default JoinHeader;
