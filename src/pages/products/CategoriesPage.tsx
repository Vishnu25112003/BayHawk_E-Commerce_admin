import { useState } from 'react';
import { Button, Modal, Badge, Card } from '../../components/ui';
import { CategoryForm, CategoryList, type CategoryFormData, type Category } from '../../components/categories';
import { Plus, Package, Eye, History, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Mock categories data with enhanced structure
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Sea Fish',
    nameTa: 'கடல் மீன்',
    description: 'Fresh sea fish varieties including tuna, seer, pomfret, and more',
    icon: 'fish',
    color: 'blue',
    image: undefined,
    isActive: true,
    order: 0,
    applicableFor: 'both',
    productCount: 25,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Freshwater Fish',
    nameTa: 'நன்னீர் மீன்',
    description: 'Fresh river and lake fish varieties',
    icon: 'fish',
    color: 'teal',
    image: undefined,
    isActive: true,
    order: 1,
    applicableFor: 'both',
    productCount: 18,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'Shell Fish',
    nameTa: 'ஓடு மீன்',
    description: 'Prawns, crabs, lobsters, and other shellfish',
    icon: 'shrimp',
    color: 'orange',
    image: undefined,
    isActive: true,
    order: 2,
    applicableFor: 'hub',
    productCount: 15,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-12'
  },
  {
    id: '4',
    name: 'Dry Fish',
    nameTa: 'காய்ந்த மீன்',
    description: 'Dried and preserved fish varieties',
    icon: 'fish',
    color: 'yellow',
    image: undefined,
    isActive: true,
    order: 3,
    applicableFor: 'both',
    productCount: 8,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-08'
  },
  {
    id: '5',
    name: 'Chicken',
    nameTa: 'கோழி',
    description: 'Fresh chicken products including whole, cuts, and processed items',
    icon: 'chicken',
    color: 'red',
    image: undefined,
    isActive: true,
    order: 4,
    applicableFor: 'store',
    productCount: 22,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-14'
  },
  {
    id: '6',
    name: 'Mutton',
    nameTa: 'ஆட்டு இறைச்சி',
    description: 'Fresh mutton and goat meat products',
    icon: 'meat',
    color: 'red',
    image: undefined,
    isActive: true,
    order: 5,
    applicableFor: 'store',
    productCount: 16,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-11'
  },
  {
    id: '7',
    name: 'Eggs',
    nameTa: 'முட்டை',
    description: 'Fresh eggs from various sources',
    icon: 'egg',
    color: 'yellow',
    image: undefined,
    isActive: true,
    order: 6,
    applicableFor: 'store',
    productCount: 12,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-13'
  },
  {
    id: '8',
    name: 'Spices & Seasonings',
    nameTa: 'மசாலா பொருட்கள்',
    description: 'Cooking spices, herbs, and seasonings',
    icon: 'spices',
    color: 'green',
    image: undefined,
    isActive: false,
    order: 7,
    applicableFor: 'store',
    productCount: 5,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-09'
  }
];

export function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Filter categories based on user's access (but show all for management)
  const getFilteredCategories = () => {
    // For category management, show all categories regardless of user type
    // The applicableFor field will control where they can be used
    return categories.sort((a, b) => a.order - b.order);
  };

  const filteredCategories = getFilteredCategories();

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setShowAddModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowViewModal(true);
  };

  const handleDeleteCategory = (category: Category) => {
    if (category.productCount > 0) {
      alert(`Cannot delete category "${category.name}" because it has ${category.productCount} products. Please move or delete the products first.`);
      return;
    }
    
    if (confirm(`Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`)) {
      setCategories(prev => prev.filter(cat => cat.id !== category.id));
      console.log('Delete category:', category.id);
    }
  };

  const handleSaveCategory = (categoryData: CategoryFormData) => {
    if (selectedCategory) {
      // Update existing category
      setCategories(prev => prev.map(cat => 
        cat.id === selectedCategory.id 
          ? { 
              ...cat, 
              ...categoryData, 
              updatedAt: new Date().toISOString().slice(0, 10)
            }
          : cat
      ));
      console.log('Update category:', selectedCategory.id, categoryData);
    } else {
      // Create new category
      const newCategory: Category = {
        ...categoryData,
        id: Date.now().toString(),
        productCount: 0,
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
        order: categories.length
      };
      setCategories(prev => [...prev, newCategory]);
      console.log('Create category:', newCategory);
    }
    
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedCategory(null);
    alert(`Category ${selectedCategory ? 'updated' : 'created'} successfully! Changes will reflect across all Hub and Store interfaces.`);
  };

  const handleReorderCategories = (reorderedCategories: Category[]) => {
    setCategories(reorderedCategories);
    console.log('Reorder categories:', reorderedCategories.map(cat => ({ id: cat.id, order: cat.order })));
  };

  const handleViewHistory = (category: Category) => {
    setSelectedCategory(category);
    setShowHistoryModal(true);
  };

  // Bulk actions handler for categories
  const handleCategoryBulkAction = async (actionId: string, selectedIds: string[], data?: any) => {
    try {
      switch (actionId) {
        case 'show':
          setCategories(prev => prev.map(cat => 
            selectedIds.includes(cat.id) ? { ...cat, isActive: true, updatedAt: new Date().toISOString().slice(0, 10) } : cat
          ));
          console.log(`Showing ${selectedIds.length} categories:`, selectedIds);
          break;
        case 'hide':
          setCategories(prev => prev.map(cat => 
            selectedIds.includes(cat.id) ? { ...cat, isActive: false, updatedAt: new Date().toISOString().slice(0, 10) } : cat
          ));
          console.log(`Hiding ${selectedIds.length} categories:`, selectedIds);
          break;
        case 'delete':
          const categoriesToDelete = categories.filter(cat => selectedIds.includes(cat.id));
          const categoriesWithProducts = categoriesToDelete.filter(cat => cat.productCount > 0);
          
          if (categoriesWithProducts.length > 0) {
            alert(`Cannot delete ${categoriesWithProducts.length} categories because they have products. Please move or delete the products first.`);
            return;
          }
          
          setCategories(prev => prev.filter(cat => !selectedIds.includes(cat.id)));
          console.log(`Deleting ${selectedIds.length} categories:`, selectedIds);
          break;
        default:
          console.log(`Bulk action ${actionId} performed on ${selectedIds.length} categories`, data);
      }
    } catch (error) {
      console.error('Category bulk action failed:', error);
      alert('Bulk action failed. Please try again.');
    }
  };

  const getCategoryStats = () => {
    return {
      total: filteredCategories.length,
      visible: filteredCategories.filter(cat => cat.isActive).length,
      hidden: filteredCategories.filter(cat => !cat.isActive).length,
      hubOnly: filteredCategories.filter(cat => cat.applicableFor === 'hub').length,
      storeOnly: filteredCategories.filter(cat => cat.applicableFor === 'store').length,
      both: filteredCategories.filter(cat => cat.applicableFor === 'both').length,
      totalProducts: filteredCategories.reduce((sum, cat) => sum + cat.productCount, 0)
    };
  };

  const stats = getCategoryStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                  Category Management
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                  Manage universal categories for both Hub and Store. Changes reflect across all interfaces.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button 
                  variant="secondary" 
                  onClick={() => setShowHistoryModal(true)}
                  className="w-full sm:w-auto flex-shrink-0 px-4 py-2"
                >
                  <History className="mr-2 h-4 w-4" /> 
                  <span className="hidden sm:inline">History</span>
                  <span className="sm:hidden">History</span>
                </Button>
                <Button 
                  onClick={handleAddCategory} 
                  className="w-full sm:w-auto flex-shrink-0 px-4 py-2 sm:px-6 sm:py-3"
                >
                  <Plus className="mr-2 h-4 w-4" /> 
                  <span className="hidden sm:inline">Add Category</span>
                  <span className="sm:hidden">Add Category</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <Card className="p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate font-medium">Total Categories</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-1">
                    {stats.total}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{stats.totalProducts} products</p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate font-medium">Visible</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 mt-1">
                    {stats.visible}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Active categories</p>
                </div>
                <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0">
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate font-medium">Hub & Store</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mt-1">
                    {stats.both}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Universal categories</p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate font-medium">Specific</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600 mt-1">
                    {stats.hubOnly + stats.storeOnly}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Hub/Store only</p>
                </div>
                <div className="p-2 sm:p-3 bg-purple-100 rounded-lg flex-shrink-0">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Categories List with Drag & Drop */}
          <Card className="overflow-hidden">
            <CategoryList
              categories={filteredCategories}
              onView={handleViewCategory}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
              onReorder={handleReorderCategories}
              onBulkAction={handleCategoryBulkAction}
              title="Categories"
              allowReordering={user?.loginType === 'super_admin'}
            />
          </Card>

          {/* Add Category Modal */}
          <Modal
            isOpen={showAddModal}
            onClose={() => {
              setShowAddModal(false);
              setSelectedCategory(null);
            }}
            title="Add New Category"
            size="xl"
          >
            <CategoryForm
              onSave={handleSaveCategory}
              onCancel={() => {
                setShowAddModal(false);
                setSelectedCategory(null);
              }}
            />
          </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCategory(null);
        }}
        title="Edit Category"
        size="xl"
      >
        {selectedCategory && (
          <CategoryForm
            initialData={selectedCategory}
            onSave={handleSaveCategory}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedCategory(null);
            }}
            isEdit={true}
          />
        )}
      </Modal>

      {/* View Category Details Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedCategory(null);
        }}
        title="Category Details"
        size="lg"
      >
        {selectedCategory && (
          <div className="space-y-6">
            {/* Header with Image/Icon */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center ${
                selectedCategory.color === 'blue' ? 'bg-blue-100 border-blue-200' :
                selectedCategory.color === 'green' ? 'bg-green-100 border-green-200' :
                selectedCategory.color === 'red' ? 'bg-red-100 border-red-200' :
                selectedCategory.color === 'yellow' ? 'bg-yellow-100 border-yellow-200' :
                selectedCategory.color === 'purple' ? 'bg-purple-100 border-purple-200' :
                selectedCategory.color === 'orange' ? 'bg-orange-100 border-orange-200' :
                'bg-gray-100 border-gray-200'
              }`}>
                {selectedCategory.image ? (
                  <img
                    src={typeof selectedCategory.image === 'string' ? selectedCategory.image : URL.createObjectURL(selectedCategory.image)}
                    alt={selectedCategory.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-2xl">
                    {selectedCategory.icon === 'fish' ? '🐟' :
                     selectedCategory.icon === 'shrimp' ? '🦐' :
                     selectedCategory.icon === 'crab' ? '🦀' :
                     selectedCategory.icon === 'squid' ? '🦑' :
                     selectedCategory.icon === 'chicken' ? '🐔' :
                     selectedCategory.icon === 'meat' ? '🥩' :
                     selectedCategory.icon === 'egg' ? '🥚' :
                     selectedCategory.icon === 'spices' ? '🌶️' :
                     '📦'}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{selectedCategory.name}</h3>
                <p className="text-gray-600">{selectedCategory.nameTa}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={selectedCategory.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {selectedCategory.isActive ? 'Visible' : 'Hidden'}
                  </Badge>
                  <Badge variant={
                    selectedCategory.applicableFor === 'both' ? 'bg-blue-100 text-blue-800' :
                    selectedCategory.applicableFor === 'hub' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }>
                    {selectedCategory.applicableFor === 'both' ? 'Hub & Store' : 
                     selectedCategory.applicableFor === 'hub' ? 'Hub Only' : 'Store Only'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-900">{selectedCategory.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Products</label>
                  <p className="text-gray-900">{selectedCategory.productCount} products using this category</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                  <p className="text-gray-900">{new Date(selectedCategory.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                  <p className="text-gray-900">{new Date(selectedCategory.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                variant="secondary"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedCategory(null);
                }}
                className="flex-1"
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  setShowViewModal(false);
                  setShowEditModal(true);
                }}
                className="flex-1"
              >
                Edit Category
              </Button>
              <Button 
                variant="secondary"
                onClick={() => handleViewHistory(selectedCategory)}
                className="flex-1"
              >
                <History className="mr-2 h-4 w-4" />
                View History
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* History Modal */}
      <Modal
        isOpen={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
          setSelectedCategory(null);
        }}
        title="Category Change History"
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600" />
            <div>
              <h4 className="font-medium text-blue-900">Change History</h4>
              <p className="text-sm text-blue-700">
                Track all changes made to categories and their impact on products
              </p>
            </div>
          </div>
          
          {/* Mock history data */}
          <div className="space-y-3">
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Category Reordered</p>
                  <p className="text-sm text-gray-600">Category order changed from position 3 to 1</p>
                  <p className="text-xs text-gray-500">by Admin User</p>
                </div>
                <span className="text-xs text-gray-500">2026-01-17 02:30 PM</span>
              </div>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Category Updated</p>
                  <p className="text-sm text-gray-600">Description and image updated</p>
                  <p className="text-xs text-gray-500">by {selectedCategory?.name} Manager</p>
                </div>
                <span className="text-xs text-gray-500">2026-01-15 10:15 AM</span>
              </div>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Category Created</p>
                  <p className="text-sm text-gray-600">Initial category setup with all details</p>
                  <p className="text-xs text-gray-500">by System Admin</p>
                </div>
                <span className="text-xs text-gray-500">2026-01-01 09:00 AM</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t">
            <Button 
              variant="secondary"
              onClick={() => {
                setShowHistoryModal(false);
                setSelectedCategory(null);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
        </div>
      </div>
    </div>
  );
}
