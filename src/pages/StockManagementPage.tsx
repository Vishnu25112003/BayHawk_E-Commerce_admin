import { useState } from 'react';
import { Card, Button, Input, Select, Badge, Modal } from '../components/ui';
import { Search, Download, Plus, Eye, Edit, AlertTriangle, TrendingUp, TrendingDown, Package, Building2, Store, X, Save } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { filterDataByModule } from '../utils/rbac';

interface StockItem {
  id: string;
  productName: string;
  productNameTa: string;
  sku: string;
  category: string;
  variant: string;
  currentStock: number;
  minStockLevel: number;
  unit: string;
  price: number;
  sourceType: 'hub' | 'store';
  moduleType: 'hub' | 'store';
  hubId?: string;
  storeId?: string;
  storeName?: string;
  lastUpdated: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

const mockStockData: StockItem[] = [
  // Hub Stock
  { id: '1', productName: 'Seer Fish (Vanjaram)', productNameTa: 'வஞ்சிரம்', sku: 'FISH-001', category: 'fish', variant: 'Whole Cleaned - Medium', currentStock: 25, minStockLevel: 10, unit: 'kg', price: 1200, sourceType: 'hub', moduleType: 'hub', hubId: 'hub_1', lastUpdated: '2024-01-10', status: 'in_stock' },
  { id: '2', productName: 'Tiger Prawns', productNameTa: 'இறால்', sku: 'PRWN-001', category: 'prawns', variant: 'Cleaned - Large', currentStock: 8, minStockLevel: 15, unit: 'kg', price: 650, sourceType: 'hub', moduleType: 'hub', hubId: 'hub_1', lastUpdated: '2024-01-10', status: 'low_stock' },
  { id: '3', productName: 'Pomfret (White)', productNameTa: 'வாவல்', sku: 'FISH-002', category: 'fish', variant: 'Whole Cleaned - Medium', currentStock: 0, minStockLevel: 5, unit: 'kg', price: 450, sourceType: 'hub', moduleType: 'hub', hubId: 'hub_1', lastUpdated: '2024-01-09', status: 'out_of_stock' },
  { id: '4', productName: 'Mud Crab', productNameTa: 'நண்டு', sku: 'CRAB-001', category: 'crab', variant: 'Live - Large', currentStock: 12, minStockLevel: 5, unit: 'kg', price: 850, sourceType: 'hub', moduleType: 'hub', hubId: 'hub_1', lastUpdated: '2024-01-10', status: 'in_stock' },
  
  // Store Stock
  { id: '5', productName: 'Chicken Breast', productNameTa: 'சிக்கன் மார்பு', sku: 'CHKN-001', category: 'chicken', variant: 'Boneless - Pack', currentStock: 50, minStockLevel: 20, unit: 'kg', price: 280, sourceType: 'store', moduleType: 'store', storeId: 'store_1', storeName: 'Anna Nagar Store', lastUpdated: '2024-01-10', status: 'in_stock' },
  { id: '6', productName: 'Mutton Curry Cut', productNameTa: 'ஆட்டு இறைச்சி', sku: 'MUTN-001', category: 'mutton', variant: 'Curry Cut - Medium', currentStock: 5, minStockLevel: 15, unit: 'kg', price: 650, sourceType: 'store', moduleType: 'store', storeId: 'store_1', storeName: 'Anna Nagar Store', lastUpdated: '2024-01-10', status: 'low_stock' },
  { id: '7', productName: 'Country Eggs', productNameTa: 'நாட்டு முட்டை', sku: 'EGG-001', category: 'egg', variant: 'Fresh - Medium', currentStock: 100, minStockLevel: 50, unit: 'pcs', price: 120, sourceType: 'store', moduleType: 'store', storeId: 'store_2', storeName: 'T. Nagar Store', lastUpdated: '2024-01-10', status: 'in_stock' },
  { id: '8', productName: 'Turmeric Powder', productNameTa: 'மஞ்சள் தூள்', sku: 'SPC-001', category: 'spices', variant: 'Powder - 100g', currentStock: 0, minStockLevel: 20, unit: 'pcs', price: 45, sourceType: 'store', moduleType: 'store', storeId: 'store_3', storeName: 'Velachery Store', lastUpdated: '2024-01-09', status: 'out_of_stock' },
];

const mockStores = [
  { id: 'store_1', name: 'Anna Nagar Store' },
  { id: 'store_2', name: 'T. Nagar Store' },
  { id: 'store_3', name: 'Velachery Store' },
];

export function StockManagementPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'hub' | 'store'>('hub');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [storeFilter, setStoreFilter] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUpdateStockModal, setShowUpdateStockModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [updateStockData, setUpdateStockData] = useState({
    currentStock: 0,
    operation: 'add' as 'add' | 'subtract' | 'set',
    amount: 0,
    reason: ''
  });

  // Filter stock data based on user's module access
  const filteredStockData = filterDataByModule(mockStockData, user);

  // Separate stock by source
  const hubStock = filteredStockData.filter(item => item.sourceType === 'hub');
  const storeStock = filteredStockData.filter(item => item.sourceType === 'store');

  const filterStock = (stockList: StockItem[]) => {
    return stockList.filter(item => {
      const matchesSearch = item.productName.toLowerCase().includes(search.toLowerCase()) ||
        item.productNameTa.includes(search) || item.sku.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || item.status === statusFilter;
      const matchesStore = !storeFilter || item.storeId === storeFilter;
      return matchesSearch && matchesStatus && matchesStore;
    });
  };

  const filteredHubStock = filterStock(hubStock);
  const filteredStoreStock = filterStock(storeStock);

  // Determine which tabs to show based on user type
  const getAvailableTabs = () => {
    const allTabs = [
      { id: 'hub', label: 'Hub Stock', icon: Building2, count: filteredHubStock.length },
      { id: 'store', label: 'Store Stock', icon: Store, count: filteredStoreStock.length },
    ];

    if (user?.loginType === 'hub') {
      return allTabs.filter(tab => tab.id === 'hub');
    } else if (user?.loginType === 'store') {
      return allTabs.filter(tab => tab.id === 'store');
    } else {
      // Super admin sees all tabs
      return allTabs;
    }
  };

  const tabs = getAvailableTabs();

  // Set default active tab based on user type
  useState(() => {
    const defaultTab = user?.loginType === 'hub' ? 'hub' : user?.loginType === 'store' ? 'store' : 'hub';
    setActiveTab(defaultTab as 'hub' | 'store');
  });

  const getCurrentStock = () => {
    return activeTab === 'hub' ? filteredHubStock : filteredStoreStock;
  };

  const getStockStats = (stockList: StockItem[]) => {
    return {
      total: stockList.length,
      inStock: stockList.filter(item => item.status === 'in_stock').length,
      lowStock: stockList.filter(item => item.status === 'low_stock').length,
      outOfStock: stockList.filter(item => item.status === 'out_of_stock').length,
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_stock': return TrendingUp;
      case 'low_stock': return AlertTriangle;
      case 'out_of_stock': return TrendingDown;
      default: return Package;
    }
  };

  const handleViewItem = (item: StockItem) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleEditItem = (item: StockItem) => {
    setSelectedItem(item);
    setUpdateStockData({
      currentStock: item.currentStock,
      operation: 'add',
      amount: 0,
      reason: ''
    });
    setShowEditModal(true);
  };

  const handleUpdateStock = () => {
    if (selectedItem) {
      console.log('Update stock:', selectedItem.id, updateStockData);
      setShowEditModal(false);
      setShowViewModal(false);
      setSelectedItem(null);
      alert(`Stock for ${selectedItem.productName} has been updated successfully!`);
    }
  };

  const handleUpdateHubStock = () => {
    setShowUpdateStockModal(true);
  };

  const confirmUpdateStock = () => {
    console.log('Bulk update hub stock:', updateStockData);
    setShowUpdateStockModal(false);
    setUpdateStockData({
      currentStock: 0,
      operation: 'add',
      amount: 0,
      reason: ''
    });
    alert('Hub stock has been updated successfully!');
  };

  const handleExport = () => {
    console.log('Export stock data');
    alert('Stock data exported successfully!');
  };

  const StockRow = ({ item }: { item: StockItem }) => {
    const StatusIcon = getStatusIcon(item.status);
    const stockPercentage = (item.currentStock / item.minStockLevel) * 100;
    
    return (
      <Card key={item.id} className="p-4 mb-3">
        <div className="flex items-center justify-between gap-4">
          {/* Product Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-base truncate">{item.productName}</h3>
                <Badge variant={getStatusColor(item.status)} className="flex items-center gap-1 text-xs">
                  <StatusIcon className="h-3 w-3" />
                  {item.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span>{item.productNameTa}</span>
                <span className="font-mono">{item.sku}</span>
                <span>{item.variant}</span>
                {item.storeName && <span className="text-blue-600">{item.storeName}</span>}
              </div>
            </div>
          </div>

          {/* Stock Info */}
          <div className="hidden md:flex items-center gap-6 flex-shrink-0">
            <div className="text-center">
              <p className={`text-2xl font-bold ${item.status === 'out_of_stock' ? 'text-red-600' : item.status === 'low_stock' ? 'text-yellow-600' : 'text-green-600'}`}>
                {item.currentStock}
              </p>
              <p className="text-xs text-gray-500">Current</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-gray-700">{item.minStockLevel}</p>
              <p className="text-xs text-gray-500">Min Level</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{formatCurrency(item.price)}</p>
              <p className="text-xs text-gray-500">per {item.unit}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button 
              onClick={() => handleViewItem(item)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handleEditItem(item)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
              title="Update Stock"
            >
              <Edit className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stock Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Stock Level</span>
            <span>{Math.round(stockPercentage)}% of minimum</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                stockPercentage >= 100 ? 'bg-green-500' : 
                stockPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Mobile Stock Info */}
        <div className="md:hidden mt-3 pt-3 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className={`text-xl font-bold ${item.status === 'out_of_stock' ? 'text-red-600' : item.status === 'low_stock' ? 'text-yellow-600' : 'text-green-600'}`}>
                {item.currentStock}
              </p>
              <p className="text-xs text-gray-500">Current</p>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">{item.minStockLevel}</p>
              <p className="text-xs text-gray-500">Min Level</p>
            </div>
            <div>
              <p className="text-lg font-semibold">{formatCurrency(item.price)}</p>
              <p className="text-xs text-gray-500">per {item.unit}</p>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const hubStats = getStockStats(filteredHubStock);
  const storeStats = getStockStats(filteredStoreStock);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {user?.loginType === 'hub' ? 'Hub Stock Management' : 
             user?.loginType === 'store' ? 'Store Stock Management' : 
             'Stock Management'}
          </h1>
          <p className="text-gray-600">
            {user?.loginType === 'hub' ? 'Monitor and manage hub inventory levels' : 
             user?.loginType === 'store' ? 'Monitor and manage store inventory levels' : 
             'Monitor and manage inventory levels across hub and stores'}
          </p>
        </div>
        <Button onClick={activeTab === 'hub' ? handleUpdateHubStock : handleUpdateHubStock} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> 
          Update {activeTab === 'hub' ? 'Hub' : 'Store'} Stock
        </Button>
      </div>

      {/* Stats Cards - Only show relevant stats based on user type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(user?.loginType === 'super_admin' || user?.loginType === 'hub') && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hub Stock</p>
                <p className="text-2xl font-bold">{hubStats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="text-center">
                <p className="text-lg font-semibold text-green-600">{hubStats.inStock}</p>
                <p className="text-xs text-gray-500">In Stock</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-yellow-600">{hubStats.lowStock}</p>
                <p className="text-xs text-gray-500">Low Stock</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-red-600">{hubStats.outOfStock}</p>
                <p className="text-xs text-gray-500">Out of Stock</p>
              </div>
            </div>
          </Card>
        )}

        {(user?.loginType === 'super_admin' || user?.loginType === 'store') && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Store Stock</p>
                <p className="text-2xl font-bold">{storeStats.total}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Store className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="text-center">
                <p className="text-lg font-semibold text-green-600">{storeStats.inStock}</p>
                <p className="text-xs text-gray-500">In Stock</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-yellow-600">{storeStats.lowStock}</p>
                <p className="text-xs text-gray-500">Low Stock</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-red-600">{storeStats.outOfStock}</p>
                <p className="text-xs text-gray-500">Out of Stock</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Tabs - Only show if there are multiple tabs */}
      {tabs.length > 1 && (
        <div className="flex gap-2 border-b overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              <Badge variant="bg-gray-100 text-gray-600">{tab.count}</Badge>
            </button>
          ))}
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search by product name, SKU..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="pl-10" 
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)} 
              options={[
                { value: '', label: 'All Status' },
                { value: 'in_stock', label: 'In Stock' },
                { value: 'low_stock', label: 'Low Stock' },
                { value: 'out_of_stock', label: 'Out of Stock' }
              ]} 
            />
            {activeTab === 'store' && (
              <Select 
                value={storeFilter} 
                onChange={e => setStoreFilter(e.target.value)} 
                options={[
                  { value: '', label: 'All Stores' },
                  ...mockStores.map(store => ({ value: store.id, label: store.name }))
                ]} 
              />
            )}
            <Button variant="secondary" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Stock List */}
      {getCurrentStock().length > 0 ? (
        <div className="space-y-3">
          {getCurrentStock().map(item => (
            <StockRow key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          {activeTab === 'hub' ? (
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          ) : (
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          )}
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab === 'hub' ? 'hub' : 'store'} stock found
          </h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Stock Items
          </Button>
        </Card>
      )}

      {/* View Stock Details Modal */}
      <Modal 
        isOpen={showViewModal} 
        onClose={() => {
          setShowViewModal(false);
          setSelectedItem(null);
        }} 
        title="Stock Item Details"
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedItem.productName}</h3>
                <p className="text-gray-600">{selectedItem.productNameTa}</p>
                <Badge variant={getStatusColor(selectedItem.status)} className="mt-2">
                  {selectedItem.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Product Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">SKU:</span>
                    <span className="font-mono">{selectedItem.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="capitalize">{selectedItem.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Variant:</span>
                    <span>{selectedItem.variant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Source:</span>
                    <span className="capitalize">{selectedItem.sourceType}</span>
                  </div>
                  {selectedItem.storeName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Store:</span>
                      <span>{selectedItem.storeName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Stock Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Stock:</span>
                    <span className={`font-bold ${selectedItem.status === 'out_of_stock' ? 'text-red-600' : selectedItem.status === 'low_stock' ? 'text-yellow-600' : 'text-green-600'}`}>
                      {selectedItem.currentStock} {selectedItem.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Minimum Level:</span>
                    <span className="font-medium">{selectedItem.minStockLevel} {selectedItem.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">{formatCurrency(selectedItem.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span>{selectedItem.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button 
                variant="secondary"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedItem(null);
                }}
                className="flex-1"
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  setShowViewModal(false);
                  handleEditItem(selectedItem);
                }}
                className="flex-1"
              >
                Update Stock
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Stock Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => {
          setShowEditModal(false);
          setSelectedItem(null);
        }} 
        title="Update Stock"
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{selectedItem.productName}</h4>
              <div className="text-sm text-gray-600">
                <p>Current Stock: <span className="font-bold">{selectedItem.currentStock} {selectedItem.unit}</span></p>
                <p>SKU: <span className="font-mono">{selectedItem.sku}</span></p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Update Operation</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={updateStockData.operation}
                onChange={e => setUpdateStockData({...updateStockData, operation: e.target.value as 'add' | 'subtract' | 'set'})}
              >
                <option value="add">Add Stock</option>
                <option value="subtract">Remove Stock</option>
                <option value="set">Set Stock Level</option>
              </select>
            </div>

            {updateStockData.operation === 'set' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Stock Level ({selectedItem.unit})</label>
                <Input 
                  type="number"
                  value={updateStockData.amount || ''}
                  onChange={e => setUpdateStockData({...updateStockData, amount: Number(e.target.value)})}
                  placeholder={`Enter new stock level in ${selectedItem.unit}`}
                  min="0"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount ({selectedItem.unit})</label>
                <Input 
                  type="number"
                  value={updateStockData.amount || ''}
                  onChange={e => setUpdateStockData({...updateStockData, amount: Number(e.target.value)})}
                  placeholder={`Enter amount in ${selectedItem.unit}`}
                  min="0"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Update</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={updateStockData.reason}
                onChange={e => setUpdateStockData({...updateStockData, reason: e.target.value})}
              >
                <option value="">Select a reason</option>
                <option value="new_stock">New Stock Received</option>
                <option value="damage">Damage/Returns</option>
                <option value="correction">Stock Correction</option>
                <option value="transfer">Stock Transfer</option>
                <option value="other">Other</option>
              </select>
            </div>

            {updateStockData.operation !== 'set' && (
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Preview:</strong> Stock will change from {selectedItem.currentStock} {selectedItem.unit} to{' '}
                  <strong>
                    {updateStockData.operation === 'add' 
                      ? selectedItem.currentStock + (updateStockData.amount || 0)
                      : selectedItem.currentStock - (updateStockData.amount || 0)
                    } {selectedItem.unit}
                  </strong>
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                variant="secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedItem(null);
                }}
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button onClick={handleUpdateStock} className="flex-1">
                <Save className="mr-2 h-4 w-4" /> Update Stock
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Hub Stock Modal */}
      <Modal 
        isOpen={showUpdateStockModal} 
        onClose={() => {
          setShowUpdateStockModal(false);
        }} 
        title="Update Hub Stock"
        size="lg"
      >
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Bulk Hub Stock Update</h4>
            <p className="text-sm text-blue-800">
              Update stock levels for multiple items in the hub inventory. This operation will be recorded in the system logs.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Update Type</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={updateStockData.operation}
              onChange={e => setUpdateStockData({...updateStockData, operation: e.target.value as 'add' | 'subtract' | 'set'})}
            >
              <option value="add">Add Stock to All Items</option>
              <option value="subtract">Remove Stock from All Items</option>
              <option value="set">Set Stock Level for All Items</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category Filter</label>
              <Select 
                options={[
                  { value: '', label: 'All Categories' },
                  { value: 'fish', label: 'Fish' },
                  { value: 'prawns', label: 'Prawns' },
                  { value: 'crab', label: 'Crab' },
                  { value: 'chicken', label: 'Chicken' },
                  { value: 'mutton', label: 'Mutton' },
                  { value: 'egg', label: 'Eggs' },
                  { value: 'spices', label: 'Spices' }
                ]} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (percentage or fixed)</label>
              <Input 
                type="number"
                value={updateStockData.amount || ''}
                onChange={e => setUpdateStockData({...updateStockData, amount: Number(e.target.value)})}
                placeholder="Enter amount"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Update Reason</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={updateStockData.reason}
              onChange={e => setUpdateStockData({...updateStockData, reason: e.target.value})}
            >
              <option value="">Select a reason</option>
              <option value="bulk_purchase">Bulk Purchase Received</option>
              <option value="seasonal_adjustment">Seasonal Adjustment</option>
              <option value="stock_take">Stock Take Correction</option>
              <option value="system_update">System Update</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="secondary"
              onClick={() => {
                setShowUpdateStockModal(false);
                setUpdateStockData({
                  currentStock: 0,
                  operation: 'add',
                  amount: 0,
                  reason: ''
                });
              }}
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={confirmUpdateStock} className="flex-1">
              <Package className="mr-2 h-4 w-4" /> Update Hub Stock
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
