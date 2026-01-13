import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/rbac';

interface PackingRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export function PackingRoute({ children, requiredPermission }: PackingRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has packing role or is main admin
  const isPackingRole = user?.role === 'hub_packing' || user?.role === 'store_packing' || 
                       user?.role === 'hub_main_admin' || user?.role === 'store_main_admin';
  
  if (!isPackingRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // If specific permission is required, check it
  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Helper function to check if user should see packing-restricted content
export function isPackingUser(user: any): boolean {
  return user?.role === 'hub_packing' || user?.role === 'store_packing' || 
         user?.role === 'hub_main_admin' || user?.role === 'store_main_admin';
}

// Helper function to check if packing user can access specific report
export function canAccessPackingReport(user: any, reportType: string): boolean {
  if (!isPackingUser(user)) return false;
  
  // Packing users can only access packing reports
  const allowedReports = ['packing'];
  return allowedReports.includes(reportType);
}
