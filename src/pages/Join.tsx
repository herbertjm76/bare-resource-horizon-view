
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCompany } from '@/context/CompanyContext';

const Join: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(true);
  const navigate = useNavigate();
  const { company } = useCompany();
  const { inviteCode } = useParams<{ inviteCode?: string }>();

  useEffect(() => {
    // In a real app, the invite code would be validated against a table of invites
    // For this demo, we'll just use the company data from context
    if (company) {
      setCompanyName(company.name);
    }
  }, [company]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        // Register new user with metadata
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              company_id: company?.id,
              role: 'member'
            }
          }
        });

        if (error) throw error;

        // Add an additional manual profile creation as backup
        if (data.user) {
          try {
            // Check if profile exists first
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
            
            // If no profile exists, create one
            if (!existingProfile) {
              console.log('No profile found, creating a new one...');
              const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                  id: data.user.id,
                  email,
                  first_name: firstName,
                  last_name: lastName,
                  company_id: company?.id,
                  role: 'member'
                });

              if (profileError) {
                console.error('Profile creation error:', profileError);
              }
            }
          } catch (profileCheckError) {
            // If checking the profile fails (likely doesn't exist), create a new one
            console.log('Creating profile as a fallback...');
            await supabase
              .from('profiles')
              .upsert({
                id: data.user.id,
                email,
                first_name: firstName,
                last_name: lastName,
                company_id: company?.id,
                role: 'member'
              });
          }
          
          toast.success('Account created successfully! Please check your email for verification.');
          navigate('/dashboard');
        }
      } else {
        // Login existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Check if user belongs to this company
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        if (profile.company_id !== company?.id) {
          await supabase.auth.signOut();
          throw new Error('You are not a member of this company.');
        }

        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Join {companyName || 'Company'}
        </h2>
        <p className="text-white/80 text-center mb-6">
          {isSignup ? 'Create an account to join the team' : 'Sign in to your account'}
        </p>
        
        <form onSubmit={handleAuth} className="space-y-4">
          {isSignup && (
            <>
              <div>
                <label htmlFor="firstName" className="block text-white/80 mb-2">First Name</label>
                <Input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-white/80 mb-2">Last Name</label>
                <Input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
                  required
                />
              </div>
            </>
          )}
          <div>
            <label htmlFor="email" className="block text-white/80 mb-2">Email</label>
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
            <label htmlFor="password" className="block text-white/80 mb-2">Password</label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-lg hover:bg-white/20 transition-all duration-300"
            disabled={loading}
          >
            {loading ? 'Processing...' : isSignup ? 'Create Account' : 'Sign In'}
          </Button>
          <p className="text-white/80 text-center mt-4">
            {isSignup ? 'Already have an account?' : 'Need to create an account?'}
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="ml-2 text-white underline"
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Join;
