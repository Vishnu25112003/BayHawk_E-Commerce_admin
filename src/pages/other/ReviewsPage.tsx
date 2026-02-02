import { useState } from 'react';
import { Card, Select, Table, Th, Td, Badge } from '../../components/ui';
import { Star, Image, Check, X, MessageSquare } from 'lucide-react';
import { formatDate, getStatusColor } from '../../utils/helpers';
import type { Review } from '../../types';

const mockReviews: Review[] = [
  { id: '1', type: 'product', targetId: 'p1', customerId: 'c1', customerName: 'Rajesh Kumar', rating: 5, text: 'Excellent quality fish! Very fresh and well packed.', photos: ['photo1.jpg'], status: 'approved', createdAt: '2024-01-07T10:30:00' },
  { id: '2', type: 'product', targetId: 'p2', customerId: 'c2', customerName: 'Priya Sharma', rating: 4, text: 'Good prawns, slightly smaller than expected but tasty.', status: 'pending', createdAt: '2024-01-07T09:15:00' },
  { id: '3', type: 'order', targetId: 'o1', customerId: 'c3', customerName: 'Arun Patel', rating: 5, text: 'Fast delivery and great packaging!', status: 'approved', createdAt: '2024-01-06T14:20:00' },
  { id: '4', type: 'recipe', targetId: 'r1', customerId: 'c4', customerName: 'Lakshmi Devi', rating: 3, text: 'Recipe was okay, needed more spices.', status: 'pending', createdAt: '2024-01-06T11:45:00' },
  { id: '5', type: 'product', targetId: 'p3', customerId: 'c5', customerName: 'Suresh Menon', rating: 1, text: 'Not fresh at all. Very disappointed.', status: 'rejected', createdAt: '2024-01-05T16:00:00' },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} className={`h-4 w-4 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ))}
  </div>
);

export function ReviewsPage() {
  const [reviews] = useState<Review[]>(mockReviews);
  const [activeTab, setActiveTab] = useState<'product' | 'recipe' | 'order'>('product');
  const [statusFilter, setStatusFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [photoFilter, setPhotoFilter] = useState('');

  const filteredReviews = reviews.filter(review => {
    const matchesType = review.type === activeTab;
    const matchesStatus = !statusFilter || review.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Review & Rating Management</h1>
        <p className="text-gray-600">Moderate and manage customer reviews</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-4">
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-yellow-100 p-3"><Star className="h-6 w-6 text-yellow-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Average Rating</p>
            <p className="text-2xl font-bold">{avgRating} / 5</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-blue-100 p-3"><MessageSquare className="h-6 w-6 text-blue-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Total Reviews</p>
            <p className="text-2xl font-bold">{reviews.length}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-yellow-100 p-3"><MessageSquare className="h-6 w-6 text-yellow-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold">{reviews.filter(r => r.status === 'pending').length}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-green-100 p-3"><Check className="h-6 w-6 text-green-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-2xl font-bold">{reviews.filter(r => r.status === 'approved').length}</p>
          </div>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Rating Distribution</h2>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = reviews.filter(r => r.rating === rating).length;
            const percent = (count / reviews.length) * 100;
            return (
              <div key={rating} className="flex items-center gap-3">
                <span className="w-8 text-sm">{rating} ⭐</span>
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percent}%` }} />
                </div>
                <span className="w-12 text-sm text-gray-500">{count} ({percent.toFixed(0)}%)</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {[
          { id: 'product', label: 'Product Reviews' },
          { id: 'recipe', label: 'Recipe Reviews' },
          { id: 'order', label: 'Order Ratings' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-4">
          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
            ]}
          />
          <Select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)} options={[{ value: '', label: 'All Ratings' }, { value: '5', label: '5 Stars' }, { value: '4', label: '4 Stars' }, { value: '3', label: '3 Stars' }, { value: '2', label: '2 Stars' }, { value: '1', label: '1 Star' }]} />
          <Select value={photoFilter} onChange={e => setPhotoFilter(e.target.value)} options={[{ value: '', label: 'All' }, { value: 'with_photos', label: 'With Photos' }, { value: 'without_photos', label: 'Without Photos' }]} />
        </div>
      </Card>

      {/* Reviews Table */}
      <Card className="p-0 overflow-hidden">
        <Table>
          <thead>
            <tr><Th>Customer</Th><Th>Rating</Th><Th>Review</Th><Th>Photos</Th><Th>Date</Th><Th>Status</Th><Th>Actions</Th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredReviews.map(review => (
              <tr key={review.id} className="hover:bg-gray-50">
                <Td><span className="font-medium">{review.customerName}</span></Td>
                <Td><StarRating rating={review.rating} /></Td>
                <Td><p className="max-w-xs truncate">{review.text}</p></Td>
                <Td>
                  {review.photos?.length ? (
                    <div className="flex gap-1">
                      {review.photos.map((_, i) => (
                        <div key={i} className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center">
                          <Image className="h-4 w-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  ) : '-'}
                </Td>
                <Td><span className="text-sm">{formatDate(review.createdAt)}</span></Td>
                <Td><Badge variant={getStatusColor(review.status)}>{review.status}</Badge></Td>
                <Td>
                  <div className="flex gap-2">
                    {review.status === 'pending' && (
                      <>
                        <button className="p-1 hover:bg-green-100 rounded text-green-600" title="Approve"><Check className="h-4 w-4" /></button>
                        <button className="p-1 hover:bg-red-100 rounded text-red-600" title="Reject"><X className="h-4 w-4" /></button>
                      </>
                    )}
                    <button className="p-1 hover:bg-gray-100 rounded" title="Reply"><MessageSquare className="h-4 w-4" /></button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
