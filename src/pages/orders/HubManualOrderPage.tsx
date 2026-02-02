import { ManualOrderForm } from '../../components/features/orders/ManualOrderForm';
import { PageHeader } from '../../components/ui';
import type { Product } from '../../types';

// Mock data for hub products
const mockHubProducts: Product[] = [
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
  }
];

const mockHubs = [
  { id: 'hub_1', name: 'Central Hub', type: 'hub', location: 'Chennai Central' },
  { id: 'hub_2', name: 'North Hub', type: 'hub', location: 'Chennai North' },
];

export function HubManualOrderPage() {
  const handleOrderSubmit = async (data: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Hub order created:', data);
      alert('Hub Order created successfully!');
    } catch (error) {
      console.error('Failed to create hub order:', error);
      alert('Failed to create hub order. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hub Manual Order Creation"
        description="Create manual orders for fish products with next-day delivery"
      />
      <ManualOrderForm
        moduleType="hub"
        products={mockHubProducts}
        hubs={mockHubs}
        onSubmit={handleOrderSubmit}
      />
    </div>
  );
}

export default HubManualOrderPage;