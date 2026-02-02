import { useState } from 'react';
import { Card, Button, Select, Modal, Input, Badge } from '../../components/ui';
import { Plus, Search, Gift, TrendingUp, Users, Target } from 'lucide-react';
import { MarketingList } from '../../components/marketing/MarketingList';

interface ScratchCard {
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

export function ScratchCardPageNew() {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ScratchCard | null>(null);
  
  const [scratchCards, setScratchCards] = useState<ScratchCard[]>([
    {
      id: '1',
      title: 'Welcome Bonus Scratch Card',
      type: 'Scratch Card',
      status: 'active',
      description: 'New user welcome scratch card with prizes up to ₹500',
      stats: [
        { label: 'Total Plays', value: '2,847' },
        { label: 'Win Rate', value: '68%' },
        { label: 'Total Rewards', value: '₹45,200' }
      ],
      validFrom: '2026-01-01',
      validTo: '2026-03-31',
      createdAt: '2026-01-01'
    },
    {
      id: '2',
      title: 'Festival Special Scratch',
      type: 'Scratch Card',
      status: 'scheduled',
      description: 'Special festival scratch card with exclusive prizes',
      stats: [
        { label: 'Total Plays', value: '0' },
        { label: 'Win Rate', value: '0%' },
        { label: 'Total Rewards', value: '₹0' }
      ],
      validFrom: '2026-02-15',
      validTo: '2026-02-28',
      createdAt: '2026-01-10'
    },
    {
      id: '3',
      title: 'Daily Login Scratch',
      type: 'Scratch Card',
      status: 'inactive',
      description: 'Daily login reward scratch card for regular users',
      stats: [
        { label: 'Total Plays', value: '1,234' },
        { label: 'Win Rate', value: '45%' },
        { label: 'Total Rewards', value: '₹12,800' }
      ],
      validFrom: '2025-12-01',
      validTo: '2025-12-31',
      createdAt: '2025-11-25'
    }
  ]);

  const handleView = (id: string) => {
    const card = scratchCards.find(c => c.id === id);
    if (card) {
      setSelectedCard(card);
      setShowViewModal(true);
    }
  };

  const handleEdit = (id: string) => {
    const card = scratchCards.find(c => c.id === id);
    if (card) {
      setSelectedCard(card);
      setShowEditModal(true);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this scratch card?')) {
      setScratchCards(prev => prev.filter(card => card.id !== id));
      alert('Scratch card deleted successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Scratch Card Management</h1>
          <p className="text-gray-600">Create and manage scratch card campaigns</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Scratch Card
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
                placeholder="Search scratch cards..."
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

      {/* Scratch Cards List */}
      <MarketingList
        items={scratchCards}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cards</p>
              <p className="text-2xl font-bold">{scratchCards.length}</p>
            </div>
            <Gift className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Cards</p>
              <p className="text-2xl font-bold">{scratchCards.filter(c => c.status === 'active').length}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Plays</p>
              <p className="text-2xl font-bold">4,081</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Rewards</p>
              <p className="text-2xl font-bold">₹58,000</p>
            </div>
            <Target className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* View Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Scratch Card Details" size="md">
        {selectedCard && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{selectedCard.title}</h3>
              <p className="text-gray-600 mb-4">{selectedCard.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge className={
                  selectedCard.status === 'active' ? 'bg-green-100 text-green-800' :
                  selectedCard.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                  selectedCard.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }>
                  {selectedCard.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium">{selectedCard.type}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Statistics</p>
              <div className="space-y-2">
                {selectedCard.stats?.map((stat, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-sm">{stat.label}:</span>
                    <span className="font-medium">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
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
            
            <div>
              <p className="text-sm text-gray-600">Created On</p>
              <p className="font-medium">{new Date(selectedCard.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Scratch Card">
        {selectedCard && (
          <form className="space-y-4">
            <Input label="Title" defaultValue={selectedCard.title} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none" 
                rows={3} 
                defaultValue={selectedCard.description}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white" defaultValue={selectedCard.status}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              <Input label="Type" defaultValue={selectedCard.type} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Valid From" type="date" defaultValue={selectedCard.validFrom} />
              <Input label="Valid To" type="date" defaultValue={selectedCard.validTo} />
            </div>
            <div className="flex gap-2 pt-4 border-t">
              <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)} className="flex-1">
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
