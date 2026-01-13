# Manual Order Creation System

A comprehensive manual order creation system for BAYHAWK E-commerce admin panel with separate Hub and Store functionality.

## Features

### 🔍 Customer Management
- **Smart Customer Search**: Search by phone, name, or email
- **Elite Member Detection**: Automatic detection and benefits application
- **Customer Profile Display**: Shows order history, wallet balance, and membership status
- **New Customer Creation**: Seamless flow for new customer registration

### 📦 Product Selection
- **Dynamic Product Filtering**: Filter by category, search by name/SKU
- **Module-Specific Products**: Hub shows fish products only, Store shows all products
- **Variant Management**: Multiple variants per product with different pricing
- **Stock Validation**: Real-time stock checking and low stock warnings
- **Elite Pricing**: Automatic 5% discount for Elite members

### 💰 Pricing & Discounts
- **Elite Member Benefits**:
  - 5% extra discount on all products
  - Free delivery on orders ₹349+
  - No surge charges
  - Priority order processing
- **Surge Charges**: Configurable rain/peak day charges
- **Delivery Charges**: Distance-based calculation with free delivery thresholds

### 🚚 Delivery Management
- **Hub/Store Selection**: Dynamic filtering based on user role
- **Delivery Slots**: Multiple time slots with availability checking
- **Address Validation**: Complete address with pincode-based city/state auto-fill
- **Special Instructions**: Custom delivery notes

### 📊 Order Summary
- **Real-time Calculations**: Live pricing updates as items are added/removed
- **Savings Display**: Clear breakdown of Elite member savings
- **Payment Methods**: COD, Online, Wallet payment options
- **Order Sources**: WhatsApp, Instagram, Facebook, Manual tracking

## Components

### 1. ManualOrderPage.tsx
Main page component that orchestrates the entire manual order creation flow.

**Features:**
- Role-based product filtering (Hub/Store/Super Admin)
- Form validation with Zod schema
- Real-time price calculations
- Elite member benefits integration
- Responsive design with mobile support

### 2. CustomerSearchCard.tsx
Reusable component for customer search and selection.

**Features:**
- Debounced search functionality
- Customer profile display with membership status
- Elite member benefits preview
- Clear selection and new customer flow

### 3. ProductSelector.tsx
Advanced product selection component with filtering and search.

**Features:**
- Category-based filtering
- Real-time search across name, Tamil name, and SKU
- Variant selection with pricing display
- Stock availability checking
- Elite member pricing preview

### 4. OrderSummaryCard.tsx
Comprehensive order summary with pricing breakdown.

**Features:**
- Item-wise pricing display
- Elite discount calculations
- Delivery and surge charge handling
- Savings summary for Elite members
- Free delivery progress indicator

## Usage

### For Hub Admin
```typescript
// Hub admins see only fish products
// Next-day delivery only
// Access via /hub/orders/manual
<HubManualOrderPage />
```

### For Store Admin
```typescript
// Store admins see all products (fish + meat + others)
// Same-day and next-day delivery
// Access via /store/orders/manual
<StoreManualOrderPage />
```

### For Super Admin
```typescript
// Super admins see all products and can select any hub/store
// Full access to all features
// Access via /orders/manual
<ManualOrderPage />
```

## API Integration

The components are designed to work with the following API endpoints:

```typescript
// Customer search
GET /api/customers/search?q={query}

// Product listing
GET /api/products?category={category}&source={hub|store}

// Order creation
POST /api/orders/manual
{
  customer: CustomerData,
  items: OrderItem[],
  delivery: DeliveryInfo,
  payment: PaymentInfo
}
```

## Elite Member Benefits

### Automatic Benefits
- **5% Product Discount**: Applied to all eligible products
- **Free Delivery**: On orders ₹349+ (configurable threshold)
- **Surge Charge Waiver**: No additional charges during peak times
- **Priority Processing**: Orders get priority in the queue

### Visual Indicators
- Crown icon for Elite members
- Yellow badges for Elite pricing
- Savings summary in order total
- Benefits preview in customer card

## Responsive Design

### Mobile Optimizations
- Collapsible sections for better mobile navigation
- Touch-friendly buttons and inputs
- Optimized product grid for small screens
- Swipe-friendly category tabs

### Desktop Features
- Multi-column layouts for efficient space usage
- Keyboard shortcuts for power users
- Drag-and-drop functionality (future enhancement)
- Advanced filtering options

## Validation & Error Handling

### Form Validation
- Phone number format validation (+91 format)
- Email validation with optional field handling
- Address validation with pincode format checking
- Minimum order requirements

### Error States
- Network error handling with retry options
- Stock validation with real-time updates
- Payment method validation
- Delivery slot availability checking

## Performance Optimizations

### Lazy Loading
- Product images loaded on demand
- Customer search with debouncing
- Pagination for large product catalogs

### Caching
- Customer data caching for repeat orders
- Product information caching
- Delivery slot availability caching

## Future Enhancements

### Planned Features
- **Bulk Order Creation**: Upload CSV for multiple orders
- **Order Templates**: Save frequently ordered items
- **Customer Favorites**: Quick add from customer's favorite products
- **Delivery Route Optimization**: Smart delivery slot suggestions
- **Voice Input**: Voice-to-text for order notes
- **Barcode Scanning**: Quick product addition via barcode

### Integration Roadmap
- **WhatsApp Integration**: Direct order creation from WhatsApp chats
- **Inventory Sync**: Real-time stock updates across all channels
- **Payment Gateway**: Direct payment processing during order creation
- **SMS Notifications**: Automatic customer notifications
- **GPS Integration**: Address validation with GPS coordinates

## Testing

### Unit Tests
```bash
npm run test:unit -- --grep "ManualOrder"
```

### Integration Tests
```bash
npm run test:integration -- --grep "order-creation"
```

### E2E Tests
```bash
npm run test:e2e -- --spec "manual-order.spec.ts"
```

## Deployment

### Environment Variables
```env
VITE_API_BASE_URL=https://api.bayhawk.com
VITE_ELITE_DISCOUNT_RATE=0.05
VITE_FREE_DELIVERY_THRESHOLD=349
VITE_SURGE_CHARGE_AMOUNT=30
```

### Build Configuration
```bash
npm run build
# Outputs optimized bundle with code splitting
# Manual order components are lazy-loaded for better performance
```

## Support

For technical support or feature requests related to the manual order system:
- Create an issue in the project repository
- Contact the development team
- Check the API documentation for integration details

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Compatibility**: React 18+, TypeScript 5+