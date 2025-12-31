
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ensureUserProfile } from '@/utils/authHelpers';
import JoinFormFields from './JoinFormFields';
import JoinAuthToggle from './JoinAuthToggle';
import { joinSchema, loginSchema } from '@/utils/authValidation';
import { logger } from '@/utils/logger';

interface JoinFormProps {
  companyName: string;
  company?: { id: string; [k: string]: any };
  inviteCode?: string;
  onAuthModeChange?: (isSignup: boolean) => void;
}
  companyName: string;
  company?: { id: string; [k: string]: any };
  inviteCode?: string;
  onAuthModeChange?: (isSignup: boolean) => void;
}

const JoinForm: React.FC<JoinFormProps> = ({ companyName, company, inviteCode, onAuthModeChange }) => {
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(true);
  const [isEmailLocked, setIsEmailLocked] = useState(false);
  const navigate = useNavigate();

  // Pre-fill email from invite code if available
  useEffect(() => {
    const fetchInviteDetails = async () => {
      if (!inviteCode) return;

      logger.debug('Fetching invite details for code:', inviteCode);

      const { data: invite, error } = await supabase
        .from('invites')
        .select('*')
        .eq('code', inviteCode)
        .eq('status', 'pending')
        .maybeSingle();

      logger.debug('Invite data:', invite);
      logger.debug('Invite error:', error);

      if (!error && invite) {
        logger.debug('Invite type:', invite.invitation_type);
        logger.debug('Invite email:', invite.email);
        
        // Pre-fill email if invite has an email address
        if (invite.email) {
          logger.debug('Setting email to:', invite.email);
          setEmail(invite.email);
          setIsEmailLocked(true);
        }
        if (invite.first_name) setFirstName(invite.first_name);
        if (invite.last_name) setLastName(invite.last_name);
      }
    };

    fetchInviteDetails();
  }, [inviteCode]);

  const handleAuthModeChange = (newIsSignup: boolean) => {
    setIsSignup(newIsSignup);
    onAuthModeChange?.(newIsSignup);
  };

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

        // Validate invite code if provided
        let inviteRecord = null;
        if (effectiveInviteCode) {
          const { data: invite, error: inviteError } = await supabase
            .from('invites')
            .select('*')
            .eq('code', effectiveInviteCode)
            .eq('status', 'pending')
            .maybeSingle();

          if (inviteError) {
            console.error('Error validating invite:', inviteError);
            toast.error('Error validating invite code');
            setLoading(false);
            return;
          }

          if (!invite) {
            toast.error('Invalid or expired invite code');
            setLoading(false);
            return;
          }

          // Verify the invite belongs to the company from URL
          if (company?.id && invite.company_id !== company.id) {
            toast.error('This invite is for a different company');
            setLoading(false);
            return;
          }

          // Validate email match for email_invite type
          if (invite.email && invite.email !== validatedData.email) {
            toast.error('This invite is for a different email address');
            setLoading(false);
            return;
          }

          inviteRecord = invite;
        }

        // Use role from invite if available, otherwise default to member
        const inviteRole = inviteRecord?.role || 'member';

        // Register new user as a member of existing company
        const { data, error } = await supabase.auth.signUp({
          email: validatedData.email,
          password: validatedData.password,
          options: {
            data: {
              first_name: validatedData.firstName,
              last_name: validatedData.lastName,
              company_id: company?.id,
              role: inviteRole
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
            role: inviteRole
          });
          
          // Add role to user_roles table
          await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role: inviteRole as any,
              company_id: company?.id
            });

          // Mark invite as accepted if it was used
          if (inviteRecord) {
            await supabase
              .from('invites')
              .update({
                status: 'accepted',
                accepted_by: data.user.id,
                accepted_at: new Date().toISOString()
              })
              .eq('id', inviteRecord.id);
          }
          
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
      {/* Only show invite code field if inviteCode is NOT present AND user is signing up */}
      {!inviteCode && isSignup && (
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
        isEmailLocked={isEmailLocked}
      />
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Processing...' : isSignup ? 'Join Company' : 'Sign In'}
      </Button>
      <JoinAuthToggle isSignup={isSignup} setIsSignup={handleAuthModeChange} />
    </form>
  );
};

export default JoinForm;
