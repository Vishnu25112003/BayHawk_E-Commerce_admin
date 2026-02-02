import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { filterDataByModule } from "../../utils/rbac";
import { Search, Filter, Download } from "lucide-react";
import type { Order } from "../../types";

// Mock data
const mockOrders: Order[] = [
  {
    id: "HUB001",
    customerId: "C001",
    customerName: "John Doe",
    customerPhone: "+91 9876543210",
    source: "app",
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "online",
    items: [
      {
        productId: "P001",
        productName: "Fresh Pomfret",
        variant: "500g",
        quantity: 2,
        price: 450,
      },
    ],
    totalAmount: 900,
    deliverySlot: "6 AM - 8 AM",
    hubId: "hub_1",
    moduleType: "hub",
    orderType: "regular",
    createdAt: "2026-01-08T10:30:00Z",
  },
  {
    id: "STORE001",
    customerId: "C002",
    customerName: "Jane Smith",
    customerPhone: "+91 9876543211",
    source: "website",
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "cod",
    items: [
      {
        productId: "P002",
        productName: "Chicken Breast",
        variant: "1kg",
        quantity: 1,
        price: 280,
      },
    ],
    totalAmount: 280,
    deliverySlot: "8 AM - 10 AM",
    storeId: "store_1",
    moduleType: "store",
    orderType: "regular",
    createdAt: "2026-01-08T09:15:00Z",
  },
];

export default function HubOrdersPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = filterDataByModule(mockOrders, user).filter(
    (order: Order) => {
      const matchesSearch =
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    },
  );

  const getStatusColor = (status: string) => {
    const colors = {
      received: "bg-blue-100 text-blue-700",
      processing: "bg-yellow-100 text-yellow-700",
      packed: "bg-purple-100 text-purple-700",
      out_for_delivery: "bg-indigo-100 text-indigo-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {user?.loginType === "super_admin" ? "All Orders" : "Hub Orders"}
        </h1>
        <p className="text-gray-600 mt-1">Manage and track all orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by order ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="received">Received</option>
            <option value="processing">Processing</option>
            <option value="packed">Packed</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
            <Filter size={20} />
            More Filters
          </button>

          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
            <Download size={20} />
            Export
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Slot
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order: Order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.id}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.customerName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.customerPhone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.items.length} item(s)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{order.totalAmount}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {order.paymentMethod}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}
                    >
                      {order.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 uppercase">
                      {order.moduleType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.deliverySlot}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
