import { useState } from 'react';
import { Card, Button, Input, Select, Modal, Badge } from '../../components/ui';
import { Plus, Search, Eye, Trash2, RotateCcw, Settings, Target, TrendingUp, Users } from 'lucide-react';
import { getStatusColor } from '../../utils/helpers';

import type { SpinWheel } from '../../types';

const mockSpinWheels: SpinWheel[] = [
  {
    id: '1',
    name: 'Lucky Fish Wheel',
    description: 'Spin to win exciting rewards on fish orders',
    segments: [
      { id: '1', label: '10% OFF', rewardType: 'discount', rewardValue: 10, probability: 25, color: '#FF6B6B', icon: '💰' },
      { id: '2', label: '₹50 Cashback', rewardType: 'cashback', rewardValue: 50, probability: 20, color: '#4ECDC4', icon: '💸' },
      { id: '3', label: 'Free Delivery', rewardType: 'free_item', rewardValue: 1, probability: 15, color: '#45B7D1', icon: '🚚' },
      { id: '4', label: '100 Points', rewardType: 'points', rewardValue: 100, probability: 15, color: '#96CEB4', icon: '⭐' },
      { id: '5', label: 'Better Luck', rewardType: 'no_reward', rewardValue: 0, probability: 25, color: '#FFEAA7', icon: '🍀' }
    ],
    minOrderValue: 300,
    maxSpinsPerUser: 3,
    totalSpins: 5000,
    usedSpins: 1250,
    validFrom: '2024-01-01',
    validTo: '2024-01-31',
    isActive: true,
    targetAudience: 'all',
    wheelDesign: {
      theme: 'ocean',
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
      centerImage: 'fish-logo.png'
    },
    spinCooldown: 24,
    createdBy: 'Admin',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Premium Rewards Wheel',
    description: 'Exclusive rewards for premium customers',
    segments: [
      { id: '1', label: '20% OFF', rewardType: 'discount', rewardValue: 20, probability: 20, color: '#E17055', icon: '💎' },
      { id: '2', label: '₹100 Cashback', rewardType: 'cashback', rewardValue: 100, probability: 15, color: '#00B894', icon: '💸' },
      { id: '3', label: 'Free Premium Fish', rewardType: 'free_item', rewardValue: 1, probability: 10, color: '#6C5CE7', icon: '🐟' },
      { id: '4', label: '200 Points', rewardType: 'points', rewardValue: 200, probability: 15, color: '#FDCB6E', icon: '⭐' },
      { id: '5', label: 'Try Again', rewardType: 'no_reward', rewardValue: 0, probability: 40, color: '#DDD', icon: '🔄' }
    ],
    minOrderValue: 1000,
    maxSpinsPerUser: 1,
    totalSpins: 1000,
    usedSpins: 340,
    validFrom: '2024-01-15',
    validTo: '2024-02-15',
    isActive: true,
    targetAudience: 'premium',
    wheelDesign: {
      theme: 'premium',
      colors: ['#E17055', '#00B894', '#6C5CE7', '#FDCB6E', '#DDD']
    },
    spinCooldown: 48,
    createdBy: 'Admin',
    createdAt: '2024-01-10'
  }
];

interface SpinWheelStatsProps {
  wheels: SpinWheel[];
}

function SpinWheelStats({ wheels }: SpinWheelStatsProps) {
  const activeWheels = wheels.filter(wheel => wheel.isActive).length;
  const totalSpins = wheels.reduce((sum, wheel) => sum + wheel.usedSpins, 0);
  const totalCapacity = wheels.reduce((sum, wheel) => sum + wheel.totalSpins, 0);
  const avgEngagement = totalCapacity > 0 ? ((totalSpins / totalCapacity) * 100).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <RotateCcw className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Wheels</p>
            <p className="text-xl font-bold">{wheels.length}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Target className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Active Wheels</p>
            <p className="text-xl font-bold">{activeWheels}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Spins</p>
            <p className="text-xl font-bold">{totalSpins}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Engagement</p>
            <p className="text-xl font-bold">{avgEngagement}%</p>
          </div>
        </div>
      </Card>
    </div>
  );
}





export function SpinWheelPage() {
  const [wheels, setWheels] = useState<SpinWheel[]>(mockSpinWheels);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedWheel, setSelectedWheel] = useState<SpinWheel | undefined>();

  const filteredWheels = wheels.filter(wheel => {
    const matchesSearch = wheel.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || (statusFilter === 'active' ? wheel.isActive : !wheel.isActive);
    const matchesAudience = !audienceFilter || wheel.targetAudience === audienceFilter;
    return matchesSearch && matchesStatus && matchesAudience;
  });



  const handleView = (id: string) => {
    const wheel = wheels.find(w => w.id === id);
    if (wheel) {
      setSelectedWheel(wheel);
      setShowViewModal(true);
    }
  };

  const handleSettings = (id: string) => {
    const wheel = wheels.find(w => w.id === id);
    if (wheel) {
      setSelectedWheel(wheel);
      setShowSettingsModal(true);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this wheel?')) {
      setWheels(wheels.filter(wheel => wheel.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Spin Wheel Generator</h1>
          <p className="text-gray-600">Create and manage interactive spin wheel campaigns</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Stats */}
      <SpinWheelStats wheels={wheels} />

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search spin wheels..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="pl-10" 
            />
          </div>
          <Select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)} 
            options={[
              { value: '', label: 'All Status' }, 
              { value: 'active', label: 'Active' }, 
              { value: 'inactive', label: 'Inactive' }
            ]} 
          />
          <Select 
            value={audienceFilter} 
            onChange={e => setAudienceFilter(e.target.value)} 
            options={[
              { value: '', label: 'All Audience' }, 
              { value: 'all', label: 'All Users' }, 
              { value: 'new_users', label: 'New Users' }, 
              { value: 'premium', label: 'Premium' }, 
              { value: 'frequent_buyers', label: 'Frequent Buyers' }
            ]} 
          />
        </div>
      </Card>

      {/* Wheels Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWheels.map(wheel => (
                <tr key={wheel.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{wheel.name}</div>
                      <div className="text-sm text-gray-500">{wheel.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{wheel.usedSpins} / {wheel.totalSpins}</div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ width: `${Math.min((wheel.usedSpins / wheel.totalSpins) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(wheel.validFrom).toLocaleDateString()} - {new Date(wheel.validTo).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusColor(wheel.isActive ? 'active' : 'inactive')}>
                      {wheel.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                     <div className="flex items-center justify-end gap-2">
                       <button onClick={() => handleView(wheel.id)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                         <Eye className="h-4 w-4" />
                       </button>
                       <button onClick={() => handleSettings(wheel.id)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                         <Settings className="h-4 w-4" />
                       </button>
                       <button onClick={() => handleDelete(wheel.id)} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
                         <Trash2 className="h-4 w-4" />
                       </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredWheels.length === 0 && (
          <div className="text-center py-12">
            <RotateCcw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No spin wheels found</h3>
            <p className="text-gray-500">Create your first spin wheel campaign</p>
          </div>
        )}
      </Card>

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Spin Wheel Campaign">
        <form className="space-y-4">
          <Input label="Campaign Name" placeholder="Lucky Fish Wheel" required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none" 
              rows={2} 
              placeholder="Campaign description..." 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Min Order Value" type="number" placeholder="300" />
            <Input label="Total Spins Limit" type="number" placeholder="5000" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Max Spins per User" type="number" placeholder="3" />
            <Input label="Spin Cooldown (hours)" type="number" placeholder="24" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Target Audience" 
              options={[
                { value: 'all', label: 'All Users' },
                { value: 'new_users', label: 'New Users' },
                { value: 'premium', label: 'Premium Users' },
                { value: 'frequent_buyers', label: 'Frequent Buyers' }
              ]} 
            />
            <Select 
              label="Wheel Theme" 
              options={[
                { value: 'ocean', label: 'Ocean Fresh' },
                { value: 'premium', label: 'Premium Gold' },
                { value: 'festive', label: 'Festival Colors' },
                { value: 'classic', label: 'Classic Style' }
              ]} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Valid From" type="date" />
            <Input label="Valid To" type="date" />
          </div>
          <div className="flex gap-2 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">Create Campaign</Button>
          </div>
        </form>
      </Modal>



      {/* View Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Spin Wheel Details" size="lg">
        {selectedWheel && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Campaign Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Campaign Name</p>
                    <p className="font-medium">{selectedWheel.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="font-medium">{selectedWheel.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge variant={getStatusColor(selectedWheel.isActive ? 'active' : 'inactive')}>
                      {selectedWheel.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Target Audience</p>
                    <p className="font-medium capitalize">{selectedWheel.targetAudience.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Wheel Settings</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Minimum Order Value</p>
                    <p className="font-medium">₹{selectedWheel.minOrderValue}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Max Spins per User</p>
                    <p className="font-medium">{selectedWheel.maxSpinsPerUser}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Spin Cooldown</p>
                    <p className="font-medium">{selectedWheel.spinCooldown} hours</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Wheel Theme</p>
                    <p className="font-medium capitalize">{selectedWheel.wheelDesign.theme}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Wheel Segments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedWheel.segments.map((segment) => (
                  <Card key={segment.id} className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-gray-300" 
                        style={{ backgroundColor: segment.color }}
                      ></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{segment.label}</p>
                        <p className="text-xs text-gray-600">{segment.icon}</p>
                      </div>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium capitalize">{segment.rewardType.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Value:</span>
                        <span className="font-medium">
                          {segment.rewardType === 'discount' ? `${segment.rewardValue}%` : 
                           segment.rewardType === 'cashback' ? `₹${segment.rewardValue}` : 
                           segment.rewardType === 'points' ? `${segment.rewardValue} pts` : 
                           segment.rewardType === 'free_item' ? 'Free' : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Probability:</span>
                        <span className="font-medium">{segment.probability}%</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Usage Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <p className="text-sm text-gray-600">Used Spins</p>
                  <p className="text-xl font-bold">{selectedWheel.usedSpins}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-gray-600">Total Spins</p>
                  <p className="text-xl font-bold">{selectedWheel.totalSpins}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-gray-600">Usage Rate</p>
                  <p className="text-xl font-bold">
                    {((selectedWheel.usedSpins / selectedWheel.totalSpins) * 100).toFixed(1)}%
                  </p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p className="text-xl font-bold">
                    {selectedWheel.totalSpins - selectedWheel.usedSpins}
                  </p>
                </Card>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Validity Period</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Valid From</p>
                  <p className="font-medium">{new Date(selectedWheel.validFrom).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Valid To</p>
                  <p className="font-medium">{new Date(selectedWheel.validTo).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Settings Modal */}
      <Modal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} title="Spin Wheel Settings">
        {selectedWheel && (
          <form className="space-y-4">
            <Input label="Campaign Name" defaultValue={selectedWheel.name} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none" 
                rows={2} 
                defaultValue={selectedWheel.description}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Min Order Value" type="number" defaultValue={selectedWheel.minOrderValue} />
              <Input label="Total Spins Limit" type="number" defaultValue={selectedWheel.totalSpins} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Max Spins per User" type="number" defaultValue={selectedWheel.maxSpinsPerUser} />
              <Input label="Spin Cooldown (hours)" type="number" defaultValue={selectedWheel.spinCooldown} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                <select 
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white"
                  defaultValue={selectedWheel.targetAudience}
                >
                  <option value="all">All Users</option>
                  <option value="new_users">New Users</option>
                  <option value="premium">Premium Users</option>
                  <option value="frequent_buyers">Frequent Buyers</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wheel Theme</label>
                <select 
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white"
                  defaultValue={selectedWheel.wheelDesign.theme}
                >
                  <option value="ocean">Ocean Fresh</option>
                  <option value="premium">Premium Gold</option>
                  <option value="festive">Festival Colors</option>
                  <option value="classic">Classic Style</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Valid From" type="date" defaultValue={selectedWheel.validFrom} />
              <Input label="Valid To" type="date" defaultValue={selectedWheel.validTo} />
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="active" 
                defaultChecked={selectedWheel.isActive}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">Active Campaign</label>
            </div>
            <div className="flex gap-2 pt-4 border-t">
              <Button type="button" variant="secondary" onClick={() => setShowSettingsModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">Save Changes</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
