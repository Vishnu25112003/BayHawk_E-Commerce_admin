import { useState } from 'react';
import { Card, Button, Input, Badge } from '../../components/ui';
import { Search, Truck, Phone, MapPin, Star, Package, Eye, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { filterDataByModule } from '../../utils/rbac';

const mockDeliveryAgents = [
  { 
    id: '1', 
    name: 'Suresh Kumar', 
    phone: '+91 9876543220', 
    vehicleNo: 'TN 01 AB 1234', 
    agentType: 'employee' as const,
    rating: 4.8, 
    deliveries: 156, 
    status: 'available' as const,
    moduleType: 'hub' as const,
    hubId: 'hub_1',
    orderHistory: [
      { orderId: 'ORD-001', date: '2024-01-20', amount: 850, status: 'delivered' },
      { orderId: 'ORD-045', date: '2024-01-19', amount: 1200, status: 'delivered' },
    ]
  },
  { 
    id: '2', 
    name: 'Ramesh Singh', 
    phone: '+91 9876543221', 
    vehicleNo: 'TN 02 CD 5678', 
    agentType: 'partner' as const,
    rating: 4.6, 
    deliveries: 142, 
    status: 'delivering' as const,
    moduleType: 'hub' as const,
    hubId: 'hub_1',
    orderHistory: [
      { orderId: 'ORD-023', date: '2024-01-20', amount: 950, status: 'in_transit' },
    ]
  },
  { 
    id: '3', 
    name: 'Vijay Raj', 
    phone: '+91 9876543222', 
    vehicleNo: 'TN 01 EF 9012', 
    agentType: 'employee' as const,
    rating: 4.9, 
    deliveries: 199, 
    status: 'available' as const,
    moduleType: 'store' as const,
    storeId: 'store_1',
    orderHistory: [
      { orderId: 'ORD-067', date: '2024-01-20', amount: 750, status: 'delivered' },
      { orderId: 'ORD-068', date: '2024-01-20', amount: 1100, status: 'delivered' },
    ]
  },
  { 
    id: '4', 
    name: 'Kumar Patel', 
    phone: '+91 9876543223', 
    vehicleNo: 'TN 03 GH 3456', 
    agentType: 'partner' as const,
    rating: 4.5, 
    deliveries: 98, 
    status: 'offline' as const,
    moduleType: 'store' as const,
    storeId: 'store_1',
    orderHistory: []
  },
];

export function DeliveryAgentPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredAgents = filterDataByModule(mockDeliveryAgents, user).filter(agent =>
    agent.name.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === '' || agent.status === statusFilter)
  );

  const stats = {
    total: filteredAgents.length,
    available: filteredAgents.filter(a => a.status === 'available').length,
    delivering: filteredAgents.filter(a => a.status === 'delivering').length,
    offline: filteredAgents.filter(a => a.status === 'offline').length,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Delivery Agent Management</h1>
        <p className="text-gray-600 mt-1">Manage delivery agents and track their performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Truck className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Agents</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold">{stats.available}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-orange-500" />
            <div>
              <p className="text-sm text-gray-600">On Delivery</p>
              <p className="text-2xl font-bold">{stats.delivering}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Offline</p>
              <p className="text-2xl font-bold">{stats.offline}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="delivering">Delivering</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {/* Agents List */}
      <div className="space-y-3">
        {filteredAgents.map(agent => (
          <Card key={agent.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg font-semibold text-blue-600">
                    {agent.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{agent.name}</h3>
                    <Badge variant={agent.status === 'available' ? 'success' : agent.status === 'delivering' ? 'warning' : 'default'}>
                      {agent.status}
                    </Badge>
                    <Badge variant={agent.agentType === 'employee' ? 'info' : 'default'}>
                      {agent.agentType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {agent.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {agent.vehicleNo}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {agent.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {agent.deliveries} deliveries
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setSelectedAgent(agent);
                    setShowDetails(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="secondary">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="secondary">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Details Modal */}
      {showDetails && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Delivery Agent Details</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Agent Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium">{selectedAgent.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium">{selectedAgent.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Vehicle Number</p>
                    <p className="font-medium">{selectedAgent.vehicleNo}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Agent Type</p>
                    <p className="font-medium capitalize">{selectedAgent.agentType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rating</p>
                    <p className="font-medium">{selectedAgent.rating} ⭐</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Deliveries</p>
                    <p className="font-medium">{selectedAgent.deliveries}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Order History</h3>
                {selectedAgent.orderHistory.length > 0 ? (
                  <div className="space-y-2">
                    {selectedAgent.orderHistory.map((order: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{order.orderId}</p>
                          <p className="text-sm text-gray-600">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{order.amount}</p>
                          <Badge variant={order.status === 'delivered' ? 'success' : 'warning'}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No delivery history available</p>
                )}
              </div>
            </div>
            <div className="p-6 border-t">
              <Button onClick={() => setShowDetails(false)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
