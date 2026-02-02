import { useState } from "react";
import { Card, Button, Input, Select, Modal, Badge } from "../../components/ui";
import {
  Plus,
  Search,
  Eye,
  Trash2,
  Zap,
  Target,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";
import { getStatusColor } from "../../utils/helpers";
import type { FlashSale } from "../../types";

const mockFlashSales: FlashSale[] = [
  {
    id: "1",
    name: "Lightning Fish Sale",
    description: "24-hour flash sale on premium fish",
    saleType: "time_based",
    products: [
      {
        id: "1",
        name: "Premium Tuna",
        category: "Fish",
        originalPrice: 800,
        salePrice: 600,
        discount: 25,
        stock: 50,
        sold: 23,
        image: "tuna.jpg",
      },
      {
        id: "2",
        name: "Fresh Salmon",
        category: "Fish",
        originalPrice: 1200,
        salePrice: 900,
        discount: 25,
        stock: 30,
        sold: 18,
        image: "salmon.jpg",
      },
    ],
    discountType: "percentage",
    discountValue: 25,
    originalPrice: 2000,
    salePrice: 1500,
    startTime: "2024-01-10T00:00:00",
    endTime: "2024-01-10T23:59:59",
    soldQuantity: 41,
    isActive: true,
    targetAudience: "all",
    saleConfig: {
      timerDisplay: true,
      stockDisplay: true,
      urgencyMessages: ["Only 24 hours left!", "Limited stock available!"],
    },
    createdBy: "Admin",
    createdAt: "2024-01-09",
  },
  {
    id: "2",
    name: "First 100 Customers",
    description: "Special discount for first 100 customers",
    saleType: "quantity_based",
    products: [
      {
        id: "3",
        name: "Prawns Combo",
        category: "Prawns",
        originalPrice: 600,
        salePrice: 450,
        discount: 25,
        stock: 100,
        sold: 67,
        image: "prawns.jpg",
      },
    ],
    discountType: "percentage",
    discountValue: 25,
    originalPrice: 600,
    salePrice: 450,
    startTime: "2024-01-10T06:00:00",
    endTime: "2024-01-15T23:59:59",
    totalQuantity: 100,
    soldQuantity: 67,
    isActive: true,
    targetAudience: "new_users",
    saleConfig: {
      timerDisplay: false,
      stockDisplay: true,
      urgencyMessages: ["Only 33 left!", "Hurry up!"],
    },
    createdBy: "Admin",
    createdAt: "2024-01-09",
  },
];

interface FlashSaleStatsProps {
  sales: FlashSale[];
}

function FlashSaleStats({ sales }: FlashSaleStatsProps) {
  const activeSales = sales.filter((sale) => sale.isActive).length;
  const totalSold = sales.reduce((sum, sale) => sum + sale.soldQuantity, 0);
  const totalRevenue = sales.reduce(
    (sum, sale) => sum + sale.salePrice * sale.soldQuantity,
    0,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Zap className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Sales</p>
            <p className="text-xl font-bold">{sales.length}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Target className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Active Sales</p>
            <p className="text-xl font-bold">{activeSales}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Items Sold</p>
            <p className="text-xl font-bold">{totalSold}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Revenue</p>
            <p className="text-xl font-bold">
              ₹{totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function FlashSaleDetails({ sale }: { sale: FlashSale }) {
  return (
    <div className="space-y-6 p-2">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{sale.name}</h2>
          <p className="text-sm text-gray-500">{sale.description}</p>
        </div>
        <Badge variant={getStatusColor(sale.isActive ? "active" : "inactive")}>
          {sale.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
        <div className="space-y-4">
          <p>
            <span className="font-semibold">Sale Type:</span>{" "}
            {sale.saleType.replace("_", " ")}
          </p>
          <p>
            <span className="font-semibold">Discount:</span>{" "}
            {sale.discountType === "percentage"
              ? `${sale.discountValue}%`
              : `₹${sale.discountValue}`}
          </p>
          <p>
            <span className="font-semibold">Target Audience:</span>{" "}
            {sale.targetAudience.replace("_", " ")}
          </p>
        </div>
        <div className="space-y-4">
          <p>
            <span className="font-semibold">Start Time:</span>{" "}
            {new Date(sale.startTime).toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">End Time:</span>{" "}
            {new Date(sale.endTime).toLocaleString()}
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Products</h3>
        <div className="space-y-2">
          {sale.products.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-600">
                  <span className="line-through">₹{product.originalPrice}</span>{" "}
                  → ₹{product.salePrice}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm">Stock: {product.stock}</p>
                <p className="text-sm">Sold: {product.sold}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4 text-sm text-gray-500">
        <p>
          Created by: {sale.createdBy} on{" "}
          {new Date(sale.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export function FlashSalePage() {
  const [sales, setSales] = useState<FlashSale[]>(mockFlashSales);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingSale, setViewingSale] = useState<FlashSale | undefined>();

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      !statusFilter ||
      (statusFilter === "active" ? sale.isActive : !sale.isActive);
    const matchesType = !typeFilter || sale.saleType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleView = (sale: FlashSale) => {
    setViewingSale(sale);
  };

  const handleDelete = (sale: FlashSale) => {
    if (window.confirm("Are you sure you want to delete this sale?")) {
      setSales(sales.filter((s) => s.id !== sale.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Flash Sale Generator</h1>
          <p className="text-gray-600">
            Create and manage flash sale campaigns
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Flash Sale
        </Button>
      </div>

      <FlashSaleStats sales={sales} />

      <Card>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search flash sales..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { value: "", label: "All Types" },
              { value: "time_based", label: "Time-Based" },
              { value: "quantity_based", label: "Quantity-Based" },
              { value: "buy_x_get_y", label: "Buy X Get Y" },
              { value: "bundle_deal", label: "Bundle Deal" },
            ]}
          />
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Campaign
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Discount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Progress
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.map((sale) => {
                const getTimeRemaining = () => {
                  const now = new Date();
                  const end = new Date(sale.endTime);
                  const diff = end.getTime() - now.getTime();
                  if (diff <= 0) return "Expired";
                  const hours = Math.floor(diff / (1000 * 60 * 60));
                  const days = Math.floor(hours / 24);
                  if (days > 0) return `${days}d remaining`;
                  return `${hours}h remaining`;
                };

                return (
                  <tr key={sale.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {sale.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {sale.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {sale.saleType.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {sale.discountType === "percentage"
                          ? `${sale.discountValue}%`
                          : `₹${sale.discountValue}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sale.saleType === "quantity_based" &&
                      sale.totalQuantity ? (
                        <div>
                          <div className="text-sm text-gray-900">
                            {sale.soldQuantity} / {sale.totalQuantity} sold
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-red-600 h-1.5 rounded-full"
                              style={{
                                width: `${Math.min((sale.soldQuantity / sale.totalQuantity) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-red-600">
                          {getTimeRemaining()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={getStatusColor(
                          sale.isActive ? "active" : "inactive",
                        )}
                      >
                        {sale.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(sale)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(sale)}
                          className="text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredSales.length === 0 && (
          <div className="text-center py-12">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No flash sales found
            </h3>
            <p className="text-gray-500">
              Create your first flash sale campaign
            </p>
          </div>
        )}
      </Card>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Flash Sale"
      >
        <form className="space-y-4">
          <Input label="Sale Name" placeholder="Lightning Fish Sale" required />
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            rows={2}
            placeholder="Sale description..."
          />
          <Select
            label="Sale Type"
            options={[
              { value: "time_based", label: "Time-Based" },
              { value: "quantity_based", label: "Quantity-Based" },
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Discount Type"
              options={[
                { value: "percentage", label: "Percentage" },
                { value: "fixed_amount", label: "Fixed Amount" },
              ]}
            />
            <Input label="Discount Value" type="number" placeholder="25" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Time" type="datetime-local" />
            <Input label="End Time" type="datetime-local" />
          </div>
          <Select
            label="Target Audience"
            options={[
              { value: "all", label: "All Users" },
              { value: "new_users", label: "New Users" },
            ]}
          />
          <div className="flex gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Sale
            </Button>
          </div>
        </form>
      </Modal>

      {viewingSale && (
        <Modal
          isOpen={!!viewingSale}
          onClose={() => setViewingSale(undefined)}
          title="Flash Sale Details"
          size="lg"
        >
          <FlashSaleDetails sale={viewingSale} />
        </Modal>
      )}
    </div>
  );
}
