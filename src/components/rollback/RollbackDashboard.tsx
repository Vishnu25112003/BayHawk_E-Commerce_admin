import { useState } from 'react';
import { Card } from '../ui';
import { ProductRollbackDemo } from '../examples/rollback/ProductRollbackDemo';
import { SystemRollbackDemo } from '../examples/rollback/SystemRollbackDemo';
import { RollbackHistory } from './RollbackHistory';
import { RotateCcw, Package, Settings, History } from 'lucide-react';

export const RollbackDashboard = () => {
  const [activeTab, setActiveTab] = useState('product');

  const tabs = [
    { id: 'product', label: 'Product Management', icon: Package },
    { id: 'system', label: 'System Management', icon: Settings },
    { id: 'history', label: 'Global History', icon: History },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <RotateCcw className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Rollback & Data Recovery</h1>
          <p className="text-gray-600">Restore previous states for data recovery</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'product' && <ProductRollbackDemo />}
      {activeTab === 'system' && <SystemRollbackDemo />}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Global Rollback History</h2>
            <p className="text-gray-600 mb-6">
              View all rollback entries across the entire system. This includes all entity types and operations.
            </p>
            <RollbackHistory />
          </Card>
        </div>
      )}

      {/* Info Panel */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <RotateCcw className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">How Rollback Works</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Every data change is automatically tracked with timestamps</li>
              <li>• Previous states are stored securely for recovery</li>
              <li>• Rollback operations create new history entries for audit trails</li>
              <li>• History is persisted locally and can be cleared when needed</li>
              <li>• Each rollback requires confirmation to prevent accidental data loss</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
