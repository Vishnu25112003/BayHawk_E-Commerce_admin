# DELIVERY MODULE - QUICK REFERENCE

## 🚀 Quick Access

### Routes
- **Delivery Agent (Hub)**: `/hub/delivery/agent`
- **Delivery Admin (Hub)**: `/hub/delivery/admin`
- **Delivery Agent (Store)**: `/store/delivery/agent`
- **Delivery Admin (Store)**: `/store/delivery/admin`

### Roles
- **hub_delivery** / **store_delivery** → Agent View
- **hub_main_admin** / **store_main_admin** → Admin View

---

## 📋 Key Features

### Delivery Agent
✅ View assigned deliveries
✅ Navigate to location (Google Maps)
✅ Call customer
✅ Update delivery status
✅ Upload photo proof (mandatory for "Delivered")
✅ Collect COD payments
✅ Export reports

### Admin
✅ Monitor all deliveries
✅ View proof images
✅ Override status (with remarks)
✅ Track payment collection
✅ Filter by delivery person
✅ Export comprehensive reports

---

## 🔄 Status Flow

```
Dispatched (Default)
    ↓
Delivered (Photo Required)
Undelivered (Remarks Required)
Returned (Remarks Required)
Failed Delivery (Remarks Required)
```

---

## 📸 Photo Proof Rules

**When**: Status = "Delivered"
**Required**: YES (Mandatory)
**Accepts**: JPG, PNG
**Supports**: Camera capture on mobile
**Cannot**: Mark delivered without photo

---

## 💰 Payment Handling

### Online Payment
- Auto-marked as **Paid**
- No action needed

### COD Payment
- Delivery person collects cash
- Updates Payment Status = **Paid**
- Records collection time and amount

---

## 🔶 Alternate Products

Products marked as "Alternate" during procurement show:
```
🔶 Alternate Product
🔶 Alternate for: [Original Product Name]
```

---

## 🎨 Status Colors

| Status | Color |
|--------|-------|
| Dispatched | 🟡 Yellow |
| Delivered | 🟢 Green |
| Undelivered | 🔴 Red |
| Returned | 🟠 Orange |
| Failed Delivery | 🔴 Red |

---

## 📊 Export Formats

- **CSV** - Data export
- **PDF** - Formatted report
- **Excel** - Spreadsheet (Admin only)

---

## 🔐 Access Control

| Role | Agent View | Admin View |
|------|------------|------------|
| Main Admin | ❌ | ✅ |
| Delivery | ✅ | ❌ |
| Procurement | ❌ | ❌ |
| Packing | ❌ | ❌ |

---

## 📱 Mobile Actions

### Navigate Button
Opens Google Maps with customer address

### Call Button
Triggers phone call to customer

### Camera Upload
Captures photo directly from mobile camera

---

## ⚠️ Important Rules

1. **Photo proof is MANDATORY** for "Delivered" status
2. **Remarks are MANDATORY** for Undelivered/Returned/Failed
3. **COD must be collected** before marking delivered
4. **Admin override requires remarks**
5. **Status history is tracked** for audit

---

## 🔧 Files Structure

```
src/
├── types/
│   └── delivery.ts
├── pages/
│   └── delivery/
│       ├── DeliveryAgentPage.tsx
│       ├── DeliveryAdminPage.tsx
│       └── index.ts
└── App.tsx (routes added)
```

---

## 🎯 Common Actions

### For Delivery Agent
1. Login → View assigned deliveries
2. Click "Navigate" → Opens map
3. Click "Call" → Calls customer
4. Deliver product
5. Select "Delivered" → Upload photo
6. If COD → Confirm payment collected
7. Submit

### For Admin
1. Login → View all deliveries
2. Apply filters (person, date, status)
3. Click "View" → See proof image
4. Override status if needed (with remarks)
5. Export reports

---

## 📞 Integration Points

### From Dispatch
- Auto-creates delivery entry when dispatch status = "Dispatched"
- Assigns to delivery person
- Links all order and product data

### To Customer
- Phone call integration
- Map navigation
- Proof of delivery

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't mark delivered | Upload photo proof first |
| Photo upload fails | Check file format (JPG/PNG) |
| Map not opening | Check location permissions |
| Status not updating | Verify role permissions |
| Export not working | Check data availability |

---

## 📈 Metrics Tracked

- Total deliveries
- Delivered count
- Undelivered count
- Payment collection (COD)
- Proof upload status
- Delivery person performance

---

**Quick Start**: Login as delivery person → View deliveries → Navigate → Deliver → Upload proof → Done! ✅
