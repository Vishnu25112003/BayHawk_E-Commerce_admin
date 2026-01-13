import { useState } from 'react';
import { 
  DataTable, 
  SearchFilter, 
  StatusBadge, 
  ActionButtons,
  BulkActions,
  BulkActionCheckbox,
  BulkActionModal,
  useBulkSelection,
  commonBulkActions,
  bulkActionConfigs
} from '../../common';
import { Badge } from '../../ui';
import { formatCurrency } from '../../../utils/helpers';
import { Star, Package, Eye, EyeOff, DollarSign } from 'lucide-react';
import type { Product } from '../../../types';

interface ProductsListProps {
  products: Product[];
  loading?: boolean;
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onRefresh?: () => void;
  onBulkAction?: (actionId: string, selectedIds: string[], data?: any) => Promise<void>;
}

export function ProductsList({ 
  products, 
  loading = false, 
  onView, 
  onEdit, 
  onDelete,
  onRefresh,
  onBulkAction
}: ProductsListProps) {
  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [bulkActionModal, setBulkActionModal] = useState<{
    isOpen: boolean;
    actionId: string;
    actionType: string;
  }>({ isOpen: false, actionId: '', actionType: '' });

  const {
    selectedItems,
    selectAll,
    deselectAll,
    toggleItem,
    isSelected
  } = useBulkSelection(products);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nameEn.toLowerCase().includes(searchValue.toLowerCase()) ||
                         product.nameTa.includes(searchValue) ||
                         product.sku.toLowerCase().includes(searchValue.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesStatus = !statusFilter || (statusFilter === 'active' ? product.isActive : !product.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Enhanced bulk actions for products
  const productBulkActions = [
    ...commonBulkActions.products,
    {
      id: 'update-category',
      label: 'Update Category',
      icon: Package,
      variant: 'default' as const
    },
    {
      id: 'toggle-visibility',
      label: 'Toggle Visibility',
      icon: Eye,
      variant: 'default' as const
    },
    {
      id: 'update-pricing',
      label: 'Update Pricing',
      icon: DollarSign,
      variant: 'default' as const
    }
  ];

  const handleBulkAction = async (actionId: string, selectedIds: string[]) => {
    if (actionId === 'export') {
      handleExportProducts(selectedIds);
      return;
    }

    if (actionId === 'delete') {
      if (onBulkAction) {
        await onBulkAction(actionId, selectedIds);
        deselectAll();
      }
      return;
    }

    setBulkActionModal({
      isOpen: true,
      actionId,
      actionType: actionId
    });
  };

  const handleBulkActionConfirm = async (data: any) => {
    if (onBulkAction) {
      await onBulkAction(bulkActionModal.actionId, selectedItems, data);
      deselectAll();
    }
    setBulkActionModal({ isOpen: false, actionId: '', actionType: '' });
  };

  const handleExportProducts = (productIds: string[]) => {
    const selectedProducts = products.filter(product => productIds.includes(product.id));
    const csvContent = generateProductsCSV(selectedProducts);
    downloadCSV(csvContent, `products-${new Date().toISOString().split('T')[0]}.csv`);
    deselectAll();
  };

  const generateProductsCSV = (products: Product[]) => {
    const headers = ['Product ID', 'Name (EN)', 'Name (TA)', 'SKU', 'Category', 'Status', 'Best Seller', 'Variants Count'];
    const rows = products.map(product => [
      product.id,
      product.nameEn,
      product.nameTa,
      product.sku,
      product.category,
      product.isActive ? 'Active' : 'Inactive',
      product.isBestSeller ? 'Yes' : 'No',
      product.variants.length.toString()
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const columns = [
    {
      key: 'select',
      label: '',
      width: '50px',
      render: (_: any, product: Product) => (
        <BulkActionCheckbox
          id={product.id}
          checked={isSelected(product.id)}
          onChange={toggleItem}
        />
      )
    },
    {
      key: 'nameEn',
      label: 'Product',
      render: (value: string, product: Product) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
            <Package className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{product.nameTa}</p>
            <p className="text-xs text-gray-400">{product.sku}</p>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (value: string) => (
        <span className="capitalize px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          {value}
        </span>
      )
    },
    {
      key: 'variants',
      label: 'Variants',
      render: (variants: any[]) => (
        <div>
          <span className="font-medium text-gray-900">{variants.length} variants</span>
          <div className="text-sm text-gray-500">
            {variants.length > 0 && (
              <span>From {formatCurrency(Math.min(...variants.map(v => v.price)))}</span>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value: boolean) => (
        <StatusBadge status={value ? 'active' : 'inactive'} />
      )
    },
    {
      key: 'badges',
      label: 'Badges',
      render: (_: any, product: Product) => (
        <div className="flex gap-1">
          {product.isBestSeller && (
            <Badge variant="warning" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              Best Seller
            </Badge>
          )}
          {product.isRare && (
            <Badge variant="danger">Rare</Badge>
          )}
          {!product.isActive && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <EyeOff className="h-3 w-3" />
              Hidden
            </Badge>
          )}
        </div>
      )
    }
  ];

  const filters = [
    {
      key: 'category',
      label: 'Category',
      value: categoryFilter,
      onChange: setCategoryFilter,
      options: [
        { value: 'fish', label: 'Fish' },
        { value: 'prawns', label: 'Prawns' },
        { value: 'chicken', label: 'Chicken' },
        { value: 'mutton', label: 'Mutton' },
        { value: 'eggs', label: 'Eggs' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ];

  // Get bulk action config for modal
  const getBulkActionConfig = () => {
    const config = bulkActionConfigs[bulkActionModal.actionId as keyof typeof bulkActionConfigs];
    if (config) return config;

    // Custom configurations for product-specific actions
    switch (bulkActionModal.actionId) {
      case 'update-category':
        return {
          title: 'Update Category',
          fields: [
            {
              id: 'category',
              label: 'New Category',
              type: 'select' as const,
              required: true,
              options: [
                { value: 'fish', label: 'Fish' },
                { value: 'prawns', label: 'Prawns' },
                { value: 'chicken', label: 'Chicken' },
                { value: 'mutton', label: 'Mutton' },
                { value: 'eggs', label: 'Eggs' }
              ]
            }
          ]
        };
      case 'toggle-visibility':
        return {
          title: 'Toggle Visibility',
          fields: [
            {
              id: 'visibility',
              label: 'Visibility',
              type: 'select' as const,
              required: true,
              options: [
                { value: 'show', label: 'Show Products' },
                { value: 'hide', label: 'Hide Products' }
              ]
            },
            {
              id: 'reason',
              label: 'Reason',
              type: 'textarea' as const,
              placeholder: 'Enter reason for visibility change...'
            }
          ]
        };
      case 'update-pricing':
        return {
          title: 'Update Pricing',
          fields: [
            {
              id: 'priceAction',
              label: 'Price Action',
              type: 'select' as const,
              required: true,
              options: [
                { value: 'increase', label: 'Increase Price' },
                { value: 'decrease', label: 'Decrease Price' },
                { value: 'set', label: 'Set Fixed Price' }
              ]
            },
            {
              id: 'value',
              label: 'Value',
              type: 'number' as const,
              required: true,
              placeholder: 'Enter amount or percentage'
            },
            {
              id: 'type',
              label: 'Type',
              type: 'select' as const,
              required: true,
              options: [
                { value: 'percentage', label: 'Percentage (%)' },
                { value: 'fixed', label: 'Fixed Amount (₹)' }
              ]
            }
          ]
        };
      default:
        return { title: 'Bulk Action', fields: [] };
    }
  };

  return (
    <div className="space-y-6">
      {/* Bulk Actions Bar */}
      <BulkActions
        selectedItems={selectedItems}
        totalItems={filteredProducts.length}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        onToggleItem={toggleItem}
        actions={productBulkActions}
        onAction={handleBulkAction}
        itemName="products"
      />

      <div className="flex justify-between items-start">
        <SearchFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filters={filters}
          onClearFilters={() => {
            setSearchValue('');
            setCategoryFilter('');
            setStatusFilter('');
          }}
          placeholder="Search products by name, SKU, or category..."
          className="flex-1 mr-4"
        />
        
        <ActionButtons
          onRefresh={onRefresh}
          refreshLabel="Refresh Products"
        />
      </div>

      <DataTable
        data={filteredProducts}
        columns={columns}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        loading={loading}
        emptyMessage="No products found"
      />

      {/* Bulk Action Modal */}
      <BulkActionModal
        isOpen={bulkActionModal.isOpen}
        onClose={() => setBulkActionModal({ isOpen: false, actionId: '', actionType: '' })}
        title={getBulkActionConfig().title}
        actionType={bulkActionModal.actionType}
        selectedCount={selectedItems.length}
        itemName="products"
        onConfirm={handleBulkActionConfirm}
        fields={getBulkActionConfig().fields}
      />
    </div>
  );
}