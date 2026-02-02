# Loyalty Points & Wallet Cash Expiry Alerts with Analytics

A comprehensive notification system to alert customers before their loyalty points and wallet cash expire, with detailed analytics tracking to measure performance and optimize engagement.

## Features

### 🎯 Smart Expiry Notifications
- **Loyalty Points Alerts**: Notify customers before their loyalty points expire
- **Wallet Cash Alerts**: Remind customers about expiring wallet cash
- **Multi-Channel Support**: Email, SMS, Push Notifications, WhatsApp
- **Customizable Timing**: Set alerts 1-30 days before expiry
- **Auto Reminders**: Optional recurring reminders until expiry

### 📊 Advanced Analytics Tracking
- **Delivery Tracking**: Monitor notification delivery rates across channels
- **Open Rate Analytics**: Track how many customers open notifications
- **Click-Through Tracking**: Measure engagement with notification links
- **Performance Insights**: AI-powered recommendations based on metrics
- **Channel Comparison**: Compare performance across different notification methods
- **Export Capabilities**: Download analytics data for further analysis

### 🔧 Configuration Options

#### Alert Methods
- **Email**: Traditional email notifications with tracking pixels
- **SMS**: Text message alerts with delivery confirmations
- **Push Notifications**: Mobile app notifications with open tracking
- **WhatsApp**: WhatsApp business messages with read receipts

#### Analytics Features
- **Delivery Tracking**: Automatic tracking of sent/delivered notifications
- **Open Tracking**: Track when customers open email/push notifications
- **Click Tracking**: Monitor clicks on links within notifications
- **Real-time Dashboard**: Live analytics with filtering and date ranges
- **Performance Metrics**: Delivery rate, open rate, click-through rate

#### Timing Controls
- **Days Before Expiry**: 1, 3, 7, 14, or 30 days
- **Auto Reminders**: Enable/disable recurring alerts
- **Reminder Frequency**: Daily, every 3 days, or weekly

#### Message Customization
- **Custom Messages**: Personalize alert content
- **Dynamic Variables**: Use `{amount}`, `{expiry_date}`, `{customer_name}`
- **Default Templates**: Pre-configured messages for quick setup

## Components

### ExpiryAlertSettings
Reusable component for configuring expiry alerts with analytics:

```typescript
interface ExpiryAlertConfig {
  enabled: boolean;
  type: "loyalty_points" | "wallet_cash";
  alertMethods: ("email" | "sms" | "push" | "whatsapp")[];
  daysBefore: number;
  customMessage: string;
  autoReminder: boolean;
  reminderFrequency: number;
  trackingEnabled: boolean;
  includeClickTracking: boolean;
}
```

### ExpiryAnalyticsDashboard
Analytics dashboard component showing performance metrics:

```typescript
interface NotificationAnalytics {
  totalSent: number;
  delivered: number;
  opened: number;
  clicked: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
}
```

### ExpiryAnalyticsControls
Filter and control component for analytics:

```typescript
interface AnalyticsFilters {
  dateRange: string;
  alertType: string;
  channel: string;
}
```

### Analytics Utilities
Helper functions for tracking:

```typescript
// Track notification events
trackNotificationEvent(
  'opened', 
  'notification-123', 
  'loyalty_points', 
  'email', 
  'customer-456'
);

// Generate tracking URLs
const trackingUrl = generateTrackingUrl('notification-123', 'customer-456', 'click');
```

## Usage Example

```tsx
import { 
  ExpiryAlertSettings, 
  ExpiryAnalyticsDashboard,
  ExpiryAnalyticsControls 
} from './components/ui';

const [loyaltyAlert, setLoyaltyAlert] = useState({
  enabled: true,
  type: "loyalty_points",
  alertMethods: ["email", "push"],
  daysBefore: 7,
  customMessage: "",
  autoReminder: true,
  reminderFrequency: 3,
  trackingEnabled: true,
  includeClickTracking: true,
});

<ExpiryAlertSettings
  config={loyaltyAlert}
  onChange={setLoyaltyAlert}
/>

<ExpiryAnalyticsDashboard
  data={analyticsData}
  dateRange="Last 30 days"
/>
```

## Integration

### In NotificationCustomizationPage
The feature is integrated into the existing notification settings page with:
- Dedicated "Customer Expiry Alerts" section
- Side-by-side configuration for loyalty points and wallet cash
- Analytics tracking options for each alert type
- Unified save functionality with other notification settings

### Analytics Integration
- **Real-time Tracking**: Events are tracked as they happen
- **Dashboard Integration**: Analytics are displayed in the main settings page
- **Export Functionality**: Data can be exported for external analysis
- **Performance Insights**: Automated recommendations based on metrics

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive grid layouts
- **Desktop**: Full-width layouts with side-by-side components

## File Structure

```
src/
├── components/ui/
│   ├── ExpiryAlertSettings.tsx           # Main configuration component
│   ├── ExpiryAnalyticsDashboard.tsx      # Analytics dashboard
│   ├── ExpiryAnalyticsControls.tsx       # Analytics filters & controls
│   └── index.tsx                         # Export declarations
├── pages/settings/
│   ├── NotificationCustomizationPage.tsx # Updated with expiry alerts
│   └── ExpiryAlertDemo.tsx              # Demo page with analytics
└── TestApp.tsx                          # Test application
```

## Analytics Metrics

### Key Performance Indicators
- **Delivery Rate**: Percentage of notifications successfully delivered
- **Open Rate**: Percentage of delivered notifications that were opened
- **Click-Through Rate**: Percentage of opened notifications that were clicked
- **Engagement Score**: Combined metric based on all interactions

### Tracking Implementation
- **Email**: Tracking pixels for opens, UTM parameters for clicks
- **SMS**: Delivery receipts, shortened URLs for click tracking
- **Push**: Platform-specific open/click tracking
- **WhatsApp**: Read receipts and link click tracking

## Benefits

1. **Reduced Churn**: Proactive notifications prevent customers from losing unused points/cash
2. **Increased Engagement**: Timely reminders encourage customers to make purchases
3. **Data-Driven Optimization**: Analytics help improve notification effectiveness
4. **Better ROI**: Track which channels and messages perform best
5. **Customer Insights**: Understand customer behavior and preferences
6. **Performance Monitoring**: Real-time tracking of notification success rates

## Implementation Notes

- Components are built with TypeScript for type safety
- Uses Tailwind CSS for responsive styling
- Follows existing UI patterns and design system
- Minimal code approach - only essential functionality
- Reusable and modular component architecture
- Analytics tracking is privacy-compliant and configurable
