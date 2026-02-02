import { useState } from 'react';
import { Card, Button } from '../ui';
import { TrendingUp, Calendar, Package, AlertTriangle, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ForecastData {
  month: string;
  predicted: number;
  actual?: number;
  confidence: number;
}

interface ProductDemand {
  product: string;
  currentStock: number;
  predictedDemand: number;
  riskLevel: 'low' | 'medium' | 'high';
  trend: 'up' | 'down' | 'stable';
}

const mockForecastData: ForecastData[] = [
  { month: 'Jan', predicted: 1200, actual: 1150, confidence: 85 },
  { month: 'Feb', predicted: 1350, actual: 1320, confidence: 88 },
  { month: 'Mar', predicted: 1500, actual: 1480, confidence: 90 },
  { month: 'Apr', predicted: 1650, confidence: 87 },
  { month: 'May', predicted: 1800, confidence: 85 },
  { month: 'Jun', predicted: 1950, confidence: 82 },
];

const mockProductDemands: ProductDemand[] = [
  { product: 'Fresh Chicken', currentStock: 500, predictedDemand: 750, riskLevel: 'high', trend: 'up' },
  { product: 'Mutton Premium', currentStock: 200, predictedDemand: 180, riskLevel: 'low', trend: 'stable' },
  { product: 'Fish Fillet', currentStock: 150, predictedDemand: 220, riskLevel: 'medium', trend: 'up' },
  { product: 'Prawns Large', currentStock: 80, predictedDemand: 120, riskLevel: 'high', trend: 'up' },
  { product: 'Eggs Organic', currentStock: 300, predictedDemand: 280, riskLevel: 'low', trend: 'down' },
];

const riskColors = {
  low: '#10B981',
  medium: '#F59E0B', 
  high: '#EF4444'
};

export const ProductDemandForecast = () => {
  const [timeRange, setTimeRange] = useState('6months');

  const getRiskColor = (level: string) => riskColors[level as keyof typeof riskColors];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '↗️';
    if (trend === 'down') return '↘️';
    return '➡️';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold">Products Demand Forecast Analysis</h2>
            <p className="text-sm text-gray-600">AI-powered demand prediction and inventory planning</p>
          </div>
        </div>
        <div className="flex gap-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="3months">3 Months</option>
            <option value="6months">6 Months</option>
            <option value="12months">12 Months</option>
          </select>
          <Button size="sm" variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Forecast Accuracy</p>
              <p className="text-2xl font-bold text-green-600">87.5%</p>
            </div>
            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Risk Products</p>
              <p className="text-2xl font-bold text-red-600">2</p>
            </div>
            <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Predicted Growth</p>
              <p className="text-2xl font-bold text-blue-600">+15.2%</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Stock Coverage</p>
              <p className="text-2xl font-bold text-purple-600">18 Days</p>
            </div>
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Forecast Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Demand Forecast Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockForecastData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Actual Demand"
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="#3B82F6" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Predicted Demand"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Product Risk Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Product Risk Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Current Stock</th>
                <th className="text-left py-3 px-4">Predicted Demand</th>
                <th className="text-left py-3 px-4">Risk Level</th>
                <th className="text-left py-3 px-4">Trend</th>
                <th className="text-left py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockProductDemands.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{item.product}</td>
                  <td className="py-3 px-4">{item.currentStock} kg</td>
                  <td className="py-3 px-4">{item.predictedDemand} kg</td>
                  <td className="py-3 px-4">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: getRiskColor(item.riskLevel) }}
                    >
                      {item.riskLevel.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1">
                      {getTrendIcon(item.trend)}
                      <span className="capitalize">{item.trend}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {item.riskLevel === 'high' && (
                      <Button size="sm" variant="danger">
                        Reorder Now
                      </Button>
                    )}
                    {item.riskLevel === 'medium' && (
                      <Button size="sm" variant="secondary">
                        Monitor
                      </Button>
                    )}
                    {item.riskLevel === 'low' && (
                      <span className="text-green-600 text-sm">✓ Optimal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">AI Recommendations</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Urgent: Fresh Chicken Stock Alert</p>
              <p className="text-sm text-red-700">Current stock will run out in 3 days. Recommend ordering 400kg immediately.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Opportunity: Prawns Demand Surge</p>
              <p className="text-sm text-yellow-700">50% increase in demand predicted. Consider increasing stock by 30%.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <Package className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">Optimization: Eggs Organic Overstock</p>
              <p className="text-sm text-blue-700">Current stock exceeds predicted demand. Consider promotional pricing.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
