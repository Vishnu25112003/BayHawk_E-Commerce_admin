import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/rbac';

interface ProcurementRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export function ProcurementRoute({ children, requiredPermission }: ProcurementRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has procurement role or is main admin
  const isProcurementRole = user?.role === 'hub_procurement' || user?.role === 'store_procurement' || 
                           user?.role === 'hub_main_admin' || user?.role === 'store_main_admin';
  
  if (!isProcurementRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // If specific permission is required, check it
  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Helper function to check if user should see procurement-restricted content
export function isProcurementUser(user: any): boolean {
  return user?.role === 'hub_procurement' || user?.role === 'store_procurement' || 
         user?.role === 'hub_main_admin' || user?.role === 'store_main_admin';
}

// Helper function to check if procurement user can access specific report
export function canAccessProcurementReport(user: any, reportType: string): boolean {
  if (!isProcurementUser(user)) return false;
  
  // Procurement users can only access stock and procurement reports
  const allowedReports = ['stock', 'procurement'];
  return allowedReports.includes(reportType);
}
