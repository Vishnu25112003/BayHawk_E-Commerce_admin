import { useState } from 'react';
import { Card, Button, Input, Modal } from '../ui';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

interface Reward {
  id: string;
  type: 'primary' | 'referral' | 'bonus' | 'seasonal' | 'daily';
  name: string;
  description: string;
  rewardValue: number;
  probability: number;
  orderValue?: number;
  nthOrder?: number;
  festival?: string;
  dateFrom?: string;
  dateTo?: string;
  intervalHours?: number;
  isActive: boolean;
  createdAt: string;
}

const dummyRewards: Reward[] = [
  {
    id: '1',
    type: 'primary',
    name: 'Order ₹350 Reward',
    description: 'Reward for orders above ₹350',
    rewardValue: 50,
    probability: 30,
    orderValue: 350,
    isActive: true,
    createdAt: '2024-02-10'
  },
  {
    id: '2',
    type: 'referral',
    name: 'Friend Referral Bonus',
    description: 'Reward when friend signs up',
    rewardValue: 100,
    probability: 100,
    isActive: true,
    createdAt: '2024-02-09'
  },
  {
    id: '3',
    type: 'bonus',
    name: '5th Order Bonus',
    description: 'Every 5th order reward',
    rewardValue: 150,
    probability: 50,
    nthOrder: 5,
    isActive: true,
    createdAt: '2024-02-08'
  },
  {
    id: '4',
    type: 'seasonal',
    name: 'Diwali Special',
    description: 'Festival season rewards',
    rewardValue: 300,
    probability: 60,
    festival: 'Diwali',
    dateFrom: '2024-10-20',
    dateTo: '2024-11-05',
    isActive: true,
    createdAt: '2024-02-07'
  },
  {
    id: '5',
    type: 'daily',
    name: 'Daily Login Reward',
    description: 'Reward every 24 hours',
    rewardValue: 25,
    probability: 40,
    intervalHours: 24,
    isActive: true,
    createdAt: '2024-02-06'
  }
];

export const ScratchCardConfig = () => {
  const [rewards, setRewards] = useState<Reward[]>(dummyRewards);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [rewardType, setRewardType] = useState<'primary' | 'referral' | 'bonus' | 'seasonal' | 'daily'>('primary');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCreateModal(false);
    alert('Reward created successfully!');
  };

  const handleView = (reward: Reward) => {
    setSelectedReward(reward);
    setShowViewModal(true);
  };

  const handleEdit = (reward: Reward) => {
    setSelectedReward(reward);
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this reward?')) {
      setRewards(rewards.filter(r => r.id !== id));
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      primary: 'bg-blue-100 text-blue-700',
      referral: 'bg-emerald-100 text-emerald-700',
      bonus: 'bg-indigo-100 text-indigo-700',
      seasonal: 'bg-amber-100 text-amber-700',
      daily: 'bg-cyan-100 text-cyan-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scratch Card Rewards</h1>
          <p className="text-gray-600 mt-1">Manage all reward types</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Offer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {['primary', 'referral', 'bonus', 'seasonal', 'daily'].map((type) => {
          const count = rewards.filter(r => r.type === type).length;
          return (
            <Card key={type} className="p-4">
              <p className="text-sm text-gray-600 capitalize">{type} Rewards</p>
              <p className="text-2xl font-bold">{count}</p>
            </Card>
          );
        })}
      </div>

      {/* Rewards List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reward Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Probability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rewards.map((reward) => (
                <tr key={reward.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(reward.type)}`}>
                      {reward.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{reward.name}</div>
                    <div className="text-sm text-gray-500">{reward.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{reward.rewardValue}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reward.probability}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${reward.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {reward.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleView(reward)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleEdit(reward)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(reward.id)} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Scratch Card Offer">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reward Type</label>
            <select 
              value={rewardType} 
              onChange={(e) => setRewardType(e.target.value as any)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="primary">Primary Reward (Order Value)</option>
              <option value="referral">Referral Reward</option>
              <option value="bonus">Bonus Reward (Nth Order)</option>
              <option value="seasonal">Seasonal Reward</option>
              <option value="daily">Daily Reward</option>
            </select>
          </div>

          <Input label="Reward Name" placeholder="Enter reward name" required />
          <Input label="Description" placeholder="Enter description" required />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Reward Value (₹)" type="number" placeholder="100" required />
            <Input label="Probability (%)" type="number" placeholder="50" min="1" max="100" required />
          </div>

          {rewardType === 'primary' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Value Trigger</label>
              <select className="w-full rounded-lg border border-gray-300 px-3 py-2">
                <option value="350">Above ₹350</option>
                <option value="650">Above ₹650</option>
                <option value="1500">Above ₹1500</option>
              </select>
            </div>
          )}

          {rewardType === 'bonus' && (
            <Input label="Every Nth Order" type="number" placeholder="5" required />
          )}

          {rewardType === 'seasonal' && (
            <>
              <Input label="Festival Name" placeholder="Diwali" required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Start Date" type="date" required />
                <Input label="End Date" type="date" required />
              </div>
            </>
          )}

          {rewardType === 'daily' && (
            <Input label="Interval (Hours)" type="number" placeholder="24" required />
          )}

          <div className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="rounded" />
            <label className="text-sm">Active</label>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">Create Offer</Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Reward Details">
        {selectedReward && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedReward.type)}`}>
                  {selectedReward.type}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${selectedReward.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {selectedReward.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{selectedReward.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Description</p>
              <p className="font-medium">{selectedReward.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Reward Value</p>
                <p className="font-medium">₹{selectedReward.rewardValue}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Probability</p>
                <p className="font-medium">{selectedReward.probability}%</p>
              </div>
            </div>
            {selectedReward.orderValue && (
              <div>
                <p className="text-sm text-gray-600">Order Value Trigger</p>
                <p className="font-medium">Above ₹{selectedReward.orderValue}</p>
              </div>
            )}
            {selectedReward.nthOrder && (
              <div>
                <p className="text-sm text-gray-600">Nth Order</p>
                <p className="font-medium">Every {selectedReward.nthOrder}th order</p>
              </div>
            )}
            {selectedReward.festival && (
              <div>
                <p className="text-sm text-gray-600">Festival</p>
                <p className="font-medium">{selectedReward.festival}</p>
              </div>
            )}
            {selectedReward.dateFrom && selectedReward.dateTo && (
              <div>
                <p className="text-sm text-gray-600">Validity Period</p>
                <p className="font-medium">{selectedReward.dateFrom} to {selectedReward.dateTo}</p>
              </div>
            )}
            {selectedReward.intervalHours && (
              <div>
                <p className="text-sm text-gray-600">Interval</p>
                <p className="font-medium">Every {selectedReward.intervalHours} hours</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Reward">
        {selectedReward && (
          <form onSubmit={(e) => { e.preventDefault(); setShowEditModal(false); alert('Updated!'); }} className="space-y-4">
            <Input label="Reward Name" defaultValue={selectedReward.name} required />
            <Input label="Description" defaultValue={selectedReward.description} required />
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Reward Value (₹)" type="number" defaultValue={selectedReward.rewardValue} required />
              <Input label="Probability (%)" type="number" defaultValue={selectedReward.probability} min="1" max="100" required />
            </div>

            {selectedReward.type === 'primary' && selectedReward.orderValue && (
              <Input label="Order Value Trigger" type="number" defaultValue={selectedReward.orderValue} required />
            )}

            {selectedReward.type === 'bonus' && selectedReward.nthOrder && (
              <Input label="Every Nth Order" type="number" defaultValue={selectedReward.nthOrder} required />
            )}

            {selectedReward.type === 'seasonal' && (
              <>
                <Input label="Festival Name" defaultValue={selectedReward.festival} required />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Start Date" type="date" defaultValue={selectedReward.dateFrom} required />
                  <Input label="End Date" type="date" defaultValue={selectedReward.dateTo} required />
                </div>
              </>
            )}

            {selectedReward.type === 'daily' && selectedReward.intervalHours && (
              <Input label="Interval (Hours)" type="number" defaultValue={selectedReward.intervalHours} required />
            )}

            <div className="flex items-center gap-2">
              <input type="checkbox" defaultChecked={selectedReward.isActive} className="rounded" />
              <label className="text-sm">Active</label>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">Update</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
