import { PreOrderForm } from '../../components/features/orders/PreOrderForm';
import { PageHeader } from '../../components/ui';
import type { Product } from '../../types';

// Mock data for hub products
const mockHubProducts: Product[] = [
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
  }
];

const mockHubs = [
  { id: 'hub_1', name: 'Central Hub', type: 'hub', location: 'Chennai Central' },
  { id: 'hub_2', name: 'North Hub', type: 'hub', location: 'Chennai North' },
];

export function HubPreOrderPage() {
  const handlePreOrderSubmit = async (data: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Hub pre-order created:', data);
      alert('Hub Pre-order created successfully!');
    } catch (error) {
      console.error('Failed to create hub pre-order:', error);
      alert('Failed to create hub pre-order. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hub Pre-Order Creation"
        description="Create advance bookings for fish products and rare items"
      />
      <PreOrderForm
        moduleType="hub"
        products={mockHubProducts}
        hubs={mockHubs}
        onSubmit={handlePreOrderSubmit}
      />
    </div>
  );
}

export default HubPreOrderPage;