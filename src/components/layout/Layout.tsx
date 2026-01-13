import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar, Header } from './Sidebar';
import { useState, useEffect } from 'react';

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true); // Always collapsed on mobile
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-hide sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true); // Always hide on mobile route change
    }
  }, [location.pathname, isMobile]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      
      {/* Only show sidebar on desktop or when explicitly opened on mobile */}
      {(!isMobile || !sidebarCollapsed) && (
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggleCollapse={setSidebarCollapsed}
          isMobile={isMobile}
        />
      )}
      
      <div className={`transition-all duration-300 ${
        isMobile ? 'ml-0' : (sidebarCollapsed ? 'ml-20' : 'ml-64')
      }`}>
        <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
