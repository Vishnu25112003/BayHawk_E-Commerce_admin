import { ManualOrderForm } from '../../components/features/orders/ManualOrderForm';
import { PageHeader } from '../../components/ui';
import type { Product } from '../../types';

// Mock data for store products (includes hub products + store-specific products)
const mockStoreProducts: Product[] = [
  // Hub products (store can also sell these)
  {
    id: '1',
    nameEn: 'Seer Fish (Vanjaram)',
    nameTa: 'வஞ்சிரம்',
    sku: 'FISH-001',
    category: 'fish',
    description: 'Premium quality seer fish',
    images: [],
    variants: [
      { id: 'v1', type: 'Whole Cleaned', size: 'Medium', grossWeight: '1000-1250g', netWeight: '800-1000g', pieces: '1 piece', serves: '3-4', price: 1200, stock: 25, discount: 10 },
      { id: 'v2', type: 'Curry Cut', size: 'Medium', grossWeight: '1000g', netWeight: '800g', pieces: '8-10 pieces', serves: '3-4', price: 1300, stock: 20 },
    ],
    isBestSeller: true,
    isRare: false,
    isActive: true,
    deliveryType: 'next_day',
    sourceType: 'hub',
    approvalStatus: 'approved'
  },
  {
    id: '2',
    nameEn: 'Tiger Prawns',
    nameTa: 'இறால்',
    sku: 'PRWN-001',
    category: 'prawns',
    description: 'Fresh tiger prawns',
    images: [],
    variants: [
      { id: 'v3', type: 'Cleaned', size: 'Large', grossWeight: '500g', netWeight: '400g', pieces: '15-20 pieces', serves: '2-3', price: 650, stock: 15 },
      { id: 'v4', type: 'Uncleaned', size: 'Large', grossWeight: '500g', netWeight: '450g', pieces: '15-20 pieces', serves: '2-3', price: 580, stock: 18 },
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
    id: '3',
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
    id: '4',
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

export function StoreManualOrderPage() {
  const handleOrderSubmit = async (data: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Store order created:', data);
      alert('Store Order created successfully!');
    } catch (error) {
      console.error('Failed to create store order:', error);
      alert('Failed to create store order. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Store Manual Order Creation"
        description="Create manual orders for all products with same-day/next-day delivery"
      />
      <ManualOrderForm
        moduleType="store"
        products={mockStoreProducts}
        hubs={mockStores}
        onSubmit={handleOrderSubmit}
      />
    </div>
  );
}

export default StoreManualOrderPage;