# 🏗️ Procurement Module - Component Architecture

## Component Hierarchy

```
PurchaseManagementPage (Main Container)
│
├── PurchaseFilters
│   ├── Date Range (From/To)
│   ├── Status Dropdown
│   ├── Product Dropdown
│   └── Reset Button
│
├── Action Buttons
│   ├── Add Purchase Button
│   └── Export Buttons (CSV, PDF, Excel)
│
├── PurchaseTable
│   ├── Table Headers
│   ├── Purchase Rows
│   │   ├── Purchase ID
│   │   ├── Date
│   │   ├── Supplier
│   │   ├── Products Count
│   │   ├── Total Weight
│   │   ├── Total Price
│   │   ├── Status Badge
│   │   ├── Alternate Icon (if applicable)
│   │   └── Actions (View, Edit)
│   │
│   └── PurchaseDetailsModal (View)
│       ├── Purchase Header Info
│       ├── Remarks Section
│       ├── Products List
│       │   ├── Product Card
│       │   │   ├── Product Name + Variant
│       │   │   ├── Status Badge + Edit Button
│       │   │   ├── Alternate Indicator
│       │   │   ├── Details Grid
│       │   │   └── Product Remarks
│       │   └── ...more products
│       ├── Summary (Total Weight, Amount)
│       └── Status History Timeline
│
└── PurchaseForm (Create/Edit Modal)
    ├── Section A: Basic Details
    │   ├── Purchase Date
    │   ├── Supplier Name
    │   ├── Module Type (auto)
    │   └── Remarks
    │
    └── Section B: Product Grid
        ├── Add Product Button
        └── Product Rows (Dynamic)
            ├── Product Dropdown
            ├── Variant Dropdown
            ├── Count Min/Max
            ├── Gross Weight
            ├── Base Price Min/Max
            ├── Purchase Price (with warning)
            ├── Status Dropdown
            ├── Alternate Product (conditional)
            ├── Remarks
            └── Remove Button

StatusChangeModal (Standalone)
├── Product Name (readonly)
├── Current Status (readonly)
├── New Status Dropdown
├── Remarks Textarea
└── Update Button
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    PurchaseManagementPage                    │
│                                                               │
│  State:                                                       │
│  - purchases: Purchase[]                                      │
│  - filters: PurchaseFilters                                   │
│  - isFormOpen: boolean                                        │
│  - editingPurchase: Purchase | undefined                      │
│                                                               │
│  Handlers:                                                    │
│  - handleCreatePurchase()                                     │
│  - handleEditPurchase(purchase)                               │
│  - handleViewPurchase(purchase)                               │
│  - handleSubmitPurchase(data)                                 │
│  - handleStatusChange(purchaseId, productId, status, remarks) │
│  - handleResetFilters()                                       │
│  - exportToCSV/PDF/Excel()                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│PurchaseFilters│    │PurchaseTable │    │PurchaseForm  │
│              │    │              │    │              │
│Props:        │    │Props:        │    │Props:        │
│- filters     │    │- purchases   │    │- isOpen      │
│- onFilterChg │    │- onEdit      │    │- onClose     │
│- onReset     │    │- onView      │    │- onSubmit    │
│- products    │    │- onStatusChg │    │- purchase    │
└──────────────┘    └──────────────┘    │- moduleType  │
                            │            │- userName    │
                            │            │- products    │
                            ▼            └──────────────┘
                  ┌──────────────────┐
                  │PurchaseDetails   │
                  │Modal             │
                  │                  │
                  │Props:            │
                  │- isOpen          │
                  │- onClose         │
                  │- purchase        │
                  │- onStatusChange  │
                  │- canEditStatus   │
                  └──────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │StatusChangeModal │
                  │                  │
                  │Props:            │
                  │- isOpen          │
                  │- onClose         │
                  │- onConfirm       │
                  │- currentStatus   │
                  │- productName     │
                  └──────────────────┘
```

## Service Layer Integration

```
┌─────────────────────────────────────────────────────────┐
│                  purchaseService.ts                      │
│                                                           │
│  API Methods:                                             │
│  ┌─────────────────────────────────────────────────┐    │
│  │ getPurchases(filters)                            │    │
│  │ ↓ GET /purchases?dateFrom=...&status=...        │    │
│  │ Returns: Purchase[]                              │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │ createPurchase(data)                             │    │
│  │ ↓ POST /purchases                                │    │
│  │ Returns: Purchase                                │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │ updatePurchase(id, data)                         │    │
│  │ ↓ PUT /purchases/:id                             │    │
│  │ Returns: Purchase                                │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │ updateProductStatus(purchaseId, productId, ...)  │    │
│  │ ↓ PATCH /purchases/:id/products/:pid/status      │    │
│  │ Returns: Purchase                                │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │ exportPurchases(filters, format)                 │    │
│  │ ↓ GET /purchases/export?format=csv               │    │
│  │ Returns: Blob                                    │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
                  ┌──────────────┐
                  │  Backend API  │
                  │  (To be built)│
                  └──────────────┘
```

## State Management Flow

### Create Purchase Flow
```
User clicks "Add Purchase"
    ↓
PurchaseManagementPage sets isFormOpen = true
    ↓
PurchaseForm modal opens (empty)
    ↓
User fills form and adds products
    ↓
User clicks "Create Purchase"
    ↓
PurchaseForm validates data
    ↓
PurchaseForm calls onSubmit(data)
    ↓
PurchaseManagementPage.handleSubmitPurchase()
    ↓
Generate new Purchase ID
    ↓
Add to purchases state
    ↓
Close modal
    ↓
Table updates with new purchase
```

### Status Change Flow
```
User clicks eye icon on purchase
    ↓
PurchaseTable opens PurchaseDetailsModal
    ↓
User clicks edit icon next to status
    ↓
StatusChangeModal opens
    ↓
User selects new status and adds remarks
    ↓
User clicks "Update Status"
    ↓
StatusChangeModal calls onConfirm(status, remarks)
    ↓
PurchaseDetailsModal calls onStatusChange()
    ↓
PurchaseManagementPage.handleStatusChange()
    ↓
Update product status in state
    ↓
Add entry to statusHistory
    ↓
Update timestamps
    ↓
Modal closes, details refresh
```

### Filter Flow
```
User changes filter (date/status/product)
    ↓
PurchaseFilters calls onFilterChange(newFilters)
    ↓
PurchaseManagementPage updates filters state
    ↓
filteredPurchases computed (useMemo recommended)
    ↓
PurchaseTable re-renders with filtered data
```

### Export Flow
```
User clicks CSV/PDF/Excel button
    ↓
PurchaseManagementPage.exportToCSV/PDF/Excel()
    ↓
Process filteredPurchases data
    ↓
Generate file (CSV string / PDF doc / Excel workbook)
    ↓
Create blob and download link
    ↓
Trigger download
```

## File Structure

```
src/
├── types/
│   └── purchase.ts                    # Type definitions
│
├── services/
│   └── purchaseService.ts             # API service layer
│
├── pages/
│   └── procurement/
│       └── PurchaseManagementPage.tsx # Main container
│
└── components/
    └── procurement/
        ├── PurchaseForm.tsx           # Create/Edit form
        ├── PurchaseTable.tsx          # Data table
        ├── PurchaseFilters.tsx        # Filter controls
        ├── PurchaseDetailsModal.tsx   # View modal
        └── StatusChangeModal.tsx      # Status update modal
```

## Props Interface Summary

### PurchaseManagementPage
```typescript
// No props - top level page
```

### PurchaseFilters
```typescript
interface PurchaseFiltersProps {
  filters: PurchaseFilters;
  onFilterChange: (filters: PurchaseFilters) => void;
  onReset: () => void;
  products: Array<{ id: string; name: string }>;
}
```

### PurchaseTable
```typescript
interface PurchaseTableProps {
  purchases: Purchase[];
  onEdit: (purchase: Purchase) => void;
  onView: (purchase: Purchase) => void;
  onStatusChange?: (purchaseId: string, productId: string, newStatus: string, remarks: string) => void;
}
```

### PurchaseForm
```typescript
interface PurchaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (purchase: Partial<Purchase>) => void;
  purchase?: Purchase;
  moduleType: 'hub' | 'store';
  userName: string;
  products: Array<{ id: string; name: string; category: string }>;
}
```

### PurchaseDetailsModal
```typescript
interface PurchaseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchase: Purchase | null;
  onStatusChange?: (purchaseId: string, productId: string, newStatus: string, remarks: string) => void;
  canEditStatus?: boolean;
}
```

### StatusChangeModal
```typescript
interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newStatus: string, remarks: string) => void;
  currentStatus: string;
  productName: string;
}
```

## Key Design Patterns

1. **Container/Presentational Pattern**: Main page manages state, components present UI
2. **Controlled Components**: All form inputs controlled by React state
3. **Prop Drilling**: Data flows down, callbacks flow up
4. **Modal Pattern**: Overlays for forms and details
5. **Service Layer**: Separation of API logic from UI
6. **Type Safety**: Full TypeScript coverage
7. **Composition**: Small, focused components
8. **Single Responsibility**: Each component has one job

---

**This architecture ensures**:
- ✅ Maintainability
- ✅ Testability
- ✅ Scalability
- ✅ Type Safety
- ✅ Reusability
- ✅ Clear data flow
