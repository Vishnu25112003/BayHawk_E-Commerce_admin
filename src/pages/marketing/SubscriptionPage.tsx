import { useState } from "react";
import { Card, Button, Input, Select, Modal, Badge } from "../../components/ui";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Target,
  TrendingUp,
  Users,
  Crown,
  Settings,
} from "lucide-react";
import { getStatusColor } from "../../utils/helpers";
import type { Subscription } from "../../types";

const mockSubscriptions: Subscription[] = [
  {
    id: "1",
    name: "Fresh Fish Weekly",
    description: "Weekly delivery of fresh fish varieties",
    subscriptionType: "weekly",
    price: 1200,
    originalPrice: 1500,
    discount: 20,
    duration: 7,
    features: [
      "Fresh fish selection",
      "Weekly delivery",
      "Free delivery",
      "Priority support",
    ],
    products: [
      {
        id: "1",
        name: "Premium Fish Mix",
        category: "Fish",
        quantity: "1kg",
        price: 800,
        isOptional: false,
      },
      {
        id: "2",
        name: "Seasonal Fish",
        category: "Fish",
        quantity: "500g",
        price: 400,
        isOptional: true,
      },
    ],
    deliverySchedule: {
      frequency: "weekly",
      preferredDay: "Saturday",
      timeSlot: "9:00 AM - 12:00 PM",
    },
    isActive: true,
    totalSubscribers: 450,
    activeSubscribers: 380,
    targetAudience: "all",
    benefits: {
      freeDelivery: true,
      prioritySupport: true,
      exclusiveDeals: true,
      customization: false,
    },
    createdBy: "Admin",
    createdAt: "2024-01-01",
  },
];

interface SubscriptionStatsProps {
  subscriptions: Subscription[];
}

function SubscriptionStats({ subscriptions }: SubscriptionStatsProps) {
  const totalSubscribers = subscriptions.reduce(
    (sum, sub) => sum + sub.activeSubscribers,
    0,
  );
  const totalRevenue = subscriptions.reduce(
    (sum, sub) => sum + sub.price * sub.activeSubscribers,
    0,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Crown className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Plans</p>
            <p className="text-xl font-bold">{subscriptions.length}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Target className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Active Plans</p>
            <p className="text-xl font-bold">
              {subscriptions.filter((s) => s.isActive).length}
            </p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Subscribers</p>
            <p className="text-xl font-bold">{totalSubscribers}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Monthly Revenue</p>
            <p className="text-xl font-bold">
              ₹{totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface SubscriptionFormProps {
  initialData?: Subscription;
  isReadOnly: boolean;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialTab?: string;
}

function SubscriptionForm({
  initialData,
  isReadOnly,
  onSubmit,
  onCancel,
  initialTab = "general",
}: SubscriptionFormProps) {
  const [data] = useState(initialData);
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  const tabs = [
    { id: "general", label: "General" },
    { id: "products", label: "Products" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "general" && (
        <div className="space-y-4">
          <Input
            label="Plan Name"
            defaultValue={data?.name}
            disabled={isReadOnly}
          />
          <textarea
            className="w-full rounded-lg border p-2"
            rows={3}
            defaultValue={data?.description}
            disabled={isReadOnly}
            placeholder="Description..."
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Type"
              defaultValue={data?.subscriptionType}
              disabled={isReadOnly}
              options={[
                { value: "weekly", label: "Weekly" },
                { value: "monthly", label: "Monthly" },
              ]}
            />
            <Input
              label="Price (₹)"
              type="number"
              defaultValue={data?.price}
              disabled={isReadOnly}
            />
          </div>
        </div>
      )}

      {activeTab === "products" && (
        <div>
          <h3 className="font-medium mb-2">Products Included</h3>
          <div className="space-y-2">
            {data?.products.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded"
              >
                <Input
                  defaultValue={p.name}
                  disabled={isReadOnly}
                  className="flex-1"
                />
                <Input
                  defaultValue={p.quantity}
                  disabled={isReadOnly}
                  className="w-24"
                />
                {!isReadOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {!isReadOnly && (
            <Button type="button" size="sm" className="mt-2">
              <Plus className="h-4 w-4 mr-1" /> Add Product
            </Button>
          )}
        </div>
      )}

      {activeTab === "settings" && (
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Features</h3>
            <div className="space-y-2">
              {data?.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    defaultValue={f}
                    disabled={isReadOnly}
                    className="flex-1"
                  />
                  {!isReadOnly && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {!isReadOnly && (
              <Button type="button" size="sm" className="mt-2">
                <Plus className="h-4 w-4 mr-1" /> Add Feature
              </Button>
            )}
          </div>
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Delivery</h3>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Frequency"
                defaultValue={data?.deliverySchedule.frequency}
                disabled={isReadOnly}
                options={[
                  { value: "weekly", label: "Weekly" },
                  { value: "monthly", label: "Monthly" },
                ]}
              />
              <Input
                label="Preferred Day"
                defaultValue={data?.deliverySchedule.preferredDay}
                disabled={isReadOnly}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Close
        </Button>
        {!isReadOnly && <Button type="submit">Save Plan</Button>}
      </div>
    </form>
  );
}

export function SubscriptionPage() {
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(mockSubscriptions);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<
    Subscription | undefined
  >();
  const [initialTab, setInitialTab] = useState("general");

  const handleOpenForm = (
    subscription?: Subscription,
    readOnly = false,
    tab = "general",
  ) => {
    setSelectedSubscription(subscription);
    setIsReadOnly(readOnly);
    setInitialTab(tab);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedSubscription(undefined);
  };

  const handleSave = (data: Subscription) => {
    console.log("Saving:", data);
    handleCloseForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure?")) {
      setSubscriptions(subscriptions.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Subscription Management</h1>
          <p className="text-gray-600">Create and manage subscription plans</p>
        </div>
        <Button onClick={() => handleOpenForm(undefined, false)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Subscription
        </Button>
      </div>

      <SubscriptionStats subscriptions={subscriptions} />

      <Card>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search subscriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 flex-1"
          />
          <Select
            options={[
              { value: "", label: "All Status" },
              { value: "active", label: "Active" },
            ]}
          />
          <Select
            options={[
              { value: "", label: "All Types" },
              { value: "weekly", label: "Weekly" },
            ]}
          />
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Subscribers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptions.map((sub) => (
                <tr key={sub.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium">{sub.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    ₹{sub.price} / {sub.subscriptionType}
                  </td>
                  <td className="px-6 py-4">{sub.activeSubscribers}</td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={getStatusColor(
                        sub.isActive ? "active" : "inactive",
                      )}
                    >
                      {sub.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenForm(sub, true)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenForm(sub, false)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenForm(sub, false, "settings")}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(sub.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={
          isReadOnly
            ? "View Plan"
            : selectedSubscription
              ? "Edit Plan"
              : "Create Plan"
        }
        size="lg"
      >
        <SubscriptionForm
          initialData={selectedSubscription}
          isReadOnly={isReadOnly}
          onSubmit={handleSave}
          onCancel={handleCloseForm}
          initialTab={initialTab}
        />
      </Modal>
    </div>
  );
}
