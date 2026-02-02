import { useState } from 'react';
import { DashboardFilters } from '../../components/dashboard/DashboardFilters';
import type { FilterOptions } from '../../components/dashboard/DashboardFilters';
import { TaxGSTReports } from '../../components/reports/TaxGSTReports';

export function TaxGSTReportPage() {
  const [filters, setFilters] = useState<FilterOptions>({});

  console.log('Tax GST report filters:', filters);

  return (
    <div className="p-6 space-y-6">
      <DashboardFilters
        onFiltersChange={setFilters}
        statusOptions={[
          { value: 'filed', label: 'Filed' },
          { value: 'pending', label: 'Pending' },
          { value: 'overdue', label: 'Overdue' }
        ]}
        categoryOptions={[
          { value: 'cgst', label: 'CGST' },
          { value: 'sgst', label: 'SGST' },
          { value: 'igst', label: 'IGST' },
          { value: 'cess', label: 'CESS' }
        ]}
      />
      <TaxGSTReports />
    </div>
  );
}
