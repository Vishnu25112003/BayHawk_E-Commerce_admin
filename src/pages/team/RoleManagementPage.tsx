import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getRolesByModule, ROLE_DEFINITIONS } from '../../utils/rbac';
import { RoleCard } from '../../components/ui/RoleCard';
import { Users, Shield, Settings } from 'lucide-react';

export function RoleManagementPage() {
  const { user } = useAuth();
  const [selectedModule, setSelectedModule] = useState<'hub' | 'store'>('hub');

  const hubRoles = getRolesByModule('hub');
  const storeRoles = getRolesByModule('store');
  const currentRoles = selectedModule === 'hub' ? hubRoles : storeRoles;

  if (!user || user.role !== 'super_admin') {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Access Denied</h2>
          <p className="text-red-600">Only Super Administrators can access role management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
            <p className="text-gray-600">Manage user roles and permissions across your organization</p>
          </div>
        </div>

        {/* Module Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedModule('hub')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedModule === 'hub'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Hub Roles ({hubRoles.length})
          </button>
          <button
            onClick={() => setSelectedModule('store')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedModule === 'store'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Store Roles ({storeRoles.length})
          </button>
        </div>
      </div>

      {/* Role Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentRoles.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            showPermissions={true}
          />
        ))}
      </div>

      {/* Create New Role Button - Placeholder for future implementation */}
      <div className="flex justify-center">
        <div className="text-center text-gray-500 text-sm">
          Custom role creation coming soon...
        </div>
      </div>

      {/* Role Statistics */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{hubRoles.length + storeRoles.length}</p>
              <p className="text-sm text-gray-600">Total Roles</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {Object.values(ROLE_DEFINITIONS).reduce((acc, role) => acc + role.permissions.length, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Permissions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-sm text-gray-600">Modules</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}