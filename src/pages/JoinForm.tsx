
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ensureUserProfile } from '@/utils/authHelpers';
import JoinFormFields from './JoinFormFields';
import JoinAuthToggle from './JoinAuthToggle';
import { joinSchema, loginSchema } from '@/utils/authValidation';

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

    try {
      if (isSignup) {
        // Validate signup inputs
        const validationResult = joinSchema.safeParse({
          email,
          password,
          firstName,
          lastName,
          inviteCode: effectiveInviteCode
        });

        if (!validationResult.success) {
          const firstError = validationResult.error.errors[0];
          toast.error(firstError.message);
          setLoading(false);
          return;
        }

        const validatedData = validationResult.data;

        // The invitation code would typically be checked server-side; for now, assume it's valid if present
        // Optionally: fetch company info here using inviteCodeInput

        // Register new user as a member of existing company
        const { data, error } = await supabase.auth.signUp({
          email: validatedData.email,
          password: validatedData.password,
          options: {
            data: {
              first_name: validatedData.firstName,
              last_name: validatedData.lastName,
              company_id: company?.id,
              role: 'member'
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          await ensureUserProfile(data.user.id, {
            email: validatedData.email,
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            companyId: company?.id,
            role: 'member'
          });
          
          // Add role to user_roles table
          await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role: 'member',
              company_id: company?.id
            });
          
          toast.success('Account created successfully! Please check your email for verification.');
          navigate(`/${company?.subdomain}/dashboard`);
        }
      } else {
        // Validate login inputs
        const loginValidation = loginSchema.safeParse({
          email,
          password
        });

        if (!loginValidation.success) {
          const firstError = loginValidation.error.errors[0];
          toast.error(firstError.message);
          setLoading(false);
          return;
        }

        const loginData = loginValidation.data;

        // Login existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginData.email,
          password: loginData.password,
        });

        if (error) throw error;

        // Verify user belongs to this company
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError || !profile) {
          await ensureUserProfile(data.user.id, {
            email,
            companyId: company?.id,
            role: 'member'
          });
        } else if (profile.company_id !== company?.id) {
          await supabase.auth.signOut();
          throw new Error('You are not a member of this company.');
        }

        toast.success('Login successful!');
        navigate(`/${company?.subdomain}/dashboard`);
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
