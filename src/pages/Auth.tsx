
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { emptyCompany } from './Auth/companyHelpers';
import LoginForm from './Auth/LoginForm';
import SignupForm from './Auth/SignupForm';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check for error parameters in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorCode = params.get('error');
    const errorDescription = params.get('error_description');
    
    if (errorCode === 'email_not_confirmed') {
      setError('Please confirm your email address before logging in. Check your inbox for a confirmation link.');
    } else if (errorCode && errorDescription) {
      setError(`${errorDescription}`);
    }
  }, [location]);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/dashboard');
      }
    };
    
    checkSession();
  }, [navigate]);

  const resendConfirmationEmail = async () => {
    const email = prompt('Please enter your email address to resend the confirmation link:');
    if (!email) return;
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      toast.success('Confirmation email resent. Please check your inbox.');
      setError(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend confirmation email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 p-4">
      <div className="w-full max-w-xl glass rounded-2xl p-8 shadow-lg border border-white/20">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          BareResource Pro
        </h1>
        
        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/30 text-white">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription className="mt-2">
              {error}
              {error.includes('confirm your email') && (
                <button 
                  onClick={resendConfirmationEmail}
                  className="block mt-2 text-blue-300 underline hover:text-blue-200 transition-colors"
                >
                  Resend confirmation email
                </button>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        {isLogin ? (
          <LoginForm
            onSwitchToSignup={() => {
              setIsLogin(false);
              setError(null);
            }}
          />
        ) : (
          <SignupForm
            onSwitchToLogin={() => {
              setIsLogin(true);
              setError(null);
            }}
          />
        )}
        
        <div className="mt-6 text-center">
          {isLogin ? (
            <span className="text-white/80 text-sm">
              Don&apos;t have an account?{" "}
              <a
                href="#"
                onClick={e => {
                  e.preventDefault(); 
                  setIsLogin(false);
                  setError(null);
                }}
                className="underline text-white font-medium hover:text-pink-200 focus:outline-none bg-transparent border-none p-0 m-0"
                tabIndex={0}
              >
                Sign up
              </a>
            </span>
          ) : (
            <span className="text-white/80 text-sm">
              Already have an account?{" "}
              <a
                href="#"
                onClick={e => {
                  e.preventDefault(); 
                  setIsLogin(true);
                  setError(null);
                }}
                className="underline text-white font-medium hover:text-blue-200 focus:outline-none bg-transparent border-none p-0 m-0"
                tabIndex={0}
              >
                Log in
              </a>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
