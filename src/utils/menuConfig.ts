import { Package, Users, ShoppingCart, BarChart3, FileText, Megaphone, Settings, Gift, RotateCcw, Zap, Crown, Bell, Ticket, Coins, Share2, Tag, Home, Play } from 'lucide-react';
import type { LoginType, UserRole } from '../types';

export interface MenuItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  module: 'hub' | 'store' | 'both';
  requiredRoles?: UserRole[]; // Optional: restrict to specific roles
  children?: MenuItem[];
}

export const HUB_MENU: MenuItem[] = [
  {
    id: 'hub-dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/dashboard',
    module: 'hub',
  },
  {
    id: 'hub-orders',
    label: 'Orders',
    icon: ShoppingCart,
    path: '/hub/orders',
    module: 'hub',
    children: [
      { id: 'hub-all-orders', label: 'All Orders', icon: null, path: '/hub/orders', module: 'hub' },
      { id: 'hub-manual-order', label: 'Manual Order Creation', icon: null, path: '/hub/orders/manual', module: 'hub' },
      { id: 'hub-pre-orders', label: 'Pre Orders', icon: null, path: '/hub/orders/pre-orders', module: 'hub' },
    ],
  },
  {
    id: 'hub-team',
    label: 'Team & Users',
    icon: Users,
    path: '/hub/team',
    module: 'hub',
    requiredRoles: ['hub_main_admin'], // Only main admin can access team management
    children: [
      { id: 'hub-team-overview', label: 'Team Members', icon: null, path: '/hub/team', module: 'hub', requiredRoles: ['hub_main_admin'] },
      { id: 'hub-delivery-agents', label: 'Delivery Agents', icon: null, path: '/hub/team/delivery-agents', module: 'hub' }, // All roles can access
    ],
  },
  {
    id: 'hub-products',
    label: 'Products & Stock',
    icon: Package,
    path: '/hub/products',
    module: 'hub',
    children: [
      { id: 'hub-all-products', label: 'All Products', icon: null, path: '/hub/products', module: 'hub' },
      { id: 'hub-stock', label: 'Stock Management', icon: null, path: '/hub/products/stock', module: 'hub', requiredRoles: ['hub_main_admin', 'hub_procurement'] },
      { id: 'hub-categories', label: 'Categories', icon: null, path: '/hub/products/categories', module: 'hub', requiredRoles: ['hub_main_admin'] },
      { id: 'hub-cutting-types', label: 'Cutting Types', icon: null, path: '/hub/products/cutting-types', module: 'hub', requiredRoles: ['hub_main_admin'] },
      { id: 'hub-recipes', label: 'Recipes', icon: null, path: '/hub/products/recipes', module: 'hub', requiredRoles: ['hub_main_admin'] },
    ],
  },
  {
    id: 'hub-labeling',
    label: 'Labeling',
    icon: Tag,
    path: '/hub/labeling',
    module: 'hub',
    requiredRoles: ['hub_main_admin'], // Only main admin can access labeling
  },
  {
    id: 'hub-marketing',
    label: 'Marketing',
    icon: Megaphone,
    path: '/hub/marketing',
    module: 'hub',
    requiredRoles: ['hub_main_admin'], // Only main admin can access marketing
    children: [
      { id: 'hub-scratch-card', label: 'Scratch Card', icon: null, path: '/hub/scratch-card', module: 'hub', requiredRoles: ['hub_main_admin'] },
      { id: 'hub-spin-wheel', label: 'Spin Wheel', icon: null, path: '/hub/spin-wheel', module: 'hub', requiredRoles: ['hub_main_admin'] },
      { id: 'hub-flash-sale', label: 'Flash Sale', icon: null, path: '/hub/flash-sale', module: 'hub', requiredRoles: ['hub_main_admin'] },
      { id: 'hub-subscription', label: 'Subscription', icon: null, path: '/hub/subscription', module: 'hub', requiredRoles: ['hub_main_admin'] },
      { id: 'hub-offer-notification', label: 'Offer Notification', icon: null, path: '/hub/offer-notification', module: 'hub', requiredRoles: ['hub_main_admin'] },
      { id: 'hub-coupon', label: 'Coupon', icon: null, path: '/hub/coupon', module: 'hub', requiredRoles: ['hub_main_admin'] },
      { id: 'hub-in-app-currency', label: 'In-App Currency', icon: null, path: '/hub/in-app-currency', module: 'hub', requiredRoles: ['hub_main_admin'] },
      { id: 'hub-referral', label: 'Referral', icon: null, path: '/hub/referral', module: 'hub', requiredRoles: ['hub_main_admin'] },
    ],
  },
  {
    id: 'hub-reports',
    label: 'Reports',
    icon: BarChart3,
    path: '/hub/reports',
    module: 'hub',
    children: [
      { id: 'hub-sales-reports', label: 'Sales Reports', icon: null, path: '/hub/reports/sales', module: 'hub', requiredRoles: ['hub_main_admin'] },
      { id: 'hub-packing-reports', label: 'Packing Reports', icon: null, path: '/hub/reports/packing', module: 'hub', requiredRoles: ['hub_main_admin', 'hub_packing'] },
      { id: 'hub-delivery-reports', label: 'Delivery Reports', icon: null, path: '/hub/reports/delivery', module: 'hub', requiredRoles: ['hub_main_admin', 'hub_delivery'] },
      { id: 'hub-stock-reports', label: 'Stock Reports', icon: null, path: '/hub/reports/stock', module: 'hub', requiredRoles: ['hub_main_admin', 'hub_procurement'] },
      { id: 'hub-customer-reports', label: 'Customer Reports', icon: null, path: '/hub/reports/customer', module: 'hub', requiredRoles: ['hub_main_admin'] },
    ],
  },
  {
    id: 'hub-audit',
    label: 'Audit Logs',
    icon: FileText,
    path: '/hub/audit',
    module: 'hub',
    requiredRoles: ['hub_main_admin'], // Only main admin can access audit logs
  },
];

export const STORE_MENU: MenuItem[] = [
  {
    id: 'store-dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/dashboard',
    module: 'store',
  },
  {
    id: 'store-orders',
    label: 'Orders',
    icon: ShoppingCart,
    path: '/store/orders',
    module: 'store',
    children: [
      { id: 'store-all-orders', label: 'All Orders', icon: null, path: '/store/orders', module: 'store' },
      { id: 'store-manual-order', label: 'Manual Order Creation', icon: null, path: '/store/orders/manual', module: 'store' },
      { id: 'store-pre-orders', label: 'Pre Orders', icon: null, path: '/store/orders/pre-orders', module: 'store' },
    ],
  },
  {
    id: 'store-team',
    label: 'Team & Users',
    icon: Users,
    path: '/store/team',
    module: 'store',
    children: [
      { id: 'store-team-members', label: 'Team Members', icon: null, path: '/store/team', module: 'store' },
      { id: 'store-delivery-agents', label: 'Delivery Agents', icon: null, path: '/store/team/delivery-agents', module: 'store' },
    ],
  },
  {
    id: 'store-products',
    label: 'Products & Stock',
    icon: Package,
    path: '/store/products',
    module: 'store',
    children: [
      { id: 'store-all-products', label: 'All Products', icon: null, path: '/store/products', module: 'store' },
      { id: 'store-stock', label: 'Stock Management', icon: null, path: '/store/products/stock', module: 'store' },
      { id: 'store-categories', label: 'Categories', icon: null, path: '/store/products/categories', module: 'store' },
      { id: 'store-cutting-types', label: 'Cutting Types', icon: null, path: '/store/products/cutting-types', module: 'store' },
      { id: 'store-recipes', label: 'Recipes', icon: null, path: '/store/products/recipes', module: 'store' },
    ],
  },
  {
    id: 'store-labeling',
    label: 'Labeling',
    icon: Tag,
    path: '/store/labeling',
    module: 'store',
  },
  {
    id: 'store-marketing',
    label: 'Marketing',
    icon: Megaphone,
    path: '/store/marketing',
    module: 'store',
    children: [
      { id: 'store-scratch-card', label: 'Scratch Card', icon: null, path: '/store/scratch-card', module: 'store' },
      { id: 'store-spin-wheel', label: 'Spin Wheel', icon: null, path: '/store/spin-wheel', module: 'store' },
      { id: 'store-flash-sale', label: 'Flash Sale', icon: null, path: '/store/flash-sale', module: 'store' },
      { id: 'store-subscription', label: 'Subscription', icon: null, path: '/store/subscription', module: 'store' },
      { id: 'store-offer-notification', label: 'Offer Notification', icon: null, path: '/store/offer-notification', module: 'store' },
      { id: 'store-coupon', label: 'Coupon', icon: null, path: '/store/coupon', module: 'store' },
      { id: 'store-in-app-currency', label: 'In-App Currency', icon: null, path: '/store/in-app-currency', module: 'store' },
      { id: 'store-referral', label: 'Referral', icon: null, path: '/store/referral', module: 'store' },
    ],
  },
  {
    id: 'store-reports',
    label: 'Reports',
    icon: BarChart3,
    path: '/store/reports',
    module: 'store',
    children: [
      { id: 'store-sales-reports', label: 'Sales Reports', icon: null, path: '/store/reports/sales', module: 'store' },
      { id: 'store-packing-reports', label: 'Packing Reports', icon: null, path: '/store/reports/packing', module: 'store' },
      { id: 'store-delivery-reports', label: 'Delivery Reports', icon: null, path: '/store/reports/delivery', module: 'store' },
      { id: 'store-stock-reports', label: 'Stock Reports', icon: null, path: '/store/reports/stock', module: 'store' },
      { id: 'store-customer-reports', label: 'Customer Reports', icon: null, path: '/store/reports/customer', module: 'store' },
    ],
  },
  {
    id: 'store-audit',
    label: 'Audit Logs',
    icon: FileText,
    path: '/store/audit',
    module: 'store',
  },
];

export const SUPER_ADMIN_MENU: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/dashboard',
    module: 'both',
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: ShoppingCart,
    path: '/orders',
    module: 'both',
    children: [
      { id: 'all-orders', label: 'All Orders', icon: null, path: '/orders', module: 'both' },
      { id: 'manual-order', label: 'Manual Order Creation', icon: null, path: '/orders/manual', module: 'both' },
      { id: 'pre-orders', label: 'Pre Orders', icon: null, path: '/orders/pre-orders', module: 'both' },
    ],
  },
  {
    id: 'team',
    label: 'Team & Users',
    icon: Users,
    path: '/team',
    module: 'both',
    children: [
      { id: 'team-members', label: 'Team Members', icon: null, path: '/team', module: 'both' },
      { id: 'delivery-agents', label: 'Delivery Agents', icon: null, path: '/team/delivery-agents', module: 'both' },
      { id: 'custom-roles', label: 'Custom Roles', icon: null, path: '/team/custom-roles', module: 'both' },
    ],
  },
  {
    id: 'products',
    label: 'Products & Stock',
    icon: Package,
    path: '/products',
    module: 'both',
    children: [
      { id: 'all-products', label: 'All Products', icon: null, path: '/products', module: 'both' },
      { id: 'stock', label: 'Stock Management', icon: null, path: '/products/stock', module: 'both' },
      { id: 'categories', label: 'Categories', icon: null, path: '/products/categories', module: 'both' },
      { id: 'cutting-types', label: 'Cutting Types', icon: null, path: '/products/cutting-types', module: 'both' },
      { id: 'product-approval', label: 'Product Approval', icon: null, path: '/products/approval', module: 'both' },
      { id: 'recipes', label: 'Recipes', icon: null, path: '/recipes', module: 'both' },
    ],
  },
  {
    id: 'labeling',
    label: 'Labeling',
    icon: Tag,
    path: '/labeling',
    module: 'both',
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: Megaphone,
    path: '/marketing',
    module: 'both',
    children: [
      { id: 'scratch-card', label: 'Scratch Card', icon: null, path: '/scratch-card', module: 'both' },
      { id: 'spin-wheel', label: 'Spin Wheel', icon: null, path: '/spin-wheel', module: 'both' },
      { id: 'flash-sale', label: 'Flash Sale', icon: null, path: '/flash-sale', module: 'both' },
      { id: 'subscription', label: 'Subscription', icon: null, path: '/subscription', module: 'both' },
      { id: 'offer-notification', label: 'Offer Notification', icon: null, path: '/offer-notification', module: 'both' },
      { id: 'coupon', label: 'Coupon', icon: null, path: '/coupon', module: 'both' },
      { id: 'in-app-currency', label: 'In-App Currency', icon: null, path: '/in-app-currency', module: 'both' },
      { id: 'referral', label: 'Referral', icon: null, path: '/referral', module: 'both' },
    ],
  },
  {
    id: 'hub-store',
    label: 'Hub & Store',
    icon: Package,
    path: '/hub-store',
    module: 'both',
    children: [
      { id: 'hubs', label: 'Hubs', icon: null, path: '/hubs', module: 'both' },
      { id: 'stores', label: 'Stores', icon: null, path: '/stores', module: 'both' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    path: '/reports',
    module: 'both',
    children: [
      { id: 'sales-reports', label: 'Sales Reports', icon: null, path: '/reports/sales', module: 'both' },
      { id: 'packing-reports', label: 'Packing Reports', icon: null, path: '/reports/packing', module: 'both' },
      { id: 'delivery-reports', label: 'Delivery Reports', icon: null, path: '/reports/delivery', module: 'both' },
      { id: 'stock-reports', label: 'Stock Reports', icon: null, path: '/reports/stock', module: 'both' },
      { id: 'customer-reports', label: 'Customer Reports', icon: null, path: '/reports/customer', module: 'both' },
    ],
  },
  {
    id: 'audit',
    label: 'Audit Logs',
    icon: FileText,
    path: '/audit',
    module: 'both',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings',
    module: 'both',
    children: [
      { id: 'general', label: 'General', icon: null, path: '/settings', module: 'both' },
      { id: 'delivery-slots', label: 'Delivery Slots', icon: null, path: '/settings/delivery-slots', module: 'both' },
      { id: 'shipping-charges', label: 'Shipping Charges', icon: null, path: '/settings/shipping-charges', module: 'both' },
      { id: 'integrations', label: 'Integrations', icon: null, path: '/settings/integrations', module: 'both' },
      { id: 'weather', label: 'Weather Customization', icon: null, path: '/settings/weather', module: 'both' },
      { id: 'notification', label: 'Notification Customization', icon: null, path: '/settings/notification', module: 'both' },
      { id: 'legal', label: 'Legal Documents', icon: null, path: '/settings/legal', module: 'both' },
      { id: 'advertisement', label: 'Advertisement Management', icon: Play, path: '/settings/advertisement', module: 'both' },
    ],
  },
];

export function getMenuByLoginType(loginType: LoginType): MenuItem[] {
  if (loginType === 'super_admin') {
    return SUPER_ADMIN_MENU;
  }
  if (loginType === 'hub') {
    return HUB_MENU;
  }
  if (loginType === 'store') {
    return STORE_MENU;
  }
  return [];
}

export function filterMenuByRole(menu: MenuItem[], userRole: UserRole): MenuItem[] {
  return menu.filter(item => {
    // If no role restriction, show to all users
    if (!item.requiredRoles) {
      // Filter children if they exist
      if (item.children) {
        const filteredChildren = filterMenuByRole(item.children, userRole);
        // Only show parent if it has accessible children or no children
        return filteredChildren.length > 0 || !item.children.length;
      }
      return true;
    }
    
    // Check if user role is in required roles
    const hasAccess = item.requiredRoles.includes(userRole);
    
    if (hasAccess && item.children) {
      // Filter children and update the item
      const filteredChildren = filterMenuByRole(item.children, userRole);
      return filteredChildren.length > 0;
    }
    
    return hasAccess;
  }).map(item => {
    // Return item with filtered children
    if (item.children) {
      return {
        ...item,
        children: filterMenuByRole(item.children, userRole)
      };
    }
    return item;
  });
}

export function getFilteredMenuByUser(loginType: LoginType, userRole: UserRole): MenuItem[] {
  const baseMenu = getMenuByLoginType(loginType);
  return filterMenuByRole(baseMenu, userRole);
}
