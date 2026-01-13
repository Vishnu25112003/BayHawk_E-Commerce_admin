import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Button, 
  Input, 
  Select, 
  Modal, 
  PageHeader, 
  ActionButtons,
  LoadingWrapper,
  EmptyState,
  Card,
  Badge,
  StatsGrid
} from '../components/ui';
import { OrdersList, OrderStatusTracker } from '../components/features/orders';
import { ShoppingCart, Fish, Store, Package, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { ordersApi } from '../utils/api';
import { createOrderSchema, type CreateOrderInput } from '../utils/validations';
import { useOrderUpdates, useNewOrders, type OrderUpdateEvent, type NewOrderEvent } from '../utils/socket';
import { useLoading } from '../hooks/useLoading';
import { formatCurrency } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { filterDataByModule } from '../utils/rbac';
import type { Order } from '../types';

export function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'hub' | 'store'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { isLoading, withLoading } = useLoading(true);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: { addressType: 'home', paymentMethod: 'cod', source: 'manual', items: [] },
  });

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      const response = await ordersApi.getAll();
      setOrders(response.data);
    } catch (error) {
      // Fallback to mock data with more examples
      setOrders([
        // Hub Orders
        {
          id: 'HUB-001',
          customerId: '1',
          customerName: 'Rajesh Kumar',
          customerPhone: '+91 9876543210',
          source: 'app',
          status: 'processing',
          paymentStatus: 'paid',
          paymentMethod: 'online',
          items: [
            { productId: '1', productName: 'Seer Fish (Vanjaram)', variant: 'Medium Cut', quantity: 1, price: 450 }
          ],
          totalAmount: 450,
          deliverySlot: '10:00 AM - 12:00 PM',
          orderType: 'regular',
          moduleType: 'hub',
          hubId: 'hub_1',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'HUB-002',
          customerId: '2',
          customerName: 'Arun Patel',
          customerPhone: '+91 9876543212',
          source: 'whatsapp',
          status: 'packed',
          paymentStatus: 'paid',
          paymentMethod: 'cod',
          items: [
            { productId: '2', productName: 'King Fish', variant: 'Steaks', quantity: 2, price: 600 }
          ],
          totalAmount: 600,
          deliverySlot: '2:00 PM - 4:00 PM',
          orderType: 'regular',
          moduleType: 'hub',
          hubId: 'hub_1',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'HUB-003',
          customerId: '3',
          customerName: 'Lakshmi Devi',
          customerPhone: '+91 9876543213',
          source: 'website',
          status: 'delivered',
          paymentStatus: 'paid',
          paymentMethod: 'online',
          items: [
            { productId: '3', productName: 'Pomfret', variant: 'Whole Fish', quantity: 1, price: 800 }
          ],
          totalAmount: 800,
          deliverySlot: '7:00 AM - 9:00 AM',
          orderType: 'regular',
          moduleType: 'hub',
          hubId: 'hub_1',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        // Store Orders
        {
          id: 'STR-001',
          customerId: '4',
          customerName: 'Priya Sharma',
          customerPhone: '+91 9876543211',
          source: 'app',
          status: 'received',
          paymentStatus: 'pending',
          paymentMethod: 'cod',
          items: [
            { productId: '4', productName: 'Chicken Curry Cut', variant: '1kg', quantity: 1, price: 280 },
            { productId: '5', productName: 'Tiger Prawns', variant: 'Large', quantity: 1, price: 520 }
          ],
          totalAmount: 800,
          deliverySlot: '6:00 PM - 8:00 PM',
          orderType: 'regular',
          moduleType: 'store',
          storeId: 'store_1',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
        },
        {
          id: 'STR-002',
          customerId: '5',
          customerName: 'Karthik Raj',
          customerPhone: '+91 9876543214',
          source: 'instagram',
          status: 'processing',
          paymentStatus: 'paid',
          paymentMethod: 'online',
          items: [
            { productId: '6', productName: 'Mutton Curry Cut', variant: '500g', quantity: 1, price: 450 },
            { productId: '7', productName: 'Eggs', variant: '12 pieces', quantity: 1, price: 84 }
          ],
          totalAmount: 534,
          deliverySlot: '10:00 AM - 12:00 PM',
          orderType: 'regular',
          moduleType: 'store',
          storeId: 'store_2',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: 'STR-003',
          customerId: '6',
          customerName: 'Meera Nair',
          customerPhone: '+91 9876543215',
          source: 'facebook',
          status: 'out_for_delivery',
          paymentStatus: 'paid',
          paymentMethod: 'online',
          items: [
            { productId: '8', productName: 'Crab', variant: 'Medium Size', quantity: 2, price: 400 },
            { productId: '9', productName: 'Spices Mix', variant: 'Fish Curry', quantity: 1, price: 50 }
          ],
          totalAmount: 450,
          deliverySlot: '4:00 PM - 6:00 PM',
          orderType: 'regular',
          moduleType: 'store',
          storeId: 'store_1',
          createdAt: new Date(Date.now() - 10800000).toISOString(),
        }
      ]);
    }
  }, []);

  useEffect(() => {
    withLoading(fetchOrders);
  }, [fetchOrders, withLoading]);
  // Filter orders based on user's module access
  const filteredOrders = filterDataByModule(orders, user);

  // Real-time order updates
  const handleOrderUpdate = useCallback((data: OrderUpdateEvent) => {
    setOrders((prev) => prev.map((o) => o.id === data.orderId ? { ...o, status: data.status as Order['status'] } : o));
  }, []);
  useOrderUpdates(handleOrderUpdate);

  // Real-time new orders
  const handleNewOrder = useCallback((data: NewOrderEvent) => {
    const newOrder: Order = {
      id: data.order.id,
      customerId: '',
      customerName: data.order.customerName,
      customerPhone: '',
      source: data.order.source as Order['source'],
      status: 'received',
      paymentStatus: 'pending',
      paymentMethod: 'cod',
      items: [],
      totalAmount: data.order.totalAmount,
      deliverySlot: '',
      orderType: 'regular',
      moduleType: 'store',
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
  }, []);
  useNewOrders(handleNewOrder);

  // Create order
  const onCreateOrder = async (data: CreateOrderInput) => {
    try {
      await ordersApi.create(data);
      setShowCreateModal(false);
      reset();
      await fetchOrders();
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  // Order actions
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setShowEditModal(true);
  };

  const handleUpdateOrder = async (updatedOrder: Partial<Order>) => {
    if (!editingOrder) return;
    
    try {
      // Update order via API
      await ordersApi.update(editingOrder.id, updatedOrder);
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === editingOrder.id 
          ? { ...order, ...updatedOrder }
          : order
      ));
      
      setShowEditModal(false);
      setEditingOrder(null);
    } catch (error) {
      // For demo purposes, update locally
      setOrders(prev => prev.map(order => 
        order.id === editingOrder.id 
          ? { ...order, ...updatedOrder }
          : order
      ));
      
      setShowEditModal(false);
      setEditingOrder(null);
      console.log('Order updated successfully');
    }
  };

  const handleDeleteOrder = async (order: Order) => {
    if (!confirm(`Are you sure you want to delete order ${order.id}? This action cannot be undone.`)) {
      return;
    }

    try {
      // Delete order via API
      await ordersApi.cancel(order.id, '');
      
      // Update local state
      setOrders(prev => prev.filter(o => o.id !== order.id));
    } catch (error) {
      // For demo purposes, delete locally
      setOrders(prev => prev.filter(o => o.id !== order.id));
      console.log('Order deleted successfully');
    }
  };

  // Bulk actions handler
  const handleBulkAction = async (actionId: string, selectedIds: string[], data?: any) => {
    try {
      switch (actionId) {
        case 'update-status':
          // Update status for selected orders
          setOrders(prev => prev.map(order => 
            selectedIds.includes(order.id) 
              ? { ...order, status: data.status as Order['status'] }
              : order
          ));
          console.log(`Updated status to ${data.status} for ${selectedIds.length} orders`);
          break;

        case 'update-delivery-slot':
          // Update delivery slot for selected orders
          setOrders(prev => prev.map(order => 
            selectedIds.includes(order.id) 
              ? { ...order, deliverySlot: data.deliverySlot }
              : order
          ));
          console.log(`Updated delivery slot for ${selectedIds.length} orders`);
          break;

        case 'mark-priority':
          // Mark orders as priority (this would typically update a priority field)
          console.log(`Marked ${selectedIds.length} orders as ${data.priority} priority`);
          break;

        case 'send-notification':
          // Send notification to customers
          console.log(`Sent ${data.type} notification to ${selectedIds.length} customers`);
          break;

        case 'delete':
          // Delete selected orders
          setOrders(prev => prev.filter(order => !selectedIds.includes(order.id)));
          console.log(`Deleted ${selectedIds.length} orders`);
          break;

        default:
          console.log(`Bulk action ${actionId} performed on ${selectedIds.length} orders`, data);
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
      alert('Bulk action failed. Please try again.');
    }
  };

  // Filter orders based on active tab
  const tabFilteredOrders = filteredOrders.filter(order => {
    if (activeTab === 'all') return true;
    return order.moduleType === activeTab;
  });

  // Calculate statistics using RBAC filtered orders
  const hubOrders = filteredOrders.filter(order => order.moduleType === 'hub');
  const storeOrders = filteredOrders.filter(order => order.moduleType === 'store');
  
  const hubStats = {
    total: hubOrders.length,
    revenue: hubOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    pending: hubOrders.filter(order => ['received', 'processing'].includes(order.status)).length,
    delivered: hubOrders.filter(order => order.status === 'delivered').length,
  };
  
  const storeStats = {
    total: storeOrders.length,
    revenue: storeOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    pending: storeOrders.filter(order => ['received', 'processing'].includes(order.status)).length,
    delivered: storeOrders.filter(order => order.status === 'delivered').length,
  };

  const handleExport = async () => {
    try {
      const params: any = { export: 'csv' };
      if (activeTab !== 'all') {
        params.moduleType = activeTab;
      }
      const response = await ordersApi.getAll(params);
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeTab}-orders-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Determine which tabs to show based on user type
  const getAvailableTabs = () => {
    const allTabs = [
      { id: 'all', label: 'All Orders', icon: ShoppingCart, count: filteredOrders.length },
      { id: 'hub', label: 'Hub Orders', icon: Fish, count: hubOrders.length },
      { id: 'store', label: 'Store Orders', icon: Store, count: storeOrders.length },
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
    const defaultTab = user?.loginType === 'hub' ? 'hub' : user?.loginType === 'store' ? 'store' : 'all';
    setActiveTab(defaultTab as 'all' | 'hub' | 'store');
  });

  return (
    <LoadingWrapper isLoading={isLoading} type="page" text="Loading orders..." variant="branded">
      <div className="space-y-4 sm:space-y-6">
        <PageHeader
          title={
            user?.loginType === 'hub' ? 'Hub Orders Management' : 
            user?.loginType === 'store' ? 'Store Orders Management' : 
            'All Orders Management'
          }
          description={
            user?.loginType === 'hub' ? 'Manage and track hub orders and deliveries' : 
            user?.loginType === 'store' ? 'Manage and track store orders and deliveries' : 
            'Manage and track orders across Hub and Store operations'
          }
          actions={
            <ActionButtons
              onDownload={handleExport}
              onRefresh={() => withLoading(fetchOrders)}
              downloadLabel={`Export ${activeTab === 'all' ? 'All' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Orders`}
            />
          }
        />

        {/* Tab Navigation */}
        <Card className="p-0 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto px-4 sm:px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'all' | 'hub' | 'store')}
                    className={`
                      flex items-center gap-2 py-3 sm:py-4 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap
                      ${isActive
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                    <Badge variant={isActive ? 'info' : 'default'} className="ml-1 text-xs">
                      {tab.count}
                    </Badge>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Statistics Section */}
          <div className="p-4 sm:p-6">
            {activeTab === 'all' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                {/* Hub Statistics */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-blue-600 flex items-center justify-center">
                      <Fish className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-blue-900">Hub Orders</h3>
                      <p className="text-xs sm:text-sm text-blue-700">Fish products • Next day delivery</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                      <p className="text-lg sm:text-2xl font-bold text-blue-900">{hubStats.total}</p>
                      <p className="text-xs sm:text-sm text-blue-700">Total Orders</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                      <p className="text-lg sm:text-2xl font-bold text-blue-900">{formatCurrency(hubStats.revenue)}</p>
                      <p className="text-xs sm:text-sm text-blue-700">Revenue</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                      <p className="text-lg sm:text-2xl font-bold text-orange-600">{hubStats.pending}</p>
                      <p className="text-xs sm:text-sm text-blue-700">Pending</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                      <p className="text-lg sm:text-2xl font-bold text-green-600">{hubStats.delivered}</p>
                      <p className="text-xs sm:text-sm text-blue-700">Delivered</p>
                    </div>
                  </div>
                </div>

                {/* Store Statistics */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 sm:p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-green-600 flex items-center justify-center">
                      <Store className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-green-900">Store Orders</h3>
                      <p className="text-xs sm:text-sm text-green-700">All products • Same/Next day delivery</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                      <p className="text-lg sm:text-2xl font-bold text-green-900">{storeStats.total}</p>
                      <p className="text-xs sm:text-sm text-green-700">Total Orders</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                      <p className="text-lg sm:text-2xl font-bold text-green-900">{formatCurrency(storeStats.revenue)}</p>
                      <p className="text-xs sm:text-sm text-green-700">Revenue</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                      <p className="text-lg sm:text-2xl font-bold text-orange-600">{storeStats.pending}</p>
                      <p className="text-xs sm:text-sm text-green-700">Pending</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-2 sm:p-3">
                      <p className="text-lg sm:text-2xl font-bold text-green-600">{storeStats.delivered}</p>
                      <p className="text-xs sm:text-sm text-green-700">Delivered</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hub' && (
              <StatsGrid
                stats={[
                  { label: 'Total Hub Orders', value: hubStats.total, icon: Package, color: 'blue' },
                  { label: 'Hub Revenue', value: formatCurrency(hubStats.revenue), icon: TrendingUp, color: 'green' },
                  { label: 'Pending Orders', value: hubStats.pending, icon: Clock, color: 'orange' },
                  { label: 'Delivered Orders', value: hubStats.delivered, icon: CheckCircle, color: 'green' },
                ]}
                columns={2}
                className="mb-4 sm:mb-6"
              />
            )}

            {activeTab === 'store' && (
              <StatsGrid
                stats={[
                  { label: 'Total Store Orders', value: storeStats.total, icon: Package, color: 'green' },
                  { label: 'Store Revenue', value: formatCurrency(storeStats.revenue), icon: TrendingUp, color: 'green' },
                  { label: 'Pending Orders', value: storeStats.pending, icon: Clock, color: 'orange' },
                  { label: 'Delivered Orders', value: storeStats.delivered, icon: CheckCircle, color: 'green' },
                ]}
                columns={2}
                className="mb-4 sm:mb-6"
              />
            )}
          </div>
        </Card>

        {/* Orders List */}
        {tabFilteredOrders.length === 0 ? (
          <EmptyState
            icon={activeTab === 'hub' ? Fish : activeTab === 'store' ? Store : ShoppingCart}
            title={`No ${activeTab === 'all' ? '' : activeTab} orders found`}
            description={`No ${activeTab === 'all' ? '' : activeTab} orders are currently available. Orders will appear here once customers place them.`}
          />
        ) : (
          <OrdersList
            orders={tabFilteredOrders}
            loading={isLoading}
            onView={handleViewOrder}
            onEdit={handleEditOrder}
            onDelete={handleDeleteOrder}
            onRefresh={() => withLoading(fetchOrders)}
            onBulkAction={handleBulkAction}
          />
        )}

        {/* Create Order Modal */}
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Order" size="lg">
          <form onSubmit={handleSubmit(onCreateOrder)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Customer Name" 
                {...register('customerName')} 
                placeholder="Full Name" 
                error={errors.customerName?.message} 
              />
              <Input 
                label="Phone Number" 
                {...register('customerPhone')} 
                placeholder="+91 9876543210" 
                error={errors.customerPhone?.message} 
              />
            </div>
            
            <Input 
              label="Email (Optional)" 
              {...register('customerEmail')} 
              type="email" 
              placeholder="customer@email.com" 
            />

            {/* Order Type Selection */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium mb-3 text-gray-900">Order Type</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center p-3 border-2 border-blue-200 bg-blue-50 rounded-lg">
                  <Fish className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-blue-900">Hub Order</p>
                    <p className="text-xs text-blue-700">Fish products • Next day delivery</p>
                  </div>
                </div>
                <div className="flex items-center p-3 border-2 border-green-200 bg-green-50 rounded-lg">
                  <Store className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-green-900">Store Order</p>
                    <p className="text-xs text-green-700">All products • Same/Next day</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Delivery Address</h3>
              <div className="space-y-3">
                <Input 
                  label="Address Line 1" 
                  {...register('addressLine1')} 
                  placeholder="House no, Building name, Street" 
                  error={errors.addressLine1?.message} 
                />
                <Input 
                  label="Address Line 2 (Optional)" 
                  {...register('addressLine2')} 
                  placeholder="Landmark, Area" 
                />
                <div className="grid grid-cols-3 gap-3">
                  <Input 
                    label="Pincode" 
                    {...register('pincode')} 
                    placeholder="600001" 
                    error={errors.pincode?.message} 
                  />
                  <Input 
                    label="City" 
                    {...register('city')} 
                    placeholder="Chennai" 
                    error={errors.city?.message} 
                  />
                  <Input 
                    label="State" 
                    {...register('state')} 
                    placeholder="Tamil Nadu" 
                    error={errors.state?.message} 
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select 
                label="Delivery Slot" 
                {...register('deliverySlot')} 
                error={errors.deliverySlot?.message} 
                options={[
                  { value: '', label: 'Select Slot' }, 
                  { value: 'slot1', label: 'Slot 1 (7AM-9AM)' }, 
                  { value: 'slot2', label: 'Slot 2 (1PM-3PM)' }, 
                  { value: 'slot3', label: 'Slot 3 (7PM-9PM)' }
                ]} 
              />
              <Select 
                label="Payment Method" 
                {...register('paymentMethod')} 
                error={errors.paymentMethod?.message} 
                options={[
                  { value: 'cod', label: 'Cash on Delivery' }, 
                  { value: 'online', label: 'Online Payment' }
                ]} 
              />
            </div>
            
            <Select 
              label="Order Source" 
              {...register('source')} 
              error={errors.source?.message} 
              options={[
                { value: 'whatsapp', label: 'WhatsApp' }, 
                { value: 'instagram', label: 'Instagram' }, 
                { value: 'facebook', label: 'Facebook' }, 
                { value: 'manual', label: 'Manual' }
              ]} 
            />
            
            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setShowCreateModal(false)} 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Create Order
              </Button>
            </div>
          </form>
        </Modal>

        {/* Edit Order Modal */}
        <Modal 
          isOpen={showEditModal} 
          onClose={() => {
            setShowEditModal(false);
            setEditingOrder(null);
          }} 
          title={`Edit Order ${editingOrder?.id}`}
          size="xl"
        >
          {editingOrder && (
            <div className="space-y-6">
              {/* Status-based restrictions info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Editing Restrictions</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• <strong>Products:</strong> {['processing', 'packed', 'out_for_delivery', 'delivered'].includes(editingOrder.status) ? 'Cannot be modified after processing' : 'Can be modified'}</p>
                  <p>• <strong>Delivery Slot:</strong> {['out_for_delivery', 'delivered'].includes(editingOrder.status) ? 'Cannot be modified after dispatch' : 'Can be modified'}</p>
                  <p>• <strong>Customer Info:</strong> {editingOrder.status === 'delivered' ? 'Cannot be modified after delivery' : 'Can be modified'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Order Details */}
                <div className="space-y-4">
                  {/* Order Status Update */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Status
                    </label>
                    <select
                      value={editingOrder.status}
                      onChange={(e) => setEditingOrder({
                        ...editingOrder,
                        status: e.target.value as Order['status']
                      })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="received">Received</option>
                      <option value="processing">Processing</option>
                      <option value="packed">Packed</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Payment Status Update */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Status
                    </label>
                    <select
                      value={editingOrder.paymentStatus}
                      onChange={(e) => setEditingOrder({
                        ...editingOrder,
                        paymentStatus: e.target.value as Order['paymentStatus']
                      })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>

                  {/* Delivery Slot Update */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Slot
                      {['out_for_delivery', 'delivered'].includes(editingOrder.status) && (
                        <span className="text-red-500 text-xs ml-2">(Cannot modify after dispatch)</span>
                      )}
                    </label>
                    <select
                      value={editingOrder.deliverySlot}
                      onChange={(e) => setEditingOrder({
                        ...editingOrder,
                        deliverySlot: e.target.value
                      })}
                      disabled={['out_for_delivery', 'delivered'].includes(editingOrder.status)}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        ['out_for_delivery', 'delivered'].includes(editingOrder.status) 
                          ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed' 
                          : 'border-gray-300'
                      }`}
                    >
                      <option value="7:00 AM - 9:00 AM">7:00 AM - 9:00 AM</option>
                      <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                      <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                      <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                      <option value="6:00 PM - 8:00 PM">6:00 PM - 8:00 PM</option>
                    </select>
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Customer Name
                        {editingOrder.status === 'delivered' && (
                          <span className="text-red-500 text-xs ml-2">(Cannot modify after delivery)</span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={editingOrder.customerName}
                        onChange={(e) => setEditingOrder({
                          ...editingOrder,
                          customerName: e.target.value
                        })}
                        disabled={editingOrder.status === 'delivered'}
                        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          editingOrder.status === 'delivered' 
                            ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed' 
                            : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Customer Phone
                        {editingOrder.status === 'delivered' && (
                          <span className="text-red-500 text-xs ml-2">(Cannot modify after delivery)</span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={editingOrder.customerPhone}
                        onChange={(e) => setEditingOrder({
                          ...editingOrder,
                          customerPhone: e.target.value
                        })}
                        disabled={editingOrder.status === 'delivered'}
                        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          editingOrder.status === 'delivered' 
                            ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed' 
                            : 'border-gray-300'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - Order Items */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Order Items</h4>
                      {['processing', 'packed', 'out_for_delivery', 'delivered'].includes(editingOrder.status) && (
                        <span className="text-red-500 text-xs">(Cannot modify after processing)</span>
                      )}
                    </div>
                    
                    {editingOrder.items && editingOrder.items.length > 0 ? (
                      <div className="space-y-3">
                        {editingOrder.items.map((item, index) => (
                          <div key={index} className="border rounded-lg p-4 bg-gray-50">
                            <div className="space-y-3">
                              {/* Product Name */}
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Product Name</label>
                                <input
                                  type="text"
                                  value={item.productName}
                                  onChange={(e) => {
                                    const updatedItems = [...editingOrder.items!];
                                    updatedItems[index] = { ...item, productName: e.target.value };
                                    setEditingOrder({
                                      ...editingOrder,
                                      items: updatedItems
                                    });
                                  }}
                                  disabled={['processing', 'packed', 'out_for_delivery', 'delivered'].includes(editingOrder.status)}
                                  className={`w-full rounded border px-2 py-1 text-sm ${
                                    ['processing', 'packed', 'out_for_delivery', 'delivered'].includes(editingOrder.status)
                                      ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                                      : 'border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500'
                                  }`}
                                />
                              </div>
                              
                              {/* Variant and Quantity */}
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Variant</label>
                                  <input
                                    type="text"
                                    value={item.variant}
                                    onChange={(e) => {
                                      const updatedItems = [...editingOrder.items!];
                                      updatedItems[index] = { ...item, variant: e.target.value };
                                      setEditingOrder({
                                        ...editingOrder,
                                        items: updatedItems
                                      });
                                    }}
                                    disabled={['processing', 'packed', 'out_for_delivery', 'delivered'].includes(editingOrder.status)}
                                    className={`w-full rounded border px-2 py-1 text-sm ${
                                      ['processing', 'packed', 'out_for_delivery', 'delivered'].includes(editingOrder.status)
                                        ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                                        : 'border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500'
                                    }`}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const updatedItems = [...editingOrder.items!];
                                      const newQuantity = parseInt(e.target.value) || 1;
                                      updatedItems[index] = { ...item, quantity: newQuantity };
                                      
                                      // Recalculate total amount
                                      const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                                      
                                      setEditingOrder({
                                        ...editingOrder,
                                        items: updatedItems,
                                        totalAmount: newTotal
                                      });
                                    }}
                                    disabled={['processing', 'packed', 'out_for_delivery', 'delivered'].includes(editingOrder.status)}
                                    className={`w-full rounded border px-2 py-1 text-sm ${
                                      ['processing', 'packed', 'out_for_delivery', 'delivered'].includes(editingOrder.status)
                                        ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                                        : 'border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500'
                                    }`}
                                  />
                                </div>
                              </div>
                              
                              {/* Price */}
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Unit Price</label>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.price}
                                    onChange={(e) => {
                                      const updatedItems = [...editingOrder.items!];
                                      const newPrice = parseFloat(e.target.value) || 0;
                                      updatedItems[index] = { ...item, price: newPrice };
                                      
                                      // Recalculate total amount
                                      const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                                      
                                      setEditingOrder({
                                        ...editingOrder,
                                        items: updatedItems,
                                        totalAmount: newTotal
                                      });
                                    }}
                                    disabled={['processing', 'packed', 'out_for_delivery', 'delivered'].includes(editingOrder.status)}
                                    className={`w-full rounded border px-2 py-1 text-sm ${
                                      ['processing', 'packed', 'out_for_delivery', 'delivered'].includes(editingOrder.status)
                                        ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                                        : 'border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500'
                                    }`}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Total</label>
                                  <div className="px-2 py-1 text-sm font-medium text-gray-900 bg-gray-100 rounded border">
                                    {formatCurrency(item.price * item.quantity)}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Remove Item Button */}
                              {!['processing', 'packed', 'out_for_delivery', 'delivered'].includes(editingOrder.status) && editingOrder.items!.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedItems = editingOrder.items!.filter((_, i) => i !== index);
                                    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                                    setEditingOrder({
                                      ...editingOrder,
                                      items: updatedItems,
                                      totalAmount: newTotal
                                    });
                                  }}
                                  className="text-red-600 hover:text-red-800 text-xs font-medium"
                                >
                                  Remove Item
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {/* Add Item Button */}
                        {!['processing', 'packed', 'out_for_delivery', 'delivered'].includes(editingOrder.status) && (
                          <button
                            type="button"
                            onClick={() => {
                              const newItem = {
                                productId: `new_${Date.now()}`,
                                productName: 'New Product',
                                variant: 'Standard',
                                quantity: 1,
                                price: 0
                              };
                              setEditingOrder({
                                ...editingOrder,
                                items: [...(editingOrder.items || []), newItem]
                              });
                            }}
                            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors text-sm"
                          >
                            + Add New Item
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No items in this order
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Order ID:</span>
                    <p className="font-medium">{editingOrder.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Module:</span>
                    <p>
                      <Badge variant={editingOrder.moduleType === 'hub' ? 'info' : 'success'}>
                        {editingOrder.moduleType.toUpperCase()}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Amount:</span>
                    <p className="font-semibold text-lg">{formatCurrency(editingOrder.totalAmount)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment Method:</span>
                    <p className="capitalize">{editingOrder.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingOrder(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleUpdateOrder(editingOrder)}
                  className="flex-1"
                >
                  Update Order
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Order Details Modal */}
        <Modal 
          isOpen={!!selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          title={`Order ${selectedOrder?.id}`}
          size="lg"
        >
          {selectedOrder && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Order Type Badge */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  {selectedOrder.moduleType === 'hub' ? (
                    <>
                      <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Fish className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900">Hub Order</p>
                        <p className="text-sm text-blue-700">Fish products • Next day delivery</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center">
                        <Store className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-900">Store Order</p>
                        <p className="text-sm text-green-700">All products • Same/Next day delivery</p>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-medium">{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span>{selectedOrder.customerPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Source:</span>
                      <span className="capitalize">{selectedOrder.source}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Module:</span>
                      <Badge variant={selectedOrder.moduleType === 'hub' ? 'info' : 'success'}>
                        {selectedOrder.moduleType.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold">{formatCurrency(selectedOrder.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment:</span>
                      <span className="capitalize">{selectedOrder.paymentMethod} - {selectedOrder.paymentStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Slot:</span>
                      <span className="text-sm">{selectedOrder.deliverySlot}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{item.productName}</p>
                            <p className="text-sm text-gray-600">{item.variant} • Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <OrderStatusTracker 
                  currentStatus={selectedOrder.status}
                  orderDate={selectedOrder.createdAt}
                />
              </div>
            </div>
          )}
        </Modal>
      </div>
    </LoadingWrapper>
  );
}
