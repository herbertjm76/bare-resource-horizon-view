
import React from 'react';

interface JoinContainerProps {
  children: React.ReactNode;
}

const JoinContainer: React.FC<JoinContainerProps> = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-lg">
      {children}
    </div>
  </div>
);

export default JoinContainer;
