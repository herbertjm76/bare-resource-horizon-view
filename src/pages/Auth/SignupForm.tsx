
import SignupFormContainer from "./SignupForm/SignupFormContainer";

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => (
  <SignupFormContainer onSwitchToLogin={onSwitchToLogin} />
);

export default SignupForm;
