import { useState } from 'react';
import { Card, Button } from '../ui';
import { Plus, Minus, Info } from 'lucide-react';

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
  vitamins: {
    vitaminA: number;
    vitaminC: number;
    vitaminD: number;
    vitaminB12: number;
  };
  minerals: {
    calcium: number;
    iron: number;
    potassium: number;
    magnesium: number;
  };
}

interface NutritionCustomizationProps {
  baseQuantity: number;
  baseUnit: string;
  nutrition: NutritionInfo;
  onNutritionChange: (nutrition: NutritionInfo) => void;
}

export function NutritionCustomization({ 
  baseQuantity, 
  baseUnit, 
  nutrition, 
  onNutritionChange 
}: NutritionCustomizationProps) {
  const [selectedQuantity, setSelectedQuantity] = useState(baseQuantity);

  const calculateNutrition = (value: number) => {
    const ratio = selectedQuantity / baseQuantity;
    return Math.round(value * ratio * 100) / 100;
  };

  const updateNutritionValue = (key: string, value: number, category?: string) => {
    const updatedNutrition = { ...nutrition };
    
    if (category) {
      (updatedNutrition as any)[category] = {
        ...(updatedNutrition as any)[category],
        [key]: value
      };
    } else {
      (updatedNutrition as any)[key] = value;
    }
    
    onNutritionChange(updatedNutrition);
  };

  const nutritionFields = [
    { key: 'calories', label: 'Calories', unit: 'kcal' },
    { key: 'protein', label: 'Protein', unit: 'g' },
    { key: 'carbs', label: 'Carbohydrates', unit: 'g' },
    { key: 'fat', label: 'Total Fat', unit: 'g' },
    { key: 'fiber', label: 'Fiber', unit: 'g' },
    { key: 'sugar', label: 'Sugar', unit: 'g' },
    { key: 'sodium', label: 'Sodium', unit: 'mg' },
    { key: 'cholesterol', label: 'Cholesterol', unit: 'mg' },
  ];

  const vitaminFields = [
    { key: 'vitaminA', label: 'Vitamin A', unit: 'IU' },
    { key: 'vitaminC', label: 'Vitamin C', unit: 'mg' },
    { key: 'vitaminD', label: 'Vitamin D', unit: 'IU' },
    { key: 'vitaminB12', label: 'Vitamin B12', unit: 'mcg' },
  ];

  const mineralFields = [
    { key: 'calcium', label: 'Calcium', unit: 'mg' },
    { key: 'iron', label: 'Iron', unit: 'mg' },
    { key: 'potassium', label: 'Potassium', unit: 'mg' },
    { key: 'magnesium', label: 'Magnesium', unit: 'mg' },
  ];

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Nutrition Information</h3>
      </div>

      {/* Quantity Selector */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Serving Size
        </label>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={selectedQuantity}
              onChange={(e) => setSelectedQuantity(Number(e.target.value) || 1)}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center"
              min="1"
            />
            <span className="text-sm text-gray-600">{baseUnit}</span>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setSelectedQuantity(selectedQuantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Base serving: {baseQuantity} {baseUnit}
        </p>
      </div>

      {/* Basic Nutrition */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Basic Nutrition</h4>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {nutritionFields.map(field => (
            <div key={field.key} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <p className="text-xs text-gray-500">per {selectedQuantity} {baseUnit}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={(nutrition as any)[field.key]}
                  onChange={(e) => updateNutritionValue(field.key, Number(e.target.value) || 0)}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                  step="0.1"
                  min="0"
                />
                <span className="text-xs text-gray-500 w-8">{field.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vitamins */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Vitamins</h4>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {vitaminFields.map(field => (
            <div key={field.key} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <p className="text-xs text-gray-500">per {selectedQuantity} {baseUnit}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={nutrition.vitamins[field.key as keyof typeof nutrition.vitamins]}
                  onChange={(e) => updateNutritionValue(field.key, Number(e.target.value) || 0, 'vitamins')}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                  step="0.1"
                  min="0"
                />
                <span className="text-xs text-gray-500 w-8">{field.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Minerals */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-3">Minerals</h4>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {mineralFields.map(field => (
            <div key={field.key} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <p className="text-xs text-gray-500">per {selectedQuantity} {baseUnit}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={nutrition.minerals[field.key as keyof typeof nutrition.minerals]}
                  onChange={(e) => updateNutritionValue(field.key, Number(e.target.value) || 0, 'minerals')}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                  step="0.1"
                  min="0"
                />
                <span className="text-xs text-gray-500 w-8">{field.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition Facts Preview */}
      <div className="mt-6 p-4 bg-white border-2 border-gray-300 rounded-lg">
        <h4 className="font-bold text-center mb-2">Nutrition Facts</h4>
        <div className="border-b-8 border-black mb-2"></div>
        <div className="text-sm">
          <div className="flex justify-between font-semibold">
            <span>Serving Size</span>
            <span>{selectedQuantity} {baseUnit}</span>
          </div>
          <div className="border-b-4 border-black my-2"></div>
          <div className="flex justify-between font-bold text-lg">
            <span>Calories</span>
            <span>{calculateNutrition(nutrition.calories)}</span>
          </div>
          <div className="border-b border-gray-300 my-1"></div>
          <div className="text-xs text-right font-semibold">% Daily Value*</div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span><strong>Total Fat</strong> {calculateNutrition(nutrition.fat)}g</span>
              <span className="font-semibold">{Math.round((calculateNutrition(nutrition.fat) / 65) * 100)}%</span>
            </div>
            <div className="flex justify-between">
              <span><strong>Cholesterol</strong> {calculateNutrition(nutrition.cholesterol)}mg</span>
              <span className="font-semibold">{Math.round((calculateNutrition(nutrition.cholesterol) / 300) * 100)}%</span>
            </div>
            <div className="flex justify-between">
              <span><strong>Sodium</strong> {calculateNutrition(nutrition.sodium)}mg</span>
              <span className="font-semibold">{Math.round((calculateNutrition(nutrition.sodium) / 2300) * 100)}%</span>
            </div>
            <div className="flex justify-between">
              <span><strong>Total Carbohydrate</strong> {calculateNutrition(nutrition.carbs)}g</span>
              <span className="font-semibold">{Math.round((calculateNutrition(nutrition.carbs) / 300) * 100)}%</span>
            </div>
            <div className="flex justify-between pl-4">
              <span>Dietary Fiber {calculateNutrition(nutrition.fiber)}g</span>
              <span className="font-semibold">{Math.round((calculateNutrition(nutrition.fiber) / 25) * 100)}%</span>
            </div>
            <div className="flex justify-between pl-4">
              <span>Total Sugars {calculateNutrition(nutrition.sugar)}g</span>
              <span></span>
            </div>
            <div className="flex justify-between">
              <span><strong>Protein</strong> {calculateNutrition(nutrition.protein)}g</span>
              <span></span>
            </div>
          </div>
          <div className="border-b-8 border-black my-2"></div>
          <div className="text-xs">
            <p>* The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet.</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
