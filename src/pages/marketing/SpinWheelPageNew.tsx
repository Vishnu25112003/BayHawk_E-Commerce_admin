import { useState } from "react";
import { Card, Button, Select } from "../../components/ui";
import {
  Plus,
  Search,
  RotateCcw,
  TrendingUp,
  Users,
  Target,
} from "lucide-react";
import { MarketingList } from "../../components/marketing/MarketingList";

interface SpinWheel {
  id: string;
  title: string;
  type: string;
  status: "active" | "inactive" | "scheduled" | "expired";
  description: string;
  stats: {
    label: string;
    value: string | number;
  }[];
  validFrom: string;
  validTo: string;
  createdAt: string;
}

export function SpinWheelPageNew() {
  const [spinWheels, setSpinWheels] = useState<SpinWheel[]>([
    {
      id: "1",
      title: "Lucky Spin Wheel",
      type: "Spin Wheel",
      status: "active",
      description: "Daily spin wheel with exciting prizes and discounts",
      stats: [
        { label: "Total Spins", value: "5,234" },
        { label: "Win Rate", value: "72%" },
        { label: "Total Rewards", value: "₹67,800" },
      ],
      validFrom: "2026-01-01",
      validTo: "2026-06-30",
      createdAt: "2026-01-01",
    },
    {
      id: "2",
      title: "Weekend Special Wheel",
      type: "Spin Wheel",
      status: "scheduled",
      description: "Weekend exclusive spin wheel with premium rewards",
      stats: [
        { label: "Total Spins", value: "0" },
        { label: "Win Rate", value: "0%" },
        { label: "Total Rewards", value: "₹0" },
      ],
      validFrom: "2026-02-01",
      validTo: "2026-02-28",
      createdAt: "2026-01-15",
    },
  ]);

  const handleView = (id: string) => {
    alert(`Viewing spin wheel details for ID: ${id}`);
  };

  const handleEdit = (id: string) => {
    alert(`Editing spin wheel with ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this spin wheel?")) {
      setSpinWheels((prev) => prev.filter((wheel) => wheel.id !== id));
      alert("Spin wheel deleted successfully!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Spin Wheel Management</h1>
          <p className="text-gray-600">
            Create and manage spin wheel campaigns
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Spin Wheel
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search spin wheels..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <Select
            options={[
              { value: "", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "scheduled", label: "Scheduled" },
              { value: "expired", label: "Expired" },
            ]}
          />
        </div>
      </Card>

      {/* Spin Wheels List */}
      <MarketingList
        items={spinWheels}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Wheels</p>
              <p className="text-2xl font-bold">{spinWheels.length}</p>
            </div>
            <RotateCcw className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Wheels</p>
              <p className="text-2xl font-bold">
                {spinWheels.filter((w) => w.status === "active").length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spins</p>
              <p className="text-2xl font-bold">5,234</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Rewards</p>
              <p className="text-2xl font-bold">₹67,800</p>
            </div>
            <Target className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>
    </div>
  );
}
