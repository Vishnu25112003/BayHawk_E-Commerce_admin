import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface CuttingRouteProps {
  children: React.ReactNode;
}

export function CuttingRoute({ children }: CuttingRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isCuttingRole = user?.role === 'hub_cutting_cleaning' || user?.role === 'store_cutting_cleaning' || 
                        user?.role === 'hub_main_admin' || user?.role === 'store_main_admin';
  
  if (!isCuttingRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
