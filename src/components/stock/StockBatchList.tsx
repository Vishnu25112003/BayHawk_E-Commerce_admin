import { useState } from 'react';
import { 
  SearchFilter, 
  BulkActions,
  BulkActionModal,
  useBulkSelection
} from '../common';
import { Card, Badge } from '../ui';
import { 
  Eye, Edit, Trash2, Package, CheckSquare, Square, Minus,
  Calendar, MapPin, Thermometer, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import type { StockBatchData } from './StockBatchForm';

interface StockBatch extends StockBatchData {
  id: string;
  totalValue: number;
  daysUntilExpiry: number;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
}

interface StockBatchListProps {
  batches: StockBatch[];
  onView?: (batch: StockBatch) => void;
  onEdit?: (batch: StockBatch) => void;
  onDelete?: (batch: StockBatch) => void;
  onApprove?: (batch: StockBatch) => void;
  onReject?: (batch: StockBatch) => void;
  onBulkAction?: (actionId: string, selectedIds: string[], data?: any) => Promise<void>;
  title?: string;
  showApprovalActions?: boolean;
}

const stockBulkActions = [
  {
    id: 'approve',
    label: 'Approve Batches',
    icon: CheckCircle,
    variant: 'success' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to approve the selected batches?'
  },
  {
    id: 'reject',
    label: 'Reject Batches',
    icon: XCircle,
    variant: 'danger' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to reject the selected batches?'
  },
  {
    id: 'update_expiry',
    label: 'Update Expiry Dates',
    icon: Calendar,
    variant: 'warning' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Update expiry dates for selected batches?'
  },
  {
    id: 'delete',
    label: 'Delete Batches',
    icon: Trash2,
    variant: 'danger' as const,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to delete the selected batches? This action cannot be undone.'
  }
];

export function StockBatchList({ 
  batches, 
  onView, 
  onEdit, 
  onDelete,
  onApprove,
  onReject,
  onBulkAction,
  title = 'Stock Batches',
  showApprovalActions = false
}: StockBatchListProps) {
  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expiryFilter, setExpiryFilter] = useState('');
  const [bulkActionModal, setBulkActionModal] = useState<{
    isOpen: boolean;
    actionId: string;
    actionType: string;
  }>({ isOpen: false, actionId: '', actionType: '' });

  // Filter batches
  const filteredBatches = batches.filter(batch => {
    const matchesSearch = !searchValue || 
      batch.productName.toLowerCase().includes(searchValue.toLowerCase()) ||
      batch.batchNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
      batch.traceabilityCode.toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesCategory = !categoryFilter || batch.category === categoryFilter;
    
    const matchesStatus = !statusFilter || batch.status === statusFilter;
    
    const matchesExpiry = !expiryFilter || 
      (expiryFilter === 'expired' && batch.daysUntilExpiry < 0) ||
      (expiryFilter === 'expiring_soon' && batch.daysUntilExpiry >= 0 && batch.daysUntilExpiry <= 3) ||
      (expiryFilter === 'fresh' && batch.daysUntilExpiry > 3);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesExpiry;
  });

  const {
    selectedItems,
    selectAll,
    deselectAll,
    toggleItem,
    isSelected
  } = useBulkSelection(filteredBatches);

  const isAllSelected = selectedItems.length === filteredBatches.length && filteredBatches.length > 0;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < filteredBatches.length;

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExpiryColor = (daysUntilExpiry: number) => {
    if (daysUntilExpiry < 0) return 'text-red-600';
    if (daysUntilExpiry <= 3) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getExpiryStatus = (daysUntilExpiry: number) => {
    if (daysUntilExpiry < 0) return 'Expired';
    if (daysUntilExpiry === 0) return 'Expires Today';
    if (daysUntilExpiry <= 3) return `${daysUntilExpiry} days left`;
    return `${daysUntilExpiry} days left`;
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder="Search by product name, batch number, or traceability code..."
        filters={[
          {
            key: 'category',
            label: 'Category',
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: [
              { value: '', label: 'All Categories' },
              { value: 'sea-fish', label: 'Sea Fish' },
              { value: 'freshwater-fish', label: 'Freshwater Fish' },
              { value: 'shell-fish', label: 'Shell Fish' },
              { value: 'dry-fish', label: 'Dry Fish' },
              { value: 'chicken', label: 'Chicken' },
              { value: 'mutton', label: 'Mutton' },
              { value: 'egg', label: 'Egg' }
            ]
          },
          {
            key: 'status',
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: '', label: 'All Status' },
              { value: 'pending', label: 'Pending Approval' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' }
            ]
          },
          {
            key: 'expiry',
            label: 'Expiry Status',
            value: expiryFilter,
            onChange: setExpiryFilter,
            options: [
              { value: '', label: 'All Items' },
              { value: 'fresh', label: 'Fresh (>3 days)' },
              { value: 'expiring_soon', label: 'Expiring Soon (≤3 days)' },
              { value: 'expired', label: 'Expired' }
            ]
          }
        ]}
      />

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <BulkActions
          selectedItems={selectedItems}
          totalItems={filteredBatches.length}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          actions={stockBulkActions}
          onAction={handleBulkActionClick}
          itemName="batches"
        />
      )}

      {/* Select All Header */}
      {filteredBatches.length > 0 && (
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
                ? `${selectedItems.length} of ${filteredBatches.length} ${title.toLowerCase()} selected`
                : `Select all ${filteredBatches.length} ${title.toLowerCase()}`
              }
            </span>
          </div>
        </Card>
      )}

      {/* Batches List */}
      <div className="space-y-3">
        {filteredBatches.map(batch => (
          <Card key={batch.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              {/* Selection Checkbox */}
              <button
                onClick={() => toggleItem(batch.id)}
                className={`p-1 rounded transition-colors flex-shrink-0 mt-1 ${
                  isSelected(batch.id) ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {isSelected(batch.id) ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
              </button>

              {/* Batch Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{batch.productName}</h3>
                      <div className="flex flex-wrap items-center gap-1">
                        <Badge variant={getStatusColor(batch.status)} className="text-xs">
                          {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                        </Badge>
                        {batch.certifications.length > 0 && (
                          <Badge variant="bg-blue-100 text-blue-800" className="text-xs">
                            {batch.certifications.length} Cert{batch.certifications.length > 1 ? 's' : ''}
                          </Badge>
                        )}
                        {batch.chemicalFree === 'organic' && (
                          <Badge variant="bg-green-100 text-green-800" className="text-xs">Organic</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Batch Number</p>
                        <p className="font-mono text-xs">{batch.batchNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Traceability</p>
                        <p className="font-mono text-xs">{batch.traceabilityCode}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Quantity</p>
                        <p className="font-medium">{batch.quantity} × {batch.individualWeight}{batch.quantityUnit}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Category</p>
                        <Badge variant="bg-gray-100 text-gray-800" className="text-xs">
                          {batch.category.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>

                    {/* Additional Info Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-500">Received:</span>
                        <span className="text-xs">{new Date(batch.receivedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-500">Expiry:</span>
                        <span className={`text-xs font-medium ${getExpiryColor(batch.daysUntilExpiry)}`}>
                          {getExpiryStatus(batch.daysUntilExpiry)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-500">Origin:</span>
                        <span className="text-xs">{batch.harvestOrigin || batch.countryOfOrigin}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Thermometer className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-500">Storage:</span>
                        <span className="text-xs">{batch.storageTemperature}</span>
                      </div>
                    </div>
                  </div>

                  {/* Value & Actions */}
                  <div className="flex flex-col items-end gap-3 ml-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-semibold text-lg">{formatCurrency(batch.totalValue)}</p>
                      <p className="text-xs text-gray-500">Total Value</p>
                    </div>
                    
                    <div className="flex gap-1">
                      <button 
                        onClick={() => onView?.(batch)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onEdit?.(batch)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {showApprovalActions && batch.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => onApprove?.(batch)}
                            className="p-2 hover:bg-green-50 rounded-lg transition-colors text-green-600" 
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => onReject?.(batch)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600" 
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => onDelete?.(batch)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600" 
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredBatches.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stock batches found</h3>
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
        itemName="batches"
      />
    </div>
  );
}

export type { StockBatch };