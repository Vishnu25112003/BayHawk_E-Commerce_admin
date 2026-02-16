# 🔌 Backend Integration Guide - Procurement Module

## Quick Start Integration

### Step 1: Update PurchaseManagementPage.tsx

Replace mock data with API calls:

```typescript
import React, { useState, useEffect } from 'react';
import { purchaseApi } from '../../services/purchaseService';
// ... other imports

export function PurchaseManagementPage() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filters, setFilters] = useState<PurchaseFilters>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch purchases on mount and filter change
  useEffect(() => {
    fetchPurchases();
  }, [filters]);

  const fetchPurchases = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await purchaseApi.getPurchases(filters);
      setPurchases(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch purchases');
      console.error('Error fetching purchases:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPurchase = async (purchaseData: Partial<Purchase>) => {
    setLoading(true);
    try {
      if (editingPurchase) {
        const updated = await purchaseApi.updatePurchase(editingPurchase.id, purchaseData);
        setPurchases(purchases.map(p => p.id === updated.id ? updated : p));
      } else {
        const created = await purchaseApi.createPurchase(purchaseData);
        setPurchases([created, ...purchases]);
      }
      setIsFormOpen(false);
    } catch (err: any) {
      alert('Error: ' + (err.message || 'Failed to save purchase'));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (purchaseId: string, productId: string, newStatus: string, remarks: string) => {
    setLoading(true);
    try {
      const updated = await purchaseApi.updateProductStatus(
        purchaseId,
        productId,
        newStatus,
        remarks,
        user?.name || 'Unknown'
      );
      setPurchases(purchases.map(p => p.id === updated.id ? updated : p));
    } catch (err: any) {
      alert('Error: ' + (err.message || 'Failed to update status'));
    } finally {
      setLoading(false);
    }
  };

  // Add loading indicator
  if (loading && purchases.length === 0) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Add error display
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  // ... rest of component
}
```

### Step 2: Update API Base URL

In `src/utils/api.ts`, ensure your base URL is correct:

```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Step 3: Environment Variables

Create `.env` file:

```env
REACT_APP_API_URL=http://localhost:3000/api
```

For production:
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
```

## Backend API Endpoints Required

### 1. Get Purchases (with filters)
```
GET /api/purchases
Query Params:
  - dateFrom: string (optional)
  - dateTo: string (optional)
  - status: string (optional)
  - productId: string (optional)
  - moduleType: 'hub' | 'store' (from auth)

Response: Purchase[]
```

**Example Response:**
```json
[
  {
    "id": "PUR-001",
    "purchaseDate": "2026-02-15",
    "supplierName": "Ocean Fresh Suppliers",
    "moduleType": "hub",
    "createdBy": "John Doe",
    "remarks": "Regular weekly purchase",
    "products": [
      {
        "id": "1",
        "productId": "prod-123",
        "productName": "Sea Crab",
        "variant": "large",
        "countMin": 10,
        "countMax": 15,
        "grossWeight": 25.5,
        "basePriceMin": 800,
        "basePriceMax": 1000,
        "purchasePrice": 900,
        "status": "purchased",
        "isAlternate": false
      }
    ],
    "createdAt": "2026-02-15T10:00:00Z",
    "updatedAt": "2026-02-15T10:00:00Z",
    "statusHistory": []
  }
]
```

### 2. Create Purchase
```
POST /api/purchases
Body: Partial<Purchase>

Response: Purchase
```

**Example Request:**
```json
{
  "purchaseDate": "2026-02-16",
  "supplierName": "Marine Traders",
  "moduleType": "hub",
  "createdBy": "John Doe",
  "remarks": "Urgent order",
  "products": [
    {
      "productId": "prod-123",
      "productName": "Sea Crab",
      "variant": "large",
      "countMin": 10,
      "countMax": 15,
      "grossWeight": 25.5,
      "basePriceMin": 800,
      "basePriceMax": 1000,
      "purchasePrice": 900,
      "status": "processing",
      "isAlternate": false
    }
  ]
}
```

### 3. Update Purchase
```
PUT /api/purchases/:id
Body: Partial<Purchase>

Response: Purchase
```

### 4. Update Product Status
```
PATCH /api/purchases/:purchaseId/products/:productId/status
Body: {
  status: string,
  remarks: string,
  updatedBy: string
}

Response: Purchase (with updated product and status history)
```

**Example Request:**
```json
{
  "status": "purchased",
  "remarks": "Delivery completed",
  "updatedBy": "John Doe"
}
```

### 5. Delete Purchase
```
DELETE /api/purchases/:id

Response: 204 No Content
```

### 6. Export Purchases
```
GET /api/purchases/export
Query Params:
  - format: 'csv' | 'pdf' | 'excel'
  - dateFrom: string (optional)
  - dateTo: string (optional)
  - status: string (optional)
  - productId: string (optional)

Response: File (Blob)
Content-Type: 
  - text/csv (for CSV)
  - application/pdf (for PDF)
  - application/vnd.openxmlformats-officedocument.spreadsheetml.sheet (for Excel)
```

## Backend Implementation Example (Node.js/Express)

### Purchase Controller

```javascript
// controllers/purchaseController.js
const Purchase = require('../models/Purchase');

exports.getPurchases = async (req, res) => {
  try {
    const { dateFrom, dateTo, status, productId } = req.query;
    const { moduleType } = req.user; // from auth middleware
    
    let query = { moduleType };
    
    if (dateFrom || dateTo) {
      query.purchaseDate = {};
      if (dateFrom) query.purchaseDate.$gte = dateFrom;
      if (dateTo) query.purchaseDate.$lte = dateTo;
    }
    
    if (status) {
      query['products.status'] = status;
    }
    
    if (productId) {
      query['products.productId'] = productId;
    }
    
    const purchases = await Purchase.find(query)
      .sort({ createdAt: -1 })
      .populate('products.productId');
    
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPurchase = async (req, res) => {
  try {
    const purchaseData = {
      ...req.body,
      id: generatePurchaseId(), // Your ID generation logic
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const purchase = new Purchase(purchaseData);
    await purchase.save();
    
    res.status(201).json(purchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };
    
    const purchase = await Purchase.findOneAndUpdate(
      { id },
      updateData,
      { new: true }
    );
    
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    
    res.json(purchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProductStatus = async (req, res) => {
  try {
    const { purchaseId, productId } = req.params;
    const { status, remarks, updatedBy } = req.body;
    
    const purchase = await Purchase.findOne({ id: purchaseId });
    
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    
    // Update product status
    const product = purchase.products.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const oldStatus = product.status;
    product.status = status;
    product.remarks = remarks;
    
    // Add to status history
    if (!purchase.statusHistory) {
      purchase.statusHistory = [];
    }
    
    purchase.statusHistory.push({
      status,
      changedBy: updatedBy,
      changedAt: new Date(),
    });
    
    purchase.updatedAt = new Date();
    purchase.updatedBy = updatedBy;
    
    await purchase.save();
    
    res.json(purchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    
    const purchase = await Purchase.findOneAndDelete({ id });
    
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Routes

```javascript
// routes/purchaseRoutes.js
const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get purchases (with filters)
router.get('/', 
  authorize(['procurement', 'hub_main_admin', 'store_main_admin']),
  purchaseController.getPurchases
);

// Create purchase
router.post('/',
  authorize(['procurement', 'hub_main_admin', 'store_main_admin']),
  purchaseController.createPurchase
);

// Update purchase
router.put('/:id',
  authorize(['procurement', 'hub_main_admin', 'store_main_admin']),
  purchaseController.updatePurchase
);

// Update product status
router.patch('/:purchaseId/products/:productId/status',
  authorize(['procurement', 'hub_main_admin', 'store_main_admin']),
  purchaseController.updateProductStatus
);

// Delete purchase
router.delete('/:id',
  authorize(['hub_main_admin', 'store_main_admin']),
  purchaseController.deletePurchase
);

module.exports = router;
```

### Database Model (Mongoose)

```javascript
// models/Purchase.js
const mongoose = require('mongoose');

const purchaseProductSchema = new mongoose.Schema({
  id: String,
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: String,
  variant: { type: String, enum: ['small', 'medium', 'large'] },
  countMin: Number,
  countMax: Number,
  grossWeight: Number,
  basePriceMin: Number,
  basePriceMax: Number,
  purchasePrice: Number,
  status: { 
    type: String, 
    enum: ['processing', 'purchased', 'cancelled', 'alternate'],
    default: 'processing'
  },
  remarks: String,
  originalProductId: String,
  alternateProductId: String,
  isAlternate: { type: Boolean, default: false },
});

const statusHistorySchema = new mongoose.Schema({
  status: String,
  changedBy: String,
  changedAt: { type: Date, default: Date.now },
});

const purchaseSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  purchaseDate: { type: Date, required: true },
  supplierName: { type: String, required: true },
  moduleType: { type: String, enum: ['hub', 'store'], required: true },
  createdBy: { type: String, required: true },
  remarks: String,
  products: [purchaseProductSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: String,
  statusHistory: [statusHistorySchema],
});

module.exports = mongoose.model('Purchase', purchaseSchema);
```

## Testing the Integration

### 1. Test with Postman/Thunder Client

**Create Purchase:**
```
POST http://localhost:3000/api/purchases
Headers:
  Authorization: Bearer YOUR_TOKEN
  Content-Type: application/json
Body: (see example above)
```

**Get Purchases:**
```
GET http://localhost:3000/api/purchases?status=processing
Headers:
  Authorization: Bearer YOUR_TOKEN
```

### 2. Test in Frontend

1. Start backend server
2. Start frontend: `npm run dev`
3. Login with procurement role
4. Navigate to Procurement → Purchase Management
5. Try creating a purchase
6. Try filtering
7. Try status change
8. Try export

## Error Handling

Add proper error handling in the service:

```typescript
// src/services/purchaseService.ts
import { api } from '../utils/api';
import type { Purchase, PurchaseFilters } from '../types/purchase';

const handleError = (error: any) => {
  if (error.response) {
    // Server responded with error
    throw new Error(error.response.data.message || 'Server error');
  } else if (error.request) {
    // Request made but no response
    throw new Error('No response from server');
  } else {
    // Something else happened
    throw new Error(error.message || 'Unknown error');
  }
};

export const purchaseApi = {
  getPurchases: async (filters?: PurchaseFilters): Promise<Purchase[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.productId) params.append('productId', filters.productId);

      const response = await api.get(`/purchases?${params.toString()}`);
      return response.data;
    } catch (error) {
      handleError(error);
      return [];
    }
  },
  // ... other methods with try-catch
};
```

## Checklist

- [ ] Backend API endpoints implemented
- [ ] Database models created
- [ ] Authentication middleware added
- [ ] Authorization checks in place
- [ ] Frontend service layer configured
- [ ] API base URL set in environment
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Tested create purchase
- [ ] Tested update purchase
- [ ] Tested status change
- [ ] Tested filters
- [ ] Tested export
- [ ] Tested role-based access
- [ ] Production environment configured

---

**Integration Time Estimate**: 2-3 days
**Priority**: High
**Status**: Ready for backend development
