import { useState } from 'react';
import { Card, Button, Input, Select, Badge, Modal } from '../../components/ui';
import { Plus, Search, Edit, Trash2, Eye, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { getStatusColor } from '../../utils/helpers';
import type { FAQ } from '../../types';

const mockFAQs: FAQ[] = [
  { id: '1', category: 'Orders & Delivery', question: 'How do I track my order?', answer: 'You can track your order from the "My Orders" section in the app. Click on any order to see real-time tracking updates.', isPublished: true, viewCount: 1234 },
  { id: '2', category: 'Orders & Delivery', question: 'What are the delivery slots available?', answer: 'We offer 3 delivery slots: Morning (7AM-9AM), Afternoon (1PM-3PM), and Evening (7PM-9PM).', isPublished: true, viewCount: 987 },
  { id: '3', category: 'Payments & Refunds', question: 'What payment methods do you accept?', answer: 'We accept Cash on Delivery (COD), UPI, Credit/Debit Cards, Net Banking, and Wallet payments.', isPublished: true, viewCount: 856 },
  { id: '4', category: 'Payments & Refunds', question: 'How long does a refund take?', answer: 'Refunds are processed within 5-7 business days. Wallet refunds are instant.', isPublished: true, viewCount: 654 },
  { id: '5', category: 'Products & Quality', question: 'How fresh are your products?', answer: 'All our seafood is sourced fresh daily from trusted fishermen and suppliers. We guarantee freshness.', isPublished: false, viewCount: 432 },
];

const categories = ['All', 'Orders & Delivery', 'Payments & Refunds', 'Products & Quality', 'Account & Membership', 'Cancellations & Returns'];

export function FAQPage() {
  const [faqs] = useState<FAQ[]>(mockFAQs);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || faq.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">FAQ Management</h1>
          <p className="text-gray-600">Manage frequently asked questions</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-5 w-5" /> Add FAQ
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-4">
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-blue-100 p-3"><HelpCircle className="h-6 w-6 text-blue-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Total FAQs</p>
            <p className="text-2xl font-bold">{faqs.length}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-green-100 p-3"><Eye className="h-6 w-6 text-green-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Total Views</p>
            <p className="text-2xl font-bold">{faqs.reduce((sum, f) => sum + f.viewCount, 0).toLocaleString()}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-purple-100 p-3"><HelpCircle className="h-6 w-6 text-purple-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Published</p>
            <p className="text-2xl font-bold">{faqs.filter(f => f.isPublished).length}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-yellow-100 p-3"><HelpCircle className="h-6 w-6 text-yellow-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Drafts</p>
            <p className="text-2xl font-bold">{faqs.filter(f => !f.isPublished).length}</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search FAQs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            options={categories.map(c => ({ value: c, label: c }))}
          />
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} options={[{ value: '', label: 'All Status' }, { value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft' }]} />
        </div>
      </Card>

      {/* FAQ List */}
      <Card className="p-0">
        <div className="divide-y divide-gray-200">
          {filteredFAQs.map(faq => (
            <div key={faq.id} className="p-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <Badge variant="bg-gray-100 text-gray-800">{faq.category}</Badge>
                  <span className="font-medium">{faq.question}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{faq.viewCount} views</span>
                  <Badge variant={getStatusColor(faq.isPublished ? 'active' : 'inactive')}>
                    {faq.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                  {expandedId === faq.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </div>
              {expandedId === faq.id && (
                <div className="mt-4 pl-4 border-l-2 border-primary-200">
                  <p className="text-gray-600 mb-4">{faq.answer}</p>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm"><Edit className="h-5 w-5 mr-1" /> Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-600"><Trash2 className="h-5 w-5 mr-1" /> Delete</Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Add FAQ Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New FAQ">
        <form className="space-y-4">
          <Select label="Category" options={categories.filter(c => c !== 'All').map(c => ({ value: c, label: c }))} />
          <Input label="Question" placeholder="Enter the question..." required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
              rows={4}
              placeholder="Enter the answer..."
              required
            />
          </div>
          <Input label="Keywords (for search)" placeholder="delivery, tracking, order" />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="publish" className="rounded" />
            <label htmlFor="publish" className="text-sm">Publish immediately</label>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">Save FAQ</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
