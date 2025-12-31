
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { logger } from '@/utils/logger';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error message
    setErrorMessage(null);
    
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    
    try {
      logger.debug('LoginForm: Attempting to login with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('LoginForm: Login error:', error.message);
        
        if (error.message.includes('Email not confirmed')) {
          setErrorMessage('Please confirm your email before logging in. Check your inbox for a confirmation link.');
          toast.error('Please confirm your email before logging in');
        } else if (error.message.includes('Invalid login credentials')) {
          setErrorMessage('Invalid email or password. Please try again.');
          toast.error('Invalid email or password');
        } else {
          setErrorMessage(error.message);
          toast.error(error.message || 'Login failed');
        }
        setLoading(false);
        return;
      }
      
      if (!data.session) {
        console.error('LoginForm: No session returned after login');
        setErrorMessage('Login failed. Please try again.');
        toast.error('Login failed. Please try again.');
        setLoading(false);
        return;
      }
      
      logger.info('LoginForm: Login successful, user:', data.user?.id);
      toast.success('Login successful!');
      
      // Let the auth listener handle the redirection
      // Don't call navigate here to avoid race conditions
    } catch (error: any) {
      console.error('LoginForm: Unexpected error during login:', error);
      setErrorMessage(error.message || 'An unexpected error occurred');
      toast.error(error.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setErrorMessage('Please enter your email address to resend the confirmation link');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;
      toast.success('Confirmation email resent. Please check your inbox.');
    } catch (error: any) {
      console.error('LoginForm: Error resending confirmation email:', error);
      setErrorMessage(error.message || 'Failed to resend confirmation email');
      toast.error(error.message || 'Failed to resend confirmation email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleLogin}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-white/60 text-sm">Sign in to your account</p>
      </div>
      
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-300 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-white/90 text-sm">{errorMessage}</p>
            {errorMessage.includes('confirm your email') && (
              <button
                type="button"
                onClick={handleResendConfirmation}
                className="text-blue-300 text-sm underline mt-2 hover:text-blue-200 transition-colors"
              >
                Resend confirmation email
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-white/90 font-medium mb-2 text-sm">Email</label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all placeholder:text-white/40"
            required
            autoComplete="email"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-white/90 font-medium mb-2 text-sm">Password</label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all placeholder:text-white/40"
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>
      </div>
      
      <Button
        type="submit"
        disabled={loading}
        className="w-full py-6 text-base font-semibold bg-white text-primary hover:bg-white/90 rounded-xl transition-all shadow-lg hover:shadow-xl"
        isLoading={loading}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
      
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-white/80 hover:text-white text-sm transition-colors"
        >
          Need an account? <span className="font-semibold underline">Sign up</span>
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
