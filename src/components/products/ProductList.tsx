import { useState } from 'react';
import { Card, Button, Input, Select, Badge } from '../ui';
import { Search, Download, Plus, Eye, Edit, Trash2, Image, Store, Building2 } from 'lucide-react';
import { formatCurrency, getStatusColor } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import type { Product, ProductCategory } from '../../types';

interface ProductListProps {
  products: Product[];
  sourceType?: 'hub' | 'store' | 'all';
  onAddProduct?: () => void;
  onEditProduct?: (product: Product) => void;
  onViewProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  showAddButton?: boolean;
  title?: string;
  description?: string;
}

const categories: { value: ProductCategory | ''; label: string }[] = [
  { value: '', label: 'All Categories' },
  { value: 'fish', label: 'Fish' },
  { value: 'prawns', label: 'Prawns' },
  { value: 'crab', label: 'Crab' },
  { value: 'squid', label: 'Squid' },
  { value: 'lobster', label: 'Lobster' },
  { value: 'chicken', label: 'Chicken' },
  { value: 'mutton', label: 'Mutton' },
  { value: 'egg', label: 'Egg' },
  { value: 'spices', label: 'Spices' },
];

const mockStores = [
  { id: 'store_1', name: 'Anna Nagar Store', location: 'Anna Nagar, Chennai' },
  { id: 'store_2', name: 'T. Nagar Store', location: 'T. Nagar, Chennai' },
  { id: 'store_3', name: 'Velachery Store', location: 'Velachery, Chennai' },
];

export function ProductList({
  products,
  onAddProduct,
  onEditProduct,
  onViewProduct,
  onDeleteProduct,
  showAddButton = true,
  title = 'Product Management',
  description = 'Manage products and inventory'
}: ProductListProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'hub' | 'store'>('hub');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedStore, setSelectedStore] = useState('');

  // Separate products by source
  const hubProducts = products.filter(p => p.sourceType === 'hub');
  const storeProducts = products.filter(p => p.sourceType === 'store');

  const filterProducts = (productList: Product[]) => {
    return productList.filter(product => {
      const matchesSearch = product.nameEn.toLowerCase().includes(search.toLowerCase()) ||
        product.nameTa.includes(search) || product.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  };

  const filteredHubProducts = filterProducts(hubProducts);
  const filteredStoreProducts = filterProducts(storeProducts);

  // Determine which tabs to show based on user type
  const getAvailableTabs = () => {
    const allTabs = [
      { id: 'hub', label: 'Hub Products', icon: Building2, count: filteredHubProducts.length },
      { id: 'store', label: 'Store Products', icon: Store, count: filteredStoreProducts.length },
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
  const getDefaultActiveTab = () => {
    if (user?.loginType === 'hub') return 'hub';
    if (user?.loginType === 'store') return 'store';
    return 'hub'; // Default for super admin
  };

  // Initialize activeTab based on user type
  useState(() => {
    const defaultTab = getDefaultActiveTab();
    setActiveTab(defaultTab as 'hub' | 'store');
  });

  const getCurrentProducts = () => {
    return activeTab === 'hub' ? filteredHubProducts : filteredStoreProducts;
  };

  const ProductRow = ({ product }: { product: Product }) => (
    <Card key={product.id} className="p-4 mb-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Product Info */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full sm:w-auto">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Image className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
              <h3 className="font-semibold text-sm sm:text-base truncate">{product.nameEn}</h3>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <Badge variant={getStatusColor(product.isActive ? 'active' : 'inactive')} className="text-xs">
                  {product.isActive ? 'Active' : 'Inactive'}
                </Badge>
                {product.isBestSeller && <Badge variant="bg-yellow-100 text-yellow-800" className="text-xs">Best Seller</Badge>}
                {product.isRare && <Badge variant="bg-purple-100 text-purple-800" className="text-xs">Rare</Badge>}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <span className="truncate">{product.nameTa}</span>
              <span className="font-mono text-xs">{product.sku}</span>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <Badge variant="bg-gray-100 text-gray-800" className="text-xs">{product.category}</Badge>
                <Badge variant={product.deliveryType === 'same_day' ? 'bg-green-100 text-green-800' : product.deliveryType === 'exotic' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'} className="text-xs">
                  {product.deliveryType.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Price & Stock */}
        <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2 w-full sm:w-auto justify-between sm:justify-end flex-shrink-0">
          <div className="text-left sm:text-right">
            <p className="font-semibold text-base sm:text-lg">{formatCurrency(product.variants[0]?.price || 0)}</p>
            {product.variants[0]?.discount && (
              <p className="text-xs text-green-600">{product.variants[0].discount}% off</p>
            )}
          </div>
          <div className="text-left sm:text-right">
            <p className={`font-medium text-sm sm:text-base ${(product.variants[0]?.stock || 0) < 10 ? 'text-red-600' : 'text-green-600'}`}>
              {product.variants[0]?.stock || 0} {product.category === 'egg' ? 'pcs' : 'kg'}
            </p>
            <p className="text-xs text-gray-500">Stock</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 mt-2 sm:mt-0">
          {onViewProduct && (
            <button 
              onClick={() => onViewProduct(product)}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors" 
              title="View"
            >
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          )}
          {onEditProduct && (
            <button 
              onClick={() => onEditProduct(product)}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors" 
              title="Edit"
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          )}
          {onDeleteProduct && (
            <button 
              onClick={() => onDeleteProduct(product.id)}
              className="p-1.5 sm:p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600" 
              title="Delete"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold truncate">{title}</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">{description}</p>
        </div>
        {showAddButton && onAddProduct && (
          <Button onClick={onAddProduct} className="w-full sm:w-auto flex-shrink-0">
            <Plus className="mr-2 h-4 w-4" /> 
            <span className="hidden sm:inline">Add {activeTab === 'hub' ? 'Hub Product' : 'Store Product'}</span>
            <span className="sm:hidden">Add Product</span>
          </Button>
        )}
      </div>

      {/* Stats Cards - Only show if there are multiple tabs */}
      {tabs.length > 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <Card key={tab.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{tab.label}</p>
                    <p className="text-xl sm:text-2xl font-bold">{tab.count}</p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${tab.id === 'hub' ? 'bg-blue-100' : 'bg-green-100'}`}>
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${tab.id === 'hub' ? 'text-blue-600' : 'text-green-600'}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Tabs - Only show if there are multiple tabs */}
      {tabs.length > 1 && (
        <div className="flex gap-1 sm:gap-2 border-b overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 border-b-2 transition-colors whitespace-nowrap text-xs sm:text-sm ${
                activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              <Badge variant="bg-gray-100 text-gray-600" className="text-xs">{tab.count}</Badge>
            </button>
          ))}
        </div>
      )}

      {/* Filters */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search by name, SKU..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="pl-10 text-sm" 
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select 
              value={categoryFilter} 
              onChange={e => setCategoryFilter(e.target.value)} 
              options={categories} 
            />
            {activeTab === 'store' && (
              <Select 
                value={selectedStore} 
                onChange={e => setSelectedStore(e.target.value)} 
                options={[
                  { value: '', label: 'All Stores' },
                  ...mockStores.map(store => ({ value: store.id, label: store.name }))
                ]} 
              />
            )}
            <Button variant="secondary">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Products List */}
      {getCurrentProducts().length > 0 ? (
        <div className="space-y-3">
          {getCurrentProducts().map(product => (
            <ProductRow key={product.id} product={product} />
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
            No {activeTab === 'hub' ? 'hub' : 'store'} products found
          </h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          {showAddButton && onAddProduct && (
            <Button onClick={onAddProduct}>
              <Plus className="mr-2 h-4 w-4" /> Add {activeTab === 'hub' ? 'Hub Product' : 'Store Product'}
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
