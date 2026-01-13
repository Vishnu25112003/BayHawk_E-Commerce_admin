import { useState } from 'react';
import { Card, Button, Input, Select, Modal, Badge } from '../components/ui';
import { Plus, Search, Eye, Users, Truck, Navigation, Clock, Phone, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { filterDataByModule, hasPermission, PERMISSIONS } from '../utils/rbac';
import type { DeliveryAgent } from '../types';

const mockDeliveryAgents: DeliveryAgent[] = [
  { 
    id: '1', 
    name: 'Murugan K', 
    phone: '+91 9876543230', 
    vehicleNo: 'TN 01 AB 1234', 
    rating: 4.8, 
    deliveries: 234, 
    isActive: true,
    status: 'delivering',
    moduleType: 'hub',
    hubId: 'hub_1',
    currentOrder: {
      orderId: 'ORD-2024-001',
      customerName: 'Rajesh Kumar',
      customerPhone: '+91 9876543220',
      deliveryAddress: '123, Anna Nagar, Chennai - 600040',
      orderValue: 850,
      estimatedTime: '15 mins',
      currentLocation: 'Near Anna Nagar Tower'
    }
  },
  { 
    id: '2', 
    name: 'Senthil R', 
    phone: '+91 9876543231', 
    vehicleNo: 'TN 01 CD 5678', 
    rating: 4.6, 
    deliveries: 189, 
    isActive: true,
    status: 'available',
    moduleType: 'hub',
    hubId: 'hub_1'
  },
  { 
    id: '3', 
    name: 'Vijay M', 
    phone: '+91 9876543232', 
    vehicleNo: 'TN 01 EF 9012', 
    rating: 4.9, 
    deliveries: 312, 
    isActive: true,
    status: 'delivering',
    moduleType: 'store',
    storeId: 'store_1',
    currentOrder: {
      orderId: 'ORD-2024-002',
      customerName: 'Priya Sharma',
      customerPhone: '+91 9876543221',
      deliveryAddress: '456, T. Nagar, Chennai - 600017',
      orderValue: 1200,
      estimatedTime: '8 mins',
      currentLocation: 'T. Nagar Main Road'
    }
  },
  { 
    id: '4', 
    name: 'Kumar S', 
    phone: '+91 9876543233', 
    vehicleNo: 'TN 01 GH 3456', 
    rating: 4.7, 
    deliveries: 156, 
    isActive: true,
    status: 'available',
    moduleType: 'store',
    storeId: 'store_1'
  },
  { 
    id: '5', 
    name: 'Arjun P', 
    phone: '+91 9876543234', 
    vehicleNo: 'TN 01 IJ 7890', 
    rating: 4.5, 
    deliveries: 98, 
    isActive: true,
    status: 'delivering',
    moduleType: 'store',
    storeId: 'store_2',
    currentOrder: {
      orderId: 'ORD-2024-003',
      customerName: 'Lakshmi Devi',
      customerPhone: '+91 9876543223',
      deliveryAddress: '789, Velachery, Chennai - 600042',
      orderValue: 1450,
      estimatedTime: '12 mins',
      currentLocation: 'Velachery Main Road'
    }
  },
  { 
    id: '6', 
    name: 'Ravi T', 
    phone: '+91 9876543235', 
    vehicleNo: 'TN 01 KL 2345', 
    rating: 4.3, 
    deliveries: 67, 
    isActive: true,
    status: 'available',
    moduleType: 'hub',
    hubId: 'hub_1'
  },
  { 
    id: '7', 
    name: 'Mani M', 
    phone: '+91 9876543236', 
    vehicleNo: 'TN 01 MN 6789', 
    rating: 4.4, 
    deliveries: 145, 
    isActive: false,
    status: 'offline',
    moduleType: 'store',
    storeId: 'store_1'
  },
];

export function DeliveryAgentPage() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'all' | 'available' | 'delivering'>('all');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignOrderModal, setShowAssignOrderModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<DeliveryAgent | null>(null);
  const [newAgent, setNewAgent] = useState({
    name: '',
    phone: '',
    vehicleNo: '',
    vehicleType: ''
  });

  // Check permissions for different actions
  const canManageAgents = hasPermission(user, PERMISSIONS.HUB_DELIVERY_AGENTS_MANAGE);
  const canViewAgents = hasPermission(user, PERMISSIONS.HUB_DELIVERY_AGENTS_VIEW);
  const canAssignOrders = hasPermission(user, PERMISSIONS.DELIVERY_MANAGE);

  // Filter data based on user's login type
  const filteredDeliveryAgents = filterDataByModule(mockDeliveryAgents, user);

  const availableAgents = filteredDeliveryAgents.filter(agent => agent.status === 'available');
  const deliveringAgents = filteredDeliveryAgents.filter(agent => agent.status === 'delivering');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivering': return 'bg-blue-100 text-blue-800';
      case 'available': return 'bg-green-100 text-green-800';
      case 'returning': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivering': return Truck;
      case 'available': return Users;
      case 'returning': return Navigation;
      case 'offline': return Clock;
      default: return Clock;
    }
  };

  const getFilteredAgents = () => {
    let agents = filteredDeliveryAgents;
    
    if (activeView === 'available') {
      agents = availableAgents;
    } else if (activeView === 'delivering') {
      agents = deliveringAgents;
    }

    if (search) {
      agents = agents.filter(agent => 
        agent.name.toLowerCase().includes(search.toLowerCase()) ||
        agent.phone.includes(search) ||
        agent.vehicleNo.toLowerCase().includes(search.toLowerCase())
      );
    }

    return agents;
  };

  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding agent:', newAgent);
    setShowAddModal(false);
    setNewAgent({ name: '', phone: '', vehicleNo: '', vehicleType: '' });
  };

  const handleViewAgent = (agent: DeliveryAgent) => {
    setSelectedAgent(agent);
    setShowViewModal(true);
  };

  const handleEditAgent = (agent: DeliveryAgent) => {
    setSelectedAgent(agent);
    setShowEditModal(true);
  };

  const handleAssignOrder = (agent: DeliveryAgent) => {
    setSelectedAgent(agent);
    setShowAssignOrderModal(true);
  };

  const handleTrackAgent = (agent: DeliveryAgent) => {
    setSelectedAgent(agent);
    setShowTrackModal(true);
  };

  const handleCallCustomer = (agent: DeliveryAgent) => {
    if (agent.currentOrder && agent.currentOrder.customerPhone) {
      window.open(`tel:${agent.currentOrder.customerPhone}`, '_self');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {user?.role === 'hub_delivery' || user?.role === 'store_delivery' 
              ? 'My Delivery Orders' 
              : user?.loginType === 'hub' 
              ? 'Hub Delivery Agent Management' 
              : user?.loginType === 'store' 
              ? 'Store Delivery Agent Management' 
              : 'Delivery Agent Management'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'hub_delivery' || user?.role === 'store_delivery'
              ? 'View your assigned delivery orders and track progress'
              : user?.loginType === 'hub' 
              ? 'Track and manage hub delivery agents with live order details' 
              : user?.loginType === 'store' 
              ? 'Track and manage store delivery agents with live order details' 
              : 'Track and manage delivery agents with live order details'}
          </p>
        </div>
        {canManageAgents && (
          <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Delivery Agent
          </Button>
        )}
      </div>

      {/* Status Summary Cards - Role-specific content */}
      {user?.role === 'hub_delivery' || user?.role === 'store_delivery' ? (
        // For delivery employees - show only their relevant stats
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">My Orders</p>
                <p className="text-xl font-bold">3</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-xl font-bold">8</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-xl font-bold">2</p>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        // For admins - show full agent management stats
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Agents</p>
                <p className="text-xl font-bold">{filteredDeliveryAgents.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-xl font-bold">{availableAgents.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Navigation className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">On Delivery</p>
                <p className="text-xl font-bold">{deliveringAgents.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Orders</p>
                <p className="text-xl font-bold">{deliveringAgents.length}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* View Tabs - Role-specific tabs */}
      {user?.role === 'hub_delivery' || user?.role === 'store_delivery' ? (
        // For delivery employees - show order-focused tabs
        <div className="flex gap-2 border-b overflow-x-auto">
          {[
            { id: 'all', label: 'My Orders', count: 3 },
            { id: 'delivering', label: 'In Progress', count: 2 },
            { id: 'available', label: 'Completed', count: 8 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as typeof activeView)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeView === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <Badge variant="bg-gray-100 text-gray-600">{tab.count}</Badge>
            </button>
          ))}
        </div>
      ) : (
        // For admins - show agent management tabs
        <div className="flex gap-2 border-b overflow-x-auto">
          {[
            { id: 'all', label: 'All Agents', count: filteredDeliveryAgents.length },
            { id: 'available', label: 'Available', count: availableAgents.length },
            { id: 'delivering', label: 'On Delivery', count: deliveringAgents.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as typeof activeView)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeView === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
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
            placeholder="Search by name, phone, or vehicle number..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="pl-10" 
          />
        </div>
      </Card>

      {/* Content based on role */}
      {user?.role === 'hub_delivery' || user?.role === 'store_delivery' ? (
        // For delivery employees - show simplified order-focused view
        <div className="space-y-4">
          {/* Mock delivery orders for the employee */}
          {[
            {
              id: 'ORD-2024-001',
              customerName: 'Rajesh Kumar',
              customerPhone: '+91 9876543220',
              deliveryAddress: '123, Anna Nagar, Chennai - 600040',
              orderValue: 850,
              estimatedTime: '15 mins',
              status: 'in_progress',
              currentLocation: 'Near Anna Nagar Tower'
            },
            {
              id: 'ORD-2024-005',
              customerName: 'Meena R',
              customerPhone: '+91 9876543225',
              deliveryAddress: '456, T. Nagar, Chennai - 600017',
              orderValue: 1200,
              estimatedTime: '25 mins',
              status: 'assigned',
              currentLocation: 'Starting delivery'
            }
          ].map(order => (
            <Card key={order.id} className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="p-3 bg-blue-100 rounded-full flex-shrink-0">
                    <Truck className="h-5 w-5 text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-base truncate">{order.id}</h3>
                      <Badge variant={order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'} className="flex items-center gap-1 text-xs flex-shrink-0">
                        <Truck className="h-3 w-3" />
                        {order.status === 'in_progress' ? 'In Progress' : 'Assigned'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{order.customerName}</span>
                      <span>₹{order.orderValue}</span>
                      <span>{order.estimatedTime}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">{order.deliveryAddress}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button 
                    onClick={() => window.open(`tel:${order.customerPhone}`, '_self')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                    title="Call Customer"
                  >
                    <Phone className="h-4 w-4 text-green-600" />
                  </button>
                  <button 
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors" 
                    title="View Details"
                  >
                    <Eye className="h-4 w-4 text-blue-600" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        // For admins - show full delivery agent management
        <div className="space-y-4">
          {getFilteredAgents().map(agent => {
            const StatusIcon = getStatusIcon(agent.status);
            const hasCurrentOrder = agent.currentOrder !== null;
            
            return (
              <Card key={agent.id} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  {/* Agent Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="p-3 bg-gray-100 rounded-full flex-shrink-0">
                      <Truck className="h-5 w-5 text-gray-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-base truncate">{agent.name}</h3>
                        <Badge variant={getStatusColor(agent.status)} className="flex items-center gap-1 text-xs flex-shrink-0">
                          <StatusIcon className="h-3 w-3" />
                          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{agent.phone}</span>
                        <span className="font-mono">{agent.vehicleNo}</span>
                        <span className="flex items-center gap-1">
                          ⭐ {agent.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Current Order Status */}
                  <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                    {hasCurrentOrder ? (
                      <div className="text-right">
                        <p className="text-sm font-medium text-blue-600">{agent.currentOrder?.orderId}</p>
                        <p className="text-xs text-gray-500 truncate max-w-32">{agent.currentOrder?.customerName}</p>
                        <p className="text-xs text-green-600">₹{agent.currentOrder?.orderValue}</p>
                      </div>
                    ) : (
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">Available</p>
                        <p className="text-xs text-gray-500">{agent.deliveries} deliveries</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {hasCurrentOrder && (
                      <>
                        <button 
                          onClick={() => handleCallCustomer(agent)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                          title="Call Customer"
                        >
                          <Phone className="h-4 w-4 text-green-600" />
                        </button>
                        <button 
                          onClick={() => handleTrackAgent(agent)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors" 
                          title="Track Live"
                        >
                          <Navigation className="h-4 w-4 text-blue-600" />
                        </button>
                      </>
                    )}
                    
                    {!hasCurrentOrder && canAssignOrders && (
                      <button 
                        onClick={() => handleAssignOrder(agent)}
                        className="p-2 hover:bg-green-100 rounded-lg transition-colors" 
                        title="Assign Order"
                      >
                        <Plus className="h-4 w-4 text-green-600" />
                      </button>
                    )}
                    
                    <button 
                      onClick={() => handleViewAgent(agent)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                      title="View Details"
                    >
                      <Eye className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Mobile Order Info */}
                {hasCurrentOrder && (
                  <div className="md:hidden mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">{agent.currentOrder?.orderId}</p>
                        <p className="text-xs text-gray-600">{agent.currentOrder?.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">₹{agent.currentOrder?.orderValue}</p>
                        <p className="text-xs text-blue-600">{agent.currentOrder?.estimatedTime}</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty state - Role-specific */}
      {user?.role === 'hub_delivery' || user?.role === 'store_delivery' ? (
        // For delivery employees - show order-focused empty state
        <Card className="p-12 text-center">
          <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders assigned</h3>
          <p className="text-gray-500 mb-4">You don't have any delivery orders at the moment</p>
        </Card>
      ) : getFilteredAgents().length === 0 && (
        <Card className="p-12 text-center">
          <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No delivery agents found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or view filter</p>
          {canManageAgents && (
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Delivery Agent
            </Button>
          )}
        </Card>
      )}

      {/* Add Delivery Agent Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Delivery Agent">
        <form onSubmit={handleAddAgent} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Full Name" 
              placeholder="Enter full name" 
              value={newAgent.name}
              onChange={e => setNewAgent({...newAgent, name: e.target.value})}
              required 
            />
            <Input 
              label="Phone" 
              placeholder="+91 9876543210" 
              value={newAgent.phone}
              onChange={e => setNewAgent({...newAgent, phone: e.target.value})}
              required 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Vehicle Number" 
              placeholder="TN 01 AB 1234" 
              value={newAgent.vehicleNo}
              onChange={e => setNewAgent({...newAgent, vehicleNo: e.target.value})}
              required
            />
            <Select 
              label="Vehicle Type" 
              value={newAgent.vehicleType}
              onChange={e => setNewAgent({...newAgent, vehicleType: e.target.value})}
              options={[
                { value: '', label: 'Select Vehicle Type' },
                { value: 'bike', label: 'Motorcycle' },
                { value: 'auto', label: 'Auto Rickshaw' },
                { value: 'van', label: 'Delivery Van' }
              ]} 
              required
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setShowAddModal(false)} 
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Delivery Agent
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Agent Modal */}
      <Modal 
        isOpen={showViewModal} 
        onClose={() => {
          setShowViewModal(false);
          setSelectedAgent(null);
        }} 
        title="Delivery Agent Details"
        size="lg"
      >
        {selectedAgent && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-orange-100 rounded-full">
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedAgent.name}</h3>
                <p className="text-gray-600 font-mono">{selectedAgent.vehicleNo}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={getStatusColor(selectedAgent.status)}>
                    {selectedAgent.status.charAt(0).toUpperCase() + selectedAgent.status.slice(1)}
                  </Badge>
                  <span className="text-sm text-gray-600">⭐ {selectedAgent.rating} Rating</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{selectedAgent.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle Number:</span>
                    <span className="font-mono">{selectedAgent.vehicleNo}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Performance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Deliveries:</span>
                    <span className="font-semibold">{selectedAgent.deliveries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-semibold text-yellow-600">⭐ {selectedAgent.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Order Information */}
            {selectedAgent.currentOrder && (
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Current Order Details</h4>
                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Order ID:</span>
                      <p className="font-medium text-blue-600">{selectedAgent.currentOrder.orderId}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Customer Name:</span>
                      <p className="font-medium">{selectedAgent.currentOrder.customerName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Customer Phone:</span>
                      <p className="font-medium">{selectedAgent.currentOrder.customerPhone}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Order Value:</span>
                      <p className="font-medium text-green-600">₹{selectedAgent.currentOrder.orderValue}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Delivery Address:</span>
                    <p className="font-medium text-sm mt-1">{selectedAgent.currentOrder.deliveryAddress}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Estimated Time:</span>
                      <p className="font-medium text-blue-600">{selectedAgent.currentOrder.estimatedTime}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Current Location:</span>
                      <p className="font-medium text-sm">{selectedAgent.currentOrder.currentLocation}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t">
              <Button 
                variant="secondary"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedAgent(null);
                }}
                className="flex-1"
              >
                Close
              </Button>
              {selectedAgent.currentOrder && (
                <Button 
                  onClick={() => {
                    setShowViewModal(false);
                    handleTrackAgent(selectedAgent);
                  }}
                  className="flex-1"
                >
                  Track Live
                </Button>
              )}
              {canManageAgents && (
                <Button 
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditAgent(selectedAgent);
                  }}
                  className="flex-1"
                >
                  Edit Agent
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Agent Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => {
          setShowEditModal(false);
          setSelectedAgent(null);
        }} 
        title="Edit Delivery Agent"
      >
        {selectedAgent && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Full Name" 
                defaultValue={selectedAgent.name}
                placeholder="Enter full name" 
              />
              <Input 
                label="Phone" 
                defaultValue={selectedAgent.phone}
                placeholder="+91 9876543210" 
              />
            </div>
            
            <Input 
              label="Vehicle Number" 
              defaultValue={selectedAgent.vehicleNo}
              placeholder="TN 01 AB 1234" 
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={selectedAgent.status}
              >
                <option value="available">Available</option>
                <option value="delivering">Delivering</option>
                <option value="returning">Returning</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                defaultChecked={selectedAgent.isActive}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Active Agent</span>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedAgent(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  console.log('Update agent:', selectedAgent.id);
                  setShowEditModal(false);
                  setSelectedAgent(null);
                }}
                className="flex-1"
              >
                Update Agent
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Assign Order Modal */}
      <Modal 
        isOpen={showAssignOrderModal} 
        onClose={() => {
          setShowAssignOrderModal(false);
          setSelectedAgent(null);
        }} 
        title={`Assign Order to ${selectedAgent?.name}`}
      >
        {selectedAgent && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Agent Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium">{selectedAgent.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Vehicle:</span>
                  <p className="font-medium">{selectedAgent.vehicleNo}</p>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p className="font-medium">{selectedAgent.phone}</p>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={getStatusColor(selectedAgent.status)} className="text-xs">
                    {selectedAgent.status.charAt(0).toUpperCase() + selectedAgent.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
              <Input 
                placeholder="Search by Order ID, Customer Name, or Phone..." 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Order</label>
              <Select 
                options={[
                  { value: '', label: 'Select an order to assign' },
                  { value: 'ORD-2024-004', label: 'ORD-2024-004 - Anand Kumar - ₹950' },
                  { value: 'ORD-2024-005', label: 'ORD-2024-005 - Meena R - ₹1200' },
                  { value: 'ORD-2024-006', label: 'ORD-2024-006 - Raju S - ₹750' }
                ]} 
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowAssignOrderModal(false);
                  setSelectedAgent(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  console.log('Assign order to agent:', selectedAgent.id);
                  setShowAssignOrderModal(false);
                  setSelectedAgent(null);
                }}
                className="flex-1"
              >
                Assign Order
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Track Agent Modal */}
      <Modal 
        isOpen={showTrackModal} 
        onClose={() => {
          setShowTrackModal(false);
          setSelectedAgent(null);
        }} 
        title={`Track ${selectedAgent?.name}`}
        size="lg"
      >
        {selectedAgent && (
          <div className="space-y-6">
            {selectedAgent.currentOrder ? (
              <>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Current Delivery</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Order ID:</span>
                        <p className="font-medium text-blue-600">{selectedAgent.currentOrder.orderId}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Customer:</span>
                        <p className="font-medium">{selectedAgent.currentOrder.customerName}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Customer Phone:</span>
                        <p className="font-medium">{selectedAgent.currentOrder.customerPhone}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Order Value:</span>
                        <p className="font-medium text-green-600">₹{selectedAgent.currentOrder.orderValue}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Delivery Address:</span>
                      <p className="font-medium text-sm mt-1">{selectedAgent.currentOrder.deliveryAddress}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Estimated Time:</span>
                        <p className="font-medium text-blue-600">{selectedAgent.currentOrder.estimatedTime}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Current Location:</span>
                        <p className="font-medium text-sm">{selectedAgent.currentOrder.currentLocation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                    <Navigation className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Live Tracking</h4>
                  <p className="text-gray-600 mb-4">Real-time location tracking would be displayed here</p>
                  <div className="text-sm text-gray-500">
                    <p>📍 {selectedAgent.currentOrder.currentLocation}</p>
                    <p>⏱️ ETA: {selectedAgent.currentOrder.estimatedTime}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleCallCustomer(selectedAgent)}
                    className="flex-1 flex items-center justify-center gap-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    Call Customer
                  </button>
                  <Button 
                    variant="secondary"
                    onClick={() => {
                      setShowTrackModal(false);
                      setSelectedAgent(null);
                    }}
                    className="flex-1"
                  >
                    Close Tracking
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="font-medium text-gray-900 mb-2">No Active Delivery</h4>
                <p className="text-gray-600 mb-4">This agent is currently available for assignments</p>
                <Button 
                  onClick={() => {
                    setShowTrackModal(false);
                    handleAssignOrder(selectedAgent);
                  }}
                >
                  Assign New Order
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
