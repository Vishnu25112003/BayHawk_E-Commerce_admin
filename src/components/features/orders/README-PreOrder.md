# Pre-Order Management System

A comprehensive pre-order management system for BAYHAWK E-commerce admin panel that handles advance bookings, rare products, bulk orders, and subscription management.

## Features Overview

### 🎯 **Pre-Order Types**

1. **Advance Booking**
   - Regular customers: 1-7 days advance
   - Elite members: 1-30 days advance
   - Price locking at booking time
   - Free cancellation up to 24 hours

2. **Rare Product Orders**
   - 2-7 days advance notice required
   - 50% minimum advance payment
   - SMS notifications when available
   - Subject to supplier availability

3. **Bulk Orders**
   - 3-14 days advance notice
   - Minimum order value: ₹2,000
   - Special packaging options
   - Extended delivery windows

4. **Subscription Orders**
   - 7-90 days scheduling
   - 10% automatic discount
   - Flexible pause/modify options
   - Priority delivery slots

### 🔍 **Customer Management**
- **Smart Customer Search**: Integrated with existing customer database
- **Elite Member Benefits**: Extended booking windows and priority slots
- **Customer Profile Integration**: Order history and preferences
- **Automatic Benefit Application**: Elite discounts and free delivery

### 📅 **Advanced Scheduling**
- **Dynamic Date Ranges**: Based on pre-order type and membership
- **Slot Availability**: Real-time slot checking and booking
- **Occasion Management**: Special handling for celebrations
- **Elite Priority**: Priority slot allocation for Elite members

### 💰 **Flexible Payment Options**
- **Full Advance Payment**: Complete payment at booking
- **Partial Advance Payment**: Configurable advance amount
- **Cash on Delivery**: For eligible pre-order types
- **Automatic Validation**: Minimum payment rules enforcement

## Components Architecture

### 1. PreOrderPage.tsx
Main orchestrator component that manages the entire pre-order workflow.

**Key Features:**
- Role-based access (Hub/Store/Super Admin)
- Form validation with Zod schema
- Real-time calculations and validations
- Elite member benefits integration
- Responsive design with mobile optimization

### 2. PreOrderTypeSelector.tsx
Interactive component for selecting pre-order types with guidelines.

**Features:**
- Visual type selection with icons and colors
- Dynamic guidelines based on selection
- Elite member benefit highlights
- Responsive grid layout

### 3. SchedulingCard.tsx
Advanced scheduling component with date and slot management.

**Features:**
- Dynamic date range calculation
- Real-time slot availability checking
- Occasion type selection with emojis
- Elite member scheduling benefits
- Weekend and peak time handling

### 4. PaymentConfigCard.tsx
Comprehensive payment configuration with validation.

**Features:**
- Multiple payment method options
- Dynamic advance payment calculation
- Quick percentage buttons (25%, 50%, 75%, 100%)
- Payment validation and rules enforcement
- Security and policy information

## Usage Examples

### For Hub Admin
```typescript
// Hub admins can create pre-orders for fish products
// Rare fish products with advance booking
// Access via /hub/orders/pre-orders
<HubPreOrderPage />
```

### For Store Admin
```typescript
// Store admins can create pre-orders for all products
// Bulk orders for events and parties
// Access via /store/orders/pre-orders
<StorePreOrderPage />
```

### For Super Admin
```typescript
// Super admins have full access to all pre-order types
// Can manage both hub and store pre-orders
// Access via /orders/pre-orders
<PreOrderPage />
```

## Pre-Order Business Rules

### Advance Booking Rules
- **Regular Customers**: 1-7 days advance booking
- **Elite Members**: 1-30 days advance booking
- **Price Lock**: Prices locked at time of booking
- **Cancellation**: Free cancellation up to 24 hours before delivery

### Rare Product Rules
- **Advance Notice**: 48-72 hours minimum
- **Advance Payment**: 50% minimum required
- **Availability**: Subject to supplier confirmation
- **Notification**: SMS alert when product arrives

### Bulk Order Rules
- **Minimum Value**: ₹2,000 order value
- **Advance Notice**: 3-14 days required
- **Special Handling**: Extended delivery windows
- **Packaging**: Special packaging charges may apply

### Subscription Rules
- **Full Payment**: 100% advance payment required
- **Discount**: 10% automatic discount applied
- **Flexibility**: Can pause or modify anytime
- **Priority**: Priority delivery slot allocation

## Elite Member Benefits

### Extended Booking Windows
- **Advance Booking**: Up to 30 days (vs 7 days for regular)
- **Priority Slots**: First access to premium time slots
- **Free Changes**: Slot changes up to 12 hours before delivery

### Financial Benefits
- **5% Extra Discount**: On all pre-order items
- **Free Delivery**: On orders above ₹349
- **No Surge Charges**: Waived during peak times
- **Flexible Payments**: Extended payment terms

### Service Benefits
- **Priority Processing**: Orders processed first
- **Dedicated Support**: Special customer service line
- **Special Occasions**: Enhanced presentation and care

## API Integration

### Pre-Order Creation
```typescript
POST /api/pre-orders
{
  preOrderType: 'advance_booking' | 'rare_product' | 'bulk_order' | 'subscription',
  customer: CustomerData,
  items: PreOrderItem[],
  scheduling: {
    scheduledDate: string,
    scheduledSlot: string,
    occasionType?: string
  },
  payment: {
    method: 'advance_full' | 'advance_partial' | 'cod_on_delivery',
    advanceAmount: number,
    totalAmount: number
  },
  delivery: DeliveryInfo
}
```

### Slot Availability Check
```typescript
GET /api/delivery-slots/availability?date={date}&type={preOrderType}
Response: {
  slots: Array<{
    id: string,
    timeRange: string,
    available: boolean,
    premium: boolean,
    price?: number
  }>
}
```

### Rare Product Availability
```typescript
GET /api/products/rare/availability?productIds={ids}
Response: {
  products: Array<{
    id: string,
    available: boolean,
    estimatedDate?: string,
    advanceNoticeRequired: number
  }>
}
```

## Validation & Business Logic

### Date Validation
- **Minimum Advance**: Based on pre-order type
- **Maximum Advance**: Based on membership level
- **Blackout Dates**: Holidays and maintenance days
- **Slot Availability**: Real-time availability checking

### Payment Validation
- **Minimum Advance**: Enforced based on pre-order type
- **Maximum Amount**: Cannot exceed total order value
- **Payment Method**: Restricted based on pre-order type
- **Elite Benefits**: Automatic discount application

### Inventory Validation
- **Stock Checking**: Real-time stock validation
- **Rare Product**: Supplier availability confirmation
- **Bulk Orders**: Quantity availability checking
- **Subscription**: Recurring stock allocation

## Notifications & Alerts

### Customer Notifications
- **Booking Confirmation**: SMS and email confirmation
- **Payment Receipt**: Payment confirmation with details
- **Delivery Reminder**: 24 hours before delivery
- **Rare Product Alert**: When rare products become available

### Admin Notifications
- **New Pre-Order**: Real-time admin notifications
- **Payment Received**: Payment confirmation alerts
- **Rare Product Request**: Supplier coordination alerts
- **Delivery Schedule**: Daily delivery schedule updates

## Reporting & Analytics

### Pre-Order Reports
- **Daily Pre-Orders**: Count and value by type
- **Elite vs Regular**: Comparison analytics
- **Popular Slots**: Most requested delivery slots
- **Advance Payment**: Payment method preferences

### Performance Metrics
- **Conversion Rate**: Pre-order to delivery success rate
- **Cancellation Rate**: Pre-order cancellation analytics
- **Elite Utilization**: Elite member feature usage
- **Revenue Impact**: Pre-order revenue contribution

## Mobile Optimization

### Responsive Design
- **Touch-Friendly**: Large buttons and touch targets
- **Swipe Navigation**: Category and type selection
- **Collapsible Sections**: Optimized for small screens
- **Quick Actions**: One-tap common operations

### Progressive Enhancement
- **Offline Support**: Basic functionality without internet
- **Push Notifications**: Mobile push for updates
- **Camera Integration**: Barcode scanning for products
- **Location Services**: Address auto-completion

## Future Enhancements

### Planned Features
- **AI Recommendations**: Smart pre-order suggestions
- **Voice Ordering**: Voice-to-text order creation
- **Calendar Integration**: Sync with customer calendars
- **Group Orders**: Collaborative ordering for events

### Advanced Analytics
- **Demand Forecasting**: Predict pre-order patterns
- **Price Optimization**: Dynamic pricing for pre-orders
- **Customer Segmentation**: Personalized pre-order offers
- **Seasonal Trends**: Holiday and festival analytics

## Testing Strategy

### Unit Tests
```bash
npm run test:unit -- --grep "PreOrder"
```

### Integration Tests
```bash
npm run test:integration -- --grep "pre-order"
```

### E2E Tests
```bash
npm run test:e2e -- --spec "pre-order.spec.ts"
```

## Performance Considerations

### Optimization Techniques
- **Lazy Loading**: Components loaded on demand
- **Debounced Search**: Efficient customer search
- **Cached Data**: Product and slot information caching
- **Optimistic Updates**: Immediate UI feedback

### Scalability Features
- **Pagination**: Large dataset handling
- **Virtual Scrolling**: Efficient list rendering
- **Background Sync**: Offline operation support
- **CDN Integration**: Fast asset delivery

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Compatibility**: React 18+, TypeScript 5+  
**Dependencies**: React Hook Form, Zod, Lucide React