import { useState } from "react";
import { Card, Badge, PageHeader } from "../components/ui";
import { PreOrderForm } from "../components/features/orders/PreOrderForm";
import { Fish, Store } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import type { Product } from "../types";

// Mock data for pre-orders
const mockHubProducts: Product[] = [
  {
    id: "rare_1",
    nameEn: "King Fish (Premium)",
    nameTa: "கிங் மீன்",
    sku: "RARE-001",
    category: "fish",
    description: "Premium king fish - advance booking required",
    images: [],
    variants: [
      {
        id: "rv1",
        type: "Whole Cleaned",
        size: "Large",
        grossWeight: "2000-2500g",
        netWeight: "1800-2200g",
        pieces: "1 piece",
        serves: "6-8",
        price: 2500,
        stock: 5,
      },
    ],
    isBestSeller: false,
    isRare: true,
    isActive: true,
    deliveryType: "exotic",
    sourceType: "hub",
    approvalStatus: "approved",
  },
  {
    id: "rare_2",
    nameEn: "Live Lobster",
    nameTa: "நண்டு",
    sku: "RARE-002",
    category: "lobster",
    description: "Fresh live lobster - 48 hours advance notice required",
    images: [],
    variants: [
      {
        id: "rv2",
        type: "Live",
        size: "Large",
        grossWeight: "800-1000g",
        netWeight: "800-1000g",
        pieces: "1 piece",
        serves: "3-4",
        price: 1800,
        stock: 3,
      },
    ],
    isBestSeller: false,
    isRare: true,
    isActive: true,
    deliveryType: "exotic",
    sourceType: "hub",
    approvalStatus: "approved",
  },
  {
    id: "hub_1",
    nameEn: "Seer Fish (Vanjaram)",
    nameTa: "வஞ்சிரம்",
    sku: "FISH-001",
    category: "fish",
    description: "Premium quality seer fish",
    images: [],
    variants: [
      {
        id: "v1",
        type: "Whole Cleaned",
        size: "Medium",
        grossWeight: "1000-1250g",
        netWeight: "800-1000g",
        pieces: "1 piece",
        serves: "3-4",
        price: 1200,
        stock: 25,
        discount: 10,
      },
      {
        id: "v2",
        type: "Curry Cut",
        size: "Medium",
        grossWeight: "1000g",
        netWeight: "800g",
        pieces: "8-10 pieces",
        serves: "3-4",
        price: 1300,
        stock: 20,
      },
    ],
    isBestSeller: true,
    isRare: false,
    isActive: true,
    deliveryType: "next_day",
    sourceType: "hub",
    approvalStatus: "approved",
  },
  {
    id: "hub_2",
    nameEn: "Tiger Prawns",
    nameTa: "இறால்",
    sku: "PRWN-001",
    category: "prawns",
    description: "Fresh tiger prawns",
    images: [],
    variants: [
      {
        id: "v3",
        type: "Cleaned",
        size: "Large",
        grossWeight: "500g",
        netWeight: "400g",
        pieces: "15-20 pieces",
        serves: "2-3",
        price: 650,
        stock: 15,
      },
      {
        id: "v4",
        type: "Uncleaned",
        size: "Large",
        grossWeight: "500g",
        netWeight: "450g",
        pieces: "15-20 pieces",
        serves: "2-3",
        price: 580,
        stock: 18,
      },
    ],
    isBestSeller: true,
    isRare: false,
    isActive: true,
    deliveryType: "next_day",
    sourceType: "hub",
    approvalStatus: "approved",
  },
];

const mockStoreProducts: Product[] = [
  ...mockHubProducts, // Store can also sell hub products
  {
    id: "store_1",
    nameEn: "Chicken Breast",
    nameTa: "சிக்கன் மார்பு",
    sku: "CHKN-001",
    category: "chicken",
    description: "Boneless chicken breast",
    images: [],
    variants: [
      {
        id: "v5",
        type: "Boneless",
        size: "Pack",
        grossWeight: "500g",
        netWeight: "500g",
        pieces: "2-3 pieces",
        serves: "2-3",
        price: 280,
        stock: 50,
      },
    ],
    isBestSeller: false,
    isRare: false,
    isActive: true,
    deliveryType: "same_day",
    sourceType: "store",
    approvalStatus: "approved",
  },
  {
    id: "store_2",
    nameEn: "Mutton Curry Cut",
    nameTa: "ஆட்டு இறைச்சி",
    sku: "MUTN-001",
    category: "mutton",
    description: "Fresh mutton curry cut",
    images: [],
    variants: [
      {
        id: "v6",
        type: "Curry Cut",
        size: "Pack",
        grossWeight: "500g",
        netWeight: "500g",
        pieces: "8-10 pieces",
        serves: "2-3",
        price: 450,
        stock: 30,
      },
    ],
    isBestSeller: false,
    isRare: false,
    isActive: true,
    deliveryType: "same_day",
    sourceType: "store",
    approvalStatus: "approved",
  },
  {
    id: "store_3",
    nameEn: "Country Eggs",
    nameTa: "நாட்டு முட்டை",
    sku: "EGG-001",
    category: "egg",
    description: "Fresh country eggs",
    images: [],
    variants: [
      {
        id: "v7",
        type: "Fresh",
        size: "Medium",
        grossWeight: "12 pieces",
        netWeight: "12 pieces",
        pieces: "12 pieces",
        serves: "4-6",
        price: 120,
        stock: 100,
      },
    ],
    isBestSeller: true,
    isRare: false,
    isActive: true,
    deliveryType: "same_day",
    sourceType: "store",
    approvalStatus: "approved",
  },
];

const mockHubs = [
  {
    id: "hub_1",
    name: "Central Hub",
    type: "hub",
    location: "Chennai Central",
  },
  { id: "hub_2", name: "North Hub", type: "hub", location: "Chennai North" },
];

const mockStores = [
  {
    id: "store_1",
    name: "Anna Nagar Store",
    type: "store",
    location: "Anna Nagar",
  },
  {
    id: "store_2",
    name: "T. Nagar Store",
    type: "store",
    location: "T. Nagar",
  },
  {
    id: "store_3",
    name: "Velachery Store",
    type: "store",
    location: "Velachery",
  },
];

export function PreOrderPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"hub" | "store">("hub");

  const handlePreOrderSubmit = async (data: any) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Pre-order created:", data);
      alert(`${activeTab.toUpperCase()} Pre-order created successfully!`);
    } catch (error) {
      console.error("Failed to create pre-order:", error);
      alert("Failed to create pre-order. Please try again.");
    }
  };

  // For specific user types, show only their relevant section
  if (user?.loginType === "hub") {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <PageHeader
          title="Hub Pre-Order Creation"
          description="Create advance bookings for fish products and rare items"
        />
        <PreOrderForm
          moduleType="hub"
          products={mockHubProducts}
          hubs={mockHubs}
          onSubmit={handlePreOrderSubmit}
        />
      </div>
    );
  }

  if (user?.loginType === "store") {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <PageHeader
          title="Store Pre-Order Creation"
          description="Create advance bookings for all products and bulk orders"
        />
        <PreOrderForm
          moduleType="store"
          products={mockStoreProducts}
          hubs={mockStores}
          onSubmit={handlePreOrderSubmit}
        />
      </div>
    );
  }

  // Super Admin sees both Hub and Store in tabs
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Pre-Order Management"
        description="Create advance bookings for both hub and store operations"
      />

      {/* Tab Navigation */}
      <Card className="p-0 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap sm:flex-nowrap overflow-x-auto px-4 sm:px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("hub")}
              className={`
                flex items-center gap-2 py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap
                ${
                  activeTab === "hub"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <Fish className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Hub Pre-Orders</span>
              <span className="sm:hidden">Hub</span>
              <Badge
                variant={activeTab === "hub" ? "info" : "default"}
                className="ml-1 text-xs"
              >
                <span className="hidden sm:inline">Fish & Rare Items</span>
                <span className="sm:hidden">Fish</span>
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab("store")}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === "store"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <Store className="h-5 w-5" />
              Store Pre-Orders
              <Badge
                variant={activeTab === "store" ? "success" : "default"}
                className="ml-1"
              >
                All Products
              </Badge>
            </button>
          </nav>
        </div>

        {/* Module Information */}
        <div className="p-6">
          {activeTab === "hub" && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Fish className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    Hub Pre-Order Creation
                  </h3>
                  <p className="text-sm text-blue-700">
                    Fish products • Rare items • Advance booking • Next day
                    delivery
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-2xl font-bold text-blue-900">
                    {mockHubProducts.length}
                  </p>
                  <p className="text-sm text-blue-700">Available Products</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-2xl font-bold text-blue-900">
                    {mockHubs.length}
                  </p>
                  <p className="text-sm text-blue-700">Active Hubs</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-2xl font-bold text-blue-900">30 Days</p>
                  <p className="text-sm text-blue-700">Max Advance</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-2xl font-bold text-blue-900">Premium</p>
                  <p className="text-sm text-blue-700">Quality Grade</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "store" && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-green-600 flex items-center justify-center">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-900">
                    Store Pre-Order Creation
                  </h3>
                  <p className="text-sm text-green-700">
                    All products • Bulk orders • Subscriptions • Same/Next day
                    delivery
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-900">
                    {mockStoreProducts.length}
                  </p>
                  <p className="text-sm text-green-700">Available Products</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-900">
                    {mockStores.length}
                  </p>
                  <p className="text-sm text-green-700">Active Stores</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-900">90 Days</p>
                  <p className="text-sm text-green-700">Max Advance</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-900">Variety</p>
                  <p className="text-sm text-green-700">Product Range</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Pre-Order Form */}
      {activeTab === "hub" && (
        <PreOrderForm
          moduleType="hub"
          products={mockHubProducts}
          hubs={mockHubs}
          onSubmit={handlePreOrderSubmit}
        />
      )}

      {activeTab === "store" && (
        <PreOrderForm
          moduleType="store"
          products={mockStoreProducts}
          hubs={mockStores}
          onSubmit={handlePreOrderSubmit}
        />
      )}
    </div>
  );
}
