# Dispatch Module Documentation

## Overview
The Dispatch Management module is part of the Bayhawk Operations flow:
**Procurement → Cutting → Packing → Dispatch → Delivery**

This module allows dispatch teams to manage packed orders ready for delivery, assign delivery personnel, and track dispatch status.

## Module Location
**Operations → Dispatch Management**

## Access Control

### Roles with Access
- `hub_main_admin` - Full access
- `hub_dispatch` - Full dispatch management
- `store_main_admin` - Full access
- `store_dispatch` - Full dispatch management

### Permissions Required
- `DISPATCH_VIEW` - View dispatch records
- `DISPATCH_MANAGE` - Update dispatch status and assign delivery personnel
- `DELIVERY_VIEW` - View delivery agents
- `DELIVERY_ASSIGN` - Assign delivery personnel

## Routes

### Hub Routes
- `/hub/dispatch/management` - Hub dispatch management page

### Store Routes
- `/store/dispatch/management` - Store dispatch management page

## Data Flow

### Auto-Creation from Packing
Dispatch entries are automatically created when:
- Packing Status = `packed`
- Order moves to Dispatch Queue

### Linked Data
Each dispatch record links to:
- Order ID (Bill #)
- Customer
- Packing ID
- Module (Hub / Store)

## Dispatch Entry Structure

### Basic Information
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Dispatch ID | Auto Generated | Yes | Unique reference |
| Bill # | Auto | Yes | Invoice number |
| Order Date | Auto | Yes | From order |
| Customer Name | Auto | Yes | From order |
| Module | Auto | Yes | Hub / Store |
| Assigned By | Auto | Yes | Logged-in user |

### Product Grid Columns
| Field | Type | Description |
|-------|------|-------------|
| Bill # | Display | Invoice reference |
| Party Name | Display | Customer name |
| Product Name | Display | Ordered product |
| Gross Weight | Decimal | From packing |
| Net Weight | Decimal | Final packed weight |
| Status | Dropdown | Default = Processing |
| Delivery Person | Dropdown | Assign delivery agent |
| Remarks | Text | Optional notes |

## Status Management

### Default Status
When dispatch entry is created:
- Status = `processing`

### Allowed Status Values
- `processing` (Default)
- `dispatched`
- `cancelled`
- `failed` (Optional)
- `returned` (Optional)

### Status Update Rules
- Status can be updated by:
  - Dispatch Role
  - Delivery Role (limited update)
  - Hub Main Admin
  - Store Main Admin

### Audit Trail
Each status update stores:
- `updated_by` - User who made the change
- `updated_at` - Timestamp
- Status history

## Delivery Person Assignment

### Requirements
- Delivery person must be selected before status = `dispatched`
- Only active delivery agents shown
- Agents limited to:
  - Hub delivery agents (for hub dispatch)
  - Store delivery agents (for store dispatch)

### Database Field
```typescript
delivery_person_id: FK (users table)
```

## Alternate Product Indication

### Display Logic
If product was marked as Alternate during Procurement:
- Display: `Alternate Product` badge
- OR: `Alternate for: [Original Product Name]`

### Example Display
```
Sea Crab
(Alternate for: Rare Sea Crab)
```

### Required Fields
- `original_product_id`
- `is_alternate`

## Filters

### Available Filters
| Filter | Type | Description |
|--------|------|-------------|
| Delivery Person | Dropdown | Filter by assigned agent |
| Date Range | From – To | Filter by dispatch date |
| Customer | Dropdown/Search | Filter by party name |
| Status | Dropdown | Processing / Dispatched / Cancelled |
| Product | Dropdown | Filter by product |

### Filter Behavior
- Combined filtering supported
- Reset option available
- Pagination supported
- Server-side filtering recommended

## Export Options

### Supported Formats
- CSV
- PDF
- Excel (.xlsx)

### Export Fields
- Dispatch ID
- Bill #
- Order Date
- Customer Name
- Product Name
- Gross Weight
- Net Weight
- Delivery Person
- Status
- Remarks
- Alternate indication (if applicable)

### PDF Format Requirements
- Bayhawk header
- Filter summary
- Date range
- Generated timestamp
- Page numbers

## Validation Rules

| Condition | Validation |
|-----------|------------|
| Status = Dispatched | Delivery person mandatory |
| Status = Cancelled | Remarks mandatory |
| Status change | Must log audit record |
| Dispatch | Only allowed if Packing = Packed |

## UI Layout

```
-------------------------------------------------
Filters Section
-------------------------------------------------
Dispatch Table
-------------------------------------------------
Export Buttons (CSV | PDF | Excel)
-------------------------------------------------
```

## Dispatch Table Display

### Columns
- Bill #
- Customer
- Product
- Gross Weight
- Net Weight
- Delivery Person
- Status (Color Badge)
- Alternate Indicator Icon
- Actions (Assign / Update)

### Status Colors
| Status | Color |
|--------|-------|
| Processing | Yellow |
| Dispatched | Green |
| Cancelled | Red |
| Failed | Orange |
| Returned | Gray |

## API Integration Points

### Fetch Dispatches
```typescript
GET /api/dispatch
Query params: filters (deliveryPerson, dateFrom, dateTo, customer, status, productId)
```

### Fetch Delivery Agents
```typescript
GET /api/delivery-agents
Filter by: moduleType (hub/store)
```

### Update Status
```typescript
PATCH /api/dispatch/:dispatchId/product/:productId
Body: {
  status: string,
  deliveryPersonId?: string,
  remarks?: string,
  updatedBy: string
}
```

## Component Files

### Type Definitions
- `src/types/dispatch.ts` - TypeScript interfaces

### Pages
- `src/pages/dispatch/DispatchManagement.tsx` - Main dispatch page

### Components
- `src/components/DispatchRoute.tsx` - Route protection

### Configuration
- `src/utils/menuConfig.ts` - Menu items
- `src/utils/rbac.ts` - Permissions
- `src/App.tsx` - Route definitions

## Implementation Notes

### Security
- Role-based access control enforced
- Audit trail for all status changes
- Delivery person assignment restricted by module

### Performance
- Server-side filtering for large datasets
- Pagination support
- Optimized queries for dispatch records

### User Experience
- Clear status indicators with color coding
- Alternate product warnings
- Inline delivery person assignment
- Quick status updates
- Export functionality for reporting

## Future Enhancements
- Real-time status updates via WebSocket
- Bulk dispatch operations
- Route optimization for delivery
- SMS/Email notifications on dispatch
- Barcode scanning for dispatch verification
