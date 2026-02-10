import { useState } from 'react';
import { Card, Badge, Modal, Button } from '../../components/ui';
import { ProductApprovalsList } from '../../components/features/products';
import { Building2, Store, AlertCircle } from 'lucide-react';

interface ProductRequest {
  id: string;
  productName: string;
  productNameTa: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  images: string[];
  requestedBy: string;
  requestedByRole: string;
  requestDate: string;
  sourceType: 'hub' | 'store';
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  reason?: string;
  specifications: {
    weight?: string;
    freshness?: string;
    origin?: string;
    packaging?: string;
  };
}

const mockRequests: ProductRequest[] = [
  // Hub Requests
  {
    id: 'HR001',
    productName: 'Premium Tuna',
    productNameTa: 'பிரீமியம் சூரை',
    category: 'Fish',
    description: 'Fresh premium tuna fish, ideal for sashimi and grilling',
    price: 850,
    unit: 'kg',
    images: ['/api/placeholder/300/200'],
    requestedBy: 'Ravi Kumar',
    requestedByRole: 'Hub Manager',
    requestDate: '2024-01-08',
    sourceType: 'hub',
    status: 'pending',
    priority: 'high',
    specifications: {
      weight: '2-5 kg per piece',
      freshness: 'Caught within 24 hours',
      origin: 'Bay of Bengal',
      packaging: 'Ice packed'
    }
  },
  {
    id: 'HR002',
    productName: 'King Prawns',
    productNameTa: 'கிங் இறால்',
    category: 'Prawns',
    description: 'Large king prawns, perfect for special occasions',
    price: 1200,
    unit: 'kg',
    images: ['/api/placeholder/300/200'],
    requestedBy: 'Suresh Babu',
    requestedByRole: 'Procurement Head',
    requestDate: '2024-01-07',
    sourceType: 'hub',
    status: 'approved',
    priority: 'medium',
    specifications: {
      weight: '15-20 pieces per kg',
      freshness: 'Live/Fresh',
      origin: 'Coastal waters',
      packaging: 'Chilled transport'
    }
  },
  {
    id: 'HR003',
    productName: 'Sea Bass',
    productNameTa: 'கடல் பாஸ்',
    category: 'Fish',
    description: 'Fresh sea bass, excellent for steaming and frying',
    price: 650,
    unit: 'kg',
    images: ['/api/placeholder/300/200'],
    requestedBy: 'Muthu Raja',
    requestedByRole: 'Quality Manager',
    requestDate: '2024-01-06',
    sourceType: 'hub',
    status: 'rejected',
    priority: 'low',
    reason: 'Seasonal availability issues',
    specifications: {
      weight: '500g-1kg per piece',
      freshness: 'Daily catch',
      origin: 'Local fishermen',
      packaging: 'Fresh ice'
    }
  },

  // Store Requests
  {
    id: 'SR001',
    productName: 'Organic Chicken',
    productNameTa: 'இயற்கை கோழி',
    category: 'Chicken',
    description: 'Free-range organic chicken, antibiotic-free',
    price: 320,
    unit: 'kg',
    images: ['/api/placeholder/300/200'],
    requestedBy: 'Priya Sharma',
    requestedByRole: 'Store Manager',
    requestDate: '2024-01-08',
    sourceType: 'store',
    status: 'pending',
    priority: 'high',
    specifications: {
      weight: '1-1.5 kg per bird',
      freshness: 'Slaughtered same day',
      origin: 'Local organic farms',
      packaging: 'Vacuum sealed'
    }
  },
  {
    id: 'SR002',
    productName: 'Goat Curry Cut',
    productNameTa: 'ஆட்டு கறி துண்டுகள்',
    category: 'Mutton',
    description: 'Fresh goat meat cut for curry preparation',
    price: 750,
    unit: 'kg',
    images: ['/api/placeholder/300/200'],
    requestedBy: 'Arun Kumar',
    requestedByRole: 'Meat Specialist',
    requestDate: '2024-01-07',
    sourceType: 'store',
    status: 'approved',
    priority: 'medium',
    specifications: {
      weight: 'Mixed cuts 200-300g pieces',
      freshness: 'Fresh daily',
      origin: 'Certified suppliers',
      packaging: 'Hygienic packing'
    }
  },
  {
    id: 'SR003',
    productName: 'Farm Eggs',
    productNameTa: 'பண்ணை முட்டை',
    category: 'Egg',
    description: 'Fresh farm eggs from free-range hens',
    price: 8,
    unit: 'piece',
    images: ['/api/placeholder/300/200'],
    requestedBy: 'Lakshmi Devi',
    requestedByRole: 'Store Assistant',
    requestDate: '2024-01-06',
    sourceType: 'store',
    status: 'pending',
    priority: 'low',
    specifications: {
      weight: '50-60g per egg',
      freshness: 'Laid within 2 days',
      origin: 'Local poultry farms',
      packaging: 'Cardboard trays'
    }
  }
];

export function ProductApprovalPage() {
  const [activeTab, setActiveTab] = useState<'hub' | 'store'>('hub');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ProductRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [approveNotes, setApproveNotes] = useState('');

  // Separate requests by source
  const hubRequests = mockRequests.filter(req => req.sourceType === 'hub');
  const storeRequests = mockRequests.filter(req => req.sourceType === 'store');

  const tabs = [
    { id: 'hub', label: 'Hub Requests', icon: Building2, count: hubRequests.length },
    { id: 'store', label: 'Store Requests', icon: Store, count: storeRequests.length },
  ];

  const getCurrentRequests = () => {
    return activeTab === 'hub' ? hubRequests : storeRequests;
  };

  // Bulk actions handler for product requests
  const handleBulkAction = async (actionId: string, selectedIds: string[], data?: any) => {
    try {
      switch (actionId) {
        case 'approve_selected':
          console.log(`Approving ${selectedIds.length} requests:`, selectedIds);
          // Update selected requests to approved status
          alert(`${selectedIds.length} product requests have been approved successfully!`);
          break;
        case 'reject_selected':
          const reason = prompt('Please provide a reason for bulk rejection:');
          if (reason) {
            console.log(`Rejecting ${selectedIds.length} requests:`, selectedIds, 'Reason:', reason);
            // Update selected requests to rejected status with reason
            alert(`${selectedIds.length} product requests have been rejected. Reason: ${reason}`);
          }
          break;
        default:
          console.log(`Bulk action ${actionId} performed on ${selectedIds.length} requests`, data);
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
      alert('Bulk action failed. Please try again.');
    }
  };

  const handleViewDetails = (request: ProductRequest) => {
    setSelectedRequest(request);
    setShowViewModal(true);
  };

  const handleApprove = (request: ProductRequest) => {
    setSelectedRequest(request);
    setApproveNotes('');
    setShowApproveModal(true);
  };

  const handleReject = (request: ProductRequest) => {
    setSelectedRequest(request);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const confirmApprove = () => {
    if (selectedRequest) {
      console.log('Approving request:', selectedRequest.id, 'Notes:', approveNotes);
      // Update the request status to approved
      setShowApproveModal(false);
      setSelectedRequest(null);
      setApproveNotes('');
      alert(`Product "${selectedRequest.productName}" has been approved successfully!`);
    }
  };

  const confirmReject = () => {
    if (selectedRequest && rejectReason.trim()) {
      console.log('Rejecting request:', selectedRequest.id, 'Reason:', rejectReason);
      // Update the request status to rejected with reason
      setShowRejectModal(false);
      setSelectedRequest(null);
      setRejectReason('');
      alert(`Product "${selectedRequest.productName}" has been rejected. Reason: ${rejectReason}`);
    } else {
      alert('Please provide a reason for rejection.');
    }
  };

  // Stats calculation
  const hubStats = {
    total: hubRequests.length,
    pending: hubRequests.filter(req => req.status === 'pending').length,
    approved: hubRequests.filter(req => req.status === 'approved').length,
    rejected: hubRequests.filter(req => req.status === 'rejected').length
  };

  const storeStats = {
    total: storeRequests.length,
    pending: storeRequests.filter(req => req.status === 'pending').length,
    approved: storeRequests.filter(req => req.status === 'approved').length,
    rejected: storeRequests.filter(req => req.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                  Product Approval
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                  Review and approve product requests from Hub and Store admins
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">
                    {hubStats.pending + storeStats.pending} Pending
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base text-gray-600 font-medium truncate">Hub Requests</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{hubStats.total}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Fish & Seafood Products</p>
                </div>
                <div className="p-3 sm:p-4 bg-blue-100 rounded-lg flex-shrink-0">
                  <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="text-center p-2 sm:p-3 bg-yellow-50 rounded-lg">
                  <p className="text-lg sm:text-xl font-bold text-yellow-600">{hubStats.pending}</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Pending</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
                  <p className="text-lg sm:text-xl font-bold text-green-600">{hubStats.approved}</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Approved</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-red-50 rounded-lg">
                  <p className="text-lg sm:text-xl font-bold text-red-600">{hubStats.rejected}</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Rejected</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base text-gray-600 font-medium truncate">Store Requests</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{storeStats.total}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Meat & Poultry Products</p>
                </div>
                <div className="p-3 sm:p-4 bg-green-100 rounded-lg flex-shrink-0">
                  <Store className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="text-center p-2 sm:p-3 bg-yellow-50 rounded-lg">
                  <p className="text-lg sm:text-xl font-bold text-yellow-600">{storeStats.pending}</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Pending</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
                  <p className="text-lg sm:text-xl font-bold text-green-600">{storeStats.approved}</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Approved</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-red-50 rounded-lg">
                  <p className="text-lg sm:text-xl font-bold text-red-600">{storeStats.rejected}</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Rejected</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Card className="p-4 sm:p-6">
            <div className="flex gap-1 sm:gap-2 border-b overflow-x-auto pb-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 border-b-2 transition-all whitespace-nowrap text-sm min-w-0 ${
                    activeTab === tab.id 
                      ? 'border-blue-600 text-blue-600 bg-blue-50' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  } rounded-t-lg`}
                >
                  <div className="flex items-center gap-1 sm:gap-2">
                    <tab.icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="font-medium truncate">{tab.label}</span>
                    <Badge variant="bg-gray-100 text-gray-600" className="text-xs flex-shrink-0">
                      {tab.count}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Product Approvals List with Bulk Actions */}
          <Card className="overflow-hidden">
            <ProductApprovalsList
              requests={getCurrentRequests()}
              onView={handleViewDetails}
              onApprove={handleApprove}
              onReject={handleReject}
              onBulkAction={handleBulkAction}
              title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Product Requests`}
            />
          </Card>

          {/* View Details Modal */}
          <Modal
            isOpen={showViewModal}
            onClose={() => setShowViewModal(false)}
            title="Product Request Details"
            size="xl"
          >
            {selectedRequest && (
              <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Product Images */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedRequest.images.map((img, idx) => (
                    <img 
                      key={idx}
                      src={img} 
                      alt={`${selectedRequest.productName} ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg bg-gray-100 border"
                    />
                  ))}
                </div>
                
                {/* Product Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedRequest.productName}</h3>
                      <p className="text-lg text-gray-700 mb-3">{selectedRequest.productNameTa}</p>
                      <p className="text-gray-600 leading-relaxed">{selectedRequest.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={selectedRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      selectedRequest.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                    </Badge>
                    <Badge variant={selectedRequest.priority === 'high' ? 'bg-red-100 text-red-800' : 
                      selectedRequest.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                      {selectedRequest.priority.charAt(0).toUpperCase() + selectedRequest.priority.slice(1)} Priority
                    </Badge>
                    <Badge variant="bg-blue-100 text-blue-800">
                      {selectedRequest.category}
                    </Badge>
                    <Badge variant={selectedRequest.sourceType === 'hub' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}>
                      {selectedRequest.sourceType.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                {/* Pricing Information */}
                <Card className="p-6 bg-green-50 border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-green-600">💰</span> Pricing Details
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Price per Unit</p>
                      <p className="text-3xl font-bold text-green-600">₹{selectedRequest.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Unit</p>
                      <p className="text-xl font-semibold text-gray-900">{selectedRequest.unit}</p>
                    </div>
                  </div>
                </Card>
                
                {/* Request Information */}
                <Card className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span>📋</span> Request Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600 font-medium">Request ID:</span>
                        <span className="font-semibold text-blue-600">{selectedRequest.id}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600 font-medium">Requested By:</span>
                        <span className="font-semibold">{selectedRequest.requestedBy}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600 font-medium">Role:</span>
                        <span className="font-semibold">{selectedRequest.requestedByRole}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600 font-medium">Request Date:</span>
                        <span className="font-semibold">{new Date(selectedRequest.requestDate).toLocaleDateString('en-IN', { 
                          year: 'numeric', month: 'long', day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600 font-medium">Source Type:</span>
                        <span className="font-semibold capitalize">{selectedRequest.sourceType}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600 font-medium">Category:</span>
                        <span className="font-semibold">{selectedRequest.category}</span>
                      </div>
                    </div>
                  </div>
                </Card>
                
                {/* Product Specifications */}
                <Card className="p-6 bg-blue-50 border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span>📊</span> Product Specifications
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(selectedRequest.specifications).map(([key, value]) => (
                      <div key={key} className="bg-white p-4 rounded-lg border">
                        <p className="text-sm text-gray-600 capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="font-semibold text-gray-900">{value}</p>
                      </div>
                    ))}
                  </div>
                </Card>
                
                {/* Rejection Reason */}
                {selectedRequest.status === 'rejected' && selectedRequest.reason && (
                  <Card className="p-6 bg-red-50 border-red-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-800 mb-2">Rejection Reason</h4>
                        <p className="text-red-700 leading-relaxed">{selectedRequest.reason}</p>
                      </div>
                    </div>
                  </Card>
                )}
                
                {/* Action Buttons */}
                {selectedRequest.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button 
                      variant="secondary"
                      onClick={() => setShowViewModal(false)}
                      className="flex-1"
                    >
                      Close
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowViewModal(false);
                        handleReject(selectedRequest);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                      Reject
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowViewModal(false);
                        handleApprove(selectedRequest);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            )}
      </Modal>

      {/* Approve Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Approve Product Request"
        size="md"
      >
        {selectedRequest && (
          <div className="space-y-6">
            <div>
              <p className="text-gray-600 mb-4">Are you sure you want to approve this product?</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold">{selectedRequest.productName}</p>
                <p className="text-sm text-gray-600">{selectedRequest.productNameTa}</p>
                <p className="text-sm text-gray-500">₹{selectedRequest.price} per {selectedRequest.unit}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Approval Notes (Optional)
              </label>
              <textarea
                value={approveNotes}
                onChange={(e) => setApproveNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                rows={3}
                placeholder="Add any notes or conditions for approval..."
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="secondary"
                onClick={() => setShowApproveModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmApprove}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Approve
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Product Request"
        size="md"
      >
        {selectedRequest && (
          <div className="space-y-6">
            <div>
              <p className="text-gray-600 mb-4">Are you sure you want to reject this product?</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold">{selectedRequest.productName}</p>
                <p className="text-sm text-gray-600">{selectedRequest.productNameTa}</p>
                <p className="text-sm text-gray-500">₹{selectedRequest.price} per {selectedRequest.unit}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={3}
                placeholder="Please provide a reason for rejection..."
                required
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="secondary"
                onClick={() => setShowRejectModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmReject}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Reject
              </Button>
            </div>
          </div>
        )}
      </Modal>
        </div>
      </div>
    </div>
  );
}
