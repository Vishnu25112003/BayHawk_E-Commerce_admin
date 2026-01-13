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
import { formatCurrency, formatDateTime } from '../../../utils/helpers';
import { Clock, Send, Star } from 'lucide-react';
import type { Order } from '../../../types';

interface OrdersListProps {
  orders: Order[];
  loading?: boolean;
  onView?: (order: Order) => void;
  onEdit?: (order: Order) => void;
  onDelete?: (order: Order) => void;
  onRefresh?: () => void;
  onBulkAction?: (actionId: string, selectedIds: string[], data?: any) => Promise<void>;
}

export function OrdersList({ 
  orders, 
  loading = false, 
  onView, 
  onEdit, 
  onDelete,
  onRefresh,
  onBulkAction
}: OrdersListProps) {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
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
  } = useBulkSelection(orders);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchValue.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesSource = !sourceFilter || order.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  // Enhanced bulk actions for orders
  const orderBulkActions = [
    ...commonBulkActions.orders,
    {
      id: 'update-delivery-slot',
      label: 'Update Delivery Slot',
      icon: Clock,
      variant: 'default' as const
    },
    {
      id: 'send-notification',
      label: 'Send Notification',
      icon: Send,
      variant: 'default' as const
    },
    {
      id: 'mark-priority',
      label: 'Mark Priority',
      icon: Star,
      variant: 'warning' as const
    }
  ];

  const handleBulkAction = async (actionId: string, selectedIds: string[]) => {
    if (actionId === 'export') {
      // Handle export directly
      handleExportOrders(selectedIds);
      return;
    }

    if (actionId === 'delete') {
      // Handle delete with confirmation
      if (onBulkAction) {
        await onBulkAction(actionId, selectedIds);
        deselectAll();
      }
      return;
    }

    // For other actions, open modal
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

  const handleExportOrders = (orderIds: string[]) => {
    const selectedOrders = orders.filter(order => orderIds.includes(order.id));
    const csvContent = generateOrdersCSV(selectedOrders);
    downloadCSV(csvContent, `orders-${new Date().toISOString().split('T')[0]}.csv`);
    deselectAll();
  };

  const generateOrdersCSV = (orders: Order[]) => {
    const headers = ['Order ID', 'Customer Name', 'Phone', 'Status', 'Amount', 'Source', 'Date'];
    const rows = orders.map(order => [
      order.id,
      order.customerName,
      order.customerPhone,
      order.status,
      order.totalAmount.toString(),
      order.source,
      new Date(order.createdAt).toLocaleDateString()
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
      render: (_: any, order: Order) => (
        <BulkActionCheckbox
          id={order.id}
          checked={isSelected(order.id)}
          onChange={toggleItem}
        />
      )
    },
    {
      key: 'id',
      label: 'Order ID',
      render: (value: string) => (
        <span className="font-mono text-sm font-medium">{value}</span>
      )
    },
    {
      key: 'customerName',
      label: 'Customer',
      render: (value: string, order: Order) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{order.customerPhone}</p>
        </div>
      )
    },
    {
      key: 'source',
      label: 'Source',
      render: (value: string) => (
        <span className="capitalize px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
          {value}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => <StatusBadge status={value} />
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      render: (value: number) => (
        <span className="font-semibold text-gray-900">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value: string) => (
        <span className="text-sm text-gray-600">{formatDateTime(value)}</span>
      )
    }
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: 'received', label: 'Received' },
        { value: 'processing', label: 'Processing' },
        { value: 'packed', label: 'Packed' },
        { value: 'out_for_delivery', label: 'Out for Delivery' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    },
    {
      key: 'source',
      label: 'Source',
      value: sourceFilter,
      onChange: setSourceFilter,
      options: [
        { value: 'app', label: 'Mobile App' },
        { value: 'website', label: 'Website' },
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'facebook', label: 'Facebook' }
      ]
    }
  ];

  // Get bulk action config for modal
  const getBulkActionConfig = () => {
    const config = bulkActionConfigs[bulkActionModal.actionId as keyof typeof bulkActionConfigs];
    if (config) return config;

    // Custom configurations for order-specific actions
    switch (bulkActionModal.actionId) {
      case 'update-delivery-slot':
        return {
          title: 'Update Delivery Slot',
          fields: [
            {
              id: 'deliverySlot',
              label: 'New Delivery Slot',
              type: 'select' as const,
              required: true,
              options: [
                { value: '7:00 AM - 9:00 AM', label: '7:00 AM - 9:00 AM' },
                { value: '10:00 AM - 12:00 PM', label: '10:00 AM - 12:00 PM' },
                { value: '2:00 PM - 4:00 PM', label: '2:00 PM - 4:00 PM' },
                { value: '4:00 PM - 6:00 PM', label: '4:00 PM - 6:00 PM' },
                { value: '6:00 PM - 8:00 PM', label: '6:00 PM - 8:00 PM' }
              ]
            },
            {
              id: 'reason',
              label: 'Reason for Change',
              type: 'textarea' as const,
              placeholder: 'Enter reason for delivery slot change...'
            }
          ]
        };
      case 'mark-priority':
        return {
          title: 'Mark as Priority',
          fields: [
            {
              id: 'priority',
              label: 'Priority Level',
              type: 'select' as const,
              required: true,
              options: [
                { value: 'high', label: 'High Priority' },
                { value: 'urgent', label: 'Urgent' },
                { value: 'critical', label: 'Critical' }
              ]
            },
            {
              id: 'notes',
              label: 'Priority Notes',
              type: 'textarea' as const,
              placeholder: 'Add notes about why this is priority...'
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
        totalItems={filteredOrders.length}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}

        actions={orderBulkActions}
        onAction={handleBulkAction}
        itemName="orders"
      />

      <div className="flex justify-between items-start">
        <SearchFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filters={filters}
          onClearFilters={() => {
            setSearchValue('');
            setStatusFilter('');
            setSourceFilter('');
          }}
          placeholder="Search orders by ID or customer name..."
          className="flex-1 mr-4"
        />
        
        <ActionButtons
          onRefresh={onRefresh}
          refreshLabel="Refresh Orders"
        />
      </div>

      <DataTable
        data={filteredOrders}
        columns={columns}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        loading={loading}
        emptyMessage="No orders found"
      />

      {/* Bulk Action Modal */}
      <BulkActionModal
        isOpen={bulkActionModal.isOpen}
        onClose={() => setBulkActionModal({ isOpen: false, actionId: '', actionType: '' })}
        title={getBulkActionConfig().title}
        actionType={bulkActionModal.actionType}
        selectedCount={selectedItems.length}
        itemName="orders"
        onConfirm={handleBulkActionConfirm}
        fields={getBulkActionConfig().fields}
      />
    </div>
  );
}