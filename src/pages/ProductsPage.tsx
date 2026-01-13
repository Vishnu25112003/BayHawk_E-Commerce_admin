import { useState } from "react";
import { Modal, Badge, Input, Button } from "../components/ui";
import { ProductFormWithCuttingType } from "../components/products/ProductFormWithCuttingType";
import { ProductList } from "../components/products/ProductList";
import { useAuth } from "../context/AuthContext";
import { filterDataByModule } from "../utils/rbac";
import { Package } from "lucide-react";
import type { Product } from "../types";

const mockProducts: Product[] = [
  // Hub Products (Fish Only)
  {
    id: "1",
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
    ],
    isBestSeller: true,
    isRare: false,
    isActive: true,
    deliveryType: "next_day",
    sourceType: "hub",
    moduleType: "hub",
    hubId: "hub_1",
    approvalStatus: "approved",
  },
  {
    id: "2",
    nameEn: "Tiger Prawns",
    nameTa: "இறால்",
    sku: "PRWN-001",
    category: "prawns",
    description: "Fresh tiger prawns",
    images: [],
    variants: [
      {
        id: "v2",
        type: "Cleaned",
        size: "Large",
        grossWeight: "500g",
        netWeight: "400g",
        pieces: "15-20 pieces",
        serves: "2-3",
        price: 650,
        stock: 15,
      },
    ],
    isBestSeller: true,
    isRare: false,
    isActive: true,
    deliveryType: "next_day",
    sourceType: "hub",
    moduleType: "hub",
    hubId: "hub_1",
    approvalStatus: "approved",
  },
  {
    id: "3",
    nameEn: "Pomfret (White)",
    nameTa: "வாவல்",
    sku: "FISH-002",
    category: "fish",
    description: "White pomfret",
    images: [],
    variants: [
      {
        id: "v3",
        type: "Whole Cleaned",
        size: "Medium",
        grossWeight: "300-400g",
        netWeight: "250-350g",
        pieces: "1 piece",
        serves: "2",
        price: 450,
        stock: 8,
      },
    ],
    isBestSeller: false,
    isRare: true,
    isActive: true,
    deliveryType: "next_day",
    sourceType: "hub",
    moduleType: "hub",
    hubId: "hub_1",
    approvalStatus: "approved",
  },
  {
    id: "5",
    nameEn: "Mud Crab",
    nameTa: "நண்டு",
    sku: "CRAB-001",
    category: "crab",
    description: "Live mud crab",
    images: [],
    variants: [
      {
        id: "v5",
        type: "Live",
        size: "Large",
        grossWeight: "500-700g",
        netWeight: "500-700g",
        pieces: "1 piece",
        serves: "2-3",
        price: 850,
        stock: 5,
      },
    ],
    isBestSeller: false,
    isRare: true,
    isActive: true,
    deliveryType: "exotic",
    sourceType: "hub",
    moduleType: "hub",
    hubId: "hub_1",
    approvalStatus: "approved",
  },

  // Store Products (Fish + Meat)
  {
    id: "4",
    nameEn: "Chicken Breast",
    nameTa: "சிக்கன் மார்பு",
    sku: "CHKN-001",
    category: "chicken",
    description: "Boneless chicken breast",
    images: [],
    variants: [
      {
        id: "v4",
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
    moduleType: "store",
    storeId: "store_1",
    approvalStatus: "approved",
  },
  {
    id: "6",
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
        size: "Medium",
        grossWeight: "500g",
        netWeight: "500g",
        pieces: "8-10 pieces",
        serves: "3-4",
        price: 650,
        stock: 20,
      },
    ],
    isBestSeller: true,
    isRare: false,
    isActive: true,
    deliveryType: "same_day",
    sourceType: "store",
    moduleType: "store",
    storeId: "store_1",
    approvalStatus: "approved",
  },
  {
    id: "7",
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
    moduleType: "store",
    storeId: "store_1",
    approvalStatus: "approved",
  },
  {
    id: "8",
    nameEn: "Turmeric Powder",
    nameTa: "மஞ்சள் தூள்",
    sku: "SPC-001",
    category: "spices",
    description: "Pure turmeric powder",
    images: [],
    variants: [
      {
        id: "v8",
        type: "Powder",
        size: "100g",
        grossWeight: "100g",
        netWeight: "100g",
        pieces: "1 pack",
        serves: "Multiple uses",
        price: 45,
        stock: 200,
      },
    ],
    isBestSeller: false,
    isRare: false,
    isActive: true,
    deliveryType: "same_day",
    sourceType: "store",
    moduleType: "store",
    storeId: "store_1",
    approvalStatus: "approved",
  },
];

export function ProductsPage() {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products based on user's login type using RBAC
  const filteredProducts = filterDataByModule(mockProducts, user);

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowAddModal(true);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleDeleteProduct = (productId: string) => {
    console.log("Delete product:", productId);
  };

  // Get page title and description based on user type
  const getPageInfo = () => {
    if (user?.loginType === "hub") {
      return {
        title: "Hub Products",
        description: "Manage hub fish products for next-day delivery",
      };
    } else if (user?.loginType === "store") {
      return {
        title: "Store Products",
        description: "Manage store products including fish, meat, and spices",
      };
    } else {
      return {
        title: "All Products",
        description: "Manage all products across hub and stores",
      };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <>
      <ProductList
        products={filteredProducts}
        sourceType={
          user?.loginType === "super_admin" ? "all" : user?.loginType || "all"
        }
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
        onViewProduct={handleViewProduct}
        onDeleteProduct={handleDeleteProduct}
        title={pageInfo.title}
        description={pageInfo.description}
      />

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedProduct(null);
        }}
        title={selectedProduct ? "Edit Product" : "Add New Product"}
        size="xl"
      >
        {selectedProduct ? (
          // Edit Product Form
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Product Name (English)"
                defaultValue={selectedProduct.nameEn}
                placeholder="e.g., Seer Fish"
              />
              <Input
                label="Product Name (Tamil)"
                defaultValue={selectedProduct.nameTa}
                placeholder="e.g., வஞ்சிரம்"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="SKU"
                defaultValue={selectedProduct.sku}
                placeholder="e.g., FISH-001"
              />
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={selectedProduct.category}
              >
                <option value="">Select Category</option>
                <option value="fish">Fish</option>
                <option value="prawns">Prawns</option>
                <option value="chicken">Chicken</option>
                <option value="mutton">Mutton</option>
                <option value="egg">Egg</option>
                <option value="spices">Spices</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={selectedProduct.description}
                placeholder="Product description..."
              />
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">
                Product Variants
              </h4>
              <div className="space-y-4">
                {selectedProduct.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Variant Type"
                        defaultValue={variant.type}
                        placeholder="e.g., Whole Cleaned"
                      />
                      <Input
                        label="Size"
                        defaultValue={variant.size}
                        placeholder="e.g., Medium"
                      />
                      <Input
                        label="Price (₹)"
                        type="number"
                        defaultValue={variant.price}
                        placeholder="0"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <Input
                        label="Gross Weight"
                        defaultValue={variant.grossWeight}
                        placeholder="e.g., 1000-1250g"
                      />
                      <Input
                        label="Net Weight"
                        defaultValue={variant.netWeight}
                        placeholder="e.g., 800-1000g"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <Input
                        label="Pieces"
                        defaultValue={variant.pieces}
                        placeholder="e.g., 1 piece"
                      />
                      <Input
                        label="Serves"
                        defaultValue={variant.serves}
                        placeholder="e.g., 3-4"
                      />
                      <Input
                        label="Stock"
                        type="number"
                        defaultValue={variant.stock}
                        placeholder="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked={selectedProduct.isBestSeller}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Best Seller</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked={selectedProduct.isRare}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Rare Product</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked={selectedProduct.isActive}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Active</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedProduct(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log("Update product:", selectedProduct.id);
                  setShowAddModal(false);
                  setSelectedProduct(null);
                }}
                className="flex-1"
              >
                Update Product
              </Button>
            </div>
          </div>
        ) : (
          // Add Product Form
          <ProductFormWithCuttingType
            onSave={(product) => {
              console.log("New product:", product);
              setShowAddModal(false);
            }}
            onCancel={() => setShowAddModal(false)}
          />
        )}
      </Modal>

      {/* Product Details Modal */}
      <Modal
        isOpen={!!selectedProduct && !showAddModal}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.nameEn || ""}
        size="lg"
      >
        {selectedProduct && (
          <div className="space-y-6">
            {/* Product Header */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <Package className="h-10 w-10 text-gray-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedProduct.nameEn}
                </h3>
                <p className="text-lg text-gray-600">
                  {selectedProduct.nameTa}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant={selectedProduct.isActive ? "success" : "secondary"}
                  >
                    {selectedProduct.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {selectedProduct.isBestSeller && (
                    <Badge variant="warning">Best Seller</Badge>
                  )}
                  {selectedProduct.isRare && (
                    <Badge variant="danger">Rare Product</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Product Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">SKU:</span>
                    <span className="font-mono">{selectedProduct.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="capitalize">
                      {selectedProduct.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Source Type:</span>
                    <span className="capitalize">
                      {selectedProduct.sourceType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Type:</span>
                    <span className="capitalize">
                      {selectedProduct.deliveryType.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Approval Status:</span>
                    <Badge
                      variant={
                        selectedProduct.approvalStatus === "approved"
                          ? "success"
                          : "warning"
                      }
                    >
                      {selectedProduct.approvalStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Description</h4>
                <p className="text-sm text-gray-600">
                  {selectedProduct.description}
                </p>
              </div>
            </div>

            {/* Product Variants */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Product Variants
              </h4>
              <div className="space-y-3">
                {selectedProduct.variants.map((variant) => (
                  <div key={variant.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900">
                          {variant.type} - {variant.size}
                        </h5>
                        <p className="text-lg font-semibold text-green-600">
                          ₹{variant.price}
                        </p>
                      </div>
                      <Badge
                        variant={
                          variant.stock > 10
                            ? "success"
                            : variant.stock > 0
                              ? "warning"
                              : "danger"
                        }
                      >
                        {variant.stock} in stock
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Gross Weight:</span>
                        <p className="font-medium">{variant.grossWeight}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Net Weight:</span>
                        <p className="font-medium">{variant.netWeight}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Pieces:</span>
                        <p className="font-medium">{variant.pieces}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Serves:</span>
                        <p className="font-medium">{variant.serves}</p>
                      </div>
                    </div>

                    {variant.discount && (
                      <div className="mt-2">
                        <Badge variant="success">
                          {variant.discount}% Discount
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => setSelectedProduct(null)}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowAddModal(true);
                }}
                className="flex-1"
              >
                Edit Product
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
