import { useAuth } from '../context/AuthContext';
import { getFilteredMenuByUser } from '../utils/menuConfig';

export function MenuDebugger() {
  const { user } = useAuth();
  
  if (!user) return <div>No user logged in</div>;
  
  const menuItems = getFilteredMenuByUser(user.loginType, user.role);
  
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Menu Debug Info</h2>
      <div className="mb-4">
        <p><strong>User Role:</strong> {user.role}</p>
        <p><strong>Login Type:</strong> {user.loginType}</p>
      </div>
      
      <h3 className="text-lg font-semibold mb-2">Available Menu Items:</h3>
      <ul className="space-y-2">
        {menuItems.map(item => (
          <li key={item.id} className="border-l-2 border-blue-500 pl-3">
            <div className="font-medium">{item.label}</div>
            <div className="text-sm text-gray-600">{item.path}</div>
            {item.requiredRoles && (
              <div className="text-xs text-gray-500">
                Required roles: {item.requiredRoles.join(', ')}
              </div>
            )}
            {item.children && (
              <ul className="ml-4 mt-1 space-y-1">
                {item.children.map(child => (
                  <li key={child.id} className="text-sm">
                    <div>{child.label} - {child.path}</div>
                    {child.requiredRoles && (
                      <div className="text-xs text-gray-500">
                        Required roles: {child.requiredRoles.join(', ')}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
