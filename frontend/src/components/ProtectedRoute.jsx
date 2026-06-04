import { Navigate } from 'react-router-dom';
import { useJourneyAccess } from '../hooks/useJourneyAccess';

export function JourneyRoute({ children }) {
  const { isUnlocked } = useJourneyAccess();
  if (!isUnlocked()) {
    return <Navigate to="/" replace />;
  }
  return children;
}
