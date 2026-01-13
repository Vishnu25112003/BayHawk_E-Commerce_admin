import { useState } from 'react';
import { Card, Button, Input, Modal, Badge } from '../components/ui';
import { Plus, Search, Eye, Edit, Trash2, Building2, Store, Fish, Beef, Egg, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { filterDataByModule } from '../utils/rbac';

interface Category {
  id: string;
  name: string;
  nameTa: string;
  description: string;
  icon: string;
  color: string;
  productCount: number;
  sourceType: 'hub' | 'store' | 'both';
  moduleType: 'hub' | 'store';
  hubId?: string;
  storeId?: string;
  isActive: boolean;
  createdAt: string;
}

const mockCategories: Category[] = [
  // Hub Categories (Fish Only)
  { id: '1', name: 'Fish', nameTa: 'மீன்', description: 'Fresh fish varieties', icon: 'fish', color: 'blue', productCount: 15, sourceType: 'hub', moduleType: 'hub', hubId: 'hub_1', isActive: true, createdAt: '2024-01-01' },
  { id: '2', name: 'Prawns', nameTa: 'இறால்', description: 'Fresh prawns and shrimps', icon: 'fish', color: 'cyan', productCount: 8, sourceType: 'hub', moduleType: 'hub', hubId: 'hub_1', isActive: true, createdAt: '2024-01-01' },
  { id: '3', name: 'Crab', nameTa: 'நண்டு', description: 'Live and fresh crabs', icon: 'fish', color: 'orange', productCount: 5, sourceType: 'hub', moduleType: 'hub', hubId: 'hub_1', isActive: true, createdAt: '2024-01-01' },
  { id: '4', name: 'Squid', nameTa: 'கணவாய்', description: 'Fresh squid varieties', icon: 'fish', color: 'purple', productCount: 3, sourceType: 'hub', moduleType: 'hub', hubId: 'hub_1', isActive: true, createdAt: '2024-01-01' },
  { id: '5', name: 'Lobster', nameTa: 'நண்டு பெரிய', description: 'Premium lobster varieties', icon: 'fish', color: 'red', productCount: 2, sourceType: 'hub', moduleType: 'hub', hubId: 'hub_1', isActive: true, createdAt: '2024-01-01' },
  
  // Store Categories (Fish + Meat)
  { id: '6', name: 'Chicken', nameTa: 'கோழி', description: 'Fresh chicken products', icon: 'beef', color: 'yellow', productCount: 12, sourceType: 'store', moduleType: 'store', storeId: 'store_1', isActive: true, createdAt: '2024-01-01' },
  { id: '7', name: 'Mutton', nameTa: 'ஆட்டு இறைச்சி', description: 'Fresh mutton and goat meat', icon: 'beef', color: 'red', productCount: 8, sourceType: 'store', moduleType: 'store', storeId: 'store_1', isActive: true, createdAt: '2024-01-01' },
  { id: '8', name: 'Egg', nameTa: 'முட்டை', description: 'Fresh eggs varieties', icon: 'egg', color: 'amber', productCount: 6, sourceType: 'store', moduleType: 'store', storeId: 'store_1', isActive: true, createdAt: '2024-01-01' },
  { id: '9', name: 'Spices', nameTa: 'மசாலா', description: 'Cooking spices and seasonings', icon: 'leaf', color: 'green', productCount: 10, sourceType: 'store', moduleType: 'store', storeId: 'store_1', isActive: true, createdAt: '2024-01-01' },
];

export function CategoriesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'hub' | 'store'>('hub');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    nameTa: '',
    description: '',
    icon: 'fish',
    color: 'blue'
  });

  // Filter categories based on user's module access
  const filteredCategoriesData = filterDataByModule(mockCategories, user);

  // Separate categories by source
  const hubCategories = filteredCategoriesData.filter(cat => cat.sourceType === 'hub');
  const storeCategories = filteredCategoriesData.filter(cat => cat.sourceType === 'store');

  const filterCategories = (categoryList: Category[]) => {
    return categoryList.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(search.toLowerCase()) ||
        category.nameTa.includes(search) || category.description.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  };

  const filteredHubCategories = filterCategories(hubCategories);
  const filteredStoreCategories = filterCategories(storeCategories);

  // Determine which tabs to show based on user type
  const getAvailableTabs = () => {
    const allTabs = [
      { id: 'hub', label: 'Hub Categories', icon: Building2, count: filteredHubCategories.length },
      { id: 'store', label: 'Store Categories', icon: Store, count: filteredStoreCategories.length },
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

  const getCurrentCategories = () => {
    return activeTab === 'hub' ? filteredHubCategories : filteredStoreCategories;
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'fish': return Fish;
      case 'beef': return Beef;
      case 'egg': return Egg;
      case 'leaf': return Leaf;
      default: return Fish;
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'cyan': return 'bg-cyan-100 text-cyan-800';
      case 'orange': return 'bg-orange-100 text-orange-800';
      case 'purple': return 'bg-purple-100 text-purple-800';
      case 'red': return 'bg-red-100 text-red-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'amber': return 'bg-amber-100 text-amber-800';
      case 'green': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding category:', newCategory);
    setShowAddModal(false);
    setEditingCategory(null);
    setNewCategory({ name: '', nameTa: '', description: '', icon: 'fish', color: 'blue' });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      nameTa: category.nameTa,
      description: category.description,
      icon: category.icon,
      color: category.color
    });
    setShowAddModal(true);
  };

  const handleViewCategory = (category: Category) => {
    setViewingCategory(category);
    setShowViewModal(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      console.log('Delete category:', categoryId);
      // Implement delete logic here
    }
  };

  const CategoryCard = ({ category }: { category: Category }) => {
    const IconComponent = getIcon(category.icon);
    
    return (
      <Card key={category.id} className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className={`p-4 rounded-lg ${getColorClass(category.color)}`}>
              <IconComponent className="h-8 w-8" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">{category.name}</h3>
                <Badge variant={category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <p className="text-gray-600 mb-2">{category.nameTa}</p>
              <p className="text-sm text-gray-500 mb-3">{category.description}</p>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-medium">{category.productCount}</span>
                  <span className="text-gray-500">products</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Created:</span>
                  <span className="font-medium">{new Date(category.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button 
              onClick={() => handleViewCategory(category)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handleEditCategory(category)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handleDeleteCategory(category.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600" 
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>
    );
  };

  const hubStats = {
    total: filteredHubCategories.length,
    active: filteredHubCategories.filter(cat => cat.isActive).length,
    products: filteredHubCategories.reduce((sum, cat) => sum + cat.productCount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Category Management</h1>
          <p className="text-gray-600">Manage product categories for hub and store</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> 
          Add {activeTab === 'hub' ? 'Hub' : 'Store'} Category
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hub Categories</p>
              <p className="text-2xl font-bold">{hubStats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="text-center">
              <p className="text-lg font-semibold text-green-600">{hubStats.active}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-blue-600">{hubStats.products}</p>
              <p className="text-xs text-gray-500">Products</p>
            </div>
          </div>
        </Card>
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

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Search categories..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="pl-10" 
          />
        </div>
      </Card>

      {/* Categories List */}
      {getCurrentCategories().length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {getCurrentCategories().map(category => (
            <CategoryCard key={category.id} category={category} />
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
            No {activeTab === 'hub' ? 'hub' : 'store'} categories found
          </h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or add a new category</p>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </Card>
      )}

      {/* Add/Edit Category Modal */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => {
          setShowAddModal(false);
          setEditingCategory(null);
          setNewCategory({ name: '', nameTa: '', description: '', icon: 'fish', color: 'blue' });
        }} 
        title={editingCategory ? 'Edit Category' : `Add ${activeTab === 'hub' ? 'Hub' : 'Store'} Category`}
      >
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Category Name (English)" 
              placeholder="e.g., Fish" 
              value={newCategory.name}
              onChange={e => setNewCategory({...newCategory, name: e.target.value})}
              required 
            />
            <Input 
              label="Category Name (Tamil)" 
              placeholder="e.g., மீன்" 
              value={newCategory.nameTa}
              onChange={e => setNewCategory({...newCategory, nameTa: e.target.value})}
              required 
            />
          </div>
          
          <Input 
            label="Description" 
            placeholder="Brief description of the category" 
            value={newCategory.description}
            onChange={e => setNewCategory({...newCategory, description: e.target.value})}
            required 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 'fish', icon: Fish, label: 'Fish' },
                  { value: 'beef', icon: Beef, label: 'Meat' },
                  { value: 'egg', icon: Egg, label: 'Egg' },
                  { value: 'leaf', icon: Leaf, label: 'Spices' }
                ].map(option => {
                  const IconComp = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setNewCategory({...newCategory, icon: option.value})}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        newCategory.icon === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <IconComp className="h-6 w-6 mx-auto" />
                      <p className="text-xs mt-1">{option.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 'blue', class: 'bg-blue-500' },
                  { value: 'green', class: 'bg-green-500' },
                  { value: 'red', class: 'bg-red-500' },
                  { value: 'yellow', class: 'bg-yellow-500' },
                  { value: 'purple', class: 'bg-purple-500' },
                  { value: 'orange', class: 'bg-orange-500' },
                  { value: 'cyan', class: 'bg-cyan-500' },
                  { value: 'amber', class: 'bg-amber-500' }
                ].map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setNewCategory({...newCategory, color: color.value})}
                    className={`w-8 h-8 rounded-full ${color.class} ${
                      newCategory.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => {
                setShowAddModal(false);
                setEditingCategory(null);
              }} 
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingCategory ? 'Update Category' : 'Add Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Category Modal */}
      <Modal 
        isOpen={showViewModal} 
        onClose={() => {
          setShowViewModal(false);
          setViewingCategory(null);
        }} 
        title="Category Details"
        size="md"
      >
        {viewingCategory && (
          <div className="space-y-6">
            {/* Category Header */}
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-lg ${getColorClass(viewingCategory.color)}`}>
                {(() => {
                  const IconComponent = getIcon(viewingCategory.icon);
                  return <IconComponent className="h-8 w-8" />;
                })()}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{viewingCategory.name}</h3>
                <p className="text-lg text-gray-600">{viewingCategory.nameTa}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={viewingCategory.isActive ? 'success' : 'secondary'}>
                    {viewingCategory.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge variant="info">
                    {viewingCategory.sourceType === 'hub' ? 'Hub Category' : 'Store Category'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Category Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Category Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category ID:</span>
                    <span className="font-mono">{viewingCategory.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Source Type:</span>
                    <span className="capitalize">{viewingCategory.sourceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Icon:</span>
                    <span className="capitalize">{viewingCategory.icon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color:</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full bg-${viewingCategory.color}-500`}></div>
                      <span className="capitalize">{viewingCategory.color}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span>{new Date(viewingCategory.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Statistics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Products:</span>
                    <span className="font-semibold text-blue-600">{viewingCategory.productCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant={viewingCategory.isActive ? 'success' : 'secondary'}>
                      {viewingCategory.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Description</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {viewingCategory.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                variant="secondary"
                onClick={() => {
                  setShowViewModal(false);
                  setViewingCategory(null);
                }}
                className="flex-1"
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  setShowViewModal(false);
                  handleEditCategory(viewingCategory);
                }}
                className="flex-1"
              >
                Edit Category
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
