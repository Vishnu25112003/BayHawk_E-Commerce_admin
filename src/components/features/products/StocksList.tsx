import { useState } from 'react';
import { 
  SearchFilter, 
  BulkActions,
  BulkActionModal,
  useBulkSelection
} from '../../common';
import { Card, Badge } from '../../ui';
import { 
  Eye, Edit, Trash2, Package, CheckSquare, Square, Minus,
  AlertTriangle, TrendingUp, TrendingDown, RefreshCw
} from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';

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
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
}

interface StocksListProps {
  stocks: StockItem[];
  onView?: (stock: StockItem) => void;
  onEdit?: (stock: StockItem) => void;
  onDelete?: (stock: StockItem) => void;
  onBulkAction?: (actionId: string, selectedIds: string[], data?: any) => Promise<void>;
  title?: string;
}

const stockBulkActions = [
  {
    id: 'update_stock',
    label: 'Update Stock Levels',
    icon: RefreshCw,
    variant: 'default' as const,
    requiresConfirmation: false
  },
  {
    id: 'set_low_stock_alert',
    label: 'Set Low Stock Alert',
    icon: AlertTriangle,
    variant: 'warning' as const,
    requiresConfirmation: false
  },
  {
    id: 'mark_out_of_stock',
    label: 'Mark Out of Stock',
    icon: TrendingDown,
    variant: 'danger' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to mark the selected items as out of stock?'
  },
  {
    id: 'delete',
    label: 'Delete Stock Items',
    icon: Trash2,
    variant: 'danger' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to delete the selected stock items? This action cannot be undone.'
  }
];

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

export function StocksList({ 
  stocks, 
  onView, 
  onEdit, 
  onDelete,
  onBulkAction,
  title = 'Stock Items'
}: StocksListProps) {
  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [bulkActionModal, setBulkActionModal] = useState<{
    isOpen: boolean;
    actionId: string;
    actionType: string;
  }>({ isOpen: false, actionId: '', actionType: '' });

  // Filter stocks
  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = !searchValue || 
      stock.productName.toLowerCase().includes(searchValue.toLowerCase()) ||
      stock.productNameTa.includes(searchValue) ||
      stock.sku.toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesCategory = !categoryFilter || stock.category === categoryFilter;
    const matchesStatus = !statusFilter || stock.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const {
    selectedItems,
    selectAll,
    deselectAll,
    toggleItem,
    isSelected
  } = useBulkSelection(filteredStocks);

  const isAllSelected = selectedItems.length === filteredStocks.length && filteredStocks.length > 0;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < filteredStocks.length;

  const handleBulkActionClick = (actionId: string) => {
    const action = stockBulkActions.find(a => a.id === actionId);
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
        placeholder="Search stock items..."
        filters={[
          {
            key: 'category',
            label: 'Category',
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: [
              { value: '', label: 'All Categories' },
              { value: 'fish', label: 'Fish' },
              { value: 'prawns', label: 'Prawns' },
              { value: 'chicken', label: 'Chicken' },
              { value: 'mutton', label: 'Mutton' },
              { value: 'egg', label: 'Egg' }
            ]
          },
          {
            key: 'status',
            label: 'Stock Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: '', label: 'All Status' },
              { value: 'in_stock', label: 'In Stock' },
              { value: 'low_stock', label: 'Low Stock' },
              { value: 'out_of_stock', label: 'Out of Stock' }
            ]
          }
        ]}
      />

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <BulkActions
          selectedItems={selectedItems}
          totalItems={filteredStocks.length}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          actions={stockBulkActions}
          onAction={handleBulkActionClick}
          itemName="stock items"
        />
      )}

      {/* Select All Header */}
      {filteredStocks.length > 0 && (
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
                ? `${selectedItems.length} of ${filteredStocks.length} ${title.toLowerCase()} selected`
                : `Select all ${filteredStocks.length} ${title.toLowerCase()}`
              }
            </span>
          </div>
        </Card>
      )}

      {/* Stock Items List */}
      <div className="space-y-3">
        {filteredStocks.map(stock => {
          const StatusIcon = getStatusIcon(stock.status);
          
          return (
            <Card key={stock.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                {/* Selection Checkbox */}
                <button
                  onClick={() => toggleItem(stock.id)}
                  className={`p-1 rounded transition-colors flex-shrink-0 ${
                    isSelected(stock.id) ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {isSelected(stock.id) ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                </button>

                {/* Product Info - Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{stock.productName}</h3>
                        <Badge variant={getStatusColor(stock.status)} className="flex items-center gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {stock.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">{stock.productNameTa}</span>
                        </div>
                        <div>
                          <span className="font-mono text-xs">{stock.sku}</span>
                        </div>
                        <div>
                          <Badge variant="bg-gray-100 text-gray-800" className="text-xs">{stock.category}</Badge>
                        </div>
                        <div>
                          <span className="text-xs">{stock.variant}</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Updated: {stock.lastUpdated}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stock Info */}
                    <div className="flex flex-col items-end gap-2 ml-4 flex-shrink-0">
                      <div className="text-right">
                        <p className="font-semibold text-lg">{formatCurrency(stock.price)}</p>
                        <p className="text-xs text-gray-500">per {stock.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          stock.currentStock <= stock.minStockLevel 
                            ? stock.currentStock === 0 ? 'text-red-600' : 'text-yellow-600'
                            : 'text-green-600'
                        }`}>
                          {stock.currentStock} {stock.unit}
                        </p>
                        <p className="text-xs text-gray-500">Min: {stock.minStockLevel}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-shrink-0">
                  <button 
                    onClick={() => onView?.(stock)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onEdit?.(stock)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                    title="Edit Stock"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDelete?.(stock)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600" 
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      {filteredStocks.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stock items found</h3>
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
        itemName="stock items"
      />
    </div>
  );
}
