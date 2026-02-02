import { useState } from 'react';
import { Card, Button, Select } from '../../components/ui';
import { Plus, Search, Percent, TrendingUp, Users, Target } from 'lucide-react';
import { MarketingList } from '../../components/marketing/MarketingList';

interface Coupon {
  id: string;
  title: string;
  type: string;
  status: 'active' | 'inactive' | 'scheduled' | 'expired';
  description: string;
  stats: {
    label: string;
    value: string | number;
  }[];
  validFrom: string;
  validTo: string;
  createdAt: string;
}

export function CouponPageNew() {
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: '1',
      title: 'WELCOME50 - New User Discount',
      type: 'Coupon',
      status: 'active',
      description: '50% off on first order, minimum order value ₹500',
      stats: [
        { label: 'Total Uses', value: '1,247' },
        { label: 'Success Rate', value: '89%' },
        { label: 'Total Savings', value: '₹89,400' }
      ],
      validFrom: '2026-01-01',
      validTo: '2026-03-31',
      createdAt: '2026-01-01'
    },
    {
      id: '2',
      title: 'FLAT100 - Flat Discount',
      type: 'Coupon',
      status: 'active',
      description: 'Flat ₹100 off on orders above ₹800',
      stats: [
        { label: 'Total Uses', value: '856' },
        { label: 'Success Rate', value: '92%' },
        { label: 'Total Savings', value: '₹85,600' }
      ],
      validFrom: '2026-01-01',
      validTo: '2026-02-28',
      createdAt: '2026-01-01'
    },
    {
      id: '3',
      title: 'FISH20 - Category Discount',
      type: 'Coupon',
      status: 'expired',
      description: '20% off on fish category, max discount ₹300',
      stats: [
        { label: 'Total Uses', value: '432' },
        { label: 'Success Rate', value: '76%' },
        { label: 'Total Savings', value: '₹32,800' }
      ],
      validFrom: '2025-12-15',
      validTo: '2025-12-31',
      createdAt: '2025-12-10'
    }
  ]);

  const handleView = (id: string) => {
    alert(`Viewing coupon details for ID: ${id}`);
  };

  const handleEdit = (id: string) => {
    alert(`Editing coupon with ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      setCoupons(prev => prev.filter(coupon => coupon.id !== id));
      alert('Coupon deleted successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Coupon Management</h1>
          <p className="text-gray-600">Create and manage discount coupons</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Coupon
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
                placeholder="Search coupons..."
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

      {/* Coupons List */}
      <MarketingList
        items={coupons}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Coupons</p>
              <p className="text-2xl font-bold">{coupons.length}</p>
            </div>
            <Percent className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Coupons</p>
              <p className="text-2xl font-bold">{coupons.filter(c => c.status === 'active').length}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Uses</p>
              <p className="text-2xl font-bold">2,535</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Savings</p>
              <p className="text-2xl font-bold">₹2,07,800</p>
            </div>
            <Target className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>
    </div>
  );
}
