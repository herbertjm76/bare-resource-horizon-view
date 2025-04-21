
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCompany } from '@/context/CompanyContext';
import JoinForm from './JoinForm';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Join {companyName || 'Company'}
        </h2>
        <p className="text-white/80 text-center mb-6">
          Create an account to join the team or sign in to your account
        </p>
        <JoinForm
          companyName={companyName}
          company={company}
          inviteCode={inviteCode}
        />
      </div>
    </div>
  );
};

export default Join;
