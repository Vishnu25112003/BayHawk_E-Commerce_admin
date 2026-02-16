# DELIVERY MODULE - COMPLETE DOCUMENTATION

## Overview
The Delivery Module is the final operational stage in the Bayhawk workflow after Dispatch. It manages the delivery process from dispatch to final delivery with proof collection and payment handling.

**Flow**: Procurement → Cutting → Packing → Dispatch → **Delivery**

---

## Module Structure

### Module Name
**Operations → Delivery Management**

### Two Views
1. **Delivery Person View** (Individual Login) - `/hub/delivery/agent` or `/store/delivery/agent`
2. **Admin View** (Hub/Store Admin Monitoring) - `/hub/delivery/admin` or `/store/delivery/admin`

---

## Purpose

### Delivery Person Can:
- View assigned dispatched orders
- Update delivery status
- Upload proof of delivery (mandatory for "Delivered" status)
- View payment details
- Contact customer via phone
- Navigate to customer location
- Collect COD payments

### Admin Can:
- Monitor all delivery statuses
- Track payment collection
- View proof uploads
- Override delivery status (with remarks)
- Export delivery reports (CSV, PDF, Excel)
- Filter by delivery person, date, customer, status

---

## Data Flow Integration

### Auto-Creation from Dispatch
```
Dispatch Status = "Dispatched"
        ↓
Create Delivery Entry (Auto)
        ↓
Default Status = "Dispatched"
```

### Linked Data
Each delivery record links to:
- Dispatch ID
- Order ID (Bill #)
- Customer details
- Delivery Person
- Payment details
- Product information

---

## Delivery Entry Structure

### Section A – Order Information

| Field | Type | Description |
|-------|------|-------------|
| Bill # | Display | Invoice number |
| Party Name | Display | Customer name |
| Total Payment | Decimal | Final payable amount |
| Payment Status | Display | Paid / Unpaid |
| Payment Mode | Display | Online / COD |
| Status | Dropdown | Default = Dispatched |
| Location | Map Link | Navigate to address |
| Call Customer | Button | Trigger phone call |
| Delivery Person | Auto | Logged-in delivery user |
| Remarks | Text | Optional notes |
| Products | List | Product details with alternate indication |

---

## Status Logic

### Default Status
When entry is created from dispatch:
- **Status = "Dispatched"**

### Allowed Status Values
1. **Dispatched** (Default)
2. **Delivered**
3. **Undelivered**
4. **Returned**
5. **Failed Delivery**

### Status Update Rules

#### Delivery Person Can Update:
- Dispatched → Delivered (Photo Required)
- Dispatched → Undelivered (Remarks Required)
- Dispatched → Returned (Remarks Required)
- Dispatched → Failed Delivery (Remarks Required)

#### Admin Can:
- Override any status (Remarks Required)

### Status History
Each status update stores:
- `updated_by` - User ID who made the change
- `updated_at` - Timestamp of change
- Status history array for audit trail

---

## Mandatory Photo Proof

### When Required
Photo upload is **MANDATORY** when status is changed to:
- **Delivered**

### System Behavior
- Photo upload field appears when "Delivered" is selected
- Accepts: JPG, PNG image files
- Supports: Camera capture on mobile devices
- Delivery cannot be marked "Delivered" without photo upload

### Database Fields
```typescript
proofImageUrl: string
proofUploadedAt: string (timestamp)
proofUploadedBy: string (user ID)
```

---

## Payment Handling Logic

### Payment Mode: Online
- Payment Status automatically = **Paid**
- No collection required

### Payment Mode: COD
- Payment Status depends on collection
- Delivery person updates Payment Status = **Paid** after collection
- Records:
  - `collectedAmount` - Amount collected
  - `collectedAt` - Collection timestamp

### COD Collection Flow
```
Status = "Delivered" + Payment Mode = "COD"
        ↓
System prompts: "Has COD payment been collected?"
        ↓
If Yes: Update Payment Status = "Paid"
        Record collectedAmount and collectedAt
        ↓
If No: Alert "Please collect payment before marking as delivered"
```

---

## Alternate Product Indication

### Display Logic
If product was marked as **Alternate** during Procurement:

**Delivery view shows:**
```
🔶 Alternate Product
```
OR
```
🔶 Alternate for: [Original Product Name]
```

### Purpose
Ensures transparency at final delivery stage so delivery person can inform customer.

---

## Filters Section

### Delivery Person View Filters
| Filter | Type | Description |
|--------|------|-------------|
| Date Range | From – To | Filter by delivery date |
| Customer | Search | Filter by customer name |
| Status | Dropdown | Dispatched / Delivered / Undelivered / Returned / Failed |

### Admin View Filters
| Filter | Type | Description |
|--------|------|-------------|
| Delivery Person | Dropdown | Filter by assigned delivery person |
| Date Range | From – To | Filter by delivery date |
| Customer | Search | Filter by customer name |
| Status | Dropdown | All status options |

---

## Export Options

### Formats Supported
1. **CSV** - Comma-separated values
2. **PDF** - Formatted report with header
3. **Excel** (.xlsx) - Spreadsheet format

### Export Includes
- Bill #
- Customer Name
- Total Payment
- Payment Mode
- Payment Status
- Delivery Person
- Delivery Status
- Delivery Date
- Remarks
- Alternate indication (Yes/No)
- Proof status (Yes/No)

### PDF Requirements
- Bayhawk header
- Filter summary (if applied)
- Generated timestamp
- Page numbers
- Formatted table

---

## UI Layout Structure

### Delivery Person View
```
-------------------------------------------------
Filters Section
-------------------------------------------------
Delivery Table
  - Bill #
  - Customer
  - Products (with alternate indication)
  - Total Payment
  - Payment Mode
  - Payment Status
  - Status
  - Location (Navigate button)
  - Call (Call button)
  - Remarks
  - Action (Update Status + Photo Upload)
-------------------------------------------------
Export Buttons (CSV, PDF)
-------------------------------------------------
```

### Admin View
```
-------------------------------------------------
Filters Section (includes Delivery Person filter)
-------------------------------------------------
Delivery Table
  - Bill #
  - Customer
  - Products (with alternate indication)
  - Total Payment
  - Payment Mode
  - Payment Status
  - Delivery Person
  - Status
  - Proof (View button)
  - Remarks
  - Actions (Override Status)
-------------------------------------------------
Export Buttons (CSV, PDF)
-------------------------------------------------
Proof Modal (View uploaded proof images)
-------------------------------------------------
```

---

## Status Color Coding

| Status | Color | CSS Class |
|--------|-------|-----------|
| Dispatched | Yellow | `bg-yellow-100 text-yellow-800` |
| Delivered | Green | `bg-green-100 text-green-800` |
| Undelivered | Red | `bg-red-100 text-red-800` |
| Returned | Orange | `bg-orange-100 text-orange-800` |
| Failed Delivery | Red | `bg-red-100 text-red-800` |

### Payment Status Colors
| Status | Color | CSS Class |
|--------|-------|-----------|
| Paid | Green | `bg-green-100 text-green-800` |
| Unpaid | Red | `bg-red-100 text-red-800` |

---

## Role-Based Access Control

### HUB
| Role | Access |
|------|--------|
| Main Admin | Full monitoring (Admin View) |
| Procurement | No access |
| Packing | No access |
| Delivery | Update own assigned deliveries (Agent View) |

### STORE
| Role | Access |
|------|--------|
| Main Admin | Full monitoring (Admin View) |
| Procurement | No access |
| Packing | No access |
| Delivery | Update own assigned deliveries (Agent View) |

---

## Complete Process Flow

```
Packing Completed
        ↓
Dispatch = "Dispatched"
        ↓
Delivery Entry Auto-Created
  - Status = "Dispatched"
  - Assigned to Delivery Person
        ↓
Delivery Person Logs In
        ↓
Views Assigned Deliveries
        ↓
Navigates to Location (Map)
        ↓
Calls Customer (Phone)
        ↓
Delivers Product
        ↓
Updates Status:
  → Delivered (Photo Required + COD Collection if applicable)
  → Undelivered (Remarks Required)
  → Returned (Remarks Required)
  → Failed Delivery (Remarks Required)
        ↓
If Delivered:
  - Upload Photo Proof (Mandatory)
  - Collect COD Payment (if applicable)
  - Mark Payment Status = "Paid"
        ↓
Admin Monitors All Deliveries
  - View Proof Images
  - Track Payment Collection
  - Override Status if needed
  - Export Reports
```

---

## Technical Implementation

### Files Created
1. **Types**: `/src/types/delivery.ts`
   - DeliveryEntry interface
   - DeliveryProduct interface
   - DeliveryFilters interface
   - DeliveryStatusHistory interface

2. **Pages**:
   - `/src/pages/delivery/DeliveryAgentPage.tsx` - Delivery person view
   - `/src/pages/delivery/DeliveryAdminPage.tsx` - Admin monitoring view
   - `/src/pages/delivery/index.ts` - Export file

3. **Routes** (in App.tsx):
   - `/hub/delivery/agent` - Hub delivery person
   - `/hub/delivery/admin` - Hub admin
   - `/store/delivery/agent` - Store delivery person
   - `/store/delivery/admin` - Store admin

### Key Features Implemented
✅ Auto-creation from dispatch
✅ Mandatory photo proof for delivered status
✅ COD payment collection tracking
✅ Alternate product indication
✅ Status history tracking
✅ Role-based access control
✅ Map navigation integration
✅ Phone call integration
✅ Export to CSV, PDF, Excel
✅ Proof image viewing (Admin)
✅ Status override (Admin only)
✅ Comprehensive filtering

---

## API Endpoints (To Be Implemented)

### Delivery Person Endpoints
```
GET    /api/delivery/agent/:userId        - Get assigned deliveries
PATCH  /api/delivery/:id                  - Update delivery status
POST   /api/delivery/:id/proof            - Upload proof image
```

### Admin Endpoints
```
GET    /api/delivery                      - Get all deliveries (with filters)
PATCH  /api/delivery/:id/override         - Override delivery status
GET    /api/delivery-agents               - Get all delivery agents
```

---

## Database Schema

### delivery_entries Table
```sql
CREATE TABLE delivery_entries (
  id VARCHAR PRIMARY KEY,
  dispatch_id VARCHAR REFERENCES dispatch_entries(id),
  bill_number VARCHAR,
  party_name VARCHAR,
  total_payment DECIMAL(10,2),
  payment_status ENUM('paid', 'unpaid'),
  payment_mode ENUM('online', 'cod'),
  status ENUM('dispatched', 'delivered', 'undelivered', 'returned', 'failed_delivery'),
  delivery_person_id VARCHAR REFERENCES users(id),
  delivery_person_name VARCHAR,
  customer_address TEXT,
  customer_phone VARCHAR,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  remarks TEXT,
  proof_image_url VARCHAR,
  proof_uploaded_at TIMESTAMP,
  proof_uploaded_by VARCHAR,
  collected_amount DECIMAL(10,2),
  collected_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR
);
```

### delivery_products Table
```sql
CREATE TABLE delivery_products (
  id VARCHAR PRIMARY KEY,
  delivery_id VARCHAR REFERENCES delivery_entries(id),
  bill_number VARCHAR,
  party_name VARCHAR,
  product_name VARCHAR,
  gross_weight DECIMAL(10,2),
  net_weight DECIMAL(10,2),
  is_alternate BOOLEAN DEFAULT FALSE,
  original_product_name VARCHAR
);
```

### delivery_status_history Table
```sql
CREATE TABLE delivery_status_history (
  id VARCHAR PRIMARY KEY,
  delivery_id VARCHAR REFERENCES delivery_entries(id),
  status VARCHAR,
  changed_by VARCHAR REFERENCES users(id),
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  remarks TEXT
);
```

---

## Testing Checklist

### Delivery Person View
- [ ] View assigned deliveries only
- [ ] Filter by date range, customer, status
- [ ] Navigate to customer location (Google Maps)
- [ ] Call customer (phone integration)
- [ ] Update status to Delivered (with photo proof)
- [ ] Update status to Undelivered/Returned/Failed (with remarks)
- [ ] Upload photo proof (camera/file)
- [ ] Collect COD payment
- [ ] Export CSV and PDF

### Admin View
- [ ] View all deliveries
- [ ] Filter by delivery person, date, customer, status
- [ ] View proof images
- [ ] Override delivery status (with remarks)
- [ ] Export CSV, PDF, Excel
- [ ] Monitor payment collection
- [ ] Track alternate products

### Integration
- [ ] Auto-creation from dispatch
- [ ] Status history tracking
- [ ] Payment status updates
- [ ] Proof upload validation
- [ ] COD collection validation

---

## Future Enhancements

1. **Real-time Tracking**
   - GPS tracking of delivery person
   - Live location updates
   - ETA calculation

2. **Customer Notifications**
   - SMS/Push notification on dispatch
   - Delivery person details shared
   - Real-time delivery updates

3. **Digital Signature**
   - Customer signature on delivery
   - OTP verification

4. **Route Optimization**
   - Optimal delivery route calculation
   - Multiple delivery batching

5. **Performance Metrics**
   - Delivery time analytics
   - Success rate tracking
   - Delivery person performance

---

## Support & Maintenance

### Common Issues
1. **Photo upload fails**: Check file size and format
2. **Map navigation not working**: Verify location permissions
3. **Status not updating**: Check role permissions
4. **Export not generating**: Verify data availability

### Logs to Monitor
- Delivery status changes
- Photo upload attempts
- Payment collection records
- Admin overrides

---

**Module Status**: ✅ Complete and Ready for Integration
**Last Updated**: February 16, 2026
**Version**: 1.0.0
