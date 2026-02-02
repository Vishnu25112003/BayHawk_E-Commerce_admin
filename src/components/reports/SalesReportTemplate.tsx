import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IndianRupee, ShoppingCart, Users, Building2, Store } from 'lucide-react';
import { ReportHeader } from './ReportHeader';
import { MetricCard } from './MetricCard';
import { ChartSection } from './ChartSection';
import { DetailedSection } from './DetailedSection';
import { Card, Button } from '../ui';
import { salesData } from './reportData';

export function SalesReportTemplate() {
  const [dateRange, setDateRange] = useState('today');
  const [viewMode, setViewMode] = useState('monthly');
  const location = useLocation();

  const getCurrentModule = () => {
    if (location.pathname.includes('/hub/')) return 'hub';
    if (location.pathname.includes('/store/')) return 'store';
    return 'super_admin';
  };

  const currentModule = getCurrentModule();
  const data = salesData[currentModule];

  const handleScheduleReport = () => {
    alert(`Schedule ${currentModule} sales report functionality`);
  };

  const handleExportReport = () => {
    alert(`Exporting ${currentModule} sales report...`);
  };

  const icons = [IndianRupee, ShoppingCart, IndianRupee, Users];
  const iconColors = ['bg-blue-50 text-blue-600', 'bg-green-50 text-green-600', 'bg-purple-50 text-purple-600', 'bg-orange-50 text-orange-600'];

  return (
    <div className="space-y-6">
      <ReportHeader
        title="Sales Report"
        description="Revenue, orders, and sales performance analytics"
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onSchedule={handleScheduleReport}
        onExport={handleExportReport}
      />

      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {data.metrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
            icon={icons[index]}
            iconColor={iconColors[index]}
          />
        ))}
      </div>

      {/* Sales Trend Chart */}
      <ChartSection
        title="Sales Trend"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        viewOptions={[
          { value: 'hourly', label: 'Hourly' },
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' },
        ]}
      />

      {/* Detailed Hub & Store Reports */}
      {currentModule === 'super_admin' && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold">Detailed Reports by Location</h2>
          </div>
          
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <DetailedSection
              title="Hub Performance"
              icon={Building2}
              data={salesData.hub}
              type="hub"
            />
            <DetailedSection
              title="Store Performance"
              icon={Store}
              data={salesData.store}
              type="store"
            />
          </div>
        </>
      )}

      {/* Top Products */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-lg font-semibold">Top Selling Products</h2>
          <Button variant="secondary" size="sm" onClick={() => alert('View all products')}>
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <div className="space-y-4 min-w-full">
            {data.topProducts.map((product, index) => (
              <div key={product.name} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b last:border-0 gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <span className="font-medium">{product.name}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="text-gray-600">{product.orders} orders</span>
                  <span className="font-semibold">{product.sales}</span>
                  <span className="text-green-600">{product.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
