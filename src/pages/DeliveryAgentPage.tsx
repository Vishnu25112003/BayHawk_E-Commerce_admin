import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card, Button } from "../components/ui";
import {
  Truck,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
} from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Check if user is delivery employee or admin
  const isDeliveryEmployee =
    user?.role === "hub_delivery" || user?.role === "store_delivery";
  const isAdmin =
    user?.role === "hub_main_admin" || user?.role === "store_main_admin";

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
      rating: 4.8,
      deliveries: 156,
      status: "available",
      currentOrders: 0,
    },
    {
      id: "DA-002",
      name: "Ramesh Singh",
      phone: "+91 9876543221",
      vehicleNo: "TN 01 CD 5678",
      rating: 4.6,
      deliveries: 142,
      status: "delivering",
      currentOrders: 2,
    },
    {
      id: "DA-003",
      name: "Vijay Raj",
      phone: "+91 9876543222",
      vehicleNo: "TN 01 EF 9012",
      rating: 4.9,
      deliveries: 189,
      status: "available",
      currentOrders: 0,
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
        return <MapPin className="h-4 w-4" />;
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
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            My Delivery Orders
          </h1>
          <p className="text-gray-600">
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
                        <Phone className="h-4 w-4 text-gray-400" />
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
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
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
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                      <Button size="sm">
                        <MapPin className="h-4 w-4 mr-1" />
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

  // Admin View - Delivery Agent Management
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Delivery Agent Management
          </h1>
          <p className="text-gray-600">
            Manage delivery agents and track their performance
          </p>
        </div>
        {isAdmin && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Agent
          </Button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="delivering">Delivering</option>
        </select>
      </div>

      {/* Delivery Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deliveryAgents.map((agent) => (
          <Card key={agent.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {agent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                  <p className="text-sm text-gray-600">{agent.vehicleNo}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(agent.status)}`}
              >
                {getStatusIcon(agent.status)}
                {agent.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Phone</span>
                <span className="text-sm font-medium">{agent.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rating</span>
                <span className="text-sm font-medium">⭐ {agent.rating}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Deliveries</span>
                <span className="text-sm font-medium">{agent.deliveries}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Orders</span>
                <span className="text-sm font-medium">
                  {agent.currentOrders}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <Button size="sm" variant="secondary" className="flex-1">
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
              <Button size="sm" className="flex-1">
                <MapPin className="h-4 w-4 mr-1" />
                Track
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
