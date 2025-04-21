
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: ownerEmail,
        password: ownerPassword,
      });
      
      if (error) {
        // Specifically handle email not confirmed error
        if (error.message.includes('Email not confirmed')) {
          // Redirect to auth page with error parameter
          navigate('/auth?error=email_not_confirmed');
          return;
        }
        throw error;
      }
      
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleLogin}>
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Login</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="ownerEmail" className="block text-white font-medium mb-2">Email</label>
            <Input
              type="email"
              id="ownerEmail"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
              required
            />
          </div>
          <div>
            <label htmlFor="ownerPassword" className="block text-white font-medium mb-2">Password</label>
            <Input
              type="password"
              id="ownerPassword"
              value={ownerPassword}
              onChange={(e) => setOwnerPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
              required
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
        Log In
      </Button>
    </form>
  );
};

export default LoginForm;
