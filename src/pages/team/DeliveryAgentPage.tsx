import { useAuth } from "../../context/AuthContext";
import { Card, Button, Modal } from "../../components/ui";
import { DeliveryAgentsList, DeliveryAgentForm, BatchOrderAssignment, BatchOrdersView } from "../../components/features/team";
import {
  Truck,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Star,
  User,
  Package,
} from "lucide-react";
import { useState } from "react";

interface DeliveryOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  orderValue: number;
  estimatedTime: string;
  status: "assigned" | "picked_up" | "in_transit" | "delivered";
}

export function DeliveryAgentPage() {
  const { user } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'agents' | 'batches'>('agents');

  // Check if user is delivery employee or admin
  const isDeliveryEmployee =
    user?.role === "hub_delivery" || user?.role === "store_delivery";
  const isAdmin =
    user?.role === "hub_main_admin" || user?.role === "store_main_admin" || user?.role === "super_admin";

  // Mock delivery orders for delivery employees
  const myDeliveryOrders: DeliveryOrder[] = [
    {
      id: "ORD-001",
      customerName: "Rajesh Kumar",
      customerPhone: "+91 9876543210",
      deliveryAddress: "123 Anna Nagar, Chennai - 600040",
      orderValue: 850,
      estimatedTime: "2:30 PM",
      status: "assigned",
    },
    {
      id: "ORD-002",
      customerName: "Priya Sharma",
      customerPhone: "+91 9876543211",
      deliveryAddress: "456 T Nagar, Chennai - 600017",
      orderValue: 1200,
      estimatedTime: "3:15 PM",
      status: "picked_up",
    },
    {
      id: "ORD-003",
      customerName: "Arjun Patel",
      customerPhone: "+91 9876543212",
      deliveryAddress: "789 Velachery, Chennai - 600042",
      orderValue: 650,
      estimatedTime: "4:00 PM",
      status: "in_transit",
    },
  ];

  // Mock delivery agents for admins
  const deliveryAgents = [
    {
      id: "DA-001",
      name: "Suresh Kumar",
      phone: "+91 9876543220",
      vehicleNo: "TN 01 AB 1234",
      vehicleType: "bike",
      rating: 4.8,
      deliveries: 156,
      status: "available" as const,
      currentOrders: 0,
      isActive: true,
    },
    {
      id: "DA-002",
      name: "Ramesh Singh",
      phone: "+91 9876543221",
      vehicleNo: "TN 01 CD 5678",
      vehicleType: "auto",
      rating: 4.6,
      deliveries: 142,
      status: "delivering" as const,
      currentOrders: 2,
      isActive: true,
    },
    {
      id: "DA-003",
      name: "Vijay Raj",
      phone: "+91 9876543222",
      vehicleNo: "TN 01 EF 9012",
      vehicleType: "van",
      rating: 4.9,
      deliveries: 189,
      status: "available" as const,
      currentOrders: 0,
      isActive: true,
    },
    {
      id: "DA-004",
      name: "Kumar Patel",
      phone: "+91 9876543223",
      vehicleNo: "TN 01 GH 3456",
      vehicleType: "bike",
      rating: 4.5,
      deliveries: 98,
      status: "offline" as const,
      currentOrders: 0,
      isActive: false,
    },
  ];

  // Mock pending orders for batch assignment
  const pendingOrders = [
    {
      id: "ORD-101",
      customerName: "Rajesh Kumar",
      deliveryAddress: "123 Anna Nagar, Chennai - 600040",
      orderValue: 850,
      estimatedTime: "2:30 PM",
    },
    {
      id: "ORD-102",
      customerName: "Priya Sharma",
      deliveryAddress: "456 T Nagar, Chennai - 600017",
      orderValue: 1200,
      estimatedTime: "3:00 PM",
    },
    {
      id: "ORD-103",
      customerName: "Arjun Patel",
      deliveryAddress: "789 Velachery, Chennai - 600042",
      orderValue: 650,
      estimatedTime: "3:30 PM",
    },
  ];

  // Mock batch assignments
  const batchAssignments = [
    {
      id: "BATCH-001",
      agentName: "Suresh Kumar",
      agentPhone: "+91 9876543220",
      assignedAt: "Today, 10:30 AM",
      totalValue: 2700,
      orders: [
        {
          id: "ORD-091",
          customerName: "Amit Singh",
          deliveryAddress: "12 MG Road, Chennai",
          orderValue: 900,
          estimatedTime: "11:00 AM",
          status: "delivered",
        },
        {
          id: "ORD-092",
          customerName: "Neha Gupta",
          deliveryAddress: "45 Park Street, Chennai",
          orderValue: 1200,
          estimatedTime: "11:30 AM",
          status: "in_transit",
        },
        {
          id: "ORD-093",
          customerName: "Ravi Kumar",
          deliveryAddress: "78 Lake View, Chennai",
          orderValue: 600,
          estimatedTime: "12:00 PM",
          status: "assigned",
        },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
        return "bg-blue-100 text-blue-700";
      case "picked_up":
        return "bg-yellow-100 text-yellow-700";
      case "in_transit":
        return "bg-purple-100 text-purple-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "available":
        return "bg-green-100 text-green-700";
      case "delivering":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "assigned":
        return <Clock className="h-4 w-4" />;
      case "picked_up":
        return <Truck className="h-4 w-4" />;
      case "in_transit":
        return <MapPin className="h-5 w-5" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "available":
        return <CheckCircle className="h-4 w-4" />;
      case "delivering":
        return <Truck className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (isDeliveryEmployee) {
    // Delivery Employee View - My Delivery Orders
    return (
      <div className="p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            My Delivery Orders
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            View and manage your assigned delivery orders
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Assigned Orders</p>
                <p className="text-2xl font-bold text-blue-600">3</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-green-600">8</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-orange-600">2</p>
              </div>
              <Truck className="h-8 w-8 text-orange-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-purple-600">₹2,450</p>
              </div>
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Delivery Orders List */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Today's Deliveries</h2>
            <div className="space-y-4">
              {myDeliveryOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">
                        {order.id}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      ₹{order.orderValue}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Customer</p>
                      <p className="font-medium">{order.customerName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {order.customerPhone}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Delivery Address
                      </p>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <span className="text-sm text-gray-700">
                          {order.deliveryAddress}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        ETA: {order.estimatedTime}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary">
                        <Phone className="h-5 w-5 mr-1" />
                        Call
                      </Button>
                      <Button size="sm">
                        <MapPin className="h-5 w-5 mr-1" />
                        Navigate
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Bulk actions handler for delivery agents
  const handleAgentBulkAction = async (actionId: string, selectedIds: string[], data?: any) => {
    try {
      switch (actionId) {
        case 'activate':
          console.log(`Activating ${selectedIds.length} delivery agents:`, selectedIds);
          // API call to activate agents
          break;
        case 'deactivate':
          console.log(`Deactivating ${selectedIds.length} delivery agents:`, selectedIds);
          // API call to deactivate agents
          break;
        case 'delete':
          console.log(`Deleting ${selectedIds.length} delivery agents:`, selectedIds);
          // API call to delete agents
          break;
        default:
          console.log(`Bulk action ${actionId} performed on ${selectedIds.length} delivery agents`, data);
      }
    } catch (error) {
      console.error('Delivery agent bulk action failed:', error);
      alert('Bulk action failed. Please try again.');
    }
  };

  const handleViewAgent = (agent: any) => {
    setSelectedAgent(agent);
    setShowViewModal(true);
  };

  const handleEditAgent = (agent: any) => {
    setSelectedAgent(agent);
    setShowFormModal(true);
  };

  const handleDeleteAgent = (agent: any) => {
    if (confirm(`Are you sure you want to delete ${agent.name}?`)) {
      console.log('Delete agent:', agent.id);
      // API call to delete agent
    }
  };

  const handleCallAgent = (agent: any) => {
    window.location.href = `tel:${agent.phone}`;
  };

  const handleTrackAgent = (agent: any) => {
    alert(`Tracking ${agent.name} - Location feature will open map view`);
    console.log('Track agent:', agent);
  };

  const handleCreateAgent = (data: any) => {
    console.log('Create agent:', data);
    setShowFormModal(false);
    setSelectedAgent(null);
  };

  const handleBatchAssign = (agentId: string, orderIds: string[]) => {
    console.log('Assign orders:', orderIds, 'to agent:', agentId);
    setShowBatchModal(false);
  };

  // Admin View - Delivery Agent Management
  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 truncate">
            Delivery Agent Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage delivery agents and track their performance
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-2 w-full sm:w-auto">
            <Button onClick={() => setShowBatchModal(true)} variant="secondary" className="flex-1 sm:flex-initial">
              <Package className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Batch Assign</span>
              <span className="sm:hidden">Batch</span>
            </Button>
            <Button className="flex-1 sm:flex-initial" onClick={() => setShowFormModal(true)}>
              <Plus className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Add Agent</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('agents')}
          className={`pb-3 px-1 font-medium transition-colors ${
            activeTab === 'agents'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Delivery Agents
        </button>
        <button
          onClick={() => setActiveTab('batches')}
          className={`pb-3 px-1 font-medium transition-colors ${
            activeTab === 'batches'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Batch Assignments
        </button>
      </div>

      {/* Content */}
      {activeTab === 'agents' ? (
        <DeliveryAgentsList
          agents={deliveryAgents}
          onView={handleViewAgent}
          onEdit={handleEditAgent}
          onDelete={handleDeleteAgent}
          onCall={handleCallAgent}
          onTrack={handleTrackAgent}
          onBulkAction={handleAgentBulkAction}
        />
      ) : (
        <BatchOrdersView batches={batchAssignments} />
      )}

      {/* View Agent Modal */}
      <Modal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)}
        title="Delivery Agent Details"
      >
        {selectedAgent && (
          <div className="space-y-6">
            {/* Agent Header */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {selectedAgent.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{selectedAgent.name}</h3>
                <p className="text-gray-600">{selectedAgent.vehicleNo}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    selectedAgent.status === 'available' ? 'bg-green-100 text-green-800' :
                    selectedAgent.status === 'delivering' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedAgent.status === 'available' && <CheckCircle className="h-3 w-3" />}
                    {selectedAgent.status === 'delivering' && <Truck className="h-3 w-3" />}
                    {selectedAgent.status === 'offline' && <Clock className="h-3 w-3" />}
                    {selectedAgent.status.charAt(0).toUpperCase() + selectedAgent.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Agent Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Phone Number</span>
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">{selectedAgent.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Vehicle Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Vehicle Number</span>
                    <span className="font-medium">{selectedAgent.vehicleNo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Vehicle Type</span>
                    <span className="font-medium capitalize">{selectedAgent.vehicleType}</span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Performance
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{selectedAgent.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Deliveries</span>
                    <span className="font-medium">{selectedAgent.deliveries}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Current Orders</span>
                    <span className="font-medium">{selectedAgent.currentOrders}</span>
                  </div>
                </div>
              </div>

              {/* Status Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Status
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Current Status</span>
                    <span className="font-medium capitalize">{selectedAgent.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Account Status</span>
                    <span className={`font-medium ${selectedAgent.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedAgent.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button 
                onClick={() => handleCallAgent(selectedAgent)}
                className="flex-1"
                variant="secondary"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Agent
              </Button>
              <Button 
                onClick={() => handleTrackAgent(selectedAgent)}
                className="flex-1"
              >
                <MapPin className="h-5 w-5 mr-2" />
                Track Location
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create/Edit Agent Modal */}
      <Modal 
        isOpen={showFormModal} 
        onClose={() => {
          setShowFormModal(false);
          setSelectedAgent(null);
        }}
        title={selectedAgent ? "Edit Delivery Agent" : "Add New Delivery Agent"}
      >
        <DeliveryAgentForm
          onSubmit={handleCreateAgent}
          onCancel={() => {
            setShowFormModal(false);
            setSelectedAgent(null);
          }}
          initialData={selectedAgent}
        />
      </Modal>

      {/* Batch Order Assignment Modal */}
      <Modal 
        isOpen={showBatchModal} 
        onClose={() => setShowBatchModal(false)}
        title="Batch Order Assignment"
      >
        <BatchOrderAssignment
          agents={deliveryAgents}
          orders={pendingOrders}
          onAssign={handleBatchAssign}
          onCancel={() => setShowBatchModal(false)}
        />
      </Modal>
    </div>
  );
}
