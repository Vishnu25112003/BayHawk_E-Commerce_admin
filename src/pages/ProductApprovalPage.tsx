import { useState } from 'react';
import { Card, Input, Badge } from '../components/ui';
import { Search, Eye, Check, X, Building2, Store, Package, User, Calendar, FileText, AlertCircle } from 'lucide-react';

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
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ProductRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [approveNotes, setApproveNotes] = useState('');

  // Separate requests by source
  const hubRequests = mockRequests.filter(req => req.sourceType === 'hub');
  const storeRequests = mockRequests.filter(req => req.sourceType === 'store');

  const filterRequests = (requestList: ProductRequest[]) => {
    return requestList.filter(request => {
      const matchesSearch = request.productName.toLowerCase().includes(search.toLowerCase()) ||
        request.productNameTa.includes(search) || request.category.toLowerCase().includes(search.toLowerCase()) ||
        request.requestedBy.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const filteredHubRequests = filterRequests(hubRequests);
  const filteredStoreRequests = filterRequests(storeRequests);

  const tabs = [
    { id: 'hub', label: 'Hub Requests', icon: Building2, count: filteredHubRequests.length },
    { id: 'store', label: 'Store Requests', icon: Store, count: filteredStoreRequests.length },
  ];

  const getCurrentRequests = () => {
    return activeTab === 'hub' ? filteredHubRequests : filteredStoreRequests;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const RequestCard = ({ request }: { request: ProductRequest }) => (
    <Card key={request.id} className="p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img 
            src={request.images[0]} 
            alt={request.productName}
            className="w-full lg:w-32 h-32 object-cover rounded-lg bg-gray-100"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">{request.productName}</h3>
                <Badge variant={getStatusColor(request.status)}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
                <Badge variant={getPriorityColor(request.priority)}>
                  {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                </Badge>
              </div>
              <p className="text-gray-600 mb-1">{request.productNameTa}</p>
              <p className="text-sm text-gray-500 mb-3">{request.description}</p>
            </div>
            
            <div className="text-right flex-shrink-0">
              <p className="text-2xl font-bold text-green-600">₹{request.price}</p>
              <p className="text-sm text-gray-500">per {request.unit}</p>
            </div>
          </div>

          {/* Request Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">{request.requestedBy}</p>
                <p className="text-xs text-gray-500">{request.requestedByRole}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Request Date</p>
                <p className="text-xs text-gray-500">{new Date(request.requestDate).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Category</p>
                <p className="text-xs text-gray-500">{request.category}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Request ID</p>
                <p className="text-xs text-gray-500">{request.id}</p>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">Product Specifications</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {Object.entries(request.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-600 capitalize">{key}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rejection Reason */}
          {request.status === 'rejected' && request.reason && (
            <div className="mb-4 p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-800">Rejection Reason</span>
              </div>
              <p className="text-sm text-red-700">{request.reason}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => handleViewDetails(request)}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-4 w-4" />
              View Details
            </button>
            
            {request.status === 'pending' && (
              <>
                <button 
                  onClick={() => handleApprove(request)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Check className="h-4 w-4" />
                  Approve
                </button>
                <button 
                  onClick={() => handleReject(request)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  // Stats calculation
  const hubStats = {
    total: filteredHubRequests.length,
    pending: filteredHubRequests.filter(req => req.status === 'pending').length,
    approved: filteredHubRequests.filter(req => req.status === 'approved').length,
    rejected: filteredHubRequests.filter(req => req.status === 'rejected').length
  };

  const storeStats = {
    total: filteredStoreRequests.length,
    pending: filteredStoreRequests.filter(req => req.status === 'pending').length,
    approved: filteredStoreRequests.filter(req => req.status === 'approved').length,
    rejected: filteredStoreRequests.filter(req => req.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Product Approval</h1>
        <p className="text-gray-600">Review and approve product requests from Hub and Store admins</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">Hub Requests</p>
              <p className="text-2xl font-bold">{hubStats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-lg font-semibold text-yellow-600">{hubStats.pending}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-green-600">{hubStats.approved}</p>
              <p className="text-xs text-gray-500">Approved</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-red-600">{hubStats.rejected}</p>
              <p className="text-xs text-gray-500">Rejected</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">Store Requests</p>
              <p className="text-2xl font-bold">{storeStats.total}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Store className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-lg font-semibold text-yellow-600">{storeStats.pending}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-green-600">{storeStats.approved}</p>
              <p className="text-xs text-gray-500">Approved</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-red-600">{storeStats.rejected}</p>
              <p className="text-xs text-gray-500">Rejected</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            <Badge variant="bg-gray-100 text-gray-600">{tab.count}</Badge>
          </button>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search requests..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="pl-10" 
            />
          </div>
          
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </Card>

      {/* Requests List */}
      {getCurrentRequests().length > 0 ? (
        <div className="space-y-6">
          {getCurrentRequests().map(request => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          {activeTab === 'hub' ? (
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          ) : (
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          )}
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab} requests found
          </h3>
          <p className="text-gray-500">
            {search || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : `No ${activeTab} product requests available`}
          </p>
        </Card>
      )}

      {/* View Details Modal */}
      {showViewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Product Request Details</h2>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Product Image */}
                <div>
                  <img 
                    src={selectedRequest.images[0]} 
                    alt={selectedRequest.productName}
                    className="w-full h-64 object-cover rounded-lg bg-gray-100"
                  />
                </div>
                
                {/* Product Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{selectedRequest.productName}</h3>
                    <p className="text-gray-600 mb-3">{selectedRequest.productNameTa}</p>
                    <div className="flex gap-2 mb-3">
                      <Badge variant={getStatusColor(selectedRequest.status)}>
                        {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                      </Badge>
                      <Badge variant={getPriorityColor(selectedRequest.priority)}>
                        {selectedRequest.priority.charAt(0).toUpperCase() + selectedRequest.priority.slice(1)} Priority
                      </Badge>
                    </div>
                    <p className="text-gray-700">{selectedRequest.description}</p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-green-600">₹{selectedRequest.price}</span>
                      <span className="text-gray-500">per {selectedRequest.unit}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Request Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t">
                <div className="space-y-3">
                  <h4 className="font-semibold">Request Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Request ID:</span>
                      <span className="font-medium">{selectedRequest.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Requested By:</span>
                      <span className="font-medium">{selectedRequest.requestedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Role:</span>
                      <span className="font-medium">{selectedRequest.requestedByRole}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{new Date(selectedRequest.requestDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Source:</span>
                      <span className="font-medium capitalize">{selectedRequest.sourceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{selectedRequest.category}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Product Specifications</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedRequest.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600 capitalize">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {selectedRequest.status === 'rejected' && selectedRequest.reason && (
                <div className="mt-6 p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-red-800">Rejection Reason</span>
                  </div>
                  <p className="text-red-700">{selectedRequest.reason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Approve Product Request</h2>
                <button 
                  onClick={() => setShowApproveModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-600 mb-2">Are you sure you want to approve this product?</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold">{selectedRequest.productName}</p>
                  <p className="text-sm text-gray-600">{selectedRequest.productNameTa}</p>
                  <p className="text-sm text-gray-500">₹{selectedRequest.price} per {selectedRequest.unit}</p>
                </div>
              </div>
              
              <div className="mb-6">
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
                <button 
                  onClick={() => setShowApproveModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmApprove}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Reject Product Request</h2>
                <button 
                  onClick={() => setShowRejectModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-600 mb-2">Are you sure you want to reject this product?</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold">{selectedRequest.productName}</p>
                  <p className="text-sm text-gray-600">{selectedRequest.productNameTa}</p>
                  <p className="text-sm text-gray-500">₹{selectedRequest.price} per {selectedRequest.unit}</p>
                </div>
              </div>
              
              <div className="mb-6">
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
                <button 
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmReject}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
