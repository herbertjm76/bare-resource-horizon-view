
import React from 'react';
import { Input } from '@/components/ui/input';

interface JoinFormFieldsProps {
  isSignup: boolean;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  isEmailLocked?: boolean;
}

const JoinFormFields: React.FC<JoinFormFieldsProps> = ({
  isSignup,
  email,
  setEmail,
  password,
  setPassword,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  isEmailLocked = false,
}) => (
  <>
    {isSignup && (
      <>
        <div>
          <label htmlFor="firstName" className="block text-white/80 mb-2">First Name</label>
          <Input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-white/80 mb-2">Last Name</label>
          <Input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
            required
          />
        </div>
      </>
    )}
    <div>
      <label htmlFor="email" className="block text-white/80 mb-2">Email</label>
      <Input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50 disabled:opacity-70 disabled:cursor-not-allowed"
        required
        disabled={isEmailLocked}
        autoComplete="off"
      />
      {isEmailLocked && (
        <p className="text-xs text-white/60 mt-1">Email is locked to match your invite</p>
      )}
    </div>
    <div>
      <label htmlFor="password" className="block text-white/80 mb-2">Password</label>
      <Input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
        required
      />
    </div>
  </>
);

export default JoinFormFields;
