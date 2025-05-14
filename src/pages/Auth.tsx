
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import LoginForm from './Auth/LoginForm';
import SignupForm from './Auth/SignupForm';
import { AlertCircle, Link2, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { checkUserSessionAndProfile } from '@/utils/authHelpers';

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const showSignup = searchParams.get('signup') === 'true';
  const [isLogin, setIsLogin] = useState(!showSignup);
  const [error, setError] = useState<string | null>(null);
  const [showConfigHelp, setShowConfigHelp] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check for error parameters in URL
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const errorCode = params.get('error');
      const errorDescription = params.get('error_description');
      
      console.log('Auth page: URL parameters:', {
        errorCode,
        errorDescription,
        search: location.search
      });
      
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
    } catch (err) {
      console.error('Error parsing URL parameters:', err);
    }
  }, [location]);

  // Check if user is already logged in - improved implementation
  useEffect(() => {
    console.log('Auth page: Checking session status');
    let mounted = true;
    
    // Set up auth state change listener first to catch immediate events
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (!mounted) return;
      
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in, ensuring profile exists');
        
        // Don't redirect immediately, ensure profile exists first
        setIsProcessing(true);
        
        // Use setTimeout to avoid potential deadlocks
        setTimeout(async () => {
          if (!mounted) return;
          
          try {
            // Ensure profile exists
            const profileExists = await checkUserSessionAndProfile();
            
            if (profileExists) {
              console.log('Profile confirmed, redirecting to dashboard');
              toast.success('Successfully signed in!');
              navigate('/dashboard');
            } else {
              console.error('Failed to ensure user profile exists');
              setError('Your account was created but there was an issue setting up your profile. Please try again or contact support.');
              setIsCheckingSession(false);
              setIsProcessing(false);
            }
          } catch (err) {
            console.error('Error in profile check:', err);
            setIsCheckingSession(false);
            setIsProcessing(false);
          }
        }, 500);
      }
    });
    
    // Then check for existing session
    const checkSession = async () => {
      try {
        const { data: sessionData, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          if (mounted) setIsCheckingSession(false);
          return;
        }
        
        if (sessionData.session) {
          console.log('User already logged in, ensuring profile exists');
          setIsProcessing(true);
          
          // Small delay to ensure database is updated
          setTimeout(async () => {
            if (!mounted) return;
            
            try {
              // Check if profile exists and create if needed
              const profileExists = await checkUserSessionAndProfile();
              
              if (profileExists) {
                console.log('Profile confirmed, redirecting to dashboard');
                navigate('/dashboard');
              } else {
                console.error('Failed to ensure user profile exists');
                setError('There was an issue accessing your profile. Please try signing in again or contact support.');
                setIsCheckingSession(false);
                setIsProcessing(false);
              }
            } catch (err) {
              console.error('Error in profile check:', err);
              setIsCheckingSession(false);
              setIsProcessing(false);
            }
          }, 500);
        } else {
          console.log('No active session found');
          if (mounted) setIsCheckingSession(false);
        }
      } catch (err) {
        console.error('Error checking session:', err);
        if (mounted) setIsCheckingSession(false);
      }
    };
    
    checkSession();
    
    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const resendConfirmationEmail = async () => {
    const email = prompt('Please enter your email address to resend the confirmation link:');
    if (!email) return;
    
    try {
      setIsProcessing(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      toast.success('Confirmation email resent. Please check your inbox.');
      setError(null);
    } catch (err: any) {
      console.error('Error resending confirmation email:', err);
      toast.error(err.message || 'Failed to resend confirmation email.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setIsCheckingSession(true);
    setError(null);
    setShowConfigHelp(false);
    window.location.reload();
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
                  disabled={isProcessing}
                  className="block mt-2 text-blue-300 underline hover:text-blue-200 transition-colors"
                >
                  {isProcessing ? 'Processing...' : 'Resend confirmation email'}
                </button>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRetry}
                className="mt-3 bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Retry
              </Button>
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
              <p className="mt-2">Current URL: {window.location.origin}</p>
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
