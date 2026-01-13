import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { hasPermission, PERMISSIONS, filterDataByModule } from '../utils/rbac';
import { Card, Button, Input, Select, Badge } from '../components/ui';
import { 
  Search, 
  Download, 
  Filter, 
  Calendar, 
  Eye, 
  Shield, 
  Activity, 
  Clock, 
  User, 
  Globe,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  RefreshCw
} from 'lucide-react';
import type { AuditLog } from '../types';

const mockLogs: AuditLog[] = [
  {
    id: 'LOG001',
    userId: 'U001',
    userName: 'Hub Admin',
    action: 'Created Order',
    module: 'Orders',
    details: 'Manual order HUB001 created for customer John Doe with total amount ₹2,450',
    ipAddress: '192.168.1.1',
    timestamp: '2026-01-11T14:30:00Z',
    moduleType: 'hub',
    hubId: 'hub_1',
  },
  {
    id: 'LOG002',
    userId: 'U002',
    userName: 'Hub Manager',
    action: 'Updated Product',
    module: 'Products',
    details: 'Updated stock for Fresh Pomfret - 500g variant from 25kg to 50kg',
    ipAddress: '192.168.1.2',
    timestamp: '2026-01-11T13:15:00Z',
    moduleType: 'hub',
    hubId: 'hub_1',
  },
  {
    id: 'LOG003',
    userId: 'U003',
    userName: 'Store Admin',
    action: 'Login',
    module: 'Authentication',
    details: 'User successfully logged into the system',
    ipAddress: '192.168.1.3',
    timestamp: '2026-01-11T12:45:00Z',
    moduleType: 'store',
    storeId: 'store_1',
  },
  {
    id: 'LOG004',
    userId: 'U001',
    userName: 'Hub Admin',
    action: 'Deleted Product',
    module: 'Products',
    details: 'Permanently deleted product "Expired Tuna - 1kg" from inventory',
    ipAddress: '192.168.1.1',
    timestamp: '2026-01-11T11:20:00Z',
    moduleType: 'hub',
    hubId: 'hub_1',
  },
  {
    id: 'LOG005',
    userId: 'U004',
    userName: 'Delivery Agent',
    action: 'Updated Order Status',
    module: 'Orders',
    details: 'Changed order ORD-2024-001 status from "Out for Delivery" to "Delivered"',
    ipAddress: '192.168.1.4',
    timestamp: '2026-01-11T10:30:00Z',
    moduleType: 'hub',
    hubId: 'hub_1',
  },
  {
    id: 'LOG006',
    userId: 'U002',
    userName: 'Hub Manager',
    action: 'Generated Report',
    module: 'Reports',
    details: 'Generated and downloaded Sales Report for date range 2026-01-01 to 2026-01-10',
    ipAddress: '192.168.1.2',
    timestamp: '2026-01-11T09:15:00Z',
    moduleType: 'hub',
    hubId: 'hub_1',
  },
  {
    id: 'LOG007',
    userId: 'U005',
    userName: 'Team Lead',
    action: 'Created User',
    module: 'Team',
    details: 'Added new delivery agent "Rajesh Kumar" with role "Delivery Agent"',
    ipAddress: '192.168.1.5',
    timestamp: '2026-01-11T08:45:00Z',
    moduleType: 'store',
    storeId: 'store_1',
  },
  {
    id: 'LOG008',
    userId: 'U001',
    userName: 'Hub Admin',
    action: 'Failed Login',
    module: 'Authentication',
    details: 'Failed login attempt with incorrect password',
    ipAddress: '192.168.1.1',
    timestamp: '2026-01-11T08:00:00Z',
    moduleType: 'hub',
    hubId: 'hub_1',
  },
  {
    id: 'LOG009',
    userId: 'U003',
    userName: 'Store Admin',
    action: 'Updated Settings',
    module: 'Settings',
    details: 'Modified delivery time slots configuration for Zone A',
    ipAddress: '192.168.1.3',
    timestamp: '2026-01-10T17:30:00Z',
    moduleType: 'store',
    storeId: 'store_1',
  },
  {
    id: 'LOG010',
    userId: 'U002',
    userName: 'Hub Manager',
    action: 'Bulk Update',
    module: 'Products',
    details: 'Bulk updated prices for 25 seafood products with 5% increase',
    ipAddress: '192.168.1.2',
    timestamp: '2026-01-10T16:20:00Z',
    moduleType: 'hub',
    hubId: 'hub_1',
  },
];

const actionIcons = {
  'Created Order': CheckCircle,
  'Updated Product': RefreshCw,
  'Login': CheckCircle,
  'Deleted Product': XCircle,
  'Updated Order Status': RefreshCw,
  'Generated Report': Download,
  'Created User': User,
  'Failed Login': AlertTriangle,
  'Updated Settings': RefreshCw,
  'Bulk Update': RefreshCw,
};

const actionColors = {
  'Created Order': 'success',
  'Updated Product': 'info',
  'Login': 'success',
  'Deleted Product': 'danger',
  'Updated Order Status': 'info',
  'Generated Report': 'info',
  'Created User': 'success',
  'Failed Login': 'danger',
  'Updated Settings': 'warning',
  'Bulk Update': 'info',
};

const moduleColors = {
  'Orders': 'bg-blue-100 text-blue-800',
  'Products': 'bg-green-100 text-green-800',
  'Authentication': 'bg-purple-100 text-purple-800',
  'Reports': 'bg-orange-100 text-orange-800',
  'Team': 'bg-indigo-100 text-indigo-800',
  'Settings': 'bg-gray-100 text-gray-800',
};

export default function AuditLogsPage() {
  const { user } = useAuth();
  const [logs] = useState(mockLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const canViewLogs = hasPermission(user, PERMISSIONS.HUB_AUDIT_LOGS) || user?.loginType === 'super_admin';

  // Filter logs based on user's module access
  const moduleFilteredLogs = filterDataByModule(logs, user);

  const filteredLogs = useMemo(() => {
    return moduleFilteredLogs.filter(log => {
      const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.module.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
      const matchesAction = actionFilter === 'all' || log.action === actionFilter;
      
      // Date filtering logic
      const logDate = new Date(log.timestamp);
      const today = new Date();
      let matchesDate = true;
      
      if (dateRange === 'today') {
        matchesDate = logDate.toDateString() === today.toDateString();
      } else if (dateRange === 'week') {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = logDate >= weekAgo;
      } else if (dateRange === 'month') {
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = logDate >= monthAgo;
      }
      
      return matchesSearch && matchesModule && matchesAction && matchesDate;
    });
  }, [moduleFilteredLogs, searchTerm, moduleFilter, actionFilter, dateRange]);

  const stats = useMemo(() => {
    const today = new Date();
    const todayLogs = moduleFilteredLogs.filter(log => new Date(log.timestamp).toDateString() === today.toDateString());
    const failedLogins = moduleFilteredLogs.filter(log => log.action === 'Failed Login').length;
    const uniqueUsers = new Set(moduleFilteredLogs.map(log => log.userId)).size;
    const criticalActions = moduleFilteredLogs.filter(log => 
      log.action.includes('Delete') || log.action.includes('Failed')
    ).length;

    return {
      totalToday: todayLogs.length,
      failedLogins,
      uniqueUsers,
      criticalActions
    };
  }, [moduleFilteredLogs]);

  if (!canViewLogs) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Audit Logs</h1>
            <p className="text-gray-600">Access denied</p>
          </div>
        </div>
        <Card className="p-6">
          <div className="flex items-center gap-3 text-red-600">
            <Shield className="h-6 w-6" />
            <div>
              <h3 className="font-semibold">Access Restricted</h3>
              <p className="text-sm text-red-500">You don't have permission to access audit logs.</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {user?.loginType === 'hub' ? 'Hub Audit Logs' : 
             user?.loginType === 'store' ? 'Store Audit Logs' : 
             'Audit Logs'}
          </h1>
          <p className="text-gray-600">
            {user?.loginType === 'hub' ? 'Track all hub system activities and changes' : 
             user?.loginType === 'store' ? 'Track all store system activities and changes' : 
             'Track all system activities and changes'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Export
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Activities</p>
              <p className="text-2xl font-bold">{stats.totalToday}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed Logins</p>
              <p className="text-2xl font-bold">{stats.failedLogins}</p>
            </div>
            <div className="rounded-lg bg-red-50 p-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold">{stats.uniqueUsers}</p>
            </div>
            <div className="rounded-lg bg-green-50 p-3">
              <User className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Actions</p>
              <p className="text-2xl font-bold">{stats.criticalActions}</p>
            </div>
            <div className="rounded-lg bg-orange-50 p-3">
              <Shield className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={[
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'Last 7 Days' },
              { value: 'month', label: 'Last 30 Days' },
              { value: 'all', label: 'All Time' },
            ]}
          />

          <Select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Modules' },
              { value: 'Orders', label: 'Orders' },
              { value: 'Products', label: 'Products' },
              { value: 'Team', label: 'Team' },
              { value: 'Reports', label: 'Reports' },
              { value: 'Authentication', label: 'Authentication' },
              { value: 'Settings', label: 'Settings' },
            ]}
          />

          <Select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Actions' },
              { value: 'Created Order', label: 'Created Order' },
              { value: 'Updated Product', label: 'Updated Product' },
              { value: 'Login', label: 'Login' },
              { value: 'Failed Login', label: 'Failed Login' },
              { value: 'Deleted Product', label: 'Deleted Product' },
            ]}
          />
        </div>
      </Card>

      {/* Logs Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => {
                const ActionIcon = actionIcons[log.action as keyof typeof actionIcons] || Activity;
                const actionColor = actionColors[log.action as keyof typeof actionColors] || 'info';
                const moduleColor = moduleColors[log.module as keyof typeof moduleColors] || 'bg-gray-100 text-gray-800';
                
                return (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                          <div className="text-xs text-gray-500">{log.userId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <ActionIcon className="h-4 w-4 text-gray-600" />
                        <Badge variant={actionColor as any}>{log.action}</Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={moduleColor}>{log.module}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                      <div className="truncate" title={log.details}>
                        {log.details}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or date range.</p>
          </div>
        )}
      </Card>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Audit Log Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLog(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Log ID</label>
                    <p className="font-mono text-sm">{selectedLog.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Timestamp</label>
                    <p className="text-sm">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">User</label>
                    <p className="text-sm">{selectedLog.userName} ({selectedLog.userId})</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">IP Address</label>
                    <p className="font-mono text-sm">{selectedLog.ipAddress}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Action</label>
                    <p className="text-sm">{selectedLog.action}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Module</label>
                    <p className="text-sm">{selectedLog.module}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Details</label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">{selectedLog.details}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}