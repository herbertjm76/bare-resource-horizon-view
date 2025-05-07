
import React from 'react';
import { InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SignupFormMessagesProps {
  signupError: string | null;
  showConfirmationInfo: boolean;
  onSwitchToLogin: () => void;
}

const SignupFormMessages: React.FC<SignupFormMessagesProps> = ({ 
  signupError, 
  showConfirmationInfo,
  onSwitchToLogin 
}) => {
  return (
    <>
      {signupError && (
        <Alert className="bg-red-500/10 border border-red-500/30 mb-4 text-white">
          <InfoIcon className="h-4 w-4 text-red-300" />
          <AlertDescription className="text-white/90">
            {signupError}
          </AlertDescription>
        </Alert>
      )}

      {showConfirmationInfo && (
        <Alert className="bg-blue-500/10 border border-blue-500/30 mb-4 text-white">
          <InfoIcon className="h-4 w-4 text-blue-300" />
          <AlertDescription className="text-white/90">
            <p className="font-medium">Please check your email to confirm your account</p>
            <p className="mt-1">You'll need to click the confirmation link in your email before you can log in.</p>
            <Button 
              variant="link" 
              className="text-blue-300 p-0 h-auto mt-2" 
              onClick={onSwitchToLogin}
            >
              Go to login page
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default SignupFormMessages;
