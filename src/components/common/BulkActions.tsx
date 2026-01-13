import { useState } from 'react';
import { Button } from '../ui';
import { 
  CheckSquare, 
  Square, 
  Minus, 
  Trash2, 
  Edit, 
  Download, 
  Archive, 
  Eye, 
  Send, 
  Copy,
  MoreHorizontal,
  X,
  AlertTriangle
} from 'lucide-react';

export interface BulkAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  disabled?: boolean;
}

interface BulkActionsProps {
  selectedItems: string[];
  totalItems: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onToggleItem: (id: string) => void;
  actions: BulkAction[];
  onAction: (actionId: string, selectedItems: string[]) => void;
  className?: string;
  itemName?: string; // e.g., "orders", "products", "customers"
}

export function BulkActions({
  selectedItems,
  totalItems,
  onSelectAll,
  onDeselectAll,
  onToggleItem,
  actions,
  onAction,
  className = '',
  itemName = 'items'
}: BulkActionsProps) {
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);
  const [showMoreActions, setShowMoreActions] = useState(false);

  const isAllSelected = selectedItems.length === totalItems && totalItems > 0;
  const isPartiallySelected = selectedItems.length > 0 && selectedItems.length < totalItems;
  const hasSelection = selectedItems.length > 0;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  const handleAction = (action: BulkAction) => {
    if (action.requiresConfirmation) {
      setShowConfirmation(action.id);
    } else {
      onAction(action.id, selectedItems);
    }
  };

  const confirmAction = (actionId: string) => {
    onAction(actionId, selectedItems);
    setShowConfirmation(null);
  };

  const getCheckboxIcon = () => {
    if (isAllSelected) return CheckSquare;
    if (isPartiallySelected) return Minus;
    return Square;
  };

  const CheckboxIcon = getCheckboxIcon();

  // Split actions into primary and secondary
  const primaryActions = actions.slice(0, 3);
  const secondaryActions = actions.slice(3);

  const getActionVariantClass = (variant?: string) => {
    switch (variant) {
      case 'danger':
        return 'text-red-600 hover:text-red-700 hover:bg-red-50';
      case 'warning':
        return 'text-orange-600 hover:text-orange-700 hover:bg-orange-50';
      case 'success':
        return 'text-green-600 hover:text-green-700 hover:bg-green-50';
      default:
        return 'text-gray-600 hover:text-gray-700 hover:bg-gray-50';
    }
  };

  return (
    <>
      <div className={`flex items-center justify-between p-4 bg-white border-b border-gray-200 ${className}`}>
        {/* Selection Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSelectAll}
            className={`p-2 rounded-lg transition-colors ${
              hasSelection ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-400'
            }`}
            title={isAllSelected ? 'Deselect all' : 'Select all'}
          >
            <CheckboxIcon className="h-5 w-5" />
          </button>

          {hasSelection ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {selectedItems.length} {itemName} selected
              </span>
              <button
                onClick={onDeselectAll}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear selection
              </button>
            </div>
          ) : (
            <span className="text-sm text-gray-500">
              Select {itemName} to perform bulk actions
            </span>
          )}
        </div>

        {/* Bulk Actions */}
        {hasSelection && (
          <div className="flex items-center gap-2">
            {/* Primary Actions */}
            {primaryActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAction(action)}
                  disabled={action.disabled}
                  className={getActionVariantClass(action.variant)}
                  title={action.label}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              );
            })}

            {/* More Actions Dropdown */}
            {secondaryActions.length > 0 && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMoreActions(!showMoreActions)}
                  className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>

                {showMoreActions && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="py-1">
                      {secondaryActions.map((action) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={action.id}
                            onClick={() => {
                              handleAction(action);
                              setShowMoreActions(false);
                            }}
                            disabled={action.disabled}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                              action.disabled
                                ? 'text-gray-400 cursor-not-allowed'
                                : getActionVariantClass(action.variant)
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {action.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Close Selection */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onDeselectAll}
              className="text-gray-400 hover:text-gray-600"
              title="Clear selection"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Action</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">
                {actions.find(a => a.id === showConfirmation)?.confirmationMessage ||
                  `Are you sure you want to perform this action on ${selectedItems.length} selected ${itemName}?`}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowConfirmation(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => confirmAction(showConfirmation)}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showMoreActions && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowMoreActions(false)}
        />
      )}
    </>
  );
}

// Checkbox component for individual items
interface BulkActionCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (id: string) => void;
  className?: string;
}

export function BulkActionCheckbox({ id, checked, onChange, className = '' }: BulkActionCheckboxProps) {
  return (
    <button
      onClick={() => onChange(id)}
      className={`p-1 rounded transition-colors ${
        checked ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
      } ${className}`}
    >
      {checked ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
    </button>
  );
}

// Hook for managing bulk selection state
export function useBulkSelection<T extends { id: string }>(items: T[]) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const selectAll = () => {
    setSelectedItems(items.map(item => item.id));
  };

  const deselectAll = () => {
    setSelectedItems([]);
  };

  const toggleItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const isSelected = (id: string) => selectedItems.includes(id);

  return {
    selectedItems,
    selectAll,
    deselectAll,
    toggleItem,
    isSelected,
    hasSelection: selectedItems.length > 0,
    selectedCount: selectedItems.length
  };
}

// Common bulk actions for different entities
export const commonBulkActions = {
  orders: [
    {
      id: 'update-status',
      label: 'Update Status',
      icon: Edit,
      variant: 'default' as const
    },
    {
      id: 'export',
      label: 'Export',
      icon: Download,
      variant: 'default' as const
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      variant: 'danger' as const,
      requiresConfirmation: true,
      confirmationMessage: 'Are you sure you want to delete the selected orders? This action cannot be undone.'
    }
  ],
  products: [
    {
      id: 'update-status',
      label: 'Update Status',
      icon: Edit,
      variant: 'default' as const
    },
    {
      id: 'bulk-edit',
      label: 'Bulk Edit',
      icon: Edit,
      variant: 'default' as const
    },
    {
      id: 'export',
      label: 'Export',
      icon: Download,
      variant: 'default' as const
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: Archive,
      variant: 'warning' as const,
      requiresConfirmation: true
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      variant: 'danger' as const,
      requiresConfirmation: true,
      confirmationMessage: 'Are you sure you want to delete the selected products? This action cannot be undone.'
    }
  ],
  customers: [
    {
      id: 'send-notification',
      label: 'Send Notification',
      icon: Send,
      variant: 'default' as const
    },
    {
      id: 'export',
      label: 'Export',
      icon: Download,
      variant: 'default' as const
    },
    {
      id: 'bulk-edit',
      label: 'Bulk Edit',
      icon: Edit,
      variant: 'default' as const
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: Archive,
      variant: 'warning' as const,
      requiresConfirmation: true
    }
  ]
};