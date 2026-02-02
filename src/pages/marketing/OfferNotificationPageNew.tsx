import { useState } from 'react';
import { Card, Button, Select } from '../../components/ui';
import { Plus, Search, Bell, TrendingUp, Users, Target } from 'lucide-react';
import { MarketingList } from '../../components/marketing/MarketingList';

interface OfferNotification {
  id: string;
  title: string;
  type: string;
  status: 'active' | 'inactive' | 'scheduled' | 'expired';
  description: string;
  stats: {
    label: string;
    value: string | number;
  }[];
  validFrom?: string;
  validTo?: string;
  createdAt: string;
}

export function OfferNotificationPageNew() {
  const [notifications, setNotifications] = useState<OfferNotification[]>([
    {
      id: '1',
      title: 'Flash Sale Alert - 50% Off',
      type: 'Offer Notification',
      status: 'active',
      description: 'Limited time flash sale notification for premium customers',
      stats: [
        { label: 'Sent', value: '12,847' },
        { label: 'Opened', value: '8,234' },
        { label: 'Clicked', value: '2,456' }
      ],
      validFrom: '2026-01-12',
      validTo: '2026-01-15',
      createdAt: '2026-01-12'
    },
    {
      id: '2',
      title: 'New Product Launch',
      type: 'Offer Notification',
      status: 'scheduled',
      description: 'Notification about new premium fish varieties launch',
      stats: [
        { label: 'Sent', value: '0' },
        { label: 'Opened', value: '0' },
        { label: 'Clicked', value: '0' }
      ],
      validFrom: '2026-01-20',
      validTo: '2026-01-25',
      createdAt: '2026-01-10'
    },
    {
      id: '3',
      title: 'Weekend Special Offers',
      type: 'Offer Notification',
      status: 'inactive',
      description: 'Weekly weekend special offers for regular customers',
      stats: [
        { label: 'Sent', value: '5,678' },
        { label: 'Opened', value: '3,456' },
        { label: 'Clicked', value: '1,234' }
      ],
      createdAt: '2026-01-05'
    }
  ]);

  const handleView = (id: string) => {
    alert(`Viewing notification details for ID: ${id}`);
  };

  const handleEdit = (id: string) => {
    alert(`Editing notification with ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this notification?')) {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      alert('Notification deleted successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Offer Notification Management</h1>
          <p className="text-gray-600">Create and manage push notifications for offers</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Notification
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search notifications..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <Select
            options={[
              { value: '', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'expired', label: 'Expired' }
            ]}
          />
        </div>
      </Card>

      {/* Notifications List */}
      <MarketingList
        items={notifications}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Notifications</p>
              <p className="text-2xl font-bold">{notifications.length}</p>
            </div>
            <Bell className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-bold">{notifications.filter(n => n.status === 'active').length}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sent</p>
              <p className="text-2xl font-bold">18,525</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Click Rate</p>
              <p className="text-2xl font-bold">19.8%</p>
            </div>
            <Target className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>
    </div>
  );
}
