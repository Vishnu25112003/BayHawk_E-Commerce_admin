import { Card, Badge } from '../../ui';
import { Package, MapPin, Clock, User } from 'lucide-react';

interface BatchOrder {
  id: string;
  customerName: string;
  deliveryAddress: string;
  orderValue: number;
  estimatedTime: string;
  status: string;
}

interface AgentBatch {
  id: string;
  agentName: string;
  agentPhone: string;
  assignedAt: string;
  orders: BatchOrder[];
  totalValue: number;
}

interface BatchOrdersViewProps {
  batches: AgentBatch[];
}

export function BatchOrdersView({ batches }: BatchOrdersViewProps) {
  return (
    <div className="space-y-4">
      {batches.map(batch => (
        <Card key={batch.id} className="p-4">
          <div className="flex items-center justify-between mb-4 pb-3 border-b">
            <div>
              <h3 className="font-semibold text-gray-900">{batch.agentName}</h3>
              <p className="text-sm text-gray-600">{batch.agentPhone}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-lg font-bold text-green-600">₹{batch.totalValue}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {batch.orders.length} Orders
              </span>
              <span className="text-xs text-gray-500">Assigned: {batch.assignedAt}</span>
            </div>
            {batch.orders.map(order => (
              <div key={order.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{order.id}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="bg-blue-100 text-blue-800">
                      {order.status}
                    </Badge>
                    <span className="text-green-600 font-semibold">₹{order.orderValue}</span>
                  </div>
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
            ))}
          </div>
        </Card>
      ))}

      {batches.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No batch assignments</h3>
          <p className="text-gray-500">Assign orders to delivery agents to see them here</p>
        </Card>
      )}
    </div>
  );
}
