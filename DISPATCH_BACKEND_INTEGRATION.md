# Dispatch Module - Backend Integration Guide

## Overview
This guide provides backend developers with the necessary information to integrate the Dispatch Management module with the API.

## Database Schema

### Table: `dispatch_entries`
```sql
CREATE TABLE dispatch_entries (
  id VARCHAR(50) PRIMARY KEY,
  bill_number VARCHAR(50) NOT NULL,
  order_date DATE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  module_type ENUM('hub', 'store') NOT NULL,
  assigned_by VARCHAR(50) NOT NULL,
  packing_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  
  FOREIGN KEY (packing_id) REFERENCES packing_entries(id),
  FOREIGN KEY (assigned_by) REFERENCES users(id),
  INDEX idx_bill_number (bill_number),
  INDEX idx_module_type (module_type),
  INDEX idx_order_date (order_date)
);
```

### Table: `dispatch_products`
```sql
CREATE TABLE dispatch_products (
  id VARCHAR(50) PRIMARY KEY,
  dispatch_entry_id VARCHAR(50) NOT NULL,
  bill_number VARCHAR(50) NOT NULL,
  party_name VARCHAR(255) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  gross_weight DECIMAL(10,2) NOT NULL,
  net_weight DECIMAL(10,2) NOT NULL,
  status ENUM('processing', 'dispatched', 'cancelled', 'failed', 'returned') DEFAULT 'processing',
  delivery_person_id VARCHAR(50),
  remarks TEXT,
  original_product_id VARCHAR(50),
  is_alternate BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (dispatch_entry_id) REFERENCES dispatch_entries(id) ON DELETE CASCADE,
  FOREIGN KEY (delivery_person_id) REFERENCES users(id),
  FOREIGN KEY (original_product_id) REFERENCES products(id),
  INDEX idx_status (status),
  INDEX idx_delivery_person (delivery_person_id)
);
```

### Table: `dispatch_status_history`
```sql
CREATE TABLE dispatch_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dispatch_entry_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  changed_by VARCHAR(50) NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  remarks TEXT,
  
  FOREIGN KEY (dispatch_entry_id) REFERENCES dispatch_entries(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES dispatch_products(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id),
  INDEX idx_dispatch_entry (dispatch_entry_id),
  INDEX idx_changed_at (changed_at)
);
```

## API Endpoints

### 1. Get Dispatch Entries
**Endpoint:** `GET /api/dispatch`

**Query Parameters:**
```typescript
{
  deliveryPerson?: string;      // Filter by delivery person ID
  dateFrom?: string;             // ISO date string
  dateTo?: string;               // ISO date string
  customer?: string;             // Customer name or ID
  status?: string;               // processing|dispatched|cancelled|failed|returned
  productId?: string;            // Product ID
  moduleType: 'hub' | 'store';   // Required
  page?: number;                 // Pagination
  limit?: number;                // Items per page
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    dispatches: DispatchEntry[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
```

**Example:**
```bash
GET /api/dispatch?moduleType=hub&status=processing&dateFrom=2024-02-01&dateTo=2024-02-16
```

### 2. Get Delivery Agents
**Endpoint:** `GET /api/delivery-agents`

**Query Parameters:**
```typescript
{
  moduleType: 'hub' | 'store';   // Required
  isActive?: boolean;            // Default: true
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    id: string;
    name: string;
    phone: string;
    vehicleNo: string;
    isActive: boolean;
    moduleType: 'hub' | 'store';
  }[];
}
```

### 3. Update Dispatch Status
**Endpoint:** `PATCH /api/dispatch/:dispatchId/product/:productId`

**Path Parameters:**
- `dispatchId` - Dispatch entry ID
- `productId` - Product ID within dispatch

**Request Body:**
```typescript
{
  status: 'processing' | 'dispatched' | 'cancelled' | 'failed' | 'returned';
  deliveryPersonId?: string;     // Required if status = 'dispatched'
  remarks?: string;              // Required if status = 'cancelled'
  updatedBy: string;             // User ID
}
```

**Validation:**
- If `status = 'dispatched'`, `deliveryPersonId` is mandatory
- If `status = 'cancelled'`, `remarks` is mandatory
- Must create entry in `dispatch_status_history`

**Response:**
```typescript
{
  success: boolean;
  message: string;
  data: {
    dispatchEntry: DispatchEntry;
  };
}
```

### 4. Auto-Create from Packing
**Trigger:** When packing status changes to 'packed'

**Logic:**
```typescript
// Pseudo-code
async function onPackingComplete(packingEntry: PackingEntry) {
  // Create dispatch entry
  const dispatchEntry = {
    id: generateId('DSP'),
    bill_number: packingEntry.billNumber,
    order_date: packingEntry.orderDate,
    customer_name: packingEntry.customerName,
    module_type: packingEntry.moduleType,
    assigned_by: getCurrentUser().id,
    packing_id: packingEntry.id,
  };
  
  await db.dispatch_entries.insert(dispatchEntry);
  
  // Create dispatch products
  for (const product of packingEntry.products) {
    if (product.status === 'packed') {
      await db.dispatch_products.insert({
        id: generateId('DSPP'),
        dispatch_entry_id: dispatchEntry.id,
        bill_number: packingEntry.billNumber,
        party_name: packingEntry.customerName,
        product_name: product.productName,
        gross_weight: product.grossWeight,
        net_weight: product.netWeight,
        status: 'processing',
        is_alternate: product.isAlternate,
        original_product_id: product.originalProductId,
      });
    }
  }
}
```

## Business Logic

### Status Transition Rules
```typescript
const allowedTransitions = {
  processing: ['dispatched', 'cancelled'],
  dispatched: ['failed', 'returned'],
  cancelled: [],  // Terminal state
  failed: ['processing', 'cancelled'],
  returned: ['processing', 'cancelled'],
};

function canTransition(currentStatus: string, newStatus: string): boolean {
  return allowedTransitions[currentStatus]?.includes(newStatus) ?? false;
}
```

### Validation Rules
```typescript
function validateStatusUpdate(data: UpdateStatusRequest): ValidationResult {
  const errors = [];
  
  // Dispatched requires delivery person
  if (data.status === 'dispatched' && !data.deliveryPersonId) {
    errors.push('Delivery person is required for dispatch');
  }
  
  // Cancelled requires remarks
  if (data.status === 'cancelled' && !data.remarks) {
    errors.push('Remarks are required for cancellation');
  }
  
  // Verify delivery person belongs to correct module
  if (data.deliveryPersonId) {
    const agent = await getDeliveryAgent(data.deliveryPersonId);
    if (agent.moduleType !== dispatchEntry.module_type) {
      errors.push('Delivery person must belong to the same module');
    }
  }
  
  return { valid: errors.length === 0, errors };
}
```

### Audit Trail
```typescript
async function logStatusChange(
  dispatchEntryId: string,
  productId: string,
  status: string,
  changedBy: string,
  remarks?: string
) {
  await db.dispatch_status_history.insert({
    dispatch_entry_id: dispatchEntryId,
    product_id: productId,
    status,
    changed_by: changedBy,
    changed_at: new Date(),
    remarks,
  });
}
```

## Integration with Other Modules

### From Packing Module
```typescript
// When packing is completed
await createDispatchFromPacking(packingEntry);
```

### To Delivery Module
```typescript
// When status changes to 'dispatched'
await notifyDeliveryModule(dispatchEntry);
await sendNotificationToAgent(deliveryPersonId, dispatchEntry);
```

## Security & Permissions

### Permission Checks
```typescript
function checkDispatchPermission(user: User, action: string): boolean {
  const requiredPermissions = {
    view: ['DISPATCH_VIEW', 'DISPATCH_MANAGE'],
    update: ['DISPATCH_MANAGE'],
    assign: ['DELIVERY_ASSIGN', 'DISPATCH_MANAGE'],
  };
  
  return user.permissions.some(p => 
    requiredPermissions[action].includes(p)
  );
}
```

### Module Filtering
```typescript
function filterByModule(query: any, user: User) {
  if (user.loginType === 'hub') {
    query.where('module_type', 'hub');
  } else if (user.loginType === 'store') {
    query.where('module_type', 'store');
  }
  return query;
}
```

## Error Handling

### Common Error Codes
```typescript
const ERROR_CODES = {
  DISPATCH_NOT_FOUND: 'DSP_001',
  INVALID_STATUS_TRANSITION: 'DSP_002',
  DELIVERY_PERSON_REQUIRED: 'DSP_003',
  REMARKS_REQUIRED: 'DSP_004',
  UNAUTHORIZED: 'DSP_005',
  INVALID_MODULE: 'DSP_006',
};
```

### Error Response Format
```typescript
{
  success: false,
  error: {
    code: 'DSP_003',
    message: 'Delivery person is required for dispatch',
    field: 'deliveryPersonId'
  }
}
```

## Performance Optimization

### Indexing Strategy
- Index on `bill_number` for quick lookups
- Index on `status` for filtering
- Index on `order_date` for date range queries
- Index on `delivery_person_id` for agent-specific queries

### Caching
```typescript
// Cache delivery agents list (rarely changes)
const CACHE_TTL = 3600; // 1 hour
await cache.set(`delivery-agents:${moduleType}`, agents, CACHE_TTL);
```

### Pagination
- Default page size: 20
- Max page size: 100
- Use cursor-based pagination for large datasets

## Testing Checklist

### Unit Tests
- [ ] Validate status transitions
- [ ] Check permission enforcement
- [ ] Test delivery person assignment
- [ ] Verify audit trail creation

### Integration Tests
- [ ] Auto-creation from packing
- [ ] Status update flow
- [ ] Filter combinations
- [ ] Export functionality

### Load Tests
- [ ] 1000+ concurrent dispatch entries
- [ ] Multiple status updates
- [ ] Complex filter queries

## Monitoring & Logging

### Key Metrics
- Dispatch creation rate
- Average time in each status
- Delivery person utilization
- Cancellation rate

### Log Events
```typescript
logger.info('Dispatch created', {
  dispatchId,
  billNumber,
  moduleType,
  assignedBy,
});

logger.info('Status updated', {
  dispatchId,
  productId,
  oldStatus,
  newStatus,
  updatedBy,
});
```

## Migration Script

### Initial Data Migration
```sql
-- Migrate existing packed orders to dispatch
INSERT INTO dispatch_entries (id, bill_number, order_date, customer_name, module_type, assigned_by, packing_id)
SELECT 
  CONCAT('DSP', LPAD(ROW_NUMBER() OVER (ORDER BY created_at), 6, '0')),
  bill_number,
  order_date,
  customer_name,
  module_type,
  'SYSTEM',
  id
FROM packing_entries
WHERE status = 'packed'
AND created_at >= '2024-01-01';
```

## Support & Maintenance

### Common Issues
1. **Dispatch not appearing** - Check packing status is 'packed'
2. **Can't assign delivery person** - Verify agent is active and in correct module
3. **Status update fails** - Check validation rules and permissions

### Maintenance Tasks
- Weekly: Review and archive old dispatch records
- Monthly: Analyze dispatch metrics
- Quarterly: Optimize database indexes

---

**Version:** 1.0  
**Last Updated:** February 16, 2026  
**Contact:** Backend Team
