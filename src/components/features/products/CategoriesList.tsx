import { useState } from 'react';
import { 
  SearchFilter, 
  BulkActions,
  BulkActionModal,
  useBulkSelection
} from '../../common';
import { Card, Badge } from '../../ui';
import { 
  Eye, Edit, Trash2, Tag, CheckSquare, Square, Minus,
  ToggleLeft, ToggleRight, Fish, Beef, Egg, Leaf
} from 'lucide-react';

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

interface CategoriesListProps {
  categories: Category[];
  onView?: (category: Category) => void;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  onBulkAction?: (actionId: string, selectedIds: string[], data?: any) => Promise<void>;
  title?: string;
}

const categoryBulkActions = [
  {
    id: 'activate',
    label: 'Activate Categories',
    icon: ToggleRight,
    variant: 'success' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to activate the selected categories?'
  },
  {
    id: 'deactivate',
    label: 'Deactivate Categories',
    icon: ToggleLeft,
    variant: 'warning' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to deactivate the selected categories?'
  },
  {
    id: 'delete',
    label: 'Delete Categories',
    icon: Trash2,
    variant: 'danger' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to delete the selected categories? This action cannot be undone.'
  }
];

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'fish': return Fish;
    case 'beef': return Beef;
    case 'egg': return Egg;
    case 'leaf': return Leaf;
    default: return Tag;
  }
};

const getColorClass = (color: string) => {
  const colorMap: { [key: string]: string } = {
    blue: 'bg-blue-100 text-blue-800',
    cyan: 'bg-cyan-100 text-cyan-800',
    orange: 'bg-orange-100 text-orange-800',
    purple: 'bg-purple-100 text-purple-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    amber: 'bg-amber-100 text-amber-800',
    green: 'bg-green-100 text-green-800',
  };
  return colorMap[color] || 'bg-gray-100 text-gray-800';
};

export function CategoriesList({ 
  categories, 
  onView, 
  onEdit, 
  onDelete,
  onBulkAction,
  title = 'Categories'
}: CategoriesListProps) {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [bulkActionModal, setBulkActionModal] = useState<{
    isOpen: boolean;
    actionId: string;
    actionType: string;
  }>({ isOpen: false, actionId: '', actionType: '' });

  // Filter categories
  const filteredCategories = categories.filter(category => {
    const matchesSearch = !searchValue || 
      category.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      category.nameTa.includes(searchValue) ||
      category.description.toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && category.isActive) ||
      (statusFilter === 'inactive' && !category.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const {
    selectedItems,
    selectAll,
    deselectAll,
    toggleItem,
    isSelected
  } = useBulkSelection(filteredCategories);

  const isAllSelected = selectedItems.length === filteredCategories.length && filteredCategories.length > 0;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < filteredCategories.length;

  const handleBulkActionClick = (actionId: string) => {
    const action = categoryBulkActions.find(a => a.id === actionId);
    if (action?.requiresConfirmation) {
      setBulkActionModal({
        isOpen: true,
        actionId,
        actionType: action.variant || 'default'
      });
    } else {
      onBulkAction?.(actionId, selectedItems);
    }
  };

  const handleConfirmBulkAction = async (data?: any) => {
    if (onBulkAction) {
      await onBulkAction(bulkActionModal.actionId, selectedItems, data);
      deselectAll();
    }
    setBulkActionModal({ isOpen: false, actionId: '', actionType: '' });
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder="Search categories..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: '', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]
          }
        ]}
      />

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <BulkActions
          selectedItems={selectedItems}
          totalItems={filteredCategories.length}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          actions={categoryBulkActions}
          onAction={handleBulkActionClick}
          itemName="categories"
        />
      )}

      {/* Select All Header */}
      {filteredCategories.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={isAllSelected ? deselectAll : selectAll}
              className={`p-1 rounded transition-colors ${
                isAllSelected ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {isAllSelected ? <CheckSquare className="h-4 w-4" /> : 
               isIndeterminate ? <Minus className="h-4 w-4" /> : 
               <Square className="h-4 w-4" />}
            </button>
            <span className="text-sm font-medium text-gray-700">
              {selectedItems.length > 0 
                ? `${selectedItems.length} of ${filteredCategories.length} ${title.toLowerCase()} selected`
                : `Select all ${filteredCategories.length} ${title.toLowerCase()}`
              }
            </span>
          </div>
        </Card>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map(category => {
          const IconComponent = getIconComponent(category.icon);
          
          return (
            <Card key={category.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                {/* Selection Checkbox */}
                <button
                  onClick={() => toggleItem(category.id)}
                  className={`p-1 rounded transition-colors flex-shrink-0 ${
                    isSelected(category.id) ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {isSelected(category.id) ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                </button>

                {/* Category Icon */}
                <div className={`p-3 rounded-lg flex-shrink-0 ${getColorClass(category.color)}`}>
                  <IconComponent className="h-6 w-6" />
                </div>

                {/* Category Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{category.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{category.nameTa}</p>
                    </div>
                    <Badge variant={category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} className="ml-2 flex-shrink-0">
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{category.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {category.productCount} products
                    </span>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-1">
                      <button 
                        onClick={() => onView?.(category)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" 
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onEdit?.(category)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" 
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onDelete?.(category)}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-600" 
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      {filteredCategories.length === 0 && (
        <Card className="p-12 text-center">
          <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </Card>
      )}

      {/* Bulk Action Modal */}
      <BulkActionModal
        isOpen={bulkActionModal.isOpen}
        onClose={() => setBulkActionModal({ isOpen: false, actionId: '', actionType: '' })}
        onConfirm={handleConfirmBulkAction}
        title={`Bulk Action: ${bulkActionModal.actionId}`}
        actionType={bulkActionModal.actionType}
        selectedCount={selectedItems.length}
        itemName="categories"
      />
    </div>
  );
}
