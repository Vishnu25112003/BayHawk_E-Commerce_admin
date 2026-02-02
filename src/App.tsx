import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute as ProtectedRouteComponent } from './components/ProtectedRoute';
import { ProcurementRoute } from './components/ProcurementRoute';
import { PackingRoute } from './components/PackingRoute';
import { DeliveryRoute } from './components/DeliveryRoute';
import { MultiRoleRoute } from './components/MultiRoleRoute';
import { PERMISSIONS } from './utils/rbac';
import { ProcurementReportsPage } from './pages/reports/ProcurementReportsPage';
import { DeliveryAgentPage } from './pages/delivery/DeliveryAgentPage';
import { LoginPage } from './pages/dashboard/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import ProcurementDashboard from './pages/dashboard/ProcurementDashboard';
import PackingDashboard from './pages/dashboard/PackingDashboard';
import DeliveryDashboard from './pages/dashboard/DeliveryDashboard';
import { OrdersPage } from './pages/orders/OrdersPage';
import { ManualOrderPage } from './pages/orders/ManualOrderPage';
import { PreOrderPage } from './pages/orders/PreOrderPage';
import HubManualOrderPage from './pages/orders/HubManualOrderPage';
import HubPreOrderPage from './pages/orders/HubPreOrderPage';
import StoreManualOrderPage from './pages/orders/StoreManualOrderPage';
import StorePreOrderPage from './pages/orders/StorePreOrderPage';
import { ProductsPage } from './pages/products/ProductsPage';
import { ProductApprovalPage } from './pages/products/ProductApprovalPage';
import { CuttingTypePage } from './pages/products/CuttingTypePage';
import { ScratchCardPage } from './pages/marketing/ScratchCardPage';
import { SpinWheelPage } from './pages/marketing/SpinWheelPage';
import { FlashSalePage } from './pages/marketing/FlashSalePage';
import { SubscriptionPage } from './pages/marketing/SubscriptionPage';
import { OfferNotificationPage } from './pages/marketing/OfferNotificationPage';
import { CouponPage } from './pages/marketing/CouponPage';
import { InAppCurrencyPage } from './pages/marketing/InAppCurrencyPage';
import { ReferralPage } from './pages/marketing/ReferralPage';
import { HubPage } from './pages/hub-store/HubPage';
import { StorePage } from './pages/hub-store/StorePage';
import { TeamPage } from './pages/team/TeamPage';
import { CustomRolesPage } from './pages/team/CustomRolesPage';
import { CategoriesPage } from './pages/products/CategoriesPage';
import { StockManagementPage } from './pages/products/StockManagementPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { SalesReportPage } from './pages/reports/SalesReportPage';
import { PackingReportPage } from './pages/reports/PackingReportPage';
import { DeliveryReportPage } from './pages/reports/DeliveryReportPage';
import { StockReportPage } from './pages/reports/StockReportPage';
import { CustomerReportPage } from './pages/reports/CustomerReportPage';
import { GeneralSettingsPage } from './pages/settings/GeneralSettingsPage';
import { DeliverySlotsPage } from './pages/settings/DeliverySlotsPage';
import { ShippingChargesPage } from './pages/settings/ShippingChargesPage';
import { IntegrationsPage } from './pages/settings/IntegrationsPage';
import { NotificationCustomizationPage } from './pages/settings/NotificationCustomizationPage';
import { WeatherCustomizationPage } from './pages/settings/WeatherCustomizationPage';
import { LegalPage } from './pages/settings/LegalPage';
import { AdvertisementPage } from './pages/settings/AdvertisementPage';
import { MarketingPage } from './pages/marketing/MarketingPage';
import { RecipesPage } from './pages/products/RecipesPage';
import { MembershipPage } from './pages/other/MembershipPage';
import { WalletPage } from './pages/other/WalletPage';
import ProcurementPage from './pages/other/ProcurementPage';
import PackingPage from './pages/other/PackingPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import AuditLogsPage from './pages/audit/AuditLogsPage';
import { LabelingPage } from './pages/labeling/LabelingPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        
        {/* Role-specific Dashboards */}
        <Route path="procurement-dashboard" element={<ProcurementRoute><ProcurementDashboard /></ProcurementRoute>} />
        <Route path="packing-dashboard" element={<PackingRoute><PackingDashboard /></PackingRoute>} />
        <Route path="delivery-dashboard" element={<DeliveryRoute><DeliveryDashboard /></DeliveryRoute>} />
        
        {/* Hub Products Routes - Procurement Accessible */}
        <Route path="hub/products/categories" element={<ProcurementRoute><CategoriesPage /></ProcurementRoute>} />
        <Route path="hub/products/cutting-types" element={<ProcurementRoute><CuttingTypePage /></ProcurementRoute>} />
        <Route path="hub/products/stock" element={<ProcurementRoute><StockManagementPage /></ProcurementRoute>} />
        <Route path="hub/products/approval" element={<ProtectedRouteComponent permission="PRODUCT_APPROVAL"><ProductApprovalPage /></ProtectedRouteComponent>} />
        <Route path="hub/products/recipes" element={<ProcurementRoute><RecipesPage /></ProcurementRoute>} />
        <Route path="hub/products/*" element={<ProcurementRoute><ProductsPage /></ProcurementRoute>} />
        
        {/* Hub Marketing Routes - Procurement Accessible */}
        <Route path="hub/scratch-card" element={<ProcurementRoute><ScratchCardPage /></ProcurementRoute>} />
        <Route path="hub/spin-wheel" element={<ProcurementRoute><SpinWheelPage /></ProcurementRoute>} />
        <Route path="hub/flash-sale" element={<ProcurementRoute><FlashSalePage /></ProcurementRoute>} />
        <Route path="hub/subscription" element={<ProcurementRoute><SubscriptionPage /></ProcurementRoute>} />
        <Route path="hub/offer-notification" element={<ProcurementRoute><OfferNotificationPage /></ProcurementRoute>} />
        <Route path="hub/coupon" element={<ProcurementRoute><CouponPage /></ProcurementRoute>} />
        <Route path="hub/in-app-currency" element={<ProcurementRoute><InAppCurrencyPage /></ProcurementRoute>} />
        <Route path="hub/referral" element={<ProcurementRoute><ReferralPage /></ProcurementRoute>} />
        <Route path="hub/marketing/*" element={<ProcurementRoute><MarketingPage /></ProcurementRoute>} />
        
        {/* Hub Reports Routes - Limited Procurement Access */}
        <Route path="hub/reports/stock" element={<ProcurementRoute><StockReportPage /></ProcurementRoute>} />
        <Route path="hub/reports/procurement" element={<ProcurementRoute><ProcurementReportsPage /></ProcurementRoute>} />
        <Route path="hub/procurement" element={<ProcurementRoute><ProcurementPage /></ProcurementRoute>} />
        <Route path="hub/reports/sales" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_REPORTS_SALES}><SalesReportPage /></ProtectedRouteComponent>} />
        <Route path="hub/reports/packing" element={<MultiRoleRoute allowedRoles={['hub_main_admin', 'hub_packing']}><PackingReportPage /></MultiRoleRoute>} />
        <Route path="hub/reports/delivery" element={<MultiRoleRoute allowedRoles={['hub_main_admin', 'hub_delivery']}><DeliveryReportPage /></MultiRoleRoute>} />
        <Route path="hub/reports/customer" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_REPORTS_CUSTOMER}><CustomerReportPage /></ProtectedRouteComponent>} />
        <Route path="hub/reports" element={<ReportsPage />} />
        
        {/* Hub Orders Routes - Multiple Roles Accessible */}
        <Route path="hub/orders/*" element={<MultiRoleRoute allowedRoles={['hub_main_admin', 'hub_packing', 'hub_delivery']}><OrdersPage /></MultiRoleRoute>} />
        
        {/* Hub Team Routes - Delivery Accessible */}
        <Route path="hub/team/delivery-agents" element={<MultiRoleRoute allowedRoles={['hub_main_admin', 'hub_delivery']}><DeliveryAgentPage /></MultiRoleRoute>} />
        <Route path="hub/team/*" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_TEAM_VIEW}><TeamPage /></ProtectedRouteComponent>} />
        
        {/* Hub Labeling Routes - Packing Accessible */}
        <Route path="hub/labeling" element={<MultiRoleRoute allowedRoles={['hub_main_admin', 'hub_packing']}><LabelingPage /></MultiRoleRoute>} />
        <Route path="hub/packing" element={<PackingRoute><PackingPage /></PackingRoute>} />
        
        {/* Hub Reports Routes - Role Specific */}
        <Route path="hub/reports/packing" element={<MultiRoleRoute allowedRoles={['hub_main_admin', 'hub_packing']}><PackingReportPage /></MultiRoleRoute>} />
        <Route path="hub/reports/delivery" element={<MultiRoleRoute allowedRoles={['hub_main_admin', 'hub_delivery']}><DeliveryReportPage /></MultiRoleRoute>} />
        <Route path="hub/reports" element={<PackingRoute><ReportsPage /></PackingRoute>} />
        
        {/* Hub Admin-Only Routes */}
        <Route path="hub/orders/manual" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_ORDERS_CREATE}><HubManualOrderPage /></ProtectedRouteComponent>} />
        <Route path="hub/orders/pre-orders" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_PRE_ORDERS}><HubPreOrderPage /></ProtectedRouteComponent>} />
        <Route path="hub/audit" element={<ProtectedRouteComponent permission={PERMISSIONS.HUB_AUDIT_LOGS}><AuditLogsPage /></ProtectedRouteComponent>} />
        <Route path="hub/settings" element={<ProtectedRouteComponent permission="HUB_TEAM_MANAGE"><GeneralSettingsPage /></ProtectedRouteComponent>} />
        <Route path="hub/settings/delivery-slots" element={<ProtectedRouteComponent permission="HUB_TEAM_MANAGE"><DeliverySlotsPage /></ProtectedRouteComponent>} />
        <Route path="hub/settings/shipping-charges" element={<ProtectedRouteComponent permission="HUB_TEAM_MANAGE"><ShippingChargesPage /></ProtectedRouteComponent>} />
        <Route path="hub/settings/integrations" element={<ProtectedRouteComponent permission="HUB_TEAM_MANAGE"><IntegrationsPage /></ProtectedRouteComponent>} />
        <Route path="hub/settings/weather" element={<ProtectedRouteComponent permission="HUB_TEAM_MANAGE"><WeatherCustomizationPage /></ProtectedRouteComponent>} />
        <Route path="hub/settings/notification" element={<ProtectedRouteComponent permission="HUB_TEAM_MANAGE"><NotificationCustomizationPage /></ProtectedRouteComponent>} />
        <Route path="hub/settings/legal" element={<ProtectedRouteComponent permission="HUB_TEAM_MANAGE"><LegalPage /></ProtectedRouteComponent>} />
        <Route path="hub/settings/advertisement" element={<ProtectedRouteComponent permission="HUB_TEAM_MANAGE"><AdvertisementPage /></ProtectedRouteComponent>} />
        <Route path="hub/settings/*" element={<ProtectedRouteComponent permission="HUB_TEAM_MANAGE"><SettingsPage /></ProtectedRouteComponent>} />
        
        {/* Store Products Routes - Procurement Accessible */}
        <Route path="store/products/categories" element={<ProcurementRoute><CategoriesPage /></ProcurementRoute>} />
        <Route path="store/products/cutting-types" element={<ProcurementRoute><CuttingTypePage /></ProcurementRoute>} />
        <Route path="store/products/stock" element={<ProcurementRoute><StockManagementPage /></ProcurementRoute>} />
        <Route path="store/products/approval" element={<ProtectedRouteComponent permission="PRODUCT_APPROVAL"><ProductApprovalPage /></ProtectedRouteComponent>} />
        <Route path="store/products/recipes" element={<ProcurementRoute><RecipesPage /></ProcurementRoute>} />
        <Route path="store/products/*" element={<ProcurementRoute><ProductsPage /></ProcurementRoute>} />
        
        {/* Store Marketing Routes - Procurement Accessible */}
        <Route path="store/scratch-card" element={<ProcurementRoute><ScratchCardPage /></ProcurementRoute>} />
        <Route path="store/spin-wheel" element={<ProcurementRoute><SpinWheelPage /></ProcurementRoute>} />
        <Route path="store/flash-sale" element={<ProcurementRoute><FlashSalePage /></ProcurementRoute>} />
        <Route path="store/subscription" element={<ProcurementRoute><SubscriptionPage /></ProcurementRoute>} />
        <Route path="store/offer-notification" element={<ProcurementRoute><OfferNotificationPage /></ProcurementRoute>} />
        <Route path="store/coupon" element={<ProcurementRoute><CouponPage /></ProcurementRoute>} />
        <Route path="store/in-app-currency" element={<ProcurementRoute><InAppCurrencyPage /></ProcurementRoute>} />
        <Route path="store/referral" element={<ProcurementRoute><ReferralPage /></ProcurementRoute>} />
        <Route path="store/marketing/*" element={<ProcurementRoute><MarketingPage /></ProcurementRoute>} />
        
        {/* Store Reports Routes - Limited Procurement Access */}
        <Route path="store/reports/stock" element={<ProcurementRoute><StockReportPage /></ProcurementRoute>} />
        <Route path="store/reports/procurement" element={<ProcurementRoute><ProcurementReportsPage /></ProcurementRoute>} />
        <Route path="store/procurement" element={<ProcurementRoute><ProcurementPage /></ProcurementRoute>} />
        <Route path="store/reports/sales" element={<ProtectedRouteComponent permission="HUB_REPORTS_SALES"><SalesReportPage /></ProtectedRouteComponent>} />
        <Route path="store/reports/packing" element={<MultiRoleRoute allowedRoles={['store_main_admin', 'store_packing']}><PackingReportPage /></MultiRoleRoute>} />
        <Route path="store/reports/delivery" element={<MultiRoleRoute allowedRoles={['store_main_admin', 'store_delivery']}><DeliveryReportPage /></MultiRoleRoute>} />
        <Route path="store/reports/customer" element={<ProtectedRouteComponent permission="HUB_REPORTS_CUSTOMER"><CustomerReportPage /></ProtectedRouteComponent>} />
        <Route path="store/reports" element={<ReportsPage />} />
        
        {/* Store Orders Routes - Multiple Roles Accessible */}
        <Route path="store/orders/*" element={<MultiRoleRoute allowedRoles={['store_main_admin', 'store_packing', 'store_delivery']}><OrdersPage /></MultiRoleRoute>} />
        
        {/* Store Team Routes - Delivery Accessible */}
        <Route path="store/team/delivery-agents" element={<MultiRoleRoute allowedRoles={['store_main_admin', 'store_delivery']}><DeliveryAgentPage /></MultiRoleRoute>} />
        <Route path="store/team/*" element={<ProtectedRouteComponent permission={PERMISSIONS.STORE_TEAM_VIEW}><TeamPage /></ProtectedRouteComponent>} />
        
        {/* Store Labeling Routes - Packing Accessible */}
        <Route path="store/labeling" element={<MultiRoleRoute allowedRoles={['store_main_admin', 'store_packing']}><LabelingPage /></MultiRoleRoute>} />
        <Route path="store/packing" element={<PackingRoute><PackingPage /></PackingRoute>} />
        
        {/* Store Reports Routes - Role Specific */}
        <Route path="store/reports/packing" element={<MultiRoleRoute allowedRoles={['store_main_admin', 'store_packing']}><PackingReportPage /></MultiRoleRoute>} />
        <Route path="store/reports/delivery" element={<MultiRoleRoute allowedRoles={['store_main_admin', 'store_delivery']}><DeliveryReportPage /></MultiRoleRoute>} />
        <Route path="store/reports" element={<ReportsPage />} />
        
        {/* Store Admin-Only Routes */}
        <Route path="store/orders/manual" element={<ProtectedRouteComponent permission="STORE_ORDERS_CREATE"><StoreManualOrderPage /></ProtectedRouteComponent>} />
        <Route path="store/orders/pre-orders" element={<ProtectedRouteComponent permission="STORE_ORDERS_CREATE"><StorePreOrderPage /></ProtectedRouteComponent>} />
        <Route path="store/team/custom-roles" element={<ProtectedRouteComponent permission="STORE_TEAM_MANAGE"><CustomRolesPage /></ProtectedRouteComponent>} />
        <Route path="store/audit" element={<ProtectedRouteComponent permission="STORE_TEAM_MANAGE"><AuditLogsPage /></ProtectedRouteComponent>} />
        <Route path="store/settings" element={<ProtectedRouteComponent permission="STORE_TEAM_MANAGE"><GeneralSettingsPage /></ProtectedRouteComponent>} />
        <Route path="store/settings/delivery-slots" element={<ProtectedRouteComponent permission="STORE_TEAM_MANAGE"><DeliverySlotsPage /></ProtectedRouteComponent>} />
        <Route path="store/settings/shipping-charges" element={<ProtectedRouteComponent permission="STORE_TEAM_MANAGE"><ShippingChargesPage /></ProtectedRouteComponent>} />
        <Route path="store/settings/integrations" element={<ProtectedRouteComponent permission="STORE_TEAM_MANAGE"><IntegrationsPage /></ProtectedRouteComponent>} />
        <Route path="store/settings/weather" element={<ProtectedRouteComponent permission="STORE_TEAM_MANAGE"><WeatherCustomizationPage /></ProtectedRouteComponent>} />
        <Route path="store/settings/notification" element={<ProtectedRouteComponent permission="STORE_TEAM_MANAGE"><NotificationCustomizationPage /></ProtectedRouteComponent>} />
        <Route path="store/settings/legal" element={<ProtectedRouteComponent permission="STORE_TEAM_MANAGE"><LegalPage /></ProtectedRouteComponent>} />
        <Route path="store/settings/advertisement" element={<ProtectedRouteComponent permission="STORE_TEAM_MANAGE"><AdvertisementPage /></ProtectedRouteComponent>} />
        <Route path="store/settings/*" element={<ProtectedRouteComponent permission="STORE_TEAM_MANAGE"><SettingsPage /></ProtectedRouteComponent>} />
        
        {/* Store Routes */}
        <Route path="store/orders/manual" element={<StoreManualOrderPage />} />
        <Route path="store/orders/pre-orders" element={<StorePreOrderPage />} />
        <Route path="store/team/delivery-agents" element={<DeliveryAgentPage />} />
        <Route path="store/team/custom-roles" element={<CustomRolesPage />} />
        <Route path="store/products/categories" element={<CategoriesPage />} />
        <Route path="store/products/cutting-types" element={<CuttingTypePage />} />
        <Route path="store/products/stock" element={<StockManagementPage />} />
        <Route path="store/products/approval" element={<ProductApprovalPage />} />
        <Route path="store/scratch-card" element={<ScratchCardPage />} />
        <Route path="store/spin-wheel" element={<SpinWheelPage />} />
        <Route path="store/flash-sale" element={<FlashSalePage />} />
        <Route path="store/subscription" element={<SubscriptionPage />} />
        <Route path="store/offer-notification" element={<OfferNotificationPage />} />
        <Route path="store/coupon" element={<CouponPage />} />
        <Route path="store/in-app-currency" element={<InAppCurrencyPage />} />
        <Route path="store/referral" element={<ReferralPage />} />
        <Route path="store/products/recipes" element={<RecipesPage />} />
        <Route path="store/marketing/referral" element={<ReferralPage />} />
        <Route path="store/labeling" element={<LabelingPage />} />
        <Route path="store/audit" element={<AuditLogsPage />} />
        <Route path="store/reports" element={<ReportsPage />} />
        <Route path="store/reports/sales" element={<SalesReportPage />} />
        <Route path="store/reports/packing" element={<PackingReportPage />} />
        <Route path="store/reports/delivery" element={<DeliveryReportPage />} />
        <Route path="store/reports/stock" element={<StockReportPage />} />
        <Route path="store/reports/customer" element={<CustomerReportPage />} />
        <Route path="store/settings" element={<GeneralSettingsPage />} />
        <Route path="store/settings/delivery-slots" element={<DeliverySlotsPage />} />
        <Route path="store/settings/shipping-charges" element={<ShippingChargesPage />} />
        <Route path="store/settings/integrations" element={<IntegrationsPage />} />
        <Route path="store/settings/weather" element={<WeatherCustomizationPage />} />
        <Route path="store/settings/notification" element={<NotificationCustomizationPage />} />
        <Route path="store/settings/legal" element={<LegalPage />} />
        <Route path="store/settings/advertisement" element={<AdvertisementPage />} />
        <Route path="store/orders/*" element={<OrdersPage />} />
        <Route path="store/team/*" element={<TeamPage />} />
        <Route path="store/products/*" element={<ProductsPage />} />
        <Route path="store/marketing/*" element={<MarketingPage />} />
        <Route path="store/settings/*" element={<SettingsPage />} />
        
        {/* Legacy/Common Routes */}
        <Route path="orders/manual" element={<ManualOrderPage />} />
        <Route path="orders/pre-orders" element={<PreOrderPage />} />
        <Route path="products/categories" element={<CategoriesPage />} />
        <Route path="products/cutting-types" element={<CuttingTypePage />} />
        <Route path="products/stock" element={<StockManagementPage />} />
        <Route path="products/approval" element={<ProductApprovalPage />} />
        <Route path="scratch-card" element={<ScratchCardPage />} />
        <Route path="spin-wheel" element={<SpinWheelPage />} />
        <Route path="flash-sale" element={<FlashSalePage />} />
        <Route path="subscription" element={<SubscriptionPage />} />
        <Route path="offer-notification" element={<OfferNotificationPage />} />
        <Route path="coupon" element={<CouponPage />} />
        <Route path="in-app-currency" element={<InAppCurrencyPage />} />
        <Route path="referral" element={<ReferralPage />} />
        <Route path="hubs" element={<HubPage />} />
        <Route path="stores" element={<StorePage />} />
        <Route path="team/delivery-agents" element={<DeliveryAgentPage />} />
        <Route path="team/custom-roles" element={<CustomRolesPage />} />
        <Route path="recipes" element={<RecipesPage />} />
        <Route path="membership" element={<MembershipPage />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="labeling" element={<LabelingPage />} />
        <Route path="audit" element={<AuditLogsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="reports/sales" element={<SalesReportPage />} />
        <Route path="reports/packing" element={<PackingReportPage />} />
        <Route path="reports/delivery" element={<DeliveryReportPage />} />
        <Route path="reports/stock" element={<StockReportPage />} />
        <Route path="reports/customer" element={<CustomerReportPage />} />
        <Route path="settings" element={<GeneralSettingsPage />} />
        <Route path="settings/delivery-slots" element={<DeliverySlotsPage />} />
        <Route path="settings/shipping-charges" element={<ShippingChargesPage />} />
        <Route path="settings/integrations" element={<IntegrationsPage />} />
        <Route path="settings/weather" element={<WeatherCustomizationPage />} />
        <Route path="settings/notification" element={<NotificationCustomizationPage />} />
        <Route path="settings/legal" element={<LegalPage />} />
        <Route path="settings/advertisement" element={<AdvertisementPage />} />
        <Route path="orders/*" element={<OrdersPage />} />
        <Route path="products/*" element={<ProductsPage />} />
        <Route path="team/*" element={<TeamPage />} />
        <Route path="marketing/*" element={<MarketingPage />} />
        <Route path="settings/*" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;
