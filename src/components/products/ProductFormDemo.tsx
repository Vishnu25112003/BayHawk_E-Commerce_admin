import { useState } from 'react';
import { DayBasedPricing, type DayBasedPricingData } from './DayBasedPricing';
import { ProductTags, type ProductTagsData } from './ProductTags';

export function ProductFormDemo() {
  const [dayPricing, setDayPricing] = useState<DayBasedPricingData>({
    enabled: false,
    dayPrices: [
      { day: 'monday', price: 0, enabled: false },
      { day: 'tuesday', price: 0, enabled: false },
      { day: 'wednesday', price: 0, enabled: false },
      { day: 'thursday', price: 0, enabled: false },
      { day: 'friday', price: 0, enabled: false },
      { day: 'saturday', price: 0, enabled: false },
      { day: 'sunday', price: 0, enabled: false },
    ]
  });

  const [productTags, setProductTags] = useState<ProductTagsData>({
    tags: []
  });

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">New Product Features Demo</h1>
      
      <DayBasedPricing
        data={dayPricing}
        onChange={setDayPricing}
      />
      
      <ProductTags
        data={productTags}
        onChange={setProductTags}
      />

      {/* Demo Output */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Form Data Output:</h3>
        <pre className="text-sm text-gray-700 overflow-auto">
          {JSON.stringify({ dayPricing, productTags }, null, 2)}
        </pre>
      </div>
    </div>
  );
}