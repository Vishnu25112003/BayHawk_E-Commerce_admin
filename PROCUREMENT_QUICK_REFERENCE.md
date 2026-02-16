# 📋 PROCUREMENT MODULE - QUICK REFERENCE

## 🚀 Quick Start

### Run the Application
```bash
cd /home/barath/vishnu/BayHawk/BayHawk_E-Commerce_admin
npm run dev
```

### Access the Module
```
URL: http://localhost:5173/hub/procurement/purchases
     http://localhost:5173/store/procurement/purchases
```

---

## 📂 File Structure

```
src/
├── types/purchase.ts                           # Type definitions
├── services/purchaseService.ts                 # API service
├── pages/procurement/
│   └── PurchaseManagementPage.tsx             # Main page
└── components/procurement/
    ├── PurchaseForm.tsx                        # Create/Edit
    ├── PurchaseTable.tsx                       # Display
    ├── PurchaseFilters.tsx                     # Filters
    ├── PurchaseDetailsModal.tsx                # View
    └── StatusChangeModal.tsx                   # Status update
```

---

## 🎯 Key Features

| Feature | Component | Location |
|---------|-----------|----------|
| Create Purchase | PurchaseForm | Click "Add Purchase" button |
| Edit Purchase | PurchaseForm | Click edit icon in table |
| View Details | PurchaseDetailsModal | Click eye icon in table |
| Change Status | StatusChangeModal | Click edit icon in details modal |
| Filter Data | PurchaseFilters | Top of page |
| Export CSV | PurchaseManagementPage | Click CSV button |
| Export PDF | PurchaseManagementPage | Click PDF button |
| Export Excel | PurchaseManagementPage | Click Excel button |

---

## 🔧 Common Tasks

### Add New Purchase
1. Click "Add Purchase" button
2. Fill purchase date and supplier name
3. Click "Add Product" to add products
4. Fill product details
5. Click "Create Purchase"

### Change Product Status
1. Click eye icon on purchase
2. Find product in details modal
3. Click edit icon next to status badge
4. Select new status
5. Add remarks (optional)
6. Click "Update Status"

### Filter Purchases
1. Use date pickers for date range
2. Select status from dropdown
3. Select product from dropdown
4. Click "Reset Filters" to clear

### Export Data
1. Apply filters (optional)
2. Click CSV/PDF/Excel button
3. File downloads automatically

---

## 🎨 Status Colors

- 🟡 **Processing** - Yellow badge
- 🟢 **Purchased** - Green badge
- 🔴 **Cancelled** - Red badge
- 🔵 **Alternate** - Blue badge

---

## 📝 Type Definitions

### Purchase
```typescript
interface Purchase {
  id: string;
  purchaseDate: string;
  supplierName: string;
  moduleType: 'hub' | 'store';
  createdBy: string;
  remarks?: string;
  products: PurchaseProduct[];
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  statusHistory?: StatusHistory[];
}
```

### PurchaseProduct
```typescript
interface PurchaseProduct {
  id: string;
  productId: string;
  productName: string;
  variant: 'small' | 'medium' | 'large';
  countMin: number;
  countMax: number;
  grossWeight: number;
  basePriceMin: number;
  basePriceMax: number;
  purchasePrice: number;
  status: 'processing' | 'purchased' | 'cancelled' | 'alternate';
  remarks?: string;
  originalProductId?: string;
  alternateProductId?: string;
  isAlternate: boolean;
}
```

---

## 🔌 API Endpoints

```
GET    /api/purchases                              # List purchases
POST   /api/purchases                              # Create purchase
PUT    /api/purchases/:id                          # Update purchase
PATCH  /api/purchases/:id/products/:pid/status     # Change status
DELETE /api/purchases/:id                          # Delete purchase
GET    /api/purchases/export                       # Export data
```

---

## 🛠️ Service Methods

```typescript
import { purchaseApi } from '../services/purchaseService';

// Get purchases
const purchases = await purchaseApi.getPurchases(filters);

// Create purchase
const newPurchase = await purchaseApi.createPurchase(data);

// Update purchase
const updated = await purchaseApi.updatePurchase(id, data);

// Change status
await purchaseApi.updateProductStatus(purchaseId, productId, status, remarks, user);

// Delete purchase
await purchaseApi.deletePurchase(id);

// Export
const blob = await purchaseApi.exportPurchases(filters, 'csv');
```

---

## ✅ Validation Rules

- ✅ Purchase date is required
- ✅ Supplier name is required
- ✅ At least one product required
- ✅ Product selection required
- ✅ Purchase price required
- ✅ Count Min ≤ Count Max
- ⚠️ Purchase price should be within base price range (warning only)
- ✅ Alternate product required when status = "Alternate"

---

## 🎭 User Roles

| Role | Permissions |
|------|-------------|
| Hub Procurement | Create, Edit, View, Export (Hub only) |
| Store Procurement | Create, Edit, View, Export (Store only) |
| Hub Main Admin | All permissions (Hub) + Status change |
| Store Main Admin | All permissions (Store) + Status change |

---

## 🐛 Troubleshooting

### Issue: Purchase not saving
- Check all required fields are filled
- Verify count min ≤ count max
- Check console for errors

### Issue: Status not changing
- Ensure user has permission
- Check if remarks are required
- Verify API connection

### Issue: Export not working
- Check if jsPDF and xlsx are installed
- Verify browser allows downloads
- Check console for errors

### Issue: Filters not working
- Click "Reset Filters" first
- Check date format
- Verify filter values

---

## 📚 Documentation Files

1. **PROCUREMENT_MODULE_README.md** - Complete feature documentation
2. **PROCUREMENT_COMPLETION_SUMMARY.md** - What was completed
3. **PROCUREMENT_ARCHITECTURE.md** - Component architecture
4. **BACKEND_INTEGRATION_GUIDE.md** - Backend integration steps
5. **PROCUREMENT_FINAL_SUMMARY.md** - Final delivery summary
6. **PROCUREMENT_QUICK_REFERENCE.md** - This file

---

## 🔗 Quick Links

- **Main Page**: `src/pages/procurement/PurchaseManagementPage.tsx`
- **Types**: `src/types/purchase.ts`
- **Service**: `src/services/purchaseService.ts`
- **Components**: `src/components/procurement/`

---

## 💻 Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

---

## 📊 Component Props Quick Reference

### PurchaseManagementPage
```typescript
// No props - top level page
```

### PurchaseForm
```typescript
isOpen: boolean
onClose: () => void
onSubmit: (data: Partial<Purchase>) => void
purchase?: Purchase
moduleType: 'hub' | 'store'
userName: string
products: Product[]
```

### PurchaseTable
```typescript
purchases: Purchase[]
onEdit: (purchase: Purchase) => void
onView: (purchase: Purchase) => void
onStatusChange?: (purchaseId, productId, status, remarks) => void
```

### PurchaseFilters
```typescript
filters: PurchaseFilters
onFilterChange: (filters: PurchaseFilters) => void
onReset: () => void
products: Product[]
```

### PurchaseDetailsModal
```typescript
isOpen: boolean
onClose: () => void
purchase: Purchase | null
onStatusChange?: (purchaseId, productId, status, remarks) => void
canEditStatus?: boolean
```

### StatusChangeModal
```typescript
isOpen: boolean
onClose: () => void
onConfirm: (status: string, remarks: string) => void
currentStatus: string
productName: string
```

---

## 🎯 Testing Checklist

Quick test scenarios:

- [ ] Create purchase with single product
- [ ] Create purchase with multiple products
- [ ] Edit existing purchase
- [ ] View purchase details
- [ ] Change status to "Purchased"
- [ ] Change status to "Alternate" (select alternate product)
- [ ] Filter by date range
- [ ] Filter by status
- [ ] Export to CSV
- [ ] Export to PDF
- [ ] Export to Excel
- [ ] Validate count min > max (should fail)
- [ ] Test responsive design on mobile

---

## 🚨 Important Notes

1. **Mock Data**: Currently using mock data. Replace with API calls for production.
2. **Authentication**: Ensure user is authenticated before accessing.
3. **Permissions**: Check user role before allowing actions.
4. **Validation**: Client-side validation only. Add server-side validation.
5. **Export**: Large datasets may take time to export.

---

## 📞 Need Help?

1. Check documentation files
2. Review component code
3. Check console for errors
4. Verify API connection
5. Check user permissions

---

**Quick Reference Version**: 1.0  
**Last Updated**: February 16, 2026  
**Status**: ✅ Complete
