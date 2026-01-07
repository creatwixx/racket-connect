import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!authService.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

