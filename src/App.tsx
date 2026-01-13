import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { OrdersPage } from './pages/OrdersPage';
import { ManualOrderPage } from './pages/ManualOrderPage';
import { PreOrderPage } from './pages/PreOrderPage';
import HubOrdersPage from './pages/HubOrdersPage';
import HubManualOrderPage from './pages/HubManualOrderPage';
import HubPreOrderPage from './pages/HubPreOrderPage';
import StoreManualOrderPage from './pages/StoreManualOrderPage';
import StorePreOrderPage from './pages/StorePreOrderPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductApprovalPage } from './pages/ProductApprovalPage';
import { CuttingTypePage } from './pages/CuttingTypePage';
import { ScratchCardPage } from './pages/ScratchCardPage';
import { SpinWheelPage } from './pages/SpinWheelPage';
import { FlashSalePage } from './pages/FlashSalePage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { OfferNotificationPage } from './pages/OfferNotificationPage';
import { CouponPage } from './pages/CouponPage';
import { InAppCurrencyPage } from './pages/InAppCurrencyPage';
import { ReferralPage } from './pages/ReferralPage';
import { HubPage } from './pages/HubPage';
import { StorePage } from './pages/StorePage';
import { TeamPage } from './pages/TeamPage';
import { DeliveryAgentPage } from './pages/DeliveryAgentPage';
import { CustomRolesPage } from './pages/CustomRolesPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { StockManagementPage } from './pages/StockManagementPage';
import { ReportsPage } from './pages/ReportsPage';
import { SalesReportPage } from './pages/SalesReportPage';
import { PackingReportPage } from './pages/PackingReportPage';
import { DeliveryReportPage } from './pages/DeliveryReportPage';
import { StockReportPage } from './pages/StockReportPage';
import { CustomerReportPage } from './pages/CustomerReportPage';
import { GeneralSettingsPage } from './pages/GeneralSettingsPage';
import { DeliverySlotsPage } from './pages/DeliverySlotsPage';
import { ShippingChargesPage } from './pages/ShippingChargesPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { NotificationCustomizationPage } from './pages/NotificationCustomizationPage';
import { WeatherCustomizationPage } from './pages/WeatherCustomizationPage';
import { LegalPage } from './pages/LegalPage';
import { AdvertisementPage } from './pages/AdvertisementPage';
import { MarketingPage } from './pages/MarketingPage';
import { RecipesPage } from './pages/RecipesPage';
import { MembershipPage } from './pages/MembershipPage';
import { WishlistPage } from './pages/WishlistPage';
import { WalletPage } from './pages/WalletPage';
import { FAQPage } from './pages/FAQPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ZonesPage } from './pages/ZonesPage';
import { SettingsPage } from './pages/SettingsPage';
import AuditLogsPage from './pages/AuditLogsPage';
import { LabelingPage } from './pages/LabelingPage';

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
        
        {/* Hub Routes */}
        <Route path="hub/orders/manual" element={<HubManualOrderPage />} />
        <Route path="hub/orders/pre-orders" element={<HubPreOrderPage />} />
        <Route path="hub/team/delivery-agents" element={<DeliveryAgentPage />} />
        <Route path="hub/team/custom-roles" element={<CustomRolesPage />} />
        <Route path="hub/products/categories" element={<CategoriesPage />} />
        <Route path="hub/products/cutting-types" element={<CuttingTypePage />} />
        <Route path="hub/products/stock" element={<StockManagementPage />} />
        <Route path="hub/products/approval" element={<ProductApprovalPage />} />
        <Route path="hub/scratch-card" element={<ScratchCardPage />} />
        <Route path="hub/spin-wheel" element={<SpinWheelPage />} />
        <Route path="hub/flash-sale" element={<FlashSalePage />} />
        <Route path="hub/subscription" element={<SubscriptionPage />} />
        <Route path="hub/offer-notification" element={<OfferNotificationPage />} />
        <Route path="hub/coupon" element={<CouponPage />} />
        <Route path="hub/in-app-currency" element={<InAppCurrencyPage />} />
        <Route path="hub/referral" element={<ReferralPage />} />
        <Route path="hub/products/recipes" element={<RecipesPage />} />
        <Route path="hub/labeling" element={<LabelingPage />} />
        <Route path="hub/audit" element={<AuditLogsPage />} />
        <Route path="hub/reports" element={<ReportsPage />} />
        <Route path="hub/reports/sales" element={<SalesReportPage />} />
        <Route path="hub/reports/packing" element={<PackingReportPage />} />
        <Route path="hub/reports/delivery" element={<DeliveryReportPage />} />
        <Route path="hub/reports/stock" element={<StockReportPage />} />
        <Route path="hub/reports/customer" element={<CustomerReportPage />} />
        <Route path="hub/settings" element={<GeneralSettingsPage />} />
        <Route path="hub/settings/delivery-slots" element={<DeliverySlotsPage />} />
        <Route path="hub/settings/shipping-charges" element={<ShippingChargesPage />} />
        <Route path="hub/settings/integrations" element={<IntegrationsPage />} />
        <Route path="hub/settings/weather" element={<WeatherCustomizationPage />} />
        <Route path="hub/settings/notification" element={<NotificationCustomizationPage />} />
        <Route path="hub/settings/legal" element={<LegalPage />} />
        <Route path="hub/settings/advertisement" element={<AdvertisementPage />} />
        <Route path="hub/orders/*" element={<HubOrdersPage />} />
        <Route path="hub/team/*" element={<TeamPage />} />
        <Route path="hub/products/*" element={<ProductsPage />} />
        <Route path="hub/marketing/*" element={<MarketingPage />} />
        <Route path="hub/settings/*" element={<SettingsPage />} />
        
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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
