import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/rbac';

interface DeliveryRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export function DeliveryRoute({ children, requiredPermission }: DeliveryRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has delivery role or is main admin
  const isDeliveryRole = user?.role === 'hub_delivery' || user?.role === 'store_delivery' || 
                        user?.role === 'hub_main_admin' || user?.role === 'store_main_admin';
  
  if (!isDeliveryRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // If specific permission is required, check it
  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Helper function to check if user should see delivery-restricted content
export function isDeliveryUser(user: any): boolean {
  return user?.role === 'hub_delivery' || user?.role === 'store_delivery' || 
         user?.role === 'hub_main_admin' || user?.role === 'store_main_admin';
}

// Helper function to check if delivery user can access specific report
export function canAccessDeliveryReport(user: any, reportType: string): boolean {
  if (!isDeliveryUser(user)) return false;
  
  // Delivery users can only access delivery reports
  const allowedReports = ['delivery'];
  return allowedReports.includes(reportType);
}
