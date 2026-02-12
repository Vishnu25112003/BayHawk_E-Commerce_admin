import { useState, useEffect } from "react";
import { Button, Select } from "../../ui";
import { Truck, User, Phone, Star } from "lucide-react";
import type { DeliveryAgent } from "../../../types";

interface DeliveryPartnerAssignmentProps {
  orderId: string;
  currentAgentId?: string;
  onAssign: (agentId: string) => Promise<void>;
  className?: string;
}

export function DeliveryPartnerAssignment({
  currentAgentId,
  onAssign,
  className = "",
}: DeliveryPartnerAssignmentProps) {
  const [agents, setAgents] = useState<DeliveryAgent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState(currentAgentId || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API call
    setAgents([
      {
        id: "1",
        name: "Raj Kumar",
        phone: "9876543210",
        vehicleNo: "TN01AB1234",
        agentType: "employee",
        rating: 4.5,
        deliveries: 120,
        isActive: true,
        status: "available",
      },
      {
        id: "2",
        name: "Suresh M",
        phone: "9876543211",
        vehicleNo: "TN02CD5678",
        agentType: "partner",
        rating: 4.8,
        deliveries: 85,
        isActive: true,
        status: "available",
      },
      {
        id: "3",
        name: "Karthik S",
        phone: "9876543212",
        vehicleNo: "TN03EF9012",
        agentType: "employee",
        rating: 4.2,
        deliveries: 95,
        isActive: true,
        status: "delivering",
      },
    ]);
  }, []);

  const handleAssign = async () => {
    if (!selectedAgentId) return;
    setLoading(true);
    try {
      await onAssign(selectedAgentId);
    } finally {
      setLoading(false);
    }
  };

  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}
    >
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Truck className="h-5 w-5 text-blue-600" />
        Assign Delivery Partner
      </h3>

      <div className="space-y-4">
        <Select
          label="Select Delivery Agent"
          value={selectedAgentId}
          onChange={(e) => setSelectedAgentId(e.target.value)}
          options={[
            { value: "", label: "Select an agent" },
            ...agents.map((agent) => ({
              value: agent.id,
              label: `${agent.name} - ${agent.status === "available" ? "✓ Available" : "⚠ Busy"}`,
            })),
          ]}
        />

        {selectedAgent && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-600" />
              <span className="font-medium">{selectedAgent.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {selectedAgent.agentType}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              {selectedAgent.phone}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck className="h-4 w-4" />
              {selectedAgent.vehicleNo}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="h-4 w-4 text-yellow-500" />
              {selectedAgent.rating} ({selectedAgent.deliveries} deliveries)
            </div>
          </div>
        )}

        <Button
          onClick={handleAssign}
          disabled={!selectedAgentId || loading}
          className="w-full"
        >
          {loading
            ? "Assigning..."
            : currentAgentId
              ? "Update Assignment"
              : "Assign Agent"}
        </Button>
      </div>
    </div>
  );
}
