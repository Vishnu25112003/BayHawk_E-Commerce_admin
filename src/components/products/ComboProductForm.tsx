import { useState } from 'react';
import { Card } from '../ui';
import { Package, Plus, X, Percent, FileText } from 'lucide-react';
import { Button } from '../ui';

interface ComboItem {
  id: string;
  categoryId: string;
  productId: string;
  quantity: number;
}

interface ComboProductData {
  isCombo: boolean;
  comboItems: ComboItem[];
  comboOfferPercent: number;
  comboDescription: string;
  comboName: string;
  comboPrice: number;
  comboSavings: number;
}

interface ComboProductFormProps {
  data: ComboProductData;
  onChange: (data: ComboProductData) => void;
  availableCategories: Array<{ id: string; name: string }>;
}

// Mock products by category
const mockProductsByCategory: Record<string, Array<{ id: string; name: string; price: number }>> = {
  '1': [{ id: 'p1', name: 'Sea Bass', price: 450 }, { id: 'p2', name: 'Seer Fish', price: 650 }],
  '2': [{ id: 'p3', name: 'Catfish', price: 300 }, { id: 'p4', name: 'Tilapia', price: 250 }],
  '5': [{ id: 'p5', name: 'Chicken Breast', price: 280 }, { id: 'p6', name: 'Mutton Curry Cut', price: 550 }],
  '6': [{ id: 'p7', name: 'Farm Eggs (6 pcs)', price: 42 }, { id: 'p8', name: 'Country Eggs (6 pcs)', price: 54 }],
  '7': [{ id: 'p9', name: 'Turmeric Powder', price: 80 }, { id: 'p10', name: 'Chili Powder', price: 90 }],
  '8': [{ id: 'p11', name: 'Biryani Mix', price: 120 }, { id: 'p12', name: 'Curry Ready', price: 150 }],
  '9': [{ id: 'p13', name: 'Marinated Chicken', price: 320 }, { id: 'p14', name: 'Tandoori Mix', price: 340 }]
};

export function ComboProductForm({ data, onChange, availableCategories }: ComboProductFormProps) {
  const [showCombo, setShowCombo] = useState(data.isCombo);

  const handleToggleCombo = () => {
    const newValue = !showCombo;
    setShowCombo(newValue);
    onChange({
      ...data,
      isCombo: newValue,
      comboItems: newValue ? data.comboItems : []
    });
  };

  const addComboItem = () => {
    const newItem: ComboItem = {
      id: Date.now().toString(),
      categoryId: '',
      productId: '',
      quantity: 1
    };
    onChange({
      ...data,
      comboItems: [...data.comboItems, newItem]
    });
  };

  const removeComboItem = (id: string) => {
    onChange({
      ...data,
      comboItems: data.comboItems.filter(item => item.id !== id)
    });
  };

  const updateComboItem = (id: string, field: keyof ComboItem, value: string | number) => {
    onChange({
      ...data,
      comboItems: data.comboItems.map(item =>
        item.id === id ? { ...item, [field]: value, ...(field === 'categoryId' ? { productId: '' } : {}) } : item
      )
    });
  };

  const calculateTotalPrice = () => {
    return data.comboItems.reduce((total, item) => {
      const category = mockProductsByCategory[item.categoryId];
      const product = category?.find(p => p.id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const calculateComboPrice = () => {
    const total = calculateTotalPrice();
    return total - (total * data.comboOfferPercent / 100);
  };

  const handleComboFieldChange = (field: keyof ComboProductData, value: string | number) => {
    onChange({
      ...data,
      [field]: value,
      ...(field === 'comboOfferPercent' ? { 
        comboPrice: calculateTotalPrice() - (calculateTotalPrice() * Number(value) / 100),
        comboSavings: calculateTotalPrice() * Number(value) / 100
      } : {})
    });
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold">Combo Product</h2>
        </div>
        <Button
          type="button"
          variant={showCombo ? "primary" : "secondary"}
          onClick={handleToggleCombo}
          size="sm"
        >
          {showCombo ? 'Disable Combo' : 'Enable Combo'}
        </Button>
      </div>

      {!showCombo && (
        <p className="text-sm text-gray-600">
          Enable combo to create product bundles with special offers and discounts
        </p>
      )}

      {showCombo && (
        <div className="space-y-6">
          {/* Combo Details Section */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Combo Details
            </h3>
            
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Combo Name *
                </label>
                <input
                  type="text"
                  value={data.comboName}
                  onChange={(e) => handleComboFieldChange('comboName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Fish & Meat Combo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Percent className="h-4 w-4" />
                  Offer Percentage *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={data.comboOfferPercent}
                  onChange={(e) => handleComboFieldChange('comboOfferPercent', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Combo Description *
              </label>
              <textarea
                value={data.comboDescription}
                onChange={(e) => handleComboFieldChange('comboDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Get fresh fish and premium meat together at a special price!"
                rows={3}
              />
            </div>
          </div>

          {/* Products in Combo Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Products in Combo</h3>
              <Button onClick={addComboItem} variant="secondary" size="sm">
                <Plus className="mr-1 h-4 w-4" />
                Add Product
              </Button>
            </div>

            {data.comboItems.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No items added yet</p>
                <Button onClick={addComboItem} variant="secondary" size="sm" className="mt-3">
                  <Plus className="mr-1 h-4 w-4" />
                  Add First Item
                </Button>
              </div>
            )}

            {data.comboItems.map((item, index) => {
            const category = mockProductsByCategory[item.categoryId];
            const product = category?.find(p => p.id === item.productId);
            const itemTotal = (product?.price || 0) * item.quantity;

            return (
              <div key={item.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-700">Product {index + 1}</h4>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => removeComboItem(item.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-3 grid-cols-1 sm:grid-cols-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={item.categoryId}
                      onChange={(e) => updateComboItem(item.id, 'categoryId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select</option>
                      {availableCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product *
                    </label>
                    <select
                      value={item.productId}
                      onChange={(e) => updateComboItem(item.id, 'productId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={!item.categoryId}
                    >
                      <option value="">Select</option>
                      {item.categoryId && mockProductsByCategory[item.categoryId]?.map(prod => (
                        <option key={prod.id} value={prod.id}>{prod.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateComboItem(item.id, 'quantity', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700 font-medium">
                      ₹{itemTotal.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {data.comboItems.length > 0 && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 mt-4">
              <h4 className="font-semibold text-gray-900 mb-3">Combo Pricing Summary</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Total Products</p>
                  <p className="text-lg font-bold text-gray-900">{data.comboItems.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Original Price</p>
                  <p className="text-lg font-bold text-gray-900">₹{calculateTotalPrice().toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Discount ({data.comboOfferPercent}%)</p>
                  <p className="text-lg font-bold text-red-600">-₹{(calculateTotalPrice() * data.comboOfferPercent / 100).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Combo Price</p>
                  <p className="text-lg font-bold text-green-600">₹{calculateComboPrice().toFixed(2)}</p>
                </div>
              </div>
              <div className="mt-3 p-2 bg-white rounded border border-green-300">
                <p className="text-sm text-green-800">
                  <strong>You Save:</strong> ₹{(calculateTotalPrice() * data.comboOfferPercent / 100).toFixed(2)} on this combo!
                </p>
              </div>
            </div>
          )}
          </div>
        </div>
      )}
    </Card>
  );
}

export type { ComboProductData, ComboItem };
