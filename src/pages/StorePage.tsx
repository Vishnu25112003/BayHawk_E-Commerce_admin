import { useState } from 'react';
import {
  Button,
  Input,
  Select,
  Badge,
  Card,
} from '../components/ui';
import { Plus, Search, Eye, Edit, Trash2, Store, Package, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StoreForm, StoreDetails } from '../components/features/stores';
import { ConfirmDialog, PageHeader, FormModal } from '../components/common';
import { getStatusColor } from '../utils/helpers';
import type { StoreInput, Store as StoreType } from '../utils/validations';

const mockStores: StoreType[] = [
  {
    id: '1',
    name: 'T. Nagar Store',
    code: 'STR-CHN-001',
    description: 'Premium retail store in T. Nagar',
    storeType: 'retail',
    address: {
      street: '789 Pondy Bazaar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600017',
      country: 'India'
    },
    location: {
      latitude: 13.0418,
      longitude: 80.2341
    },
    contactInfo: {
      phone: '+91 9876543220',
      email: 'tnagar.store@fishapp.com',
      manager: 'Meera Krishnan'
    },
    operatingHours: {
      open: '08:00',
      close: '21:00',
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    capacity: {
      storage: 1000,
      dailyOrders: 200,
      staff: 8
    },
    hubId: '1',
    deliveryRadius: 5,
    isActive: true,
    createdBy: 'Admin',
    createdAt: '2024-01-01'
  },
];

// ... (rest of the components like StoreStats, StoreRow remain the same)

function StoreStats({ stores }: StoreStatsProps) {
  const activeStores = stores.filter(store => store.isActive).length;
  const totalCapacity = stores.reduce((sum, store) => sum + store.capacity.storage, 0);
  const totalStaff = stores.reduce((sum, store) => sum + store.capacity.staff, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-green-100 rounded-lg"><Store className="h-5 w-5 text-green-600" /></div><div><p className="text-sm text-gray-600">Total Stores</p><p className="text-xl font-bold">{stores.length}</p></div></div></Card>
      <Card className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-blue-100 rounded-lg"><Package className="h-5 w-5 text-blue-600" /></div><div><p className="text-sm text-gray-600">Active Stores</p><p className="text-xl font-bold">{activeStores}</p></div></div></Card>
      <Card className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-purple-100 rounded-lg"><Users className="h-5 w-5 text-purple-600" /></div><div><p className="text-sm text-gray-600">Total Staff</p><p className="text-xl font-bold">{totalStaff}</p></div></div></Card>
      <Card className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-orange-100 rounded-lg"><Package className="h-5 w-5 text-orange-600" /></div><div><p className="text-sm text-gray-600">Total Capacity</p><p className="text-xl font-bold">{totalCapacity.toLocaleString()}</p></div></div></Card>
    </div>
  );
}

function StoreRow({ store, onView, onEdit, onDelete }: { store: StoreType; onView: () => void; onEdit: () => void; onDelete: () => void; }) {
  const getStoreTypeColor = (type: string) => {
    switch (type) {
      case 'retail': return 'bg-green-100 text-green-800';
      case 'warehouse': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const getStoreTypeIcon = (type: string) => {
    switch (type) {
      case 'retail': return '🏪';
      case 'warehouse': return '🏭';
      default: return '🏢';
    }
  };
  return (
    <div className="flex items-center p-4 border-b hover:bg-gray-50">
      <div className="flex-1 min-w-0"><p className="font-semibold truncate">{store.name}</p><p className="text-sm text-gray-500 font-mono">{store.code}</p></div>
      <div className="w-40 text-center"><Badge className={`${getStoreTypeColor(store.storeType)} capitalize`}>{getStoreTypeIcon(store.storeType)} {store.storeType.replace('_', ' ')}</Badge></div>
      <div className="flex-1 min-w-0"><p className="text-sm truncate">{store.address.city}, {store.address.state}</p></div>
      <div className="w-28 text-center"><Badge variant={getStatusColor(store.isActive ? 'active' : 'inactive')}>{store.isActive ? 'Active' : 'Inactive'}</Badge></div>
      <div className="flex items-center justify-end gap-2 w-32">
        <Button variant="icon" size="sm" onClick={onView}><Eye className="h-4 w-4" /></Button>
        <Button variant="icon" size="sm" onClick={onEdit}><Edit className="h-4 w-4" /></Button>
        <Button variant="icon" size="sm" onClick={onDelete} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}

export function StorePage() {
  const { user } = useAuth();
  const [stores, setStores] = useState<StoreType[]>(mockStores);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreType | undefined>();

  const filteredStores = stores.filter(store => 
    (store.name.toLowerCase().includes(search.toLowerCase()) || store.code.toLowerCase().includes(search.toLowerCase())) &&
    (!statusFilter || (statusFilter === 'active' ? store.isActive : !store.isActive)) &&
    (!typeFilter || store.storeType === typeFilter)
  );

  const handleSaveStore = (data: StoreInput) => {
    if (selectedStore) {
      setStores(prev => prev.map(s => s.id === selectedStore.id ? { ...s, ...data, id: s.id } : s));
    } else {
      const newStore: StoreType = { ...data, id: Date.now().toString(), createdBy: user?.name || 'Admin', createdAt: new Date().toISOString() };
      setStores(prev => [...prev, newStore]);
    }
    setIsFormOpen(false);
    setSelectedStore(undefined);
  };

  const handleEdit = (store: StoreType) => {
    setSelectedStore(store);
    setIsFormOpen(true);
  };

  const handleView = (store: StoreType) => {
    setSelectedStore(store);
    setIsViewOpen(true);
  };

  const handleDelete = (store: StoreType) => {
    setSelectedStore(store);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (selectedStore) {
      setStores(prev => prev.filter(store => store.id !== selectedStore.id));
    }
    setIsConfirmOpen(false);
    setSelectedStore(undefined);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Store Management"
        description="Manage retail stores, warehouses, and pickup points"
        actions={
          <Button onClick={() => { setSelectedStore(undefined); setIsFormOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Store
          </Button>
        }
      />

      <StoreStats stores={stores} />

      <Card>
        <div className="flex items-center gap-4 p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search stores by name or code..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} options={[{ value: '', label: 'All Status' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
          <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} options={[{ value: '', label: 'All Types' }, { value: 'retail', label: 'Retail Store' }, { value: 'warehouse', label: 'Warehouse' }]} />
        </div>
      </Card>

      <Card>
        <div className="flex items-center p-4 border-b bg-gray-50 rounded-t-lg font-semibold text-sm text-gray-600">
          <div className="flex-1 min-w-0">Store</div>
          <div className="w-40 text-center">Type</div>
          <div className="flex-1 min-w-0">Location</div>
          <div className="w-28 text-center">Status</div>
          <div className="w-32 text-right">Actions</div>
        </div>
        <div>
          {filteredStores.length > 0 ? (
            filteredStores.map(store => (
              <StoreRow key={store.id} store={store} onView={() => handleView(store)} onEdit={() => handleEdit(store)} onDelete={() => handleDelete(store)} />
            ))
          ) : (
            <div className="text-center py-12"><Store className="h-12 w-12 text-gray-400 mx-auto mb-4" /><h3 className="text-lg font-medium">No stores found</h3><p className="text-gray-500">Your search criteria did not match any stores.</p></div>
          )}
        </div>
      </Card>

      <FormModal isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setSelectedStore(undefined); }} title={selectedStore ? 'Edit Store' : 'Add New Store'} size="2xl">
        <StoreForm onSubmit={handleSaveStore} onCancel={() => { setIsFormOpen(false); setSelectedStore(undefined); }} initialData={selectedStore} />
      </FormModal>

      {selectedStore && (
        <FormModal isOpen={isViewOpen} onClose={() => { setIsViewOpen(false); setSelectedStore(undefined); }} title="Store Details" size="2xl">
          <div className="p-2"><StoreDetails store={selectedStore} /></div>
        </FormModal>
      )}

      {selectedStore && (
        <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={confirmDelete} title="Delete Store" message={`Are you sure you want to delete "${selectedStore.name}"?`} />
      )}
    </div>
  );
}
