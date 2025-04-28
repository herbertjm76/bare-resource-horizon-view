
import React from 'react';

interface TeamHeaderProps {
  title: string;
}

const TeamHeader: React.FC<TeamHeaderProps> = ({ title }) => {
  return (
    <h1 className="text-3xl font-bold tracking-tight text-brand-primary">{title}</h1>
  );
};

export default TeamHeader;
