import { useState } from 'react';
import { Card, Button } from '../../components/ui';
import { Plus, Search, Filter } from 'lucide-react';
import { ProductFormWithNutrition } from '../../components/products/ProductFormWithNutrition';
import { NutritionDisplay } from '../../components/products/NutritionDisplay';

// Sample product with nutrition data
const sampleProduct = {
  id: '1',
  name: 'Fresh Atlantic Salmon',
  category: 'Fresh Fish',
  price: 450,
  weight: 500,
  unit: 'g',
  nutrition: {
    calories: 208,
    protein: 25.4,
    carbs: 0,
    fat: 12.4,
    fiber: 0,
    sugar: 0,
    sodium: 59,
    cholesterol: 55,
    vitamins: {
      vitaminA: 25,
      vitaminC: 0,
      vitaminD: 360,
      vitaminB12: 2.8,
    },
    minerals: {
      calcium: 12,
      iron: 0.8,
      potassium: 363,
      magnesium: 27,
    },
  },
};

export function ProductsWithNutritionPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [products] = useState([sampleProduct]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products with Nutrition</h1>
          <p className="text-gray-600">Manage products with detailed nutrition information</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="mr-2 h-5 w-5" />
          {showAddForm ? 'View Products' : 'Add Product'}
        </Button>
      </div>

      {showAddForm ? (
        <ProductFormWithNutrition 
          onSave={() => {}}
          onCancel={() => {}}
        />
      ) : (
        <>
          {/* Search and Filter */}
          <Card>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <Button variant="secondary">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </Card>

          {/* Products List */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {products.map((product) => (
              <Card key={product.id}>
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                  </div>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="text-sm text-gray-500">Weight: {product.weight}{product.unit}</p>
                </div>

                {/* Compact Nutrition Display */}
                <div className="bg-green-50 p-3 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-green-900">
                      Nutrition per {product.weight}{product.unit}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span>Calories:</span>
                      <span className="font-semibold">{product.nutrition.calories}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Protein:</span>
                      <span className="font-semibold">{product.nutrition.protein}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carbs:</span>
                      <span className="font-semibold">{product.nutrition.carbs}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fat:</span>
                      <span className="font-semibold">{product.nutrition.fat}g</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" className="flex-1">
                    Edit
                  </Button>
                  <Button size="sm" variant="secondary" className="flex-1">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Detailed Nutrition Example */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Detailed Nutrition View Example</h2>
            <NutritionDisplay
              nutrition={sampleProduct.nutrition}
              servingSize={sampleProduct.weight}
              servingUnit={sampleProduct.unit}
            />
          </div>
        </>
      )}
    </div>
  );
}
