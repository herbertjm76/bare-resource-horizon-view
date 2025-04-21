
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

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
      console.log('Attempting to login with:', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error.message);
        
        // Handle specific error cases
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
        return;
      }
      
      if (!data.session) {
        console.error('No session returned after login');
        setErrorMessage('Login failed. Please try again.');
        toast.error('Login failed. Please try again.');
        return;
      }
      
      console.log('Login successful, user:', data.user?.id);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Unexpected error during login:', error);
      setErrorMessage(error.message || 'An unexpected error occurred');
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
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
      console.error('Error resending confirmation email:', error);
      setErrorMessage(error.message || 'Failed to resend confirmation email');
      toast.error(error.message || 'Failed to resend confirmation email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleLogin}>
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Login</h2>
        
        {errorMessage && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-md p-3 mb-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-white text-sm">{errorMessage}</p>
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
            <label htmlFor="email" className="block text-white font-medium mb-2">Email</label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
              required
              autoComplete="email"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-white font-medium mb-2">Password</label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full"
        isLoading={loading}
      >
        {loading ? 'Logging in...' : 'Log In'}
      </Button>
    </form>
  );
};

export default LoginForm;
