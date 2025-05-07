
import React from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from "react-hook-form";
import OwnerInfoFields from "./OwnerInfoFields";
import CompanyInfoFields from "./CompanyInfoFields";
import { CompanyFormData, emptyCompany } from '../companyHelpers';
import { useSignupForm } from './useSignupForm';
import SignupFormMessages from './SignupFormMessages';

interface SignupFormContainerProps {
  onSwitchToLogin: () => void;
}

const SignupFormContainer: React.FC<SignupFormContainerProps> = ({ onSwitchToLogin }) => {
  const { 
    formState: { 
      ownerFirstName, ownerLastName, ownerEmail, ownerPassword,
      company, subdomainCheck, loading, showConfirmationInfo, signupError
    },
    handleOwnerChange,
    handleCompanyChange,
    handleSignUp
  } = useSignupForm(onSwitchToLogin);

  const form = useForm<CompanyFormData>({ defaultValues: emptyCompany });
  const { watch, setValue, formState: { errors } } = form;

  // Keep form values in sync with company state
  React.useEffect(() => {
    Object.entries(company).forEach(([key, value]) => {
      setValue(key as keyof CompanyFormData, value);
    });
  }, [company, setValue]);

  return (
    <form className="space-y-4" onSubmit={handleSignUp} autoComplete="off">
      <h2 className="text-2xl font-extrabold text-white mb-1 text-center">Sign Up & Register Company</h2>
      <p className="text-white/70 text-center mb-6">Complete your details to create your account and register your company in one step.</p>

      <SignupFormMessages 
        signupError={signupError} 
        showConfirmationInfo={showConfirmationInfo} 
        onSwitchToLogin={onSwitchToLogin} 
      />

      <OwnerInfoFields
        ownerFirstName={ownerFirstName}
        setOwnerFirstName={(value) => handleOwnerChange('ownerFirstName', value)}
        ownerLastName={ownerLastName}
        setOwnerLastName={(value) => handleOwnerChange('ownerLastName', value)}
        ownerEmail={ownerEmail}
        setOwnerEmail={(value) => handleOwnerChange('ownerEmail', value)}
        ownerPassword={ownerPassword}
        setOwnerPassword={(value) => handleOwnerChange('ownerPassword', value)}
      />

      <CompanyInfoFields
        company={company}
        handleCompanyChange={handleCompanyChange}
        watch={watch}
        setValue={setValue}
        errors={errors}
        subdomainCheck={subdomainCheck}
      />

      <Button
        type="submit"
        disabled={loading || showConfirmationInfo}
        className="w-full mt-4"
        isLoading={loading}
      >
        Sign Up & Register Company
      </Button>
      
      {showConfirmationInfo && (
        <p className="text-center text-white/70 text-sm mt-2">
          You need to confirm your email before logging in
        </p>
      )}

      <div className="text-center mt-4">
        <button
          type="button" 
          onClick={onSwitchToLogin}
          className="text-white/70 hover:text-white underline text-sm"
        >
          Already have an account? Log in
        </button>
      </div>
    </form>
  );
};

export default SignupFormContainer;
