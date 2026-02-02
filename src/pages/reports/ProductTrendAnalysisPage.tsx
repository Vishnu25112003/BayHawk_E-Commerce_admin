import { ProductTrendAnalysis } from '../../components/reports/ProductTrendAnalysis';
import { DashboardFilters } from '../../components/dashboard/DashboardFilters';
import type { FilterOptions } from '../../components/dashboard/DashboardFilters';
import { useState } from 'react';

export function ProductTrendAnalysisPage() {
  const [filters, setFilters] = useState<FilterOptions>({});

  // TODO: Implement filter functionality for trend analysis
  console.log('Product trend analysis filters:', filters);

  return (
    <div className="p-6 space-y-6">
      <DashboardFilters
        onFiltersChange={setFilters}
        statusOptions={[
          { value: 'trending_up', label: 'Trending Up' },
          { value: 'trending_down', label: 'Trending Down' },
          { value: 'stable', label: 'Stable' },
          { value: 'volatile', label: 'Volatile' }
        ]}
        categoryOptions={[
          { value: 'poultry', label: 'Poultry' },
          { value: 'meat', label: 'Meat' },
          { value: 'seafood', label: 'Seafood' },
          { value: 'dairy', label: 'Dairy' },
          { value: 'processed', label: 'Processed' }
        ]}
      />
      <ProductTrendAnalysis />
    </div>
  );
}
