import { useState } from 'react';
import { Card, Button, Input, Modal } from '../ui';
import { Plus, Eye, Edit, Trash2, Copy, Clock, Bell, Users, Tag, Package } from 'lucide-react';

type FlashSaleType = 'discount_coupon' | 'product_sale' | 'members_only' | 'membership_subscription';

interface Product {
  id: string;
  nameEnglish: string;
  nameTamil: string;
  descriptionEnglish: string;
  descriptionTamil: string;
  category: string;
  weights: WeightOption[];
  images: string[];
  totalStock: number;
  flashOfferDetails: string;
}

interface WeightOption {
  id: string;
  weight: string;
  unit: 'g' | 'kg' | 'ml' | 'l' | 'pcs';
  originalPrice: number;
  discountPrice: number;
  stock: number;
}

interface MembershipPlan {
  name: string;
  duration: number;
  totalPrice: number;
  monthlyEquivalent: number;
  benefits: string[];
  welcomeCredit: number;
  deliveryBenefits: string;
  bonusPercentage: number;
  priorityService: boolean;
  surpriseRewards: string;
}

interface Notification {
  type: 'before_start' | 'before_end' | 'popup_reminder';
  minutes: number;
  message: string;
  enabled: boolean;
}

interface FlashSale {
  id: string;
  name: string;
  type: FlashSaleType;
  description: string;
  startTime: string;
  endTime: string;
  timerType: 'fixed' | 'datetime' | 'recurring';
  fixedDuration?: number;
  couponCode?: string;
  discountValue?: number;
  discountType?: 'percentage' | 'fixed';
  products?: Product[];
  membershipPlan?: MembershipPlan;
  notifications: Notification[];
  status: 'draft' | 'scheduled' | 'active' | 'ended';
  isActive: boolean;
  createdAt: string;
}

const dummySales: FlashSale[] = [
  {
    id: '1',
    name: 'Weekend Mega Sale',
    type: 'discount_coupon',
    description: 'Get 30% off on all orders',
    startTime: '2024-02-15T00:00',
    endTime: '2024-02-15T23:59',
    timerType: 'datetime',
    couponCode: 'WEEKEND30',
    discountValue: 30,
    discountType: 'percentage',
    notifications: [
      { type: 'before_start', minutes: 15, message: 'Flash sale starting in 15 minutes!', enabled: true },
      { type: 'before_end', minutes: 15, message: 'Last 15 minutes! Hurry up!', enabled: true }
    ],
    status: 'scheduled',
    isActive: true,
    createdAt: '2024-02-10'
  },
  {
    id: '2',
    name: 'Fresh Chicken Flash Sale',
    type: 'product_sale',
    description: 'Limited stock chicken at special prices',
    startTime: '2024-02-14T10:00',
    endTime: '2024-02-14T22:00',
    timerType: 'fixed',
    fixedDuration: 12,
    products: [
      { 
        id: 'p1', 
        nameEnglish: 'Fresh Chicken',
        nameTamil: 'புதிய கோழி',
        descriptionEnglish: 'Farm fresh chicken',
        descriptionTamil: 'பண்ணை புதிய கோழி',
        category: 'Chicken',
        weights: [
          { id: 'w1', weight: '500', unit: 'g', originalPrice: 150, discountPrice: 120, stock: 30 },
          { id: 'w2', weight: '1', unit: 'kg', originalPrice: 280, discountPrice: 220, stock: 50 }
        ],
        images: [],
        totalStock: 80,
        flashOfferDetails: 'Limited time offer - Save up to 20%'
      }
    ],
    notifications: [
      { type: 'before_start', minutes: 15, message: 'Chicken flash sale starts soon!', enabled: true },
      { type: 'popup_reminder', minutes: 5, message: 'Only 5 minutes left!', enabled: true }
    ],
    status: 'active',
    isActive: true,
    createdAt: '2024-02-09'
  }
];

export const FlashSaleConfig = () => {
  const [sales, setSales] = useState<FlashSale[]>(dummySales);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState<FlashSale | null>(null);
  
  const [saleType, setSaleType] = useState<FlashSaleType>('discount_coupon');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    timerType: 'datetime' as 'fixed' | 'datetime' | 'recurring',
    fixedDuration: 12
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([
    { type: 'before_start', minutes: 15, message: 'Flash sale starting in 15 minutes!', enabled: true },
    { type: 'before_end', minutes: 15, message: 'Last 15 minutes! Hurry up!', enabled: true },
    { type: 'popup_reminder', minutes: 5, message: 'Only 5 minutes left!', enabled: false }
  ]);

  const getTypeIcon = (type: FlashSaleType) => {
    const icons = {
      discount_coupon: Tag,
      product_sale: Package,
      members_only: Users,
      membership_subscription: Users
    };
    return icons[type];
  };

  const getTypeColor = (type: FlashSaleType) => {
    const colors = {
      discount_coupon: 'bg-blue-100 text-blue-700',
      product_sale: 'bg-emerald-100 text-emerald-700',
      members_only: 'bg-indigo-100 text-indigo-700',
      membership_subscription: 'bg-amber-100 text-amber-700'
    };
    return colors[type];
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      scheduled: 'bg-blue-100 text-blue-700',
      active: 'bg-green-100 text-green-700',
      ended: 'bg-red-100 text-red-700'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const addProduct = () => {
    setProducts([...products, { 
      id: `p${Date.now()}`, 
      nameEnglish: '',
      nameTamil: '',
      descriptionEnglish: '',
      descriptionTamil: '',
      category: '',
      weights: [{ id: 'w1', weight: '', unit: 'g', originalPrice: 0, discountPrice: 0, stock: 0 }],
      images: [],
      totalStock: 0,
      flashOfferDetails: ''
    }]);
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const updateProduct = (id: string, field: string, value: any) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addWeight = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, weights: [...p.weights, { id: `w${Date.now()}`, weight: '', unit: 'g', originalPrice: 0, discountPrice: 0, stock: 0 }] }
        : p
    ));
  };

  const removeWeight = (productId: string, weightId: string) => {
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, weights: p.weights.filter(w => w.id !== weightId) }
        : p
    ));
  };

  const updateWeight = (productId: string, weightId: string, field: string, value: any) => {
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, weights: p.weights.map(w => w.id === weightId ? { ...w, [field]: value } : w) }
        : p
    ));
  };

  const handleImageUpload = (productId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setProducts(products.map(p => 
        p.id === productId ? { ...p, images: [...p.images, ...imageUrls] } : p
      ));
    }
  };

  const removeImage = (productId: string, imageUrl: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, images: p.images.filter(img => img !== imageUrl) } : p
    ));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newSale: FlashSale = {
      id: `fs${Date.now()}`,
      name: formData.name,
      type: saleType,
      description: formData.description,
      startTime: formData.startTime,
      endTime: formData.endTime,
      timerType: formData.timerType,
      fixedDuration: formData.fixedDuration,
      products: products.length > 0 ? products : undefined,
      notifications,
      status: 'draft',
      isActive: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSales([...sales, newSale]);
    setShowCreateModal(false);
    resetForm();
    alert('Flash sale created successfully!');
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', startTime: '', endTime: '', timerType: 'datetime', fixedDuration: 12 });
    setProducts([]);
    setSaleType('discount_coupon');
  };

  const handleView = (sale: FlashSale) => {
    setSelectedSale(sale);
    setShowViewModal(true);
  };

  const handleEdit = (sale: FlashSale) => {
    setSelectedSale(sale);
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this flash sale?')) {
      setSales(sales.filter(s => s.id !== id));
    }
  };

  const handleClone = (sale: FlashSale) => {
    const cloned = { ...sale, id: `fs${Date.now()}`, name: `${sale.name} (Copy)`, status: 'draft' as const };
    setSales([...sales, cloned]);
    alert('Flash sale cloned successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flash Sale Management</h1>
          <p className="text-gray-600 mt-1">Create and manage flash sale campaigns</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Flash Sale
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Sales</p>
          <p className="text-2xl font-bold">{sales.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold">{sales.filter(s => s.status === 'active').length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Scheduled</p>
          <p className="text-2xl font-bold">{sales.filter(s => s.status === 'scheduled').length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Draft</p>
          <p className="text-2xl font-bold">{sales.filter(s => s.status === 'draft').length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Ended</p>
          <p className="text-2xl font-bold">{sales.filter(s => s.status === 'ended').length}</p>
        </Card>
      </div>

      {/* Sales List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sale Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map((sale) => {
                const Icon = getTypeIcon(sale.type);
                return (
                  <tr key={sale.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{sale.name}</div>
                      <div className="text-sm text-gray-500">{sale.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(sale.type)}`}>
                        <Icon className="h-3 w-3" />
                        {sale.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Clock className="h-4 w-4" />
                        {sale.timerType === 'fixed' ? `${sale.fixedDuration}h` : 'Custom'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(sale.status)}`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${sale.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {sale.isActive ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleView(sale)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleEdit(sale)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleClone(sale)} className="p-2 hover:bg-gray-100 rounded-lg text-indigo-600">
                          <Copy className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(sale.id)} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Flash Sale" size="lg">
        <form onSubmit={handleCreate} className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Sale Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Flash Sale Type</label>
            <select 
              value={saleType} 
              onChange={(e) => setSaleType(e.target.value as FlashSaleType)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="discount_coupon">Discount Coupon Flash Sale</option>
              <option value="product_sale">Product Flash Sale</option>
              <option value="members_only">Members-Only Flash Sale</option>
              <option value="membership_subscription">Membership Subscription Sale</option>
            </select>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <Input 
              label="Sale Name" 
              placeholder="Weekend Mega Sale" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required 
            />
            <Input 
              label="Description" 
              placeholder="Get amazing discounts" 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required 
            />
          </div>

          {/* Timer Configuration */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-4">Timer Configuration</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timer Type</label>
              <select 
                value={formData.timerType} 
                onChange={(e) => setFormData({ ...formData, timerType: e.target.value as any })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 mb-4"
              >
                <option value="datetime">Specific Date & Time</option>
                <option value="fixed">Fixed Duration</option>
                <option value="recurring">Recurring</option>
              </select>
            </div>

            {formData.timerType === 'fixed' ? (
              <Input 
                label="Duration (hours)" 
                type="number" 
                placeholder="12"
                value={formData.fixedDuration}
                onChange={(e) => setFormData({ ...formData, fixedDuration: Number(e.target.value) })}
              />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Start Time" 
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required 
                />
                <Input 
                  label="End Time" 
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required 
                />
              </div>
            )}
          </div>

          {/* Discount Coupon Fields */}
          {saleType === 'discount_coupon' && (
            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold text-gray-900">Coupon Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Coupon Code" placeholder="WEEKEND30" required />
                <Input label="Discount Value" type="number" placeholder="30" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2">
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
            </div>
          )}

          {/* Product Configuration */}
          {(saleType === 'product_sale' || saleType === 'members_only') && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Products</h3>
                <Button type="button" size="sm" variant="secondary" onClick={addProduct}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Product
                </Button>
              </div>

              <div className="space-y-6">
                {products.map((product, pIdx) => (
                  <div key={product.id} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Product {pIdx + 1}</h4>
                      {products.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeProduct(product.id)}
                          className="text-red-600 text-sm flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove Product
                        </button>
                      )}
                    </div>

                    {/* Product Names */}
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        label="Product Name (English)" 
                        placeholder="Fresh Chicken"
                        value={product.nameEnglish}
                        onChange={(e) => updateProduct(product.id, 'nameEnglish', e.target.value)}
                        required
                      />
                      <Input 
                        label="Product Name (Tamil)" 
                        placeholder="புதிய கோழி"
                        value={product.nameTamil}
                        onChange={(e) => updateProduct(product.id, 'nameTamil', e.target.value)}
                        required
                      />
                    </div>

                    {/* Descriptions */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                        <textarea 
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                          rows={2}
                          placeholder="Farm fresh chicken"
                          value={product.descriptionEnglish}
                          onChange={(e) => updateProduct(product.id, 'descriptionEnglish', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description (Tamil)</label>
                        <textarea 
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                          rows={2}
                          placeholder="பண்ணை புதிய கோழி"
                          value={product.descriptionTamil}
                          onChange={(e) => updateProduct(product.id, 'descriptionTamil', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select 
                          className="w-full rounded-lg border border-gray-300 px-3 py-2"
                          value={product.category}
                          onChange={(e) => updateProduct(product.id, 'category', e.target.value)}
                        >
                          <option value="">Select Category</option>
                          <option value="Chicken">Chicken</option>
                          <option value="Mutton">Mutton</option>
                          <option value="Fish">Fish</option>
                          <option value="Prawns">Prawns</option>
                          <option value="Eggs">Eggs</option>
                        </select>
                      </div>
                      <Input 
                        label="Total Stock" 
                        type="number"
                        placeholder="100"
                        value={product.totalStock}
                        onChange={(e) => updateProduct(product.id, 'totalStock', Number(e.target.value))}
                        required
                      />
                    </div>

                    {/* Weight Options */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-sm">Weight & Pricing Options</h5>
                        <Button type="button" size="sm" variant="secondary" onClick={() => addWeight(product.id)}>
                          <Plus className="h-3 w-3 mr-1" />
                          Add Weight
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {product.weights.map((weight) => (
                          <div key={weight.id} className="bg-white border rounded-lg p-3">
                            <div className="grid grid-cols-5 gap-3 mb-2">
                              <Input 
                                label="Weight" 
                                type="number"
                                placeholder="500"
                                value={weight.weight}
                                onChange={(e) => updateWeight(product.id, weight.id, 'weight', e.target.value)}
                              />
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Unit</label>
                                <select 
                                  className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                                  value={weight.unit}
                                  onChange={(e) => updateWeight(product.id, weight.id, 'unit', e.target.value)}
                                >
                                  <option value="g">g</option>
                                  <option value="kg">kg</option>
                                  <option value="ml">ml</option>
                                  <option value="l">l</option>
                                  <option value="pcs">pcs</option>
                                </select>
                              </div>
                              <Input 
                                label="Original Price (₹)" 
                                type="number"
                                placeholder="250"
                                value={weight.originalPrice}
                                onChange={(e) => updateWeight(product.id, weight.id, 'originalPrice', Number(e.target.value))}
                              />
                              <Input 
                                label="Discount Price (₹)" 
                                type="number"
                                placeholder="199"
                                value={weight.discountPrice}
                                onChange={(e) => updateWeight(product.id, weight.id, 'discountPrice', Number(e.target.value))}
                              />
                              <Input 
                                label="Stock" 
                                type="number"
                                placeholder="50"
                                value={weight.stock}
                                onChange={(e) => updateWeight(product.id, weight.id, 'stock', Number(e.target.value))}
                              />
                            </div>
                            {product.weights.length > 1 && (
                              <button 
                                type="button" 
                                onClick={() => removeWeight(product.id, weight.id)}
                                className="text-red-600 text-xs flex items-center gap-1"
                              >
                                <Trash2 className="h-3 w-3" />
                                Remove Weight
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(product.id, e)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {product.images.length > 0 && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {product.images.map((img, idx) => (
                            <div key={idx} className="relative">
                              <img src={img} alt="" className="h-20 w-20 object-cover rounded border" />
                              <button 
                                type="button"
                                onClick={() => removeImage(product.id, img)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Flash Offer Details */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Flash Offer Details</label>
                      <textarea 
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        rows={2}
                        placeholder="Limited time offer - Save up to 20%"
                        value={product.flashOfferDetails}
                        onChange={(e) => updateProduct(product.id, 'flashOfferDetails', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Membership Plan */}
          {saleType === 'membership_subscription' && (
            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold text-gray-900">Membership Plan Details</h3>
              <Input label="Plan Name" placeholder="Premium Annual" required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Duration (months)" type="number" placeholder="12" required />
                <Input label="Total Price (₹)" type="number" placeholder="1999" required />
              </div>
              <Input label="Monthly Equivalent (₹)" type="number" placeholder="166" required />
              <Input label="Welcome Wallet Credit (₹)" type="number" placeholder="200" />
              <Input label="Delivery Benefits" placeholder="Free delivery on all orders" />
              <Input label="Bonus Percentage (%)" type="number" placeholder="5" />
              <Input label="Surprise Rewards" placeholder="Birthday special offers" />
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <label className="text-sm">Priority Customer Service</label>
              </div>
            </div>
          )}

          {/* Notifications */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-gray-700" />
              <h3 className="font-semibold text-gray-900">Notification Settings</h3>
            </div>
            
            <div className="space-y-3">
              {notifications.map((notif, idx) => (
                <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={notif.enabled}
                        onChange={(e) => {
                          const updated = [...notifications];
                          updated[idx].enabled = e.target.checked;
                          setNotifications(updated);
                        }}
                        className="rounded" 
                      />
                      <span className="text-sm font-medium capitalize">
                        {notif.type.replace('_', ' ')} ({notif.minutes} min)
                      </span>
                    </label>
                  </div>
                  <Input 
                    placeholder="Notification message"
                    value={notif.message}
                    onChange={(e) => {
                      const updated = [...notifications];
                      updated[idx].message = e.target.value;
                      setNotifications(updated);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t sticky bottom-0 bg-white">
            <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="button" variant="secondary" className="flex-1">
              Save as Draft
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Publish Sale
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Flash Sale Details" size="lg">
        {selectedSale && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Sale Name</p>
                <p className="font-medium">{selectedSale.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedSale.type)}`}>
                  {selectedSale.type.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">Description</p>
              <p className="font-medium">{selectedSale.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Start Time</p>
                <p className="font-medium">{selectedSale.startTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">End Time</p>
                <p className="font-medium">{selectedSale.endTime}</p>
              </div>
            </div>

            {selectedSale.products && selectedSale.products.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Products</h3>
                <div className="space-y-3">
                  {selectedSale.products.map((product) => (
                    <div key={product.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-gray-900">{product.nameEnglish}</span>
                          <span className="text-sm text-gray-600 ml-2">({product.nameTamil})</span>
                        </div>
                        <span className="text-sm text-gray-600">Stock: {product.totalStock}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{product.descriptionEnglish}</p>
                      <div className="space-y-2">
                        {product.weights.map((weight) => (
                          <div key={weight.id} className="flex items-center justify-between bg-white p-2 rounded text-sm">
                            <span className="font-medium">{weight.weight}{weight.unit}</span>
                            <div className="flex items-center gap-3">
                              <span className="line-through text-gray-500">₹{weight.originalPrice}</span>
                              <span className="font-medium text-green-600">₹{weight.discountPrice}</span>
                              <span className="text-gray-600">Stock: {weight.stock}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {product.flashOfferDetails && (
                        <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                          {product.flashOfferDetails}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedSale.notifications.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Notifications</h3>
                <div className="space-y-2">
                  {selectedSale.notifications.filter(n => n.enabled).map((notif, idx) => (
                    <div key={idx} className="bg-blue-50 p-3 rounded text-sm">
                      <div className="font-medium capitalize">{notif.type.replace('_', ' ')}</div>
                      <div className="text-gray-600">{notif.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Edit Modal - Similar to Create */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Flash Sale" size="lg">
        {selectedSale && (
          <form onSubmit={(e) => { e.preventDefault(); setShowEditModal(false); alert('Updated!'); }} className="space-y-4">
            <Input label="Sale Name" defaultValue={selectedSale.name} required />
            <Input label="Description" defaultValue={selectedSale.description} required />
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Start Time" type="datetime-local" defaultValue={selectedSale.startTime} required />
              <Input label="End Time" type="datetime-local" defaultValue={selectedSale.endTime} required />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" defaultChecked={selectedSale.isActive} className="rounded" />
              <label className="text-sm">Active</label>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Update Sale
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
