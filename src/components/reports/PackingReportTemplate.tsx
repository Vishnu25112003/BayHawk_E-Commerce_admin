import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Package, Clock, Users, CheckCircle, Building2, Store } from 'lucide-react';
import { ReportHeader } from './ReportHeader';
import { MetricCard } from './MetricCard';
import { ChartSection } from './ChartSection';
import { DetailedSection } from './DetailedSection';
import { packingData } from './reportData';

export function PackingReportTemplate() {
  const [dateRange, setDateRange] = useState('today');
  const [viewMode, setViewMode] = useState('daily');
  const location = useLocation();

  const getCurrentModule = () => {
    if (location.pathname.includes('/hub/')) return 'hub';
    if (location.pathname.includes('/store/')) return 'store';
    return 'super_admin';
  };

  const currentModule = getCurrentModule();
  const data = packingData[currentModule];

  const handleScheduleReport = () => {
    alert(`Schedule ${currentModule} packing report functionality`);
  };

  const handleExportReport = () => {
    alert(`Exporting ${currentModule} packing report...`);
  };

  const icons = [Package, Clock, Users, CheckCircle];
  const iconColors = ['bg-blue-50 text-blue-600', 'bg-green-50 text-green-600', 'bg-purple-50 text-purple-600', 'bg-orange-50 text-orange-600'];

  return (
    <div className="space-y-6">
      <ReportHeader
        title="Packing Report"
        description="Items packed, time taken, and team performance"
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

      {/* Packing Performance Chart */}
      <ChartSection
        title="Packing Performance"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        viewOptions={[
          { value: 'hourly', label: 'Hourly' },
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
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
              title="Hub Packing"
              icon={Building2}
              data={packingData.hub}
              type="hub"
            />
            <DetailedSection
              title="Store Packing"
              icon={Store}
              data={packingData.store}
              type="store"
            />
          </div>
        </>
      )}
    </div>
  );
}
