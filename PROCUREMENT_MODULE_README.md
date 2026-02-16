# 🧾 Procurement Module - Purchase Management

## Overview
Complete purchase entry and management system for Hub and Store procurement roles.

## ✅ Implemented Features

### 1. Purchase Entry Form
- **Basic Details Section**
  - Auto-generated Purchase ID
  - Date picker (default: current date)
  - Supplier name input
  - Auto-filled module type (Hub/Store)
  - Auto-filled created by (logged-in user)
  - Optional remarks textarea

- **Product Purchase Grid**
  - Multiple products per purchase
  - Product selection dropdown
  - Variant selection (Small/Medium/Large)
  - Count Min/Max fields
  - Gross weight input
  - Base price range (Min/Max)
  - Purchase price entry with validation warning
  - Status dropdown (Processing/Purchased/Cancelled/Alternate)
  - Product-level remarks
  - Add/Remove product rows

### 2. Status Management
- **Default Status**: Processing
- **Available Statuses**: Processing, Purchased, Cancelled, Alternate
- **Status Change Features**:
  - Manual status update via modal
  - Status history tracking
  - Timestamp and user tracking
  - Remarks for status changes
  - Visual status badges with color coding

### 3. Alternate Product Handling
- When status = "Alternate":
  - Select alternate product from dropdown
  - Original product ID stored
  - Alternate product ID stored
  - Visual indicator in table (icon)
  - Detailed display in view modal showing substitution

### 4. Filters
- **Date Range**: From/To date pickers
- **Status**: Dropdown filter
- **Product**: Dropdown filter
- Combined filtering support
- Reset filters button
- Server-side pagination ready

### 5. Export Options
- **CSV Export**: All purchase data
- **PDF Export**: Formatted report with header, footer, page numbers
- **Excel Export**: Structured spreadsheet with all fields
- Includes filter summary in exports
- Company header in PDF

### 6. Validation Rules
✅ Purchase price range warning (optional)
✅ Count Min ≤ Count Max validation
✅ Required fields enforcement
✅ Alternate product selection when status = Alternate

### 7. UI Components

#### Files Created/Updated:
```
src/types/purchase.ts                          - Type definitions
src/pages/procurement/PurchaseManagementPage.tsx - Main page
src/components/procurement/
  ├── PurchaseForm.tsx                         - Create/Edit form
  ├── PurchaseTable.tsx                        - Data table with actions
  ├── PurchaseFilters.tsx                      - Filter controls
  ├── PurchaseDetailsModal.tsx                 - View details modal
  └── StatusChangeModal.tsx                    - Status update modal
src/services/purchaseService.ts                - API service layer
```

### 8. Status Color Coding
- 🟡 **Processing**: Yellow badge
- 🟢 **Purchased**: Green badge
- 🔴 **Cancelled**: Red badge
- 🔵 **Alternate**: Blue badge

### 9. Audit & History Tracking
- Status history table maintained
- Tracks: purchase_id, old_status, new_status, changed_by, changed_at
- Displayed in purchase details modal
- Automatic timestamp on all updates

### 10. Role-Based Access
- **Hub Procurement**: Full access to hub purchases
- **Store Procurement**: Limited to store purchases
- **Main Admins**: Can change status
- Status change permissions enforced

## 📋 Database Schema Suggestion

### purchases table
```sql
CREATE TABLE purchases (
  id VARCHAR(50) PRIMARY KEY,
  purchase_date DATE NOT NULL,
  supplier_name VARCHAR(255) NOT NULL,
  module_type ENUM('hub', 'store') NOT NULL,
  created_by VARCHAR(255) NOT NULL,
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(255)
);
```

### purchase_products table
```sql
CREATE TABLE purchase_products (
  id VARCHAR(50) PRIMARY KEY,
  purchase_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  variant ENUM('small', 'medium', 'large') NOT NULL,
  count_min INT NOT NULL,
  count_max INT NOT NULL,
  gross_weight DECIMAL(10,2) NOT NULL,
  base_price_min DECIMAL(10,2) NOT NULL,
  base_price_max DECIMAL(10,2) NOT NULL,
  purchase_price DECIMAL(10,2) NOT NULL,
  status ENUM('processing', 'purchased', 'cancelled', 'alternate') DEFAULT 'processing',
  remarks TEXT,
  original_product_id VARCHAR(50),
  alternate_product_id VARCHAR(50),
  is_alternate BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (purchase_id) REFERENCES purchases(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### purchase_status_history table
```sql
CREATE TABLE purchase_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  purchase_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by VARCHAR(255) NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  remarks TEXT,
  FOREIGN KEY (purchase_id) REFERENCES purchases(id),
  FOREIGN KEY (product_id) REFERENCES purchase_products(id)
);
```

## 🔌 API Integration

### Service Layer Ready
The `purchaseService.ts` provides:
- `getPurchases(filters)` - Fetch with filters
- `getPurchaseById(id)` - Get single purchase
- `createPurchase(data)` - Create new
- `updatePurchase(id, data)` - Update existing
- `updateProductStatus(...)` - Change status
- `deletePurchase(id)` - Delete purchase
- `exportPurchases(filters, format)` - Export data

### Integration Steps:
1. Replace mock data in `PurchaseManagementPage.tsx`
2. Import `purchaseApi` from services
3. Use `useEffect` to fetch data on mount
4. Add loading states
5. Add error handling
6. Connect to your backend API

## 🎯 Usage

### For Procurement Users:
1. Navigate to Procurement → Purchase Management
2. Click "Add Purchase" to create new entry
3. Fill basic details and add products
4. Submit to create purchase
5. Use filters to find purchases
6. Click eye icon to view details
7. Click edit icon to modify
8. Change status via edit icon in details modal
9. Export data using CSV/PDF/Excel buttons

### For Developers:
```typescript
// Import the service
import { purchaseApi } from '../services/purchaseService';

// Fetch purchases
const purchases = await purchaseApi.getPurchases({ status: 'processing' });

// Create purchase
const newPurchase = await purchaseApi.createPurchase(purchaseData);

// Update status
await purchaseApi.updateProductStatus(purchaseId, productId, 'purchased', 'Completed', userName);
```

## 🚀 Next Steps (Backend Integration)

1. **Create Backend API Endpoints**:
   - `GET /api/purchases` - List with filters
   - `POST /api/purchases` - Create
   - `PUT /api/purchases/:id` - Update
   - `PATCH /api/purchases/:id/products/:productId/status` - Status change
   - `DELETE /api/purchases/:id` - Delete
   - `GET /api/purchases/export` - Export

2. **Add Authentication**:
   - JWT token validation
   - Role-based middleware
   - Module type filtering

3. **Add Validation**:
   - Server-side validation
   - Business logic checks
   - Price range validation

4. **Add Notifications**:
   - Status change notifications
   - Purchase creation alerts
   - Export completion notifications

## 📝 Notes

- All components use TypeScript for type safety
- Responsive design for mobile/tablet/desktop
- Follows existing project structure and patterns
- Uses existing UI components (Button, Input, Modal, Badge)
- Mock data included for testing
- Ready for backend API integration
- Audit trail maintained for compliance

## 🎨 UI/UX Features

- Color-coded status badges
- Alternate product indicators
- Price range warnings
- Validation messages
- Loading states ready
- Empty state handling
- Responsive tables
- Modal-based forms
- Inline editing for status
- Export with filters applied

---

**Status**: ✅ Complete and ready for backend integration
**Last Updated**: 2026-02-16
