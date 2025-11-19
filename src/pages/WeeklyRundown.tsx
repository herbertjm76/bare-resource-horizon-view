import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Redirect to unified weekly overview page
const WeeklyRundown = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/weekly-overview', { replace: true });
  }, [navigate]);
  
  return null;
};

export default WeeklyRundown;
