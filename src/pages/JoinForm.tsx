
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useCompany } from '@/context/CompanyContext';
import { ensureUserProfile } from '@/utils/authHelpers';
import JoinFormFields from './JoinFormFields';
import JoinAuthToggle from './JoinAuthToggle';

interface JoinFormProps {
  companyName: string;
  company?: { id: string, [k: string]: any };
  inviteCode?: string;
}

const JoinForm: React.FC<JoinFormProps> = ({ companyName, company, inviteCode }) => {
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

    try {
      if (isSignup) {
        if (!firstName || !lastName || !email || !password) {
          toast.error('Please fill in all required fields');
          setLoading(false);
          return;
        }

        console.log(`Attempting to sign up user with email: ${email}`);
        
        // Explicitly cast role to a string to avoid type issues
        const role = 'member';
        
        // Register new user with metadata
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              company_id: company?.id,
              role: role
            }
          }
        });

        if (error) {
          console.error('Signup error:', error);
          throw error;
        }

        console.log('User created successfully:', data.user?.id);

        // Ensure profile is created for this user
        if (data.user) {
          // Wait to allow database trigger to work
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Try multiple times to create the profile
          let profileCreated = false;
          for (let attempt = 1; attempt <= 3; attempt++) {
            console.log(`Attempt ${attempt} to create profile for user ${data.user.id}`);
            
            profileCreated = await ensureUserProfile(data.user.id, {
              email,
              firstName,
              lastName,
              companyId: company?.id,
              role: role // Pass role as a string
            });
            
            if (profileCreated) {
              console.log('Profile created or verified successfully on attempt', attempt);
              break;
            } else if (attempt < 3) {
              console.log(`Profile creation failed on attempt ${attempt}, retrying...`);
              await new Promise(resolve => setTimeout(resolve, 1500));
            } else {
              console.warn('All profile creation attempts failed');
            }
          }
          
          // Direct insert fallback (as a last resort)
          if (!profileCreated) {
            try {
              console.log('Attempting direct profile insert as fallback');
              const { error: directInsertError } = await supabase
                .from('profiles')
                .upsert({
                  id: data.user.id,
                  email: email,
                  first_name: firstName,
                  last_name: lastName,
                  company_id: company?.id,
                  role: role // Use string value directly
                });
                
              if (directInsertError) {
                console.warn('Direct profile insert fallback also failed:', directInsertError.message);
              } else {
                profileCreated = true;
                console.log('Direct profile insert fallback succeeded');
              }
            } catch (fallbackError) {
              console.error('Error in direct profile insert fallback:', fallbackError);
            }
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
          .maybeSingle(); // Use maybeSingle instead of single to avoid errors if not found

        if (profileError || !profile) {
          // If profile doesn't exist, try to create it
          const profileCreated = await ensureUserProfile(data.user.id, {
            email,
            companyId: company?.id,
            role: 'member' // Use string value directly
          });
          
          if (!profileCreated) {
            throw new Error('Could not verify your account. Please contact support.');
          }
        } else if (profile.company_id !== company?.id) {
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
        className="w-full bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-lg hover:bg-white/20 transition-all duration-300"
        disabled={loading}
      >
        {loading ? 'Processing...' : isSignup ? 'Create Account' : 'Sign In'}
      </Button>
      <JoinAuthToggle isSignup={isSignup} setIsSignup={setIsSignup} />
    </form>
  );
};

export default JoinForm;
