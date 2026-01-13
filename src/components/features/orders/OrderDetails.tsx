import { StatusBadge } from '../../common';
import { formatCurrency, formatDateTime } from '../../../utils/helpers';
import type { Order } from '../../../types';

interface OrderDetailsProps {
  order: Order;
  className?: string;
}

export function OrderDetails({ order, className = '' }: OrderDetailsProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Order Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{order.id}</h2>
          <p className="text-gray-600">
            Placed on {formatDateTime(order.createdAt)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Customer Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">{order.customerName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-medium">{order.customerPhone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Order Source</p>
            <p className="font-medium capitalize">{order.source}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Delivery Slot</p>
            <p className="font-medium">{order.deliverySlot}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {order.items.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.productName}</h4>
                    <p className="text-sm text-gray-600">{item.variant}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Qty: {item.quantity}</p>
                    <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No items details available
            </div>
          )}
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Payment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Payment Method</p>
            <p className="font-medium uppercase">{order.paymentMethod}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Payment Status</p>
            <StatusBadge status={order.paymentStatus} />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}