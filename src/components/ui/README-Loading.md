# Loading Components System

A comprehensive, reusable loading animation system for the BAYHAWK admin panel.

## 🎯 Overview

This loading system provides consistent loading states across all pages and components in your admin panel. It includes multiple animation types, skeleton loaders, and responsive design.

## 📦 Components

### 1. LoadingSpinner
Basic loading spinner with multiple variants.

```tsx
import { LoadingSpinner } from '../components/ui';

<LoadingSpinner 
  variant="branded"    // 'spinner' | 'dots' | 'pulse' | 'branded'
  size="md"           // 'sm' | 'md' | 'lg' | 'xl'
  text="Loading..."   // Optional loading text
/>
```

### 2. LoadingOverlay
Overlay loading that dims background content.

```tsx
import { LoadingOverlay } from '../components/ui';

<LoadingOverlay
  isLoading={isLoading}
  text="Processing..."
  variant="branded"
  backdrop="blur"     // 'light' | 'dark' | 'blur'
>
  <YourContent />
</LoadingOverlay>
```

### 3. PageLoader
Full-page loading screen with branding.

```tsx
import { PageLoader } from '../components/ui';

<PageLoader 
  text="Loading dashboard..."
  variant="branded"
  showLogo={true}
/>
```

### 4. LoadingWrapper
Universal wrapper that handles different loading types.

```tsx
import { LoadingWrapper } from '../components/ui';

<LoadingWrapper
  isLoading={isLoading}
  type="overlay"        // 'overlay' | 'page' | 'inline' | 'skeleton'
  text="Loading..."
  variant="branded"
>
  <YourContent />
</LoadingWrapper>
```

### 5. Skeleton Loaders
Placeholder content while loading.

```tsx
import { CardSkeleton, TableSkeleton, StatCardSkeleton } from '../components/ui';

// Individual skeletons
<CardSkeleton />
<TableSkeleton rows={5} columns={4} />
<StatCardSkeleton />

// Custom skeleton
<Skeleton 
  variant="rectangular"  // 'text' | 'circular' | 'rectangular'
  width={200}
  height={100}
  lines={3}             // For text variant
/>
```

## 🎣 Hooks

### useLoading
Simple loading state management.

```tsx
import { useLoading } from '../hooks/useLoading';

function MyComponent() {
  const { isLoading, startLoading, stopLoading, withLoading } = useLoading();

  const handleApiCall = async () => {
    await withLoading(async () => {
      // Your async operation
      await api.fetchData();
    });
  };

  return (
    <LoadingWrapper isLoading={isLoading} type="overlay">
      <button onClick={handleApiCall}>Load Data</button>
    </LoadingWrapper>
  );
}
```

### useMultipleLoading
Manage multiple loading states.

```tsx
import { useMultipleLoading } from '../hooks/useLoading';

function MyComponent() {
  const { isLoading, withLoading } = useMultipleLoading();

  const loadUsers = () => withLoading('users', fetchUsers);
  const loadOrders = () => withLoading('orders', fetchOrders);

  return (
    <div>
      <LoadingWrapper isLoading={isLoading('users')} type="skeleton">
        <UsersList />
      </LoadingWrapper>
      
      <LoadingWrapper isLoading={isLoading('orders')} type="skeleton">
        <OrdersList />
      </LoadingWrapper>
    </div>
  );
}
```

## 🎨 Animation Variants

### Spinner Variants
- **spinner**: Classic rotating border spinner
- **dots**: Three bouncing dots animation
- **pulse**: Pulsing circle animation
- **branded**: Spinner with BAYHAWK fish logo

### Sizes
- **sm**: Small (16px spinner, 12px text)
- **md**: Medium (24px spinner, 14px text)
- **lg**: Large (32px spinner, 16px text)
- **xl**: Extra Large (48px spinner, 18px text)

## 📱 Responsive Design

All loading components are fully responsive:
- Adaptive sizing based on screen size
- Touch-friendly on mobile devices
- Proper spacing and typography scaling
- Optimized for different viewport sizes

## 🎯 Usage Examples

### Page-Level Loading
```tsx
// For entire page loading
if (isLoading) {
  return <PageLoader text="Loading dashboard..." />;
}
```

### Section Loading
```tsx
// For loading specific sections
<LoadingWrapper 
  isLoading={isLoadingStats} 
  type="skeleton" 
  skeletonType="stats"
  skeletonCount={4}
>
  <StatsGrid />
</LoadingWrapper>
```

### Button Loading
```tsx
<Button disabled={isLoading}>
  {isLoading ? (
    <LoadingSpinner variant="spinner" size="sm" text="" />
  ) : (
    'Save Changes'
  )}
</Button>
```

### Table Loading
```tsx
<LoadingWrapper 
  isLoading={isLoadingData} 
  type="skeleton" 
  skeletonType="table"
  skeletonCount={10}
>
  <DataTable />
</LoadingWrapper>
```

## 🎨 Customization

### Custom Colors
The loading components use CSS classes that can be customized:

```css
/* Custom spinner colors */
.custom-spinner {
  border-color: #your-color;
  border-top-color: #your-accent-color;
}

/* Custom branded spinner */
.custom-branded .fish-icon {
  color: #your-brand-color;
}
```

### Custom Animations
You can extend the system with custom animations:

```tsx
<LoadingSpinner 
  className="custom-animation"
  variant="spinner"
  size="md"
/>
```

## 🚀 Best Practices

1. **Consistent Usage**: Use the same loading variant across similar components
2. **Appropriate Types**: 
   - Use `PageLoader` for initial page loads
   - Use `LoadingOverlay` for form submissions
   - Use `Skeleton` for content placeholders
   - Use `inline` for small sections

3. **Loading Text**: Provide meaningful loading messages
4. **Performance**: Use skeleton loading for better perceived performance
5. **Accessibility**: Loading components include proper ARIA labels

## 🔧 Integration

The loading system is already integrated into:
- ✅ Dashboard page
- ✅ Authentication flow
- ✅ Form submissions
- ✅ Data fetching operations

To add to new pages:
1. Import the required loading components
2. Use the `useLoading` hook for state management
3. Wrap your content with `LoadingWrapper`
4. Choose appropriate loading type and variant

## 📊 Performance

- **Lightweight**: Minimal bundle size impact
- **Optimized**: CSS animations for smooth performance
- **Responsive**: Adapts to different screen sizes
- **Accessible**: Screen reader friendly