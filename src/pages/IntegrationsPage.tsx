import { useState } from 'react';
import { Card, Button, Input } from '../components/ui';
import { Save, Link, CheckCircle, XCircle, Settings, Key, Globe, Smartphone, Mail, CreditCard, MapPin, BarChart3 } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  connected: boolean;
  status: 'active' | 'inactive' | 'error';
  category: 'payment' | 'communication' | 'analytics' | 'location' | 'other';
  config?: Record<string, any>;
}

export function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'razorpay',
      name: 'Razorpay',
      description: 'Payment Gateway for secure online transactions',
      icon: CreditCard,
      connected: true,
      status: 'active',
      category: 'payment',
      config: {
        keyId: 'rzp_test_****',
        keySecret: '****',
        webhookSecret: '****'
      }
    },
    {
      id: 'google-maps',
      name: 'Google Maps',
      description: 'Location services and route optimization',
      icon: MapPin,
      connected: true,
      status: 'active',
      category: 'location',
      config: {
        apiKey: 'AIza****'
      }
    },
    {
      id: 'sms-gateway',
      name: 'SMS Gateway',
      description: 'OTP and notification SMS service',
      icon: Smartphone,
      connected: true,
      status: 'active',
      category: 'communication',
      config: {
        apiKey: 'sms_****',
        senderId: 'BAYHWK'
      }
    },
    {
      id: 'whatsapp-business',
      name: 'WhatsApp Business',
      description: 'Order updates and customer communication',
      icon: Smartphone,
      connected: false,
      status: 'inactive',
      category: 'communication'
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Website and app analytics tracking',
      icon: BarChart3,
      connected: false,
      status: 'inactive',
      category: 'analytics'
    },
    {
      id: 'firebase',
      name: 'Firebase',
      description: 'Push notifications and app analytics',
      icon: Globe,
      connected: true,
      status: 'error',
      category: 'other',
      config: {
        projectId: 'bayhawk-****',
        apiKey: 'AIza****'
      }
    },
    {
      id: 'sendgrid',
      name: 'SendGrid',
      description: 'Email delivery service for notifications',
      icon: Mail,
      connected: false,
      status: 'inactive',
      category: 'communication'
    },
    {
      id: 'payu',
      name: 'PayU',
      description: 'Alternative payment gateway',
      icon: CreditCard,
      connected: false,
      status: 'inactive',
      category: 'payment'
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { 
            ...integration, 
            connected: !integration.connected,
            status: !integration.connected ? 'active' : 'inactive'
          }
        : integration
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'error': return XCircle;
      default: return XCircle;
    }
  };

  const categories = [
    { key: 'payment', label: 'Payment Gateways', color: 'bg-green-50 text-green-700' },
    { key: 'communication', label: 'Communication', color: 'bg-blue-50 text-blue-700' },
    { key: 'location', label: 'Location Services', color: 'bg-purple-50 text-purple-700' },
    { key: 'analytics', label: 'Analytics', color: 'bg-orange-50 text-orange-700' },
    { key: 'other', label: 'Other Services', color: 'bg-gray-50 text-gray-700' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-gray-600">Connect and configure third-party services</p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save All Changes
        </Button>
      </div>

      {/* Integration Categories */}
      {categories.map(category => {
        const categoryIntegrations = integrations.filter(i => i.category === category.key);
        if (categoryIntegrations.length === 0) return null;

        return (
          <Card key={category.key}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`rounded-lg p-2 ${category.color.replace('text-', 'bg-').replace('-700', '-100')}`}>
                <Link className={`h-5 w-5 ${category.color}`} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{category.label}</h2>
                <p className="text-sm text-gray-600">{categoryIntegrations.length} services available</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {categoryIntegrations.map((integration) => {
                const StatusIcon = getStatusIcon(integration.status);
                return (
                  <div key={integration.id} className="border rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-gray-100 p-2">
                          <integration.icon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{integration.name}</h3>
                          <p className="text-sm text-gray-500">{integration.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 ${getStatusColor(integration.status)}`} />
                        <span className={`text-sm ${getStatusColor(integration.status)}`}>
                          {integration.connected ? 
                            (integration.status === 'error' ? 'Error' : 'Connected') : 
                            'Not Connected'
                          }
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={integration.connected}
                            onChange={() => toggleIntegration(integration.id)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                        <span className="text-sm text-gray-600">
                          {integration.connected ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedIntegration(integration)}
                        disabled={!integration.connected}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                    </div>

                    {integration.status === 'error' && (
                      <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        Configuration error. Please check your settings.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}

      {/* Configuration Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setSelectedIntegration(null)} />
            <Card className="relative w-full max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <selectedIntegration.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{selectedIntegration.name} Configuration</h2>
                    <p className="text-sm text-gray-600">{selectedIntegration.description}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIntegration(null)}
                >
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                {selectedIntegration.id === 'razorpay' && (
                  <>
                    <Input
                      label="Key ID"
                      value={selectedIntegration.config?.keyId || ''}
                      placeholder="rzp_test_xxxxxxxxxx"
                    />
                    <Input
                      label="Key Secret"
                      type="password"
                      value={selectedIntegration.config?.keySecret || ''}
                      placeholder="Enter your Razorpay key secret"
                    />
                    <Input
                      label="Webhook Secret"
                      type="password"
                      value={selectedIntegration.config?.webhookSecret || ''}
                      placeholder="Enter webhook secret"
                    />
                    <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                      <p className="font-medium mb-1">Webhook URL:</p>
                      <code className="text-xs">https://yourdomain.com/api/webhooks/razorpay</code>
                    </div>
                  </>
                )}

                {selectedIntegration.id === 'google-maps' && (
                  <>
                    <Input
                      label="API Key"
                      value={selectedIntegration.config?.apiKey || ''}
                      placeholder="AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Enabled APIs</label>
                      {['Maps JavaScript API', 'Geocoding API', 'Directions API', 'Places API'].map(api => (
                        <label key={api} className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm">{api}</span>
                        </label>
                      ))}
                    </div>
                  </>
                )}

                {selectedIntegration.id === 'sms-gateway' && (
                  <>
                    <Input
                      label="API Key"
                      value={selectedIntegration.config?.apiKey || ''}
                      placeholder="Enter SMS gateway API key"
                    />
                    <Input
                      label="Sender ID"
                      value={selectedIntegration.config?.senderId || ''}
                      placeholder="BAYHWK"
                      maxLength={6}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="OTP Template ID"
                        placeholder="1234567890"
                      />
                      <Input
                        label="Order Update Template ID"
                        placeholder="1234567891"
                      />
                    </div>
                  </>
                )}

                {selectedIntegration.id === 'firebase' && (
                  <>
                    <Input
                      label="Project ID"
                      value={selectedIntegration.config?.projectId || ''}
                      placeholder="your-project-id"
                    />
                    <Input
                      label="API Key"
                      value={selectedIntegration.config?.apiKey || ''}
                      placeholder="AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Service Account Key</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Key className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Upload service account JSON file</p>
                        <Button variant="secondary" size="sm">Choose File</Button>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="secondary" onClick={() => setSelectedIntegration(null)}>
                    Cancel
                  </Button>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Integration Status Summary */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-indigo-50 p-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Integration Status</h2>
            <p className="text-sm text-gray-600">Overview of all integrations</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {integrations.filter(i => i.status === 'active').length}
            </div>
            <div className="text-sm text-green-600">Active</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {integrations.filter(i => i.status === 'error').length}
            </div>
            <div className="text-sm text-red-600">Errors</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">
              {integrations.filter(i => i.status === 'inactive').length}
            </div>
            <div className="text-sm text-gray-600">Inactive</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {integrations.length}
            </div>
            <div className="text-sm text-blue-600">Total</div>
          </div>
        </div>
      </Card>
    </div>
  );
}