import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Button, Input, Table, Th, Td, Badge, Modal } from '../../components/ui';
import { Plus, Search, Edit, Trash2, MapPin, Store } from 'lucide-react';
import { getStatusColor } from '../../utils/helpers';
import { zonesApi, storesApi } from '../../utils/api';
import { zoneSchema, storeSchema, type ZoneInput, type StoreInput } from '../../utils/validations';
import { ZoneMap, LocationPicker, useGoogleMaps } from '../../components/maps/GoogleMaps';
import type { Zone, Store as StoreType } from '../../types';

interface ZoneWithCoords extends Zone {
  coordinates?: { lat: number; lng: number }[];
}

export function ZonesPage() {
  const [activeTab, setActiveTab] = useState<'zones' | 'stores'>('zones');
  const [zones, setZones] = useState<ZoneWithCoords[]>([]);
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState<string | undefined>();
  const [search, setSearch] = useState('');
  const { isLoaded: mapsLoaded } = useGoogleMaps();

  const zoneForm = useForm<ZoneInput>({ resolver: zodResolver(zoneSchema) });
  const storeForm = useForm<StoreInput>({ resolver: zodResolver(storeSchema) });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [zonesRes, storesRes] = await Promise.all([zonesApi.getAll(), storesApi.getAll()]);
        setZones(zonesRes.data);
        setStores(storesRes.data);
      } catch (error) {
        // Mock data fallback
        setZones([
          { id: '1', name: 'Chennai Central', pincodes: ['600001', '600002', '600003'], storeIds: ['s1', 's2'], coordinates: [{ lat: 13.0827, lng: 80.2707 }, { lat: 13.0927, lng: 80.2807 }, { lat: 13.0727, lng: 80.2807 }] },
          { id: '2', name: 'Chennai South', pincodes: ['600020', '600021'], storeIds: ['s3'], coordinates: [{ lat: 13.0027, lng: 80.2507 }, { lat: 13.0127, lng: 80.2607 }, { lat: 12.9927, lng: 80.2607 }] },
        ]);
        setStores([
          { id: 's1', name: 'Store - Anna Nagar', address: { street: '123, Anna Nagar Main Road', city: 'Chennai', state: 'Tamil Nadu', pincode: '600040', country: 'India' }, contactInfo: { phone: '+91 9876543210', email: 'annanagar@bayhawk.com', manager: 'Suresh' }, zoneId: '1', isActive: true, code: 'AN001', storeType: 'retail', location: { latitude: 13.0878, longitude: 80.2176 }, operatingHours: { open: '08:00', close: '22:00', workingDays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] }, capacity: { storage: 100, dailyOrders: 50, staff: 5 }, hubId: '1', deliveryRadius: 5, createdBy: 'admin', createdAt: '2023-01-01' },
          { id: 's2', name: 'Store - T Nagar', address: { street: '456, Pondy Bazaar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600017', country: 'India' }, contactInfo: { phone: '+91 9876543211', email: 'tnagar@bayhawk.com', manager: 'Ramesh' }, zoneId: '1', isActive: true, code: 'TN001', storeType: 'retail', location: { latitude: 13.0418, longitude: 80.2341 }, operatingHours: { open: '08:00', close: '22:00', workingDays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] }, capacity: { storage: 120, dailyOrders: 60, staff: 6 }, hubId: '1', deliveryRadius: 5, createdBy: 'admin', createdAt: '2023-01-01' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Create zone
  const onCreateZone = async (data: ZoneInput) => {
    try {
      const pincodes = data.pincodes.split(',').map((p) => p.trim());
      await zonesApi.create({ name: data.name, pincodes });
      setShowAddModal(false);
      zoneForm.reset();
      const response = await zonesApi.getAll();
      setZones(response.data);
    } catch (error) {
      console.error('Failed to create zone:', error);
    }
  };

  // Create store
  const onCreateStore = async (data: StoreInput) => {
    try {
      await storesApi.create(data);
      setShowAddModal(false);
      storeForm.reset();
      const response = await storesApi.getAll();
      setStores(response.data);
    } catch (error) {
      console.error('Failed to create store:', error);
    }
  };

  // Delete zone
  const deleteZone = async (id: string) => {
    if (!confirm('Are you sure you want to delete this zone?')) return;
    try {
      await zonesApi.delete(id);
      setZones((prev) => prev.filter((z) => z.id !== id));
    } catch (error) {
      console.error('Failed to delete zone:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Zone & Store Management</h1>
          <p className="text-gray-600">Manage delivery zones and store locations</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-5 w-5" /> Add {activeTab === 'zones' ? 'Zone' : 'Store'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-4">
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-blue-100 p-3"><MapPin className="h-6 w-6 text-blue-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Total Zones</p>
            <p className="text-2xl font-bold">{zones.length}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-green-100 p-3"><Store className="h-6 w-6 text-green-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Active Stores</p>
            <p className="text-2xl font-bold">{stores.filter((s) => s.isActive).length}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-purple-100 p-3"><MapPin className="h-6 w-6 text-purple-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Pincodes Covered</p>
            <p className="text-2xl font-bold">{zones.reduce((sum, z) => sum + z.pincodes.length, 0)}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-orange-100 p-3"><Store className="h-6 w-6 text-orange-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Inactive Stores</p>
            <p className="text-2xl font-bold">{stores.filter((s) => !s.isActive).length}</p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {[{ id: 'zones', label: 'Zones', icon: MapPin }, { id: 'stores', label: 'Stores', icon: Store }].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${activeTab === tab.id ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Map View */}
      {activeTab === 'zones' && mapsLoaded && zones.some((z) => z.coordinates) && (
        <Card>
          <h2 className="text-lg font-semibold mb-4">Zone Map</h2>
          <ZoneMap
            zones={zones.filter((z) => z.coordinates).map((z) => ({ id: z.id, name: z.name, coordinates: z.coordinates! }))}
            selectedZoneId={selectedZoneId}
            onZoneClick={setSelectedZoneId}
          />
        </Card>
      )}

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder={`Search ${activeTab}...`} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </Card>

      {/* Zones Tab */}
      {activeTab === 'zones' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {zones.filter((z) => z.name.toLowerCase().includes(search.toLowerCase())).map((zone) => (
            <Card key={zone.id} className={selectedZoneId === zone.id ? 'ring-2 ring-primary-500' : ''} onClick={() => setSelectedZoneId(zone.id)}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{zone.name}</h3>
                  <p className="text-sm text-gray-500">{zone.storeIds.length} stores assigned</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded"><Edit className="h-5 w-5" /></button>
                  <button onClick={() => deleteZone(zone.id)} className="p-1 hover:bg-gray-100 rounded text-red-600"><Trash2 className="h-5 w-5" /></button>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Pincodes ({zone.pincodes.length})</p>
                <div className="flex flex-wrap gap-2">
                  {zone.pincodes.map((pin) => (
                    <span key={pin} className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">{pin}</span>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">Assigned Stores</p>
                <div className="space-y-2">
                  {stores.filter((s) => zone.storeIds.includes(s.id)).map((store) => (
                    <div key={store.id} className="flex items-center justify-between text-sm">
                      <span>{store.name}</span>
                      <Badge variant={getStatusColor(store.isActive ? 'active' : 'inactive')}>{store.isActive ? 'Active' : 'Inactive'}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Stores Tab */}
      {activeTab === 'stores' && (
        <Card className="p-0 overflow-hidden">
          <Table>
            <thead>
              <tr><Th>Store Name</Th><Th>Address</Th><Th>Contact</Th><Th>Zone</Th><Th>Status</Th><Th>Actions</Th></tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stores.filter((s) => s.name.toLowerCase().includes(search.toLowerCase())).map((store) => (
                <tr key={store.id} className="hover:bg-gray-50">
                  <Td><span className="font-medium">{store.name}</span></Td>
                  <Td><span className="text-sm">{`${store.address.street}, ${store.address.city}`}</span></Td>
                  <Td>
                    <div>
                      <p className="text-sm">{store.contactInfo.phone}</p>
                      <p className="text-xs text-gray-500">{store.contactInfo.email}</p>
                    </div>
                  </Td>
                  <Td>{zones.find((z) => z.id === store.zoneId)?.name || '-'}</Td>
                  <Td><Badge variant={getStatusColor(store.isActive ? 'active' : 'inactive')}>{store.isActive ? 'Active' : 'Inactive'}</Badge></Td>
                  <Td>
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded"><Edit className="h-5 w-5" /></button>
                      <button className="p-1 hover:bg-gray-100 rounded text-red-600"><Trash2 className="h-5 w-5" /></button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {/* Add Zone Modal */}
      <Modal isOpen={showAddModal && activeTab === 'zones'} onClose={() => setShowAddModal(false)} title="Add New Zone">
        <form onSubmit={zoneForm.handleSubmit(onCreateZone)} className="space-y-4">
          <Input label="Zone Name" {...zoneForm.register('name')} placeholder="Chennai Central" error={zoneForm.formState.errors.name?.message} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pincodes</label>
            <textarea
              {...zoneForm.register('pincodes')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
              rows={3}
              placeholder="Enter pincodes separated by comma (e.g., 600001, 600002, 600003)"
            />
            {zoneForm.formState.errors.pincodes && <p className="text-sm text-red-500 mt-1">{zoneForm.formState.errors.pincodes.message}</p>}
          </div>
          {mapsLoaded && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Draw Zone on Map (Optional)</label>
              <LocationPicker value={undefined} onChange={() => {}} />
            </div>
          )}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Create Zone</Button>
          </div>
        </form>
      </Modal>

      {/* Add Store Modal */}
      <Modal isOpen={showAddModal && activeTab === 'stores'} onClose={() => setShowAddModal(false)} title="Add New Store">
        <form onSubmit={storeForm.handleSubmit(onCreateStore)} className="space-y-4">
          <Input label="Store Name" {...storeForm.register('name')} placeholder="Store - Anna Nagar" error={storeForm.formState.errors.name?.message} />
          <Input label="Address" {...storeForm.register('address.street')} placeholder="Full address" error={storeForm.formState.errors.address?.street?.message} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" {...storeForm.register('contactInfo.phone')} placeholder="+91 9876543210" error={storeForm.formState.errors.contactInfo?.phone?.message} />
            <Input label="Email" {...storeForm.register('contactInfo.email')} type="email" placeholder="store@bayhawk.com" error={storeForm.formState.errors.contactInfo?.email?.message} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
            <select {...storeForm.register('zoneId')} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none">
              <option value="">Select Zone</option>
              {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
            </select>
            {storeForm.formState.errors.zoneId && <p className="text-sm text-red-500 mt-1">{storeForm.formState.errors.zoneId.message}</p>}
          </div>
          {mapsLoaded && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pin Location on Map</label>
              <LocationPicker value={undefined} onChange={(loc) => console.log('Store location:', loc)} zoom={15} />
            </div>
          )}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Create Store</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
