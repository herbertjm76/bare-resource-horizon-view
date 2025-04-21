
import React from 'react';

interface JoinAuthToggleProps {
  isSignup: boolean;
  setIsSignup: (v: boolean) => void;
}

const JoinAuthToggle: React.FC<JoinAuthToggleProps> = ({ isSignup, setIsSignup }) => (
  <p className="text-white/80 text-center mt-4">
    {isSignup ? 'Already have an account?' : 'Need to create an account?'}
    <button
      type="button"
      onClick={() => setIsSignup(!isSignup)}
      className="ml-2 text-white underline"
    >
      {isSignup ? 'Sign In' : 'Sign Up'}
    </button>
  </p>
);

export default JoinAuthToggle;
