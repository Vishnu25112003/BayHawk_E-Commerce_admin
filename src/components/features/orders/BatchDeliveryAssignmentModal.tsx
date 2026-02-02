import { useState, useEffect } from 'react';
import { X, Truck, DollarSign } from 'lucide-react';

interface BatchDeliveryAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { agentId: string; pricePerOrder?: number }) => void;
  orderCount: number;
  agents: Array<{ id: string; name: string; agentType: 'employee' | 'partner' }>;
}

export function BatchDeliveryAssignmentModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  orderCount,
  agents 
}: BatchDeliveryAssignmentModalProps) {
  const [selectedAgent, setSelectedAgent] = useState('');
  const [pricePerOrder, setPricePerOrder] = useState('');
  const [selectedAgentType, setSelectedAgentType] = useState<'employee' | 'partner' | null>(null);

  useEffect(() => {
    if (selectedAgent) {
      const agent = agents.find(a => a.id === selectedAgent);
      setSelectedAgentType(agent?.agentType || null);
      if (agent?.agentType === 'employee') {
        setPricePerOrder('');
      }
    }
  }, [selectedAgent, agents]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      agentId: selectedAgent,
      pricePerOrder: selectedAgentType === 'partner' ? parseFloat(pricePerOrder) : undefined
    });
    setSelectedAgent('');
    setPricePerOrder('');
    onClose();
  };

  const totalAmount = selectedAgentType === 'partner' && pricePerOrder 
    ? parseFloat(pricePerOrder) * orderCount 
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Assign Batch Delivery</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">{orderCount}</span> orders selected for batch delivery
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Delivery Agent
            </label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose agent...</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} ({agent.agentType === 'employee' ? 'Employee' : 'Partner'})
                </option>
              ))}
            </select>
          </div>

          {selectedAgentType === 'partner' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  Price Per Order
                </label>
                <input
                  type="number"
                  value={pricePerOrder}
                  onChange={(e) => setPricePerOrder(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter price per order"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {pricePerOrder && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-green-700">Total Partner Payment:</span>
                    <span className="font-semibold text-green-900">
                      ₹{totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    {orderCount} orders × ₹{parseFloat(pricePerOrder).toFixed(2)}
                  </p>
                </div>
              )}
            </>
          )}

          {selectedAgentType === 'employee' && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-600">
                No pricing required for employee delivery agents
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Assign Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
