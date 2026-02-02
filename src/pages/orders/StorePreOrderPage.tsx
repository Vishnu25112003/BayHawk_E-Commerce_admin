import { PreOrderForm } from '../../components/features/orders/PreOrderForm';
import { PageHeader } from '../../components/ui';
import type { Product } from '../../types';

// Mock data for store products (includes hub products + store-specific products)
const mockStoreProducts: Product[] = [
  // Hub products (store can also sell these)
  {
    id: 'rare_1',
    nameEn: 'King Fish (Premium)',
    nameTa: 'கிங் மீன்',
    sku: 'RARE-001',
    category: 'fish',
    description: 'Premium king fish - advance booking required',
    images: [],
    variants: [
      { id: 'rv1', type: 'Whole Cleaned', size: 'Large', grossWeight: '2000-2500g', netWeight: '1800-2200g', pieces: '1 piece', serves: '6-8', price: 2500, stock: 5 },
    ],
    isBestSeller: false,
    isRare: true,
    isActive: true,
    deliveryType: 'exotic',
    sourceType: 'hub',
    approvalStatus: 'approved'
  },
  {
    id: 'hub_1',
    nameEn: 'Seer Fish (Vanjaram)',
    nameTa: 'வஞ்சிரம்',
    sku: 'FISH-001',
    category: 'fish',
    description: 'Premium quality seer fish',
    images: [],
    variants: [
      { id: 'v1', type: 'Whole Cleaned', size: 'Medium', grossWeight: '1000-1250g', netWeight: '800-1000g', pieces: '1 piece', serves: '3-4', price: 1200, stock: 25, discount: 10 },
    ],
    isBestSeller: true,
    isRare: false,
    isActive: true,
    deliveryType: 'next_day',
    sourceType: 'hub',
    approvalStatus: 'approved'
  },
  // Store-specific products
  {
    id: 'store_1',
    nameEn: 'Chicken Breast',
    nameTa: 'சிக்கன் மார்பு',
    sku: 'CHKN-001',
    category: 'chicken',
    description: 'Boneless chicken breast',
    images: [],
    variants: [
      { id: 'v5', type: 'Boneless', size: 'Pack', grossWeight: '500g', netWeight: '500g', pieces: '2-3 pieces', serves: '2-3', price: 280, stock: 50 },
    ],
    isBestSeller: false,
    isRare: false,
    isActive: true,
    deliveryType: 'same_day',
    sourceType: 'store',
    approvalStatus: 'approved'
  },
  {
    id: 'store_2',
    nameEn: 'Mutton Curry Cut',
    nameTa: 'ஆட்டு இறைச்சி',
    sku: 'MUTN-001',
    category: 'mutton',
    description: 'Fresh mutton curry cut',
    images: [],
    variants: [
      { id: 'v6', type: 'Curry Cut', size: 'Pack', grossWeight: '500g', netWeight: '500g', pieces: '8-10 pieces', serves: '2-3', price: 450, stock: 30 },
    ],
    isBestSeller: false,
    isRare: false,
    isActive: true,
    deliveryType: 'same_day',
    sourceType: 'store',
    approvalStatus: 'approved'
  }
];

const mockStores = [
  { id: 'store_1', name: 'Anna Nagar Store', type: 'store', location: 'Anna Nagar' },
  { id: 'store_2', name: 'T. Nagar Store', type: 'store', location: 'T. Nagar' },
  { id: 'store_3', name: 'Velachery Store', type: 'store', location: 'Velachery' },
];

export function StorePreOrderPage() {
  const handlePreOrderSubmit = async (data: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Store pre-order created:', data);
      alert('Store Pre-order created successfully!');
    } catch (error) {
      console.error('Failed to create store pre-order:', error);
      alert('Failed to create store pre-order. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Store Pre-Order Creation"
        description="Create advance bookings for all products and bulk orders"
      />
      <PreOrderForm
        moduleType="store"
        products={mockStoreProducts}
        hubs={mockStores}
        onSubmit={handlePreOrderSubmit}
      />
    </div>
  );
}

export default StorePreOrderPage;