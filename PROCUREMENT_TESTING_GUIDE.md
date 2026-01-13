# Procurement Role Implementation - Testing Guide

## How to Test the Implementation

### 1. Login as Procurement User
1. Go to the login page
2. Select "Hub" as login type
3. Select "Procurement Employee" as role
4. Enter any email/password and login

### 2. Expected Behavior After Login

#### ✅ SHOULD BE VISIBLE:
1. **Dashboard** - Basic dashboard with procurement-specific stats
2. **Products & Stock Menu** with all sub-items:
   - All Products
   - Stock Management  
   - Categories
   - Cutting Types
   - Recipes
3. **Marketing Menu** with all sub-items:
   - Scratch Card
   - Spin Wheel
   - Flash Sale
   - Subscription
   - Offer Notification
   - Coupon
   - In-App Currency
   - Referral
4. **Reports Menu** with limited items:
   - Stock Reports
   - Procurement Reports

#### ❌ SHOULD NOT BE VISIBLE:
1. **Orders Menu** - Should not appear in sidebar
2. **Team & Users Menu** - Should not appear in sidebar  
3. **Labeling** - Should not appear in sidebar
4. **Audit Logs** - Should not appear in sidebar
5. **Settings** - Should not appear in sidebar
6. **Sales Reports** - Should not appear in reports menu
7. **Packing Reports** - Should not appear in reports menu
8. **Delivery Reports** - Should not appear in reports menu
9. **Customer Reports** - Should not appear in reports menu

#### ❌ ACCESS DENIED PAGES:
If procurement user tries to access restricted URLs directly:
- `/hub/orders` → Access Denied
- `/hub/team` → Access Denied  
- `/hub/labeling` → Access Denied
- `/hub/audit` → Access Denied
- `/hub/settings` → Access Denied
- `/hub/reports/sales` → Access Denied
- `/hub/reports/packing` → Access Denied
- `/hub/reports/delivery` → Access Denied
- `/hub/reports/customer` → Access Denied

## Key Files Modified

1. **`src/utils/rbac.ts`** - Updated procurement role permissions
2. **`src/utils/menuConfig.ts`** - Added role-based menu filtering
3. **`src/components/layout/Sidebar.tsx`** - Uses filtered menu
4. **`src/components/ProcurementRoute.tsx`** - Route protection component
5. **`src/pages/DashboardPage.tsx`** - Allow procurement access to dashboard
6. **`src/App.tsx`** - Protected routes with ProcurementRoute component

## Troubleshooting

If procurement users still see all menu items:
1. Check browser console for errors
2. Verify user role is set to 'hub_procurement' in localStorage
3. Clear browser cache and localStorage
4. Check that `getFilteredMenuByUser` is being called in Sidebar.tsx

If "Access Denied" doesn't show for restricted pages:
1. Verify ProcurementRoute component is wrapping the routes
2. Check that user role is properly set in AuthContext
3. Verify route paths match exactly in App.tsx
