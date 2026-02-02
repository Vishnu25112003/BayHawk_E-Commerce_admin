import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Package, Clock, Users, CheckCircle, Building2, Store, User, Box, Timer, Target } from 'lucide-react';
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

  // Dummy packing team data
  const packingTeam = [
    { id: 'PK001', name: 'Ramesh Kumar', shift: 'Morning', itemsPacked: 145, avgTime: '3.2m', efficiency: '98%', status: 'Active' },
    { id: 'PK002', name: 'Sita Sharma', shift: 'Morning', itemsPacked: 132, avgTime: '3.8m', efficiency: '95%', status: 'Active' },
    { id: 'PK003', name: 'Arjun Singh', shift: 'Afternoon', itemsPacked: 156, avgTime: '2.9m', efficiency: '99%', status: 'Break' },
    { id: 'PK004', name: 'Priya Patel', shift: 'Afternoon', itemsPacked: 128, avgTime: '4.1m', efficiency: '92%', status: 'Active' },
    { id: 'PK005', name: 'Vijay Reddy', shift: 'Evening', itemsPacked: 98, avgTime: '3.5m', efficiency: '96%', status: 'Active' },
  ];

  // Dummy packing queue data
  const packingQueue = [
    { id: 'ORD001', customer: 'Rajesh Kumar', items: 8, priority: 'High', estimatedTime: '12m', assignedTo: 'Ramesh Kumar', status: 'In Progress' },
    { id: 'ORD002', customer: 'Meera Sharma', items: 5, priority: 'Medium', estimatedTime: '8m', assignedTo: 'Sita Sharma', status: 'Pending' },
    { id: 'ORD003', customer: 'Kiran Patel', items: 12, priority: 'High', estimatedTime: '18m', assignedTo: 'Arjun Singh', status: 'Completed' },
    { id: 'ORD004', customer: 'Suresh Reddy', items: 6, priority: 'Low', estimatedTime: '10m', assignedTo: 'Priya Patel', status: 'Pending' },
    { id: 'ORD005', customer: 'Anita Devi', items: 9, priority: 'Medium', estimatedTime: '14m', assignedTo: 'Vijay Reddy', status: 'In Progress' },
  ];

  const handleScheduleReport = () => {
    alert(`Schedule ${currentModule} packing report functionality`);
  };

  const handleExportReport = () => {
    alert(`Exporting ${currentModule} packing report...`);
  };

  const icons = [Package, Clock, Users, CheckCircle];
  const iconColors = ['bg-blue-50 text-blue-600', 'bg-green-50 text-green-600', 'bg-purple-50 text-purple-600', 'bg-orange-50 text-orange-600'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Break': return 'bg-yellow-100 text-yellow-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getEfficiencyColor = (efficiency: string) => {
    const value = parseInt(efficiency);
    if (value >= 98) return 'text-green-600';
    if (value >= 95) return 'text-blue-600';
    if (value >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

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

      {/* Packing Team Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Packing Team Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Packer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Shift</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Items Packed</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Avg Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Efficiency</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {packingTeam.map((packer) => (
                <tr key={packer.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {packer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{packer.name}</p>
                        <p className="text-sm text-gray-500">{packer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700">{packer.shift}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Box className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{packer.itemsPacked}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{packer.avgTime}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-gray-400" />
                      <span className={`font-medium ${getEfficiencyColor(packer.efficiency)}`}>
                        {packer.efficiency}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(packer.status)}`}>
                      {packer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Packing Queue */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Packing Queue</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Order ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Items</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Priority</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Est. Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Assigned To</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {packingQueue.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-medium text-blue-600">{order.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{order.customer}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{order.items}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                      {order.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{order.estimatedTime}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700">{order.assignedTo}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
