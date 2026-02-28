import { useState } from 'react';
import { Card, Button, Input, Modal } from '../ui';
import { Plus, Edit, Crown, Gift, TrendingUp, Users, Wallet, Truck, Zap, DollarSign, Star, Sparkles, Shield } from 'lucide-react';

interface MembershipBenefit {
  id: string;
  type: 'free_delivery' | 'no_surge' | 'welcome_wallet' | 'extra_discount' | 'priority_order' | 'faster_delivery' | 'special_rewards';
  label: string;
  value: string;
  isEditable: boolean;
}

interface MembershipPlan {
  id: string;
  name: string;
  duration: number;
  price: number;
  monthlyEquivalent: number;
  benefits: MembershipBenefit[];
  welcomeWallet: number;
  walletExpiry: number;
  discountPercentage: number;
  isActive: boolean;
  createdAt: string;
}

interface MarketingPlacement {
  id: string;
  location: 'homepage_banner' | 'flash_banner' | 'product_page' | 'cart_page' | 'checkout_page';
  title: string;
  message: string;
  ctaText: string;
  isActive: boolean;
}

interface Analytics {
  totalMembers: number;
  activeMembers: number;
  revenue: number;
  conversionRate: number;
  avgSavings: number;
  avgOrderValue: number;
}

const dummyPlan: MembershipPlan = {
  id: '1',
  name: 'Bay Hawk Elite',
  duration: 365,
  price: 1299,
  monthlyEquivalent: 108,
  benefits: [
    { id: 'b1', type: 'free_delivery', label: 'Free Delivery from ₹349', value: 'Non-members pay delivery charges on every order', isEditable: true },
    { id: 'b2', type: 'priority_order', label: 'Priority Processing & Faster Delivery', value: 'Get priority during busy hours', isEditable: false },
    { id: 'b3', type: 'welcome_wallet', label: '₹300 Welcome Cash in Wallet', value: 'Ready to use on your next order', isEditable: true },
    { id: 'b4', type: 'extra_discount', label: 'Save 10% Extra on Premium Cuts', value: 'Pomfret, tiger prawns, lobster & more', isEditable: true },
    { id: 'b5', type: 'no_surge', label: 'Never Pay Surge Pricing', value: 'Same price in rain, weekends and peak hours', isEditable: false },
    { id: 'b6', type: 'special_rewards', label: 'Little Surprises', value: 'On birthdays, anniversaries and festivals', isEditable: true }
  ],
  welcomeWallet: 300,
  walletExpiry: 60,
  discountPercentage: 10,
  isActive: true,
  createdAt: '2024-02-10'
};

const dummyPlacements: MarketingPlacement[] = [
  {
    id: 'p1',
    location: 'homepage_banner',
    title: 'Join Elite Membership',
    message: 'Save more on every order with exclusive benefits',
    ctaText: 'Join Now',
    isActive: true
  },
  {
    id: 'p2',
    location: 'checkout_page',
    title: 'Elite Members Save More',
    message: 'Save delivery charges + surge fee + extra 10% discount on selected products',
    ctaText: 'Join Membership & Save',
    isActive: true
  },
  {
    id: 'p3',
    location: 'cart_page',
    title: 'Unlock Member Benefits',
    message: 'Get free delivery and exclusive discounts',
    ctaText: 'Become a Member',
    isActive: true
  }
];

const dummyAnalytics: Analytics = {
  totalMembers: 1250,
  activeMembers: 1180,
  revenue: 1623750,
  conversionRate: 8.5,
  avgSavings: 450,
  avgOrderValue: 850
};

export const MembershipConfig = () => {
  const [plan] = useState<MembershipPlan>(dummyPlan);
  const [placements, setPlacements] = useState<MarketingPlacement[]>(dummyPlacements);
  const [analytics] = useState<Analytics>(dummyAnalytics);
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [showEditBenefitModal, setShowEditBenefitModal] = useState(false);
  const [showEditPlacementModal, setShowEditPlacementModal] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<MembershipBenefit | null>(null);
  const [selectedPlacement, setSelectedPlacement] = useState<MarketingPlacement | null>(null);

  const handleEditBenefit = (benefit: MembershipBenefit) => {
    setSelectedBenefit(benefit);
    setShowEditBenefitModal(true);
  };

  const handleEditPlacement = (placement: MarketingPlacement) => {
    setSelectedPlacement(placement);
    setShowEditPlacementModal(true);
  };

  const togglePlacementStatus = (id: string) => {
    setPlacements(placements.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  return (
    <div className="space-y-6">
      {/* Header with Hook */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bay Hawk Elite Membership</h1>
            <p className="text-gray-600 mt-1">Configure membership plans, benefits, and marketing</p>
          </div>
          <Button onClick={() => setShowEditPlanModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Edit className="h-4 w-4 mr-2" />
            Edit Plan
          </Button>
        </div>
        
        {/* Marketing Hook */}
        <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 rounded-full">
              <Shield className="h-8 w-8 text-amber-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                "The Only Seafood Membership That Guarantees Your Price"
              </h2>
              <p className="text-gray-700">
                Join Bay Hawk Elite and enjoy exclusive benefits designed for seafood lovers who value quality, savings, and convenience.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-600" />
            <p className="text-sm text-gray-600">Total Members</p>
          </div>
          <p className="text-2xl font-bold">{analytics.totalMembers}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-4 w-4 text-amber-600" />
            <p className="text-sm text-gray-600">Active</p>
          </div>
          <p className="text-2xl font-bold">{analytics.activeMembers}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <p className="text-sm text-gray-600">Revenue</p>
          </div>
          <p className="text-2xl font-bold">₹{(analytics.revenue / 1000).toFixed(0)}K</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            <p className="text-sm text-gray-600">Conversion</p>
          </div>
          <p className="text-2xl font-bold">{analytics.conversionRate}%</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="h-4 w-4 text-emerald-600" />
            <p className="text-sm text-gray-600">Avg Savings</p>
          </div>
          <p className="text-2xl font-bold">₹{analytics.avgSavings}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-4 w-4 text-purple-600" />
            <p className="text-sm text-gray-600">Avg Order</p>
          </div>
          <p className="text-2xl font-bold">₹{analytics.avgOrderValue}</p>
        </Card>
      </div>

      {/* Current Plan with Enhanced Benefits */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Crown className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
              <p className="text-sm text-gray-600">{plan.duration} days membership</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">₹{plan.price}</div>
            <div className="text-sm text-gray-600">₹{plan.monthlyEquivalent}/month</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Welcome Wallet</p>
            <p className="text-xl font-bold text-blue-700">₹{plan.welcomeWallet}</p>
            <p className="text-xs text-gray-500">{plan.walletExpiry} days expiry</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Extra Discount</p>
            <p className="text-xl font-bold text-emerald-700">{plan.discountPercentage}%</p>
            <p className="text-xs text-gray-500">On premium cuts</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${plan.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {plan.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            Member Benefits
          </h3>
          <div className="space-y-3">
            {plan.benefits.map((benefit) => {
              const icons = {
                free_delivery: Truck,
                priority_order: Zap,
                welcome_wallet: Wallet,
                extra_discount: DollarSign,
                no_surge: Shield,
                special_rewards: Sparkles
              };
              const Icon = icons[benefit.type as keyof typeof icons] || Gift;
              
              const colors = {
                free_delivery: 'bg-blue-50 border-blue-200',
                priority_order: 'bg-purple-50 border-purple-200',
                welcome_wallet: 'bg-green-50 border-green-200',
                extra_discount: 'bg-emerald-50 border-emerald-200',
                no_surge: 'bg-orange-50 border-orange-200',
                special_rewards: 'bg-pink-50 border-pink-200'
              };
              const bgColor = colors[benefit.type as keyof typeof colors] || 'bg-gray-50 border-gray-200';

              return (
                <div key={benefit.id} className={`flex items-start gap-4 p-4 ${bgColor} border rounded-lg`}>
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Icon className="h-5 w-5 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">{benefit.label}</p>
                        <p className="text-sm text-gray-600">{benefit.value}</p>
                      </div>
                      {benefit.isEditable && (
                        <button 
                          onClick={() => handleEditBenefit(benefit)}
                          className="p-2 hover:bg-white rounded-lg text-blue-600 ml-2"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Marketing Placements */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Marketing Placements</h2>
          <Button size="sm" variant="secondary">
            <Plus className="h-4 w-4 mr-1" />
            Add Placement
          </Button>
        </div>

        <div className="space-y-3">
          {placements.map((placement) => (
            <div key={placement.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                    {placement.location.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${placement.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {placement.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => togglePlacementStatus(placement.id)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {placement.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button 
                    onClick={() => handleEditPlacement(placement)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">{placement.title}</p>
                <p className="text-sm text-gray-600 mb-2">{placement.message}</p>
                <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs rounded">
                  {placement.ctaText}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Product Eligibility */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Product Eligibility</h2>
            <p className="text-sm text-gray-600">Mark products eligible for 10% member discount</p>
          </div>
          <Button size="sm" variant="secondary">
            Manage Products
          </Button>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            Configure which products are eligible for the {plan.discountPercentage}% member discount from the Products section.
          </p>
        </div>
      </Card>

      {/* Edit Plan Modal */}
      <Modal isOpen={showEditPlanModal} onClose={() => setShowEditPlanModal(false)} title="Edit Membership Plan">
        <form onSubmit={(e) => { e.preventDefault(); setShowEditPlanModal(false); alert('Plan updated!'); }} className="space-y-4">
          <Input label="Plan Name" defaultValue={plan.name} required />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Duration (days)" type="number" defaultValue={plan.duration} required />
            <Input label="Price (₹)" type="number" defaultValue={plan.price} required />
          </div>

          <Input label="Monthly Equivalent (₹)" type="number" defaultValue={plan.monthlyEquivalent} required />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Welcome Wallet (₹)" type="number" defaultValue={plan.welcomeWallet} required />
            <Input label="Wallet Expiry (days)" type="number" defaultValue={plan.walletExpiry} required />
          </div>

          <Input label="Extra Discount (%)" type="number" defaultValue={plan.discountPercentage} required />

          <div className="flex items-center gap-2">
            <input type="checkbox" defaultChecked={plan.isActive} className="rounded" />
            <label className="text-sm">Active Plan</label>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => setShowEditPlanModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Update Plan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Benefit Modal */}
      <Modal isOpen={showEditBenefitModal} onClose={() => setShowEditBenefitModal(false)} title="Edit Benefit">
        {selectedBenefit && (
          <form onSubmit={(e) => { e.preventDefault(); setShowEditBenefitModal(false); alert('Benefit updated!'); }} className="space-y-4">
            <Input label="Benefit Label" defaultValue={selectedBenefit.label} required />
            <Input label="Benefit Value" defaultValue={selectedBenefit.value} required />

            <div className="flex gap-2 pt-4 border-t">
              <Button type="button" variant="secondary" onClick={() => setShowEditBenefitModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Update Benefit
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Edit Placement Modal */}
      <Modal isOpen={showEditPlacementModal} onClose={() => setShowEditPlacementModal(false)} title="Edit Marketing Placement">
        {selectedPlacement && (
          <form onSubmit={(e) => { e.preventDefault(); setShowEditPlacementModal(false); alert('Placement updated!'); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select 
                defaultValue={selectedPlacement.location}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="homepage_banner">Homepage Banner</option>
                <option value="flash_banner">Flash Banner</option>
                <option value="product_page">Product Page</option>
                <option value="cart_page">Cart Page</option>
                <option value="checkout_page">Checkout Page</option>
              </select>
            </div>

            <Input label="Title" defaultValue={selectedPlacement.title} required />
            <Input label="Message" defaultValue={selectedPlacement.message} required />
            <Input label="CTA Text" defaultValue={selectedPlacement.ctaText} required />

            <div className="flex items-center gap-2">
              <input type="checkbox" defaultChecked={selectedPlacement.isActive} className="rounded" />
              <label className="text-sm">Active</label>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="button" variant="secondary" onClick={() => setShowEditPlacementModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Update Placement
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
