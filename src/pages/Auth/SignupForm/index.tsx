
import SignupFormContainer from "./SignupFormContainer";
import { ensureUserProfile } from "@/utils/authHelpers";

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => (
  <SignupFormContainer 
    onSwitchToLogin={onSwitchToLogin} 
    ensureProfile={ensureUserProfile}
  />
);

export default SignupForm;
