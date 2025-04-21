
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CompanyRegistrationForm } from '@/components/CompanyRegistrationForm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/dashboard');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please provide both email and password');
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setUserId(data.user.id);
        setShowCompanyForm(true);
        toast.success('Sign up successful! Please complete your company registration.');
      } else {
        toast.info('Please check your email for the confirmation link.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySuccess = (companyId: string) => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          BareResource Pro
        </h2>
        
        {showCompanyForm && userId ? (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Register Your Company</h3>
            <CompanyRegistrationForm onSuccess={handleCompanySuccess} userId={userId} />
          </div>
        ) : (
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-white mb-2">Email</label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-white mb-2">Password</label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
                required
              />
            </div>
            <div className="flex space-x-4">
              <Button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                className="flex-1 bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                {loading ? 'Loading...' : 'Login'}
              </Button>
              <Button
                type="button"
                onClick={handleSignUp}
                disabled={loading}
                className="flex-1 bg-white/5 backdrop-blur-sm text-white px-6 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                {loading ? 'Loading...' : 'Sign Up'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
