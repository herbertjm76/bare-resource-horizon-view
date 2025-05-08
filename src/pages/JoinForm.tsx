
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ensureUserProfile } from '@/utils/authHelpers';
import JoinFormFields from './JoinFormFields';
import JoinAuthToggle from './JoinAuthToggle';

interface JoinFormProps {
  companyName: string;
  company?: { id: string; [k: string]: any };
  inviteCode?: string;
}

const JoinForm: React.FC<JoinFormProps> = ({ companyName, company, inviteCode }) => {
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(true);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const effectiveInviteCode = inviteCode ?? inviteCodeInput;

    // Validate invite code if needed
    if (!inviteCode && !inviteCodeInput) {
      toast.error('Please enter an invite code.');
      setLoading(false);
      return;
    }

    try {
      console.log(`Join form: ${isSignup ? 'Signup' : 'Login'} attempt for company:`, companyName);
      console.log('Company ID:', company?.id);
      
      if (isSignup) {
        if (!firstName || !lastName || !email || !password) {
          toast.error('Please fill in all required fields');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          toast.error('Password must be at least 6 characters long');
          setLoading(false);
          return;
        }

        console.log('Signing up new user as company member...');
        
        // Register new user as a member of existing company
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              company_id: company?.id,
              role: 'member'
            },
            emailRedirectTo: window.location.origin + '/auth'
          }
        });

        if (error) throw error;

        console.log('Signup successful, user ID:', data.user?.id);

        if (data.user) {
          // Manual profile creation as a fallback
          await ensureUserProfile(data.user.id, {
            email,
            firstName,
            lastName,
            companyId: company?.id,
            role: 'member'
          });
          
          toast.success('Account created successfully! Please check your email for verification.');
          navigate('/dashboard');
        }
      } else {
        // Login existing user
        console.log('Signing in existing user...');
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        console.log('Login successful, verifying company membership...');
        
        // Verify user belongs to this company
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          await ensureUserProfile(data.user.id, {
            email,
            companyId: company?.id,
            role: 'member'
          });
        } else if (!profile) {
          console.log('No profile found, creating one...');
          await ensureUserProfile(data.user.id, {
            email,
            companyId: company?.id,
            role: 'member'
          });
        } else if (profile.company_id !== company?.id) {
          console.error('User belongs to a different company');
          await supabase.auth.signOut();
          throw new Error('You are not a member of this company.');
        }

        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error(error.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAuth} className="space-y-4">
      {/* Only show invite code field if inviteCode is NOT present */}
      {!inviteCode && (
        <div>
          <label htmlFor="inviteCode" className="block text-white/80 mb-2">Invite Code</label>
          <input
            type="text"
            id="inviteCode"
            value={inviteCodeInput}
            onChange={(e) => setInviteCodeInput(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/50"
            required
            autoComplete="off"
            placeholder="Enter invite code"
          />
        </div>
      )}
      <JoinFormFields
        isSignup={isSignup}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
      />
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Processing...' : isSignup ? 'Join Company' : 'Sign In'}
      </Button>
      <JoinAuthToggle isSignup={isSignup} setIsSignup={setIsSignup} />
    </form>
  );
};

export default JoinForm;
