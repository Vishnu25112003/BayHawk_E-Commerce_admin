import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProcurementOrCuttingRouteProps {
  children: React.ReactNode;
}

export function ProcurementOrCuttingRoute({ children }: ProcurementOrCuttingRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Allow procurement, cutting/cleaning, and main admin roles
  const hasAccess = user?.role === 'hub_procurement' || 
                    user?.role === 'store_procurement' || 
                    user?.role === 'hub_cutting_cleaning' || 
                    user?.role === 'store_cutting_cleaning' || 
                    user?.role === 'hub_main_admin' || 
                    user?.role === 'store_main_admin';
  
  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
