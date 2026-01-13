import { useState } from "react";
import { Card, Button, Input, Select } from "../components/ui";
import {
  Save,
  Bell,
  Mail,
  Smartphone,
  Eye,
  Edit,
  Plus,
  Volume2,
} from "lucide-react";

interface NotificationTemplate {
  id: string;
  name: string;
  type: "email" | "sms" | "push" | "whatsapp";
  trigger: string;
  subject?: string;
  content: string;
  isActive: boolean;
  variables: string[];
}

export function NotificationCustomizationPage() {
  const [notificationSettings, setNotificationSettings] = useState({
    newOrderAlerts: true,
    lowStockAlerts: true,
    paymentFailureAlerts: true,
    customerSupportAlerts: true,
    dailySummaryEmail: true,
    orderStatusUpdates: true,
    promotionalEmails: false,
    maintenanceAlerts: true,
  });

  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: "1",
      name: "Order Confirmation",
      type: "email",
      trigger: "order_placed",
      subject: "Order Confirmed - #{order_id}",
      content:
        "Dear {customer_name}, your order #{order_id} has been confirmed. Total amount: {order_total}. Expected delivery: {delivery_date}.",
      isActive: true,
      variables: ["customer_name", "order_id", "order_total", "delivery_date"],
    },
    {
      id: "2",
      name: "Order Status Update",
      type: "sms",
      trigger: "order_status_changed",
      content:
        "Hi {customer_name}, your order #{order_id} is now {order_status}. Track: {tracking_url}",
      isActive: true,
      variables: ["customer_name", "order_id", "order_status", "tracking_url"],
    },
    {
      id: "3",
      name: "Low Stock Alert",
      type: "email",
      trigger: "low_stock",
      subject: "Low Stock Alert - {product_name}",
      content:
        "Product {product_name} is running low. Current stock: {current_stock}. Minimum threshold: {min_threshold}.",
      isActive: true,
      variables: ["product_name", "current_stock", "min_threshold"],
    },
    {
      id: "4",
      name: "Payment Failed",
      type: "push",
      trigger: "payment_failed",
      content:
        "Payment failed for order #{order_id}. Please try again or contact support.",
      isActive: true,
      variables: ["order_id", "customer_name"],
    },
  ]);

  const [selectedTemplate, setSelectedTemplate] =
    useState<NotificationTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const notificationTypes = [
    { value: "email", label: "Email", icon: Mail, color: "text-blue-600" },
    { value: "sms", label: "SMS", icon: Smartphone, color: "text-green-600" },
    {
      value: "push",
      label: "Push Notification",
      icon: Bell,
      color: "text-purple-600",
    },
    {
      value: "whatsapp",
      label: "WhatsApp",
      icon: Smartphone,
      color: "text-green-600",
    },
  ];

  const toggleNotificationSetting = (key: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const addNewTemplate = () => {
    const newTemplate: NotificationTemplate = {
      id: Date.now().toString(),
      name: "New Template",
      type: "email",
      trigger: "custom",
      subject: "",
      content: "",
      isActive: false,
      variables: [],
    };
    setTemplates([...templates, newTemplate]);
    setSelectedTemplate(newTemplate);
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notification Customization</h1>
          <p className="text-gray-600">
            Configure notification settings and templates
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={addNewTemplate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Template
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save All Changes
          </Button>
        </div>
      </div>

      {/* Notification Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-blue-50 p-2">
            <Bell className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Notification Settings</h2>
            <p className="text-sm text-gray-600">
              Enable or disable notification types
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              key: "newOrderAlerts",
              label: "New Order Alerts",
              desc: "Get notified when a new order is placed",
            },
            {
              key: "lowStockAlerts",
              label: "Low Stock Alerts",
              desc: "Alert when product stock falls below threshold",
            },
            {
              key: "paymentFailureAlerts",
              label: "Payment Failure Alerts",
              desc: "Notify on payment failures",
            },
            {
              key: "customerSupportAlerts",
              label: "Customer Support Alerts",
              desc: "New support tickets and messages",
            },
            {
              key: "dailySummaryEmail",
              label: "Daily Summary Email",
              desc: "Receive daily sales and order summary",
            },
            {
              key: "orderStatusUpdates",
              label: "Order Status Updates",
              desc: "Notify customers about order status changes",
            },
            {
              key: "promotionalEmails",
              label: "Promotional Emails",
              desc: "Send marketing and promotional content",
            },
            {
              key: "maintenanceAlerts",
              label: "Maintenance Alerts",
              desc: "System maintenance and downtime notifications",
            },
          ].map((setting) => (
            <div
              key={setting.key}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium text-sm">{setting.label}</p>
                <p className="text-xs text-gray-500">{setting.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    notificationSettings[
                      setting.key as keyof typeof notificationSettings
                    ]
                  }
                  onChange={() => toggleNotificationSetting(setting.key)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Notification Templates */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-green-50 p-2">
            <Edit className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Notification Templates</h2>
            <p className="text-sm text-gray-600">
              Customize notification messages and content
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {templates.map((template) => {
            const TypeIcon =
              notificationTypes.find((t) => t.value === template.type)?.icon ||
              Bell;
            const typeColor =
              notificationTypes.find((t) => t.value === template.type)?.color ||
              "text-gray-600";

            return (
              <div key={template.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={template.isActive}
                        onChange={(e) => {
                          setTemplates(
                            templates.map((t) =>
                              t.id === template.id
                                ? { ...t, isActive: e.target.checked }
                                : t,
                            ),
                          );
                        }}
                        className="rounded"
                      />
                      <TypeIcon className={`h-4 w-4 ${typeColor}`} />
                      <span className="font-medium">{template.name}</span>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs capitalize">
                      {template.type}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                      {template.trigger.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setIsEditing(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {template.subject && (
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">Subject:</span>
                    <p className="text-sm font-medium">{template.subject}</p>
                  </div>
                )}

                <div className="mb-3">
                  <span className="text-xs text-gray-500">Content:</span>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {template.content}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {template.variables.map((variable) => (
                    <span
                      key={variable}
                      className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs"
                    >
                      {`{${variable}}`}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Email Configuration */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-purple-50 p-2">
            <Mail className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Email Configuration</h2>
            <p className="text-sm text-gray-600">
              Configure email sender settings
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="From Name"
              defaultValue="BAYHAWK"
              placeholder="Your Business Name"
            />
            <Input
              label="From Email"
              type="email"
              defaultValue="noreply@bayhawk.com"
              placeholder="noreply@yourdomain.com"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Reply-To Email"
              type="email"
              defaultValue="support@bayhawk.com"
              placeholder="support@yourdomain.com"
            />
            <Select
              label="Email Provider"
              options={[
                { value: "sendgrid", label: "SendGrid" },
                { value: "mailgun", label: "Mailgun" },
                { value: "ses", label: "Amazon SES" },
                { value: "smtp", label: "Custom SMTP" },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Signature
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              defaultValue="Best regards,&#10;BAYHAWK Team&#10;support@bayhawk.com&#10;+91 9876543210"
            />
          </div>
        </div>
      </Card>

      {/* SMS Configuration */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-orange-50 p-2">
            <Smartphone className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">SMS Configuration</h2>
            <p className="text-sm text-gray-600">
              Configure SMS notification settings
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Sender ID"
              defaultValue="BAYHWK"
              placeholder="SENDER"
              maxLength={6}
            />
            <Select
              label="SMS Provider"
              options={[
                { value: "twilio", label: "Twilio" },
                { value: "textlocal", label: "TextLocal" },
                { value: "msg91", label: "MSG91" },
                { value: "custom", label: "Custom Gateway" },
              ]}
            />
            <Input
              label="Character Limit"
              type="number"
              defaultValue="160"
              min="70"
              max="1600"
            />
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-yellow-800">
                SMS Usage Guidelines
              </span>
            </div>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Keep messages under 160 characters for single SMS</li>
              <li>
                • Use approved sender ID registered with telecom operators
              </li>
              <li>• Include opt-out instructions for promotional messages</li>
              <li>
                • Avoid sending messages during restricted hours (9 PM - 9 AM)
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Template Editor Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={() => {
                setSelectedTemplate(null);
                setIsEditing(false);
              }}
            />
            <Card className="relative w-full max-w-3xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">
                    {isEditing ? "Edit" : "View"} Template:{" "}
                    {selectedTemplate.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedTemplate.type.toUpperCase()} •{" "}
                    {selectedTemplate.trigger.replace("_", " ")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedTemplate(null);
                      setIsEditing(false);
                    }}
                  >
                    ×
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Template Name"
                    value={selectedTemplate.name}
                    disabled={!isEditing}
                  />
                  <Select
                    label="Notification Type"
                    value={selectedTemplate.type}
                    disabled={!isEditing}
                    options={notificationTypes.map((type) => ({
                      value: type.value,
                      label: type.label,
                    }))}
                  />
                </div>

                {selectedTemplate.type === "email" && (
                  <Input
                    label="Subject Line"
                    value={selectedTemplate.subject || ""}
                    disabled={!isEditing}
                    placeholder="Enter email subject"
                  />
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Content
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    rows={6}
                    value={selectedTemplate.content}
                    disabled={!isEditing}
                    placeholder="Enter notification content..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Variables
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.variables.map((variable) => (
                      <button
                        key={variable}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                        onClick={() => {
                          // Copy variable to clipboard
                          navigator.clipboard.writeText(`{${variable}}`);
                        }}
                      >
                        {`{${variable}}`}
                      </button>
                    ))}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                      variant="secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Save Template
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
