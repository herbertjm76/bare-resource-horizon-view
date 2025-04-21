
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import LoginForm from './Auth/LoginForm';
import SignupForm from './Auth/SignupForm';
import { AlertCircle, Link2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfigHelp, setShowConfigHelp] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Check for error parameters in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorCode = params.get('error');
    const errorDescription = params.get('error_description');
    
    if (errorCode === 'email_not_confirmed') {
      setError('Please confirm your email address before logging in. Check your inbox for a confirmation link.');
    } else if (errorCode === 'invalid_request') {
      setError('The verification link is invalid or has expired. If you\'re trying to verify your email, please try requesting a new confirmation email.');
      setShowConfigHelp(true);
    } else if (errorCode && errorDescription) {
      setError(`${errorDescription}`);
      if (errorDescription.includes('invalid') || errorDescription.includes('expired')) {
        setShowConfigHelp(true);
      }
    }
  }, [location]);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsCheckingSession(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          return;
        }
        
        if (data.session) {
          console.log('User already logged in, redirecting to dashboard');
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Error checking session:', err);
      } finally {
        setIsCheckingSession(false);
      }
    };
    
    checkSession();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN' && session) {
        toast.success('Successfully signed in!');
        navigate('/dashboard');
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
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

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 p-4">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
          <p className="text-white mt-4">Checking authentication status...</p>
        </div>
      </div>
    );
  }

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
              {(error.includes('confirm your email') || error.includes('verification link') || error.includes('invalid')) && (
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
        
        {showConfigHelp && (
          <Alert className="mb-6 bg-blue-500/10 border-blue-500/30 text-white">
            <Link2 className="h-4 w-4" />
            <AlertTitle>Configuration Help</AlertTitle>
            <AlertDescription className="mt-2">
              <p>This error often occurs when the Supabase Site URL and Redirect URL are not properly configured.</p>
              <p className="mt-2">For administrators: Please ensure that your Supabase project has the correct Site URL and Redirect URLs configured in the Authentication settings.</p>
            </AlertDescription>
          </Alert>
        )}
        
        {isLogin ? (
          <LoginForm
            onSwitchToSignup={() => {
              setIsLogin(false);
              setError(null);
              setShowConfigHelp(false);
            }}
          />
        ) : (
          <SignupForm
            onSwitchToLogin={() => {
              setIsLogin(true);
              setError(null);
              setShowConfigHelp(false);
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
                  setShowConfigHelp(false);
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
                  setShowConfigHelp(false);
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
