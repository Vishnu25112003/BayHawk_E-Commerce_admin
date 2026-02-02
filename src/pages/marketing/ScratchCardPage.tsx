import { useState } from 'react';
import { Card, Button, Input, Select, Modal, Badge } from '../../components/ui';
import { Plus, Search, Eye, Trash2, Gift, Settings, Target, TrendingUp, Users } from 'lucide-react';
import { getStatusColor } from '../../utils/helpers';

import type { ScratchCard } from '../../types';

const mockScratchCards: ScratchCard[] = [
  {
    id: '1',
    name: 'New Year Special',
    description: 'Celebrate New Year with exciting rewards',
    cardType: 'percentage',
    rewardValue: 20,
    minOrderValue: 500,
    maxRedemptions: 1000,
    usedRedemptions: 245,
    validFrom: '2024-01-01',
    validTo: '2024-01-31',
    isActive: true,
    targetAudience: 'all',
    cardDesign: 'template1',
    scratchArea: { width: 200, height: 100, position: { x: 150, y: 200 } },
    winProbability: 30,
    createdBy: 'Admin',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Premium Fish Bonus',
    description: 'Extra cashback on premium fish purchases',
    cardType: 'fixed_amount',
    rewardValue: 50,
    minOrderValue: 1000,
    maxRedemptions: 500,
    usedRedemptions: 89,
    validFrom: '2024-01-10',
    validTo: '2024-02-10',
    isActive: true,
    targetAudience: 'premium',
    cardDesign: 'template2',
    scratchArea: { width: 180, height: 120, position: { x: 160, y: 180 } },
    winProbability: 25,
    createdBy: 'Admin',
    createdAt: '2024-01-05'
  }
];

interface ScratchCardStatsProps {
  cards: ScratchCard[];
}

function ScratchCardStats({ cards }: ScratchCardStatsProps) {
  const activeCards = cards.filter(card => card.isActive).length;
  const totalRedemptions = cards.reduce((sum, card) => sum + card.usedRedemptions, 0);
  const avgWinRate = cards.length > 0 ? (cards.reduce((sum, card) => sum + card.winProbability, 0) / cards.length).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Gift className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Cards</p>
            <p className="text-xl font-bold">{cards.length}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Target className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Active Cards</p>
            <p className="text-xl font-bold">{activeCards}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Scratches</p>
            <p className="text-xl font-bold">{totalRedemptions}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Avg Win Rate</p>
            <p className="text-xl font-bold">{avgWinRate}%</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function ScratchCardPage() {
  const [cards, setCards] = useState<ScratchCard[]>(mockScratchCards);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ScratchCard | null>(null);

  const handleView = (id: string) => {
    const card = cards.find(c => c.id === id);
    if (card) {
      setSelectedCard(card);
      setShowViewModal(true);
    }
  };

  const handleSettings = (id: string) => {
    const card = cards.find(c => c.id === id);
    if (card) {
      setSelectedCard(card);
      setShowSettingsModal(true);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      setCards(cards.filter(card => card.id !== id));
    }
  };

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || (statusFilter === 'active' ? card.isActive : !card.isActive);
    const matchesType = !typeFilter || card.cardType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Scratch Card Generator</h1>
          <p className="text-gray-600">Create and manage interactive scratch cards</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Stats */}
      <ScratchCardStats cards={cards} />

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search scratch cards..." 
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
            value={typeFilter} 
            onChange={e => setTypeFilter(e.target.value)} 
            options={[
              { value: '', label: 'All Types' }, 
              { value: 'percentage', label: 'Percentage' }, 
              { value: 'fixed_amount', label: 'Fixed Amount' }, 
              { value: 'free_item', label: 'Free Item' },
              { value: 'points', label: 'Points' }
            ]} 
          />
        </div>
      </Card>

      {/* Cards Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCards.map(card => (
                <tr key={card.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-2xl mr-4">
                        {card.cardType === 'percentage' ? '💰' : 
                         card.cardType === 'fixed_amount' ? '💸' : 
                         card.cardType === 'free_item' ? '🎁' : '⭐'}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{card.name}</div>
                        <div className="text-sm text-gray-500">{card.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {card.cardType === 'percentage' ? `${card.rewardValue}%` : 
                       card.cardType === 'fixed_amount' ? `₹${card.rewardValue}` : 
                       card.cardType === 'points' ? `${card.rewardValue} pts` : 'Free Item'}
                    </div>
                    <div className="text-sm text-gray-500">Min. ₹{card.minOrderValue}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{card.usedRedemptions} / {card.maxRedemptions}</div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ width: `${Math.min((card.usedRedemptions / card.maxRedemptions) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(card.validFrom).toLocaleDateString()} - {new Date(card.validTo).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusColor(card.isActive ? 'active' : 'inactive')}>
                      {card.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleView(card.id)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleSettings(card.id)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                        <Settings className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(card.id)} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scratch cards found</h3>
            <p className="text-gray-500">Create your first scratch card campaign</p>
          </div>
        )}
      </Card>

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Scratch Card Campaign">
        <form className="space-y-4">
          <Input label="Campaign Name" placeholder="New Year Special" required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none" 
              rows={2} 
              placeholder="Campaign description..." 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Reward Type" 
              options={[
                { value: 'percentage', label: 'Percentage Discount' },
                { value: 'fixed_amount', label: 'Fixed Amount' },
                { value: 'free_item', label: 'Free Item' },
                { value: 'points', label: 'Points' }
              ]} 
            />
            <Input label="Reward Value" type="number" placeholder="20" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Min Order Value" type="number" placeholder="500" />
            <Input label="Max Redemptions" type="number" placeholder="1000" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Win Probability %" type="number" placeholder="30" min="1" max="100" />
            <Select 
              label="Target Audience" 
              options={[
                { value: 'all', label: 'All Users' },
                { value: 'new_users', label: 'New Users' },
                { value: 'premium', label: 'Premium Users' },
                { value: 'frequent_buyers', label: 'Frequent Buyers' }
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
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Scratch Card Details" size="lg">
        {selectedCard && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Campaign Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Campaign Name</p>
                    <p className="font-medium">{selectedCard.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="font-medium">{selectedCard.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge variant={getStatusColor(selectedCard.isActive ? 'active' : 'inactive')}>
                      {selectedCard.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Target Audience</p>
                    <p className="font-medium capitalize">{selectedCard.targetAudience.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Reward Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Reward Type</p>
                    <p className="font-medium capitalize">{selectedCard.cardType.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reward Value</p>
                    <p className="font-medium">
                      {selectedCard.cardType === 'percentage' ? `${selectedCard.rewardValue}%` : 
                       selectedCard.cardType === 'fixed_amount' ? `₹${selectedCard.rewardValue}` : 
                       selectedCard.cardType === 'points' ? `${selectedCard.rewardValue} pts` : 'Free Item'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Minimum Order Value</p>
                    <p className="font-medium">₹{selectedCard.minOrderValue}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Win Probability</p>
                    <p className="font-medium">{selectedCard.winProbability}%</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Usage Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <p className="text-sm text-gray-600">Total Redemptions</p>
                  <p className="text-xl font-bold">{selectedCard.usedRedemptions}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-gray-600">Max Redemptions</p>
                  <p className="text-xl font-bold">{selectedCard.maxRedemptions}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-gray-600">Usage Rate</p>
                  <p className="text-xl font-bold">
                    {((selectedCard.usedRedemptions / selectedCard.maxRedemptions) * 100).toFixed(1)}%
                  </p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p className="text-xl font-bold">
                    {selectedCard.maxRedemptions - selectedCard.usedRedemptions}
                  </p>
                </Card>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Validity Period</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Valid From</p>
                  <p className="font-medium">{new Date(selectedCard.validFrom).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Valid To</p>
                  <p className="font-medium">{new Date(selectedCard.validTo).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Settings Modal */}
      <Modal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} title="Scratch Card Settings">
        {selectedCard && (
          <form className="space-y-4">
            <Input label="Campaign Name" defaultValue={selectedCard.name} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none" 
                rows={2} 
                defaultValue={selectedCard.description}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reward Type</label>
                <select 
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white"
                  defaultValue={selectedCard.cardType}
                >
                  <option value="percentage">Percentage Discount</option>
                  <option value="fixed_amount">Fixed Amount</option>
                  <option value="free_item">Free Item</option>
                  <option value="points">Points</option>
                </select>
              </div>
              <Input label="Reward Value" type="number" defaultValue={selectedCard.rewardValue} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Min Order Value" type="number" defaultValue={selectedCard.minOrderValue} />
              <Input label="Max Redemptions" type="number" defaultValue={selectedCard.maxRedemptions} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Win Probability %" type="number" defaultValue={selectedCard.winProbability} min="1" max="100" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                <select 
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white"
                  defaultValue={selectedCard.targetAudience}
                >
                  <option value="all">All Users</option>
                  <option value="new_users">New Users</option>
                  <option value="premium">Premium Users</option>
                  <option value="frequent_buyers">Frequent Buyers</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Valid From" type="date" defaultValue={selectedCard.validFrom} />
              <Input label="Valid To" type="date" defaultValue={selectedCard.validTo} />
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="active" 
                defaultChecked={selectedCard.isActive}
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