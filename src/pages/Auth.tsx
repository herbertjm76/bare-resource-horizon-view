
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import LoginForm from './Auth/LoginForm';
import SignupForm from './Auth/SignupForm';
import { AlertCircle, Link2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const showSignup = searchParams.get('signup') === 'true';
  const [isLogin, setIsLogin] = useState(!showSignup);
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
    let mounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;
    
    const checkSession = async () => {
      try {
        console.log('Auth page: Checking session');
        
        // First set up auth state change listener to catch immediate events
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          console.log('Auth page: Auth state changed:', event, session?.user?.id);
          
          if (!mounted) return;
          
          if (event === 'SIGNED_IN' && session) {
            console.log('Auth page: User signed in, redirecting to dashboard');
            toast.success('Successfully signed in!');
            navigate('/dashboard');
          }
        });
        
        authSubscription = data.subscription;
        
        // Check for existing session
        const { data: sessionData, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth page: Session check error:', error);
          if (mounted) setIsCheckingSession(false);
          return;
        }
        
        if (sessionData.session) {
          console.log('Auth page: User already logged in, redirecting to dashboard');
          navigate('/dashboard');
        } else {
          console.log('Auth page: No active session found');
          if (mounted) setIsCheckingSession(false);
        }
      } catch (err) {
        console.error('Auth page: Error checking session:', err);
        if (mounted) setIsCheckingSession(false);
      }
    };
    
    checkSession();
    
    return () => {
      console.log('Auth page: Cleaning up');
      mounted = false;
      if (authSubscription) authSubscription.unsubscribe();
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
        <div className="flex flex-col items-center bg-white/10 p-6 rounded-lg shadow-lg border border-white/20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
          <p className="text-white mt-4">Checking login status...</p>
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
      </div>
    </div>
  );
};

export default Auth;
