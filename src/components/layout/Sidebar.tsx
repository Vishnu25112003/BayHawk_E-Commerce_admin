import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Menu, X, Bell, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { getFilteredMenuByUser, type MenuItem } from '../../utils/menuConfig';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const { user, logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const menuItems = user ? getFilteredMenuByUser(user.loginType, user.role) : [];

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const renderMenuItem = (item: MenuItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);

    if (hasChildren && item.children) {
      return (
        <div key={item.id}>
          {/* Single clickable div for the entire menu section */}
          <button
            onClick={() => toggleExpand(item.id)}
            className={`w-full flex items-center rounded-lg px-3 py-2.5 transition-all duration-200 ${
              collapsed ? 'justify-center' : 'gap-3'
            } text-slate-400 hover:bg-slate-800 hover:text-white`}
          >
            <item.icon size={20} />
            {!collapsed && (
              <>
                <span className="font-medium flex-1 text-left">{item.label}</span>
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </>
            )}
          </button>
          {/* Submenu items */}
          {isExpanded && !collapsed && (
            <div className="ml-8 mt-1 space-y-1">
              {item.children.map(child => (
                <NavLink
                  key={child.id}
                  to={child.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  <span className="w-2 h-2 rounded-full bg-current opacity-50"></span>
                  {child.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.id}
        to={item.path}
        className={({ isActive }) => `
          flex items-center rounded-lg px-3 py-2.5 transition-all duration-200 ${
            collapsed ? 'justify-center' : 'gap-3'
          }
          ${isActive 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }
        `}
      >
        <item.icon size={20} />
        {!collapsed && <span className="font-medium">{item.label}</span>}
      </NavLink>
    );
  };

  return (
    <aside 
      className={`fixed left-0 top-0 z-40 h-screen bg-slate-900 text-white transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="relative flex h-16 items-center border-b border-slate-700 px-4">
        {collapsed ? (
          /* Collapsed state - Show only logo icon centered with toggle button positioned properly */
          <>
            <div className="flex items-center justify-center w-full">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
            </div>
            <button 
              onClick={() => onToggleCollapse(!collapsed)} 
              className="absolute top-1/2 right-2 transform -translate-y-1/2 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Menu size={16} />
            </button>
          </>
        ) : (
          /* Expanded state - Show full logo with toggle button */
          <>
            <div className="flex items-center gap-2 flex-1">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold text-white">BAYHAWK</span>
            </div>
            <button 
              onClick={() => onToggleCollapse(!collapsed)} 
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </>
        )}
      </div>
      
      {/* Module Badge */}
      {user && (
        <div className="px-4 py-3 border-b border-slate-700">
          {collapsed ? (
            /* Collapsed state - Show abbreviated badge */
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 text-xs font-bold flex items-center justify-center">
                {user.loginType === 'super_admin' ? 'SA' : user.loginType === 'hub' ? 'H' : 'S'}
              </div>
            </div>
          ) : (
            /* Expanded state - Show full badge */
            <div className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 text-xs font-semibold uppercase text-center">
              {user.loginType === 'super_admin' ? 'Super Admin' : user.loginType === 'hub' ? 'Hub Module' : 'Store Module'}
            </div>
          )}
        </div>
      )}
      
      {/* Navigation */}
      <nav className={`mt-4 px-3 space-y-1 overflow-y-auto ${collapsed ? 'h-[calc(100vh-260px)]' : 'h-[calc(100vh-220px)]'}`}>
        {menuItems.map(renderMenuItem)}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700 p-3">
        <button
          onClick={logout}
          title="Logout"
          className={`w-full flex items-center rounded-lg px-3 py-2.5 transition-all duration-200 ${
            collapsed ? 'justify-center' : 'gap-3'
          } text-slate-400 hover:bg-slate-800 hover:text-red-500`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export function Header() {
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">
          {user?.loginType === 'hub' ? 'Hub Admin' : user?.loginType === 'store' ? 'Store Admin' : 'Super Admin'} Panel
        </h1>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        
        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
