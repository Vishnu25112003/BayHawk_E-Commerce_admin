import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Button, 
  Input, 
  Select, 
  Card, 
  Badge,
  LoadingWrapper
} from '../../ui';
import { 
  Plus, 
  Minus, 
  X, 
  Search, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  Package,
  Truck,
  CreditCard,
  Crown,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';
import type { Product, Customer } from '../../../types';

// Validation schema
const manualOrderSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerPhone: z.string().regex(/^\+91[6-9]\d{9}$/, 'Invalid phone number format'),
  customerEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  addressLine1: z.string().min(5, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  addressType: z.enum(['home', 'work', 'other']),
  items: z.array(z.object({
    productId: z.string().min(1, 'Product is required'),
    variantId: z.string().min(1, 'Variant is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    price: z.number().min(0, 'Price must be positive'),
  })).min(1, 'At least one item is required'),
  hubId: z.string().min(1, 'Hub/Store selection is required'),
  deliverySlot: z.string().min(1, 'Delivery slot is required'),
  paymentMethod: z.enum(['cod', 'online', 'wallet']),
  orderSource: z.enum(['whatsapp', 'instagram', 'facebook', 'manual']),
  applySurgeCharges: z.boolean().optional(),
  specialInstructions: z.string().optional(),
});

type ManualOrderForm = z.infer<typeof manualOrderSchema>;

interface ManualOrderFormProps {
  moduleType: 'hub' | 'store';
  products: Product[];
  hubs: Array<{ id: string; name: string; type: string; location: string }>;
  onSubmit: (data: ManualOrderForm & { total: number; isEliteMember: boolean }) => Promise<void>;
}

const deliverySlots = [
  { value: 'slot1', label: 'Slot 1 (7:00 AM - 9:00 AM)' },
  { value: 'slot2', label: 'Slot 2 (10:00 AM - 12:00 PM)' },
  { value: 'slot3', label: 'Slot 3 (1:00 PM - 3:00 PM)' },
  { value: 'slot4', label: 'Slot 4 (4:00 PM - 6:00 PM)' },
  { value: 'slot5', label: 'Slot 5 (7:00 PM - 9:00 PM)' },
];

export function ManualOrderForm({ moduleType, products, hubs, onSubmit }: ManualOrderFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [isEliteMember, setIsEliteMember] = useState(false);
  
  const surgeCharges = 30;
  const deliveryCharges = 50;

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<ManualOrderForm>({
    resolver: zodResolver(manualOrderSchema),
    defaultValues: {
      addressType: 'home',
      paymentMethod: 'cod',
      orderSource: 'manual',
      applySurgeCharges: false,
      items: []
    }
  });

  const { fields: itemFields, append: appendItem, remove: removeItem, update: updateItem } = useFieldArray({
    control,
    name: 'items'
  });

  const watchedItems = watch('items');
  const watchedApplySurgeCharges = watch('applySurgeCharges');

  // Calculate totals
  const subtotal = watchedItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const eliteDiscount = isEliteMember ? subtotal * 0.05 : 0;
  const finalSurgeCharges = watchedApplySurgeCharges ? surgeCharges : 0;
  const finalDeliveryCharges = isEliteMember && subtotal >= 349 ? 0 : deliveryCharges;
  const total = subtotal - eliteDiscount + finalSurgeCharges + finalDeliveryCharges;

  const handleCustomerSearch = (phone: string) => {
    setCustomerSearch(phone);
    if (phone === '+919876543210') {
      const mockCustomer: Customer = {
        id: '1',
        name: 'Rajesh Kumar',
        email: 'rajesh@email.com',
        phone: '+919876543210',
        totalOrders: 45,
        totalSpent: 28500,
        walletBalance: 250,
        membershipPlan: 'Premium',
        isActive: true,
        createdAt: '2023-06-15'
      };
      setSelectedCustomer(mockCustomer);
      setIsEliteMember(!!mockCustomer.membershipPlan);
      setValue('customerName', mockCustomer.name);
      setValue('customerPhone', mockCustomer.phone);
      setValue('customerEmail', mockCustomer.email || '');
    }
  };

  const addProduct = (product: Product, variantId: string) => {
    const variant = product.variants.find(v => v.id === variantId);
    if (!variant) return;

    const existingItemIndex = itemFields.findIndex(
      item => item.productId === product.id && item.variantId === variantId
    );

    if (existingItemIndex >= 0) {
      const existingItem = watchedItems[existingItemIndex];
      updateItem(existingItemIndex, {
        ...existingItem,
        quantity: existingItem.quantity + 1
      });
    } else {
      appendItem({
        productId: product.id,
        variantId: variantId,
        quantity: 1,
        price: variant.price
      });
    }
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(index);
    } else {
      const item = watchedItems[index];
      updateItem(index, { ...item, quantity: newQuantity });
    }
  };

  const handleFormSubmit = async (data: ManualOrderForm) => {
    setIsLoading(true);
    try {
      await onSubmit({ ...data, total, isEliteMember });
      reset();
      setSelectedCustomer(null);
      setIsEliteMember(false);
    } finally {
      setIsLoading(false);
    }
  };

  const moduleInfo = {
    hub: {
      title: 'Hub Manual Order Creation',
      description: 'Create manual orders for fish products with next-day delivery',
      color: 'blue'
    },
    store: {
      title: 'Store Manual Order Creation', 
      description: 'Create manual orders for all products with same-day/next-day delivery',
      color: 'green'
    }
  }[moduleType];

  return (
    <LoadingWrapper isLoading={isLoading} type="page" text="Creating order..." variant="branded">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Customer Information */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-10 w-10 rounded-lg bg-${moduleInfo.color}-600 flex items-center justify-center`}>
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
              <p className="text-sm text-gray-600">Search existing customer or add new customer details</p>
            </div>
          </div>

          {/* Customer Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search customer by phone number (+91XXXXXXXXXX)"
                value={customerSearch}
                onChange={(e) => handleCustomerSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {selectedCustomer && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-green-900">{selectedCustomer.name}</p>
                    <p className="text-sm text-green-700">{selectedCustomer.phone}</p>
                  </div>
                  {selectedCustomer.membershipPlan && (
                    <Badge variant="warning" className="flex items-center gap-1">
                      <Crown className="h-3 w-3" />
                      Elite Member
                    </Badge>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCustomer(null);
                    setIsEliteMember(false);
                    setValue('customerName', '');
                    setValue('customerPhone', '');
                    setValue('customerEmail', '');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  {...register('customerName')}
                  placeholder="Customer full name"
                  error={errors.customerName?.message}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  {...register('customerPhone')}
                  placeholder="+91 9876543210"
                  error={errors.customerPhone?.message}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email (Optional)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                {...register('customerEmail')}
                type="email"
                placeholder="customer@email.com"
                error={errors.customerEmail?.message}
                className="pl-10"
              />
            </div>
          </div>

          {isEliteMember && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <Crown className="h-5 w-5" />
                <span className="font-semibold">Elite Member Benefits Active</span>
              </div>
              <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                <li>• Free delivery on orders above ₹349</li>
                <li>• 5% extra discount on selected products</li>
                <li>• No surge charges</li>
                <li>• Priority order processing</li>
              </ul>
            </div>
          )}
        </Card>

        {/* Delivery Address */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-10 w-10 rounded-lg bg-${moduleInfo.color}-600 flex items-center justify-center`}>
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delivery Address</h3>
              <p className="text-sm text-gray-600">Enter complete delivery address details</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Address Line 1"
              {...register('addressLine1')}
              placeholder="House no, Building name, Street"
              error={errors.addressLine1?.message}
            />
            
            <Input
              label="Address Line 2 (Optional)"
              {...register('addressLine2')}
              placeholder="Landmark, Area"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Pincode"
                {...register('pincode')}
                placeholder="600001"
                error={errors.pincode?.message}
              />
              <Input
                label="City"
                {...register('city')}
                placeholder="Chennai"
                error={errors.city?.message}
              />
              <Input
                label="State"
                {...register('state')}
                placeholder="Tamil Nadu"
                error={errors.state?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
              <div className="flex gap-4">
                {[
                  { value: 'home', label: 'Home' },
                  { value: 'work', label: 'Work' },
                  { value: 'other', label: 'Other' }
                ].map((type) => (
                  <label key={type.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      {...register('addressType')}
                      value={type.value}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Order Items */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg bg-${moduleInfo.color}-600 flex items-center justify-center`}>
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
                <p className="text-sm text-gray-600">Add products to the order</p>
              </div>
            </div>
          </div>

          {/* Product Search & Add */}
          <div className="mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
              {products
                .filter(product => 
                  product.nameEn.toLowerCase().includes(productSearch.toLowerCase()) ||
                  product.nameTa.includes(productSearch) ||
                  product.sku.toLowerCase().includes(productSearch.toLowerCase())
                )
                .map((product) => (
                  <div key={product.id} className="border rounded-lg p-3 hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{product.nameEn}</h4>
                        <p className="text-sm text-gray-600">{product.nameTa}</p>
                        <p className="text-xs text-gray-500">{product.sku}</p>
                      </div>
                      <div className="flex gap-1">
                        {product.isBestSeller && (
                          <Badge variant="warning">Best Seller</Badge>
                        )}
                        {product.isRare && (
                          <Badge variant="danger">Rare</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {product.variants.map((variant) => (
                        <div key={variant.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{variant.type} - {variant.size}</p>
                            <p className="text-xs text-gray-600">{variant.serves} • Stock: {variant.stock}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-green-600">
                                {formatCurrency(variant.price)}
                              </span>
                              {variant.discount && (
                                <Badge variant="success">{variant.discount}% off</Badge>
                              )}
                              {isEliteMember && (
                                <Badge variant="warning">+5% Elite</Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => addProduct(product, variant.id)}
                            disabled={variant.stock === 0}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Selected Items */}
          {itemFields.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Selected Items ({itemFields.length})</h4>
              {itemFields.map((field, index) => {
                const product = products.find(p => p.id === field.productId);
                const variant = product?.variants.find(v => v.id === field.variantId);
                const item = watchedItems[index];
                
                if (!product || !variant) return null;

                return (
                  <div key={field.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{product.nameEn}</h5>
                      <p className="text-sm text-gray-600">{variant.type} - {variant.size}</p>
                      <p className="text-sm text-gray-500">{variant.serves}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(item.price)} each
                      </p>
                    </div>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {errors.items && (
            <p className="text-sm text-red-600 mt-2">{errors.items.message}</p>
          )}
        </Card>

        {/* Delivery Information */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-10 w-10 rounded-lg bg-${moduleInfo.color}-600 flex items-center justify-center`}>
              <Truck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delivery Information</h3>
              <p className="text-sm text-gray-600">Configure delivery and payment details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label={moduleType === 'hub' ? 'Hub' : 'Store'}
              {...register('hubId')}
              error={errors.hubId?.message}
              options={[
                { value: '', label: `Select ${moduleType === 'hub' ? 'Hub' : 'Store'}` },
                ...hubs.map(hub => ({
                  value: hub.id,
                  label: `${hub.name} (${hub.location})`
                }))
              ]}
            />
            
            <Select
              label="Delivery Slot"
              {...register('deliverySlot')}
              error={errors.deliverySlot?.message}
              options={[
                { value: '', label: 'Select Delivery Slot' },
                ...deliverySlots
              ]}
            />
            
            <Select
              label="Payment Method"
              {...register('paymentMethod')}
              error={errors.paymentMethod?.message}
              options={[
                { value: 'cod', label: 'Cash on Delivery' },
                { value: 'online', label: 'Online Payment' },
                { value: 'wallet', label: 'Wallet Payment' }
              ]}
            />
            
            <Select
              label="Order Source"
              {...register('orderSource')}
              error={errors.orderSource?.message}
              options={[
                { value: 'manual', label: 'Manual Entry' },
                { value: 'whatsapp', label: 'WhatsApp' },
                { value: 'instagram', label: 'Instagram' },
                { value: 'facebook', label: 'Facebook' }
              ]}
            />
          </div>

          {/* Surge Charges */}
          <div className="mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('applySurgeCharges')}
                className="rounded text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">Apply Surge Charges</span>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </label>
            <p className="text-xs text-gray-600 mt-1">
              Apply surge charges for rain/peak day delivery
            </p>
            {watchedApplySurgeCharges && (
              <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  Surge charges: {formatCurrency(surgeCharges)} (Rain/Peak day delivery)
                </p>
              </div>
            )}
          </div>

          {/* Special Instructions */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              {...register('specialInstructions')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any special delivery instructions..."
            />
          </div>
        </Card>

        {/* Order Summary */}
        {itemFields.length > 0 && (
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className={`h-10 w-10 rounded-lg bg-${moduleInfo.color}-600 flex items-center justify-center`}>
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
                <p className="text-sm text-gray-600">Review order details and pricing</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({itemFields.length} items)</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              
              {isEliteMember && eliteDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <Crown className="h-4 w-4" />
                    Elite Discount (5%)
                  </span>
                  <span>-{formatCurrency(eliteDiscount)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Charges</span>
                <span className={finalDeliveryCharges === 0 ? 'text-green-600' : ''}>
                  {finalDeliveryCharges === 0 ? 'FREE' : formatCurrency(finalDeliveryCharges)}
                </span>
              </div>
              
              {finalSurgeCharges > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    Surge Charges
                  </span>
                  <span>+{formatCurrency(finalSurgeCharges)}</span>
                </div>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span className="text-green-600">{formatCurrency(total)}</span>
                </div>
              </div>

              {isEliteMember && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 font-medium">
                    Elite Member Savings: {formatCurrency(eliteDiscount + (deliveryCharges - finalDeliveryCharges))}
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              reset();
              setSelectedCustomer(null);
              setIsEliteMember(false);
            }}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={itemFields.length === 0 || isLoading}
            className="flex-1"
          >
            {isLoading ? 'Creating Order...' : 'Create Order'}
          </Button>
        </div>
      </form>
    </LoadingWrapper>
  );
}