import { useState } from 'react';
import { Card, Button, Select, Table, Th, Td, Badge } from '../components/ui';
import { Plus, Edit, Trash2, Crown, Users, TrendingUp } from 'lucide-react';
import { formatCurrency, getStatusColor } from '../utils/helpers';

const mockPlans = [
  { id: '1', name: 'Free', price: 0, billingCycle: 'monthly', members: 1523, features: ['Basic delivery slots', 'Standard support'], isActive: true },
  { id: '2', name: 'Premium', price: 199, billingCycle: 'monthly', members: 342, features: ['Advanced scheduling (1 month)', 'Priority support', 'Exclusive deals', 'Free delivery over ₹500'], isActive: true },
  { id: '3', name: 'Premium Yearly', price: 1999, billingCycle: 'yearly', members: 89, features: ['All Premium features', '2 months free', 'Early access to sales'], isActive: true },
];

export function MembershipPage() {
  const [planFilter, setPlanFilter] = useState('');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Membership Management</h1>
          <p className="text-gray-600">Manage membership plans and members</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Create Plan</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-4">
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-yellow-100 p-3"><Crown className="h-6 w-6 text-yellow-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Total Members</p>
            <p className="text-2xl font-bold">1,954</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-purple-100 p-3"><Users className="h-6 w-6 text-purple-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Premium Members</p>
            <p className="text-2xl font-bold">431</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-green-100 p-3"><TrendingUp className="h-6 w-6 text-green-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Conversion Rate</p>
            <p className="text-2xl font-bold">22%</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-blue-100 p-3"><Crown className="h-6 w-6 text-blue-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Monthly Revenue</p>
            <p className="text-2xl font-bold">₹86,158</p>
          </div>
        </Card>
      </div>

      {/* Plans */}
      <div className="grid gap-6 lg:grid-cols-3">
        {mockPlans.map(plan => (
          <Card key={plan.id} className={plan.name === 'Premium' ? 'ring-2 ring-primary-500' : ''}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              {plan.name === 'Premium' && <Badge variant="bg-primary-100 text-primary-800">Popular</Badge>}
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
              <span className="text-gray-500">/{plan.billingCycle}</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">{plan.members} active members</p>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span> {feature}
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1"><Edit className="h-4 w-4 mr-1" /> Edit</Button>
              <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Members Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Members</h2>
          <Select value={planFilter} onChange={e => setPlanFilter(e.target.value)} options={[{ value: '', label: 'All Plans' }, { value: 'free', label: 'Free' }, { value: 'premium', label: 'Premium' }]} />
        </div>
        <Table>
          <thead>
            <tr><Th>Member</Th><Th>Plan</Th><Th>Start Date</Th><Th>Renewal Date</Th><Th>Auto-Renew</Th><Th>Status</Th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[
              { name: 'Rajesh Kumar', email: 'rajesh@email.com', plan: 'Premium', start: '2024-01-01', renewal: '2024-02-01', autoRenew: true, status: 'active' },
              { name: 'Priya Sharma', email: 'priya@email.com', plan: 'Premium Yearly', start: '2023-12-15', renewal: '2024-12-15', autoRenew: true, status: 'active' },
              { name: 'Arun Patel', email: 'arun@email.com', plan: 'Free', start: '2024-01-05', renewal: '-', autoRenew: false, status: 'active' },
            ].map((member, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <Td>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </Td>
                <Td><Badge variant={member.plan.includes('Premium') ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}>{member.plan}</Badge></Td>
                <Td>{member.start}</Td>
                <Td>{member.renewal}</Td>
                <Td>{member.autoRenew ? '✓' : '-'}</Td>
                <Td><Badge variant={getStatusColor(member.status)}>{member.status}</Badge></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
