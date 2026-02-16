# Dispatch Module - Quick Reference

## 🚀 Quick Start

### Access the Module
- **Hub:** Navigate to Operations → Dispatch
- **Store:** Navigate to Operations → Dispatch
- **URL:** `/hub/dispatch/management` or `/store/dispatch/management`

### Required Roles
- `hub_dispatch` or `store_dispatch`
- `hub_main_admin` or `store_main_admin`

## 📊 Main Features

### 1. View Dispatch Queue
- Auto-populated from packed orders
- Shows Bill #, Customer, Product details
- Displays gross and net weights
- Indicates alternate products

### 2. Assign Delivery Person
- Select from dropdown (filtered by module)
- Required before dispatching
- Only active agents shown

### 3. Update Status
- **Processing** → Default status
- **Dispatched** → Requires delivery person
- **Cancelled** → Requires remarks
- **Failed** → Optional
- **Returned** → Optional

### 4. Filter Records
- By Delivery Person
- By Date Range
- By Customer
- By Status
- By Product

### 5. Export Reports
- **CSV** - Spreadsheet format
- **PDF** - Formatted report with header
- **Excel** - .xlsx format

## 🎯 Common Tasks

### Dispatch an Order
1. Find the order in the table
2. Select delivery person from dropdown
3. Change status to "Dispatched"
4. System validates and updates

### Cancel a Dispatch
1. Locate the order
2. Change status to "Cancelled"
3. Enter cancellation remarks in prompt
4. Confirm

### Filter by Date
1. Enter "From Date"
2. Enter "To Date"
3. Results auto-update
4. Click "Reset" to clear

### Export Report
1. Apply desired filters
2. Click export button (CSV/PDF/Excel)
3. File downloads automatically

## ⚠️ Validation Rules

| Action | Requirement |
|--------|-------------|
| Dispatch | Delivery person must be assigned |
| Cancel | Remarks are mandatory |
| Status Change | Audit log created automatically |
| Access | Only packed orders appear |

## 🎨 Status Colors

- 🟡 **Processing** - Yellow badge
- 🟢 **Dispatched** - Green badge
- 🔴 **Cancelled** - Red badge
- 🟠 **Failed** - Orange badge
- ⚫ **Returned** - Gray badge

## 🔔 Alternate Products

When you see the amber "Alternate" badge:
- Product was substituted during procurement
- Original product was rare/unavailable
- Customer should be informed

## 📱 Responsive Design

- Desktop: Full table view
- Tablet: Scrollable table
- Mobile: Optimized layout

## 🔐 Permissions

### Dispatch Role Can:
- ✅ View all dispatch records
- ✅ Assign delivery personnel
- ✅ Update dispatch status
- ✅ Export reports
- ✅ Filter records

### Dispatch Role Cannot:
- ❌ Delete dispatch records
- ❌ Modify order details
- ❌ Access other modules (without permission)

## 💡 Tips

1. **Assign Early** - Assign delivery person as soon as order is packed
2. **Use Filters** - Filter by delivery person to balance workload
3. **Check Alternates** - Review alternate products before dispatch
4. **Export Daily** - Export reports at end of day for records
5. **Add Remarks** - Use remarks field for special instructions

## 🐛 Troubleshooting

### Can't Dispatch Order
- ✓ Check if delivery person is assigned
- ✓ Verify order status is "Processing"
- ✓ Ensure you have DISPATCH_MANAGE permission

### Delivery Person Not Showing
- ✓ Check if agent is active
- ✓ Verify agent belongs to correct module (hub/store)
- ✓ Refresh the page

### Export Not Working
- ✓ Check if filters are valid
- ✓ Ensure there are records to export
- ✓ Try different export format

## 📞 Support

For technical issues or questions:
- Contact System Administrator
- Check DISPATCH_MODULE_DOCUMENTATION.md
- Review audit logs for status history

## 🔄 Workflow

```
Packing Complete
      ↓
Order appears in Dispatch Queue
      ↓
Assign Delivery Person
      ↓
Update Status to "Dispatched"
      ↓
Order moves to Delivery Module
```

## 📋 Keyboard Shortcuts

- `Tab` - Navigate between fields
- `Enter` - Confirm selection
- `Esc` - Cancel action
- `Ctrl+F` - Focus on filters

## 🎓 Training Checklist

- [ ] Understand dispatch workflow
- [ ] Know how to assign delivery person
- [ ] Practice status updates
- [ ] Learn to use filters
- [ ] Export sample reports
- [ ] Identify alternate products
- [ ] Handle cancellations
- [ ] Review audit trail

---

**Module Version:** 1.0  
**Last Updated:** February 16, 2026  
**Module:** Dispatch Management  
**Part of:** Bayhawk Operations Flow
