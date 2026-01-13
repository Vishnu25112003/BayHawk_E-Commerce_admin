# Procurement Role Access Control Implementation

## Overview
Implemented strict role-based access control for the procurement role (`hub_procurement`) where employees can only access specific sections and pages, with all other pages showing "Access Denied".

## Procurement Role Access Rules

### ✅ ALLOWED ACCESS

#### 1. Products & Stock Section - Full Access
- **All Products** (`/hub/products`)
- **Stock Management** (`/hub/products/stock`)
- **Categories** (`/hub/products/categories`)
- **Cutting Types** (`/hub/products/cutting-types`)
- **Recipes** (`/hub/products/recipes`)

#### 2. Marketing Section - Full Access
- **Scratch Card** (`/hub/scratch-card`)
- **Spin Wheel** (`/hub/spin-wheel`)
- **Flash Sale** (`/hub/flash-sale`)
- **Subscription** (`/hub/subscription`)
- **Offer Notification** (`/hub/offer-notification`)
- **Coupon** (`/hub/coupon`)
- **In-App Currency** (`/hub/in-app-currency`)
- **Referral** (`/hub/referral`)
- **Marketing Overview** (`/hub/marketing`)

#### 3. Reports Section - Procurement Related Only
- **Stock Reports** (`/hub/reports/stock`)
- **Procurement Reports** (`/hub/reports/procurement`)

### ❌ ACCESS DENIED

#### All Other Pages Show "Access Denied":
- **Orders Management** (Manual orders, Pre-orders)
- **Team Management** (Team members, Delivery agents, Custom roles)
- **Sales Reports**
- **Packing Reports**
- **Delivery Reports**
- **Customer Reports**
- **Labeling**
- **Audit Logs**
- **Settings** (All settings pages)

## Technical Implementation

### 1. Updated RBAC System (`src/utils/rbac.ts`)
```typescript
hub_procurement: {
  permissions: [
    // Products & Stock - Full Access
    PERMISSIONS.HUB_PRODUCTS_VIEW,
    PERMISSIONS.HUB_PRODUCTS_MANAGE,
    PERMISSIONS.HUB_STOCK_VIEW,
    PERMISSIONS.HUB_STOCK_MANAGE,
    PERMISSIONS.HUB_CATEGORIES_VIEW,
    PERMISSIONS.HUB_CATEGORIES_MANAGE,
    PERMISSIONS.HUB_RECIPES_VIEW,
    PERMISSIONS.HUB_RECIPES_MANAGE,
    PERMISSIONS.PROCUREMENT_VIEW,
    PERMISSIONS.PROCUREMENT_MANAGE,
    
    // Marketing - Full Access
    'HUB_MARKETING_VIEW',
    'HUB_MARKETING_MANAGE',
    'HUB_SCRATCH_CARD',
    'HUB_SPIN_WHEEL', 
    'HUB_FLASH_SALE',
    'HUB_SUBSCRIPTION',
    'HUB_OFFER_NOTIFICATION',
    'HUB_COUPON',
    'HUB_IN_APP_CURRENCY',
    'HUB_REFERRAL',
    
    // Reports - Procurement Related Only
    PERMISSIONS.HUB_REPORTS_STOCK,
    'HUB_REPORTS_PROCUREMENT',
  ],
}
```

### 2. Created ProcurementRoute Component (`src/components/ProcurementRoute.tsx`)
- **Purpose**: Specialized route protection for procurement employees
- **Features**:
  - Checks if user has `hub_procurement` or `hub_main_admin` role
  - Shows "Access Denied" message for unauthorized users
  - Includes helper functions for procurement-specific access checks

### 3. Updated Menu Configuration (`src/utils/menuConfig.ts`)
- **Products & Stock**: Added `hub_procurement` to `requiredRoles` for all sub-pages
- **Marketing**: Added `hub_procurement` to `requiredRoles` for all marketing pages
- **Reports**: Added procurement-specific reports with proper role restrictions

### 4. Created ProcurementReportsPage (`src/pages/ProcurementReportsPage.tsx`)
- **Purpose**: Shows only procurement-related reports
- **Features**:
  - Displays Stock Reports and Procurement Reports only
  - Filters reports based on procurement access rights
  - Clean, focused interface for procurement employees

### 5. Updated App.tsx Route Protection
```typescript
// Procurement Accessible Routes
<Route path="hub/products/*" element={<ProcurementRoute><ProductsPage /></ProcurementRoute>} />
<Route path="hub/marketing/*" element={<ProcurementRoute><MarketingPage /></ProcurementRoute>} />
<Route path="hub/reports/stock" element={<ProcurementRoute><StockReportPage /></ProcurementRoute>} />

// Admin-Only Routes (Access Denied for Procurement)
<Route path="hub/orders/*" element={<ProtectedRoute permission="HUB_ORDERS_VIEW"><HubOrdersPage /></ProtectedRoute>} />
<Route path="hub/team/*" element={<ProtectedRoute permission="HUB_TEAM_VIEW"><TeamPage /></ProtectedRoute>} />
```

## User Experience for Procurement Role

### ✅ What Procurement Users See:
1. **Dashboard**: Basic dashboard access
2. **Products & Stock Menu**: Full access to all product and inventory management
3. **Marketing Menu**: Complete marketing tools and campaigns access
4. **Reports Menu**: Only Stock Reports and Procurement Reports
5. **Clean Navigation**: Menu only shows accessible sections

### ❌ What Procurement Users DON'T See:
1. **Orders Management**: No access to order creation or management
2. **Team Management**: Cannot manage team members or delivery agents
3. **Other Reports**: No access to sales, packing, delivery, or customer reports
4. **Administrative Features**: No access to settings, audit logs, or labeling
5. **Access Denied Pages**: Clear error messages for restricted areas

## Benefits Achieved

1. **Strict Role Separation**: Procurement employees only see relevant functionality
2. **Enhanced Security**: No access to unauthorized features or sensitive data
3. **Improved Focus**: Clean interface focused on procurement and marketing tasks
4. **Clear Error Handling**: Informative "Access Denied" messages
5. **Maintainable Code**: Reusable ProcurementRoute component for future roles

## Testing Scenarios

### Procurement User Login:
1. ✅ Can access all Products & Stock pages
2. ✅ Can access all Marketing pages  
3. ✅ Can access Stock and Procurement reports only
4. ❌ Gets "Access Denied" for Orders, Team, Settings, Audit, etc.
5. ✅ Menu shows only accessible sections

### Main Admin Login:
1. ✅ Retains full access to all features
2. ✅ Can access everything procurement users can access
3. ✅ Plus additional administrative features

The implementation ensures that procurement employees have a focused, secure interface that displays only the pages they need for their job function, while all other pages show appropriate "Access Denied" messages.
