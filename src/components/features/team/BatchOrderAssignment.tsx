import { useState } from 'react';
import { Card, Button } from '../../ui';
import { CheckSquare, Square, Package, MapPin, Clock, User } from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  deliveryAddress: string;
  orderValue: number;
  estimatedTime: string;
}

interface BatchOrderAssignmentProps {
  agents: any[];
  orders: Order[];
  onAssign: (agentId: string, orderIds: string[]) => void;
  onCancel: () => void;
}

export function BatchOrderAssignment({ agents, orders, onAssign, onCancel }: BatchOrderAssignmentProps) {
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const toggleOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const handleAssign = () => {
    if (selectedAgent && selectedOrders.length > 0) {
      onAssign(selectedAgent, selectedOrders);
    }
  };

  const availableAgents = agents.filter(a => a.status === 'available' || a.status === 'delivering');

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Delivery Agent</label>
        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Choose an agent...</option>
          {availableAgents.map(agent => (
            <option key={agent.id} value={agent.id}>
              {agent.name} - {agent.vehicleType} ({agent.currentOrders} orders)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Orders ({selectedOrders.length} selected)
        </label>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {orders.map(order => (
            <Card
              key={order.id}
              className={`p-3 cursor-pointer transition-colors ${
                selectedOrders.includes(order.id) ? 'bg-blue-50 border-blue-300' : ''
              }`}
              onClick={() => toggleOrder(order.id)}
            >
              <div className="flex items-start gap-3">
                <div className="pt-1">
                  {selectedOrders.includes(order.id) ? (
                    <CheckSquare className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Square className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900">{order.id}</span>
                    <span className="text-green-600 font-semibold">₹{order.orderValue}</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{order.deliveryAddress}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>ETA: {order.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button
          onClick={handleAssign}
          disabled={!selectedAgent || selectedOrders.length === 0}
          className="flex-1"
        >
          <Package className="h-5 w-5 mr-2" />
          Assign {selectedOrders.length} Orders
        </Button>
        <Button variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
}
