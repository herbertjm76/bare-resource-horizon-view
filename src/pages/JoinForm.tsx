
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
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const effectiveInviteCode = inviteCode ?? inviteCodeInput;

    // Validate invite code if needed
    if (!inviteCode && !inviteCodeInput) {
      setError('Please enter an invite code.');
      toast.error('Please enter an invite code.');
      setLoading(false);
      return;
    }

    try {
      console.log(`Join form: ${isSignup ? 'Signup' : 'Login'} attempt for company:`, companyName);
      console.log('Company ID:', company?.id);
      
      if (isSignup) {
        if (!firstName || !lastName || !email || !password) {
          setError('Please fill in all required fields');
          toast.error('Please fill in all required fields');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters long');
          toast.error('Password must be at least 6 characters long');
          setLoading(false);
          return;
        }

        console.log('Signing up new user as company member...');
        
        // Register new user as a member of existing company
        const { data, error: signupError } = await supabase.auth.signUp({
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

        if (signupError) {
          console.error('Signup error:', signupError);
          setError(signupError.message);
          toast.error(signupError.message || 'Sign up failed');
          setLoading(false);
          return;
        }

        console.log('Signup successful, user ID:', data.user?.id);

        if (data.user) {
          // Give a small delay for the auth system to stabilize
          setTimeout(async () => {
            try {
              // Manual profile creation as a fallback
              const profileResult = await ensureUserProfile(data.user!.id, {
                email,
                firstName,
                lastName,
                companyId: company?.id,
                role: 'member'
              });
              
              console.log('Profile creation result:', profileResult);
              
              toast.success('Account created successfully! Please check your email for verification.');
              navigate('/dashboard');
            } catch (profileError: any) {
              console.error('Error ensuring user profile:', profileError);
              setError(`Account created but profile setup failed: ${profileError.message}`);
              toast.error('Account created but profile setup failed');
              setLoading(false);
            }
          }, 300);
        } else {
          // This should rarely happen, but handle it just in case
          setError('Sign up response missing user data');
          toast.error('Sign up response missing user data');
          setLoading(false);
        }
      } else {
        // Login existing user
        console.log('Signing in existing user...');
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (loginError) {
          console.error('Login error:', loginError);
          setError(loginError.message);
          toast.error(loginError.message || 'Login failed');
          setLoading(false);
          return;
        }

        console.log('Login successful, verifying company membership...');
        
        // Small delay before verifying company membership
        setTimeout(async () => {
          try {
            // Verify user belongs to this company
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('company_id')
              .eq('id', data.user.id)
              .maybeSingle();
    
            if (profileError) {
              console.error('Error fetching profile:', profileError);
              try {
                await ensureUserProfile(data.user.id, {
                  email,
                  companyId: company?.id,
                  role: 'member'
                });
              } catch (ensureError) {
                console.error('Profile creation failed:', ensureError);
              }
            } else if (!profile) {
              console.log('No profile found, creating one...');
              try {
                await ensureUserProfile(data.user.id, {
                  email,
                  companyId: company?.id,
                  role: 'member'
                });
              } catch (createError) {
                console.error('Profile creation failed:', createError);
              }
            } else if (profile.company_id !== company?.id) {
              console.error('User belongs to a different company');
              await supabase.auth.signOut();
              setError('You are not a member of this company.');
              toast.error('You are not a member of this company.');
              setLoading(false);
              return;
            }
    
            toast.success('Login successful!');
            navigate('/dashboard');
          } catch (verifyError) {
            console.error('Error verifying company membership:', verifyError);
            setLoading(false);
          }
        }, 300);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.message || 'Authentication failed. Please try again.');
      toast.error(error.message || 'Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAuth} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-md text-white text-sm">
          {error}
        </div>
      )}
      
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
