import { Button, Badge } from '../../ui';
import { Crown, Clock, Package, AlertTriangle, X, Minus, Plus, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';
import type { Product } from '../../../types';

interface OrderItem {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  alternateProductId?: string;
  alternateVariantId?: string;
}

interface EnhancedOrderItemProps {
  item: OrderItem;
  product: Product;
  variant: any;
  alternateProduct?: Product;
  alternateVariant?: any;
  index: number;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  className?: string;
}

export function EnhancedOrderItem({
  item,
  product,
  variant,
  alternateProduct,
  alternateVariant,
  index,
  onUpdateQuantity,
  onRemoveItem,
  className = ''
}: EnhancedOrderItemProps) {
  const isRare = product.isRare;
  const isExotic = product.deliveryType === 'exotic';
  const hasAlternate = alternateProduct && alternateVariant;

  return (
    <div className={`border rounded-lg p-4 space-y-3 ${className}`}>
      {/* Main Product */}
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h5 className="font-medium text-gray-900 flex items-center gap-2">
                {product.nameEn}
                {isRare && (
                  <Badge variant="danger" className="flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    Rare
                  </Badge>
                )}
                {isExotic && (
                  <Badge variant="purple" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Exotic
                  </Badge>
                )}
              </h5>
              <p className="text-sm text-gray-600">{product.nameTa}</p>
              <p className="text-sm text-gray-500">{variant.type} - {variant.size}</p>
              <p className="text-xs text-gray-500">{variant.serves}</p>
            </div>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemoveItem(index)}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onUpdateQuantity(index, item.quantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onUpdateQuantity(index, item.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {formatCurrency(item.price * item.quantity)}
              </p>
              <p className="text-sm text-gray-600">
                {formatCurrency(item.price)} each
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alternate Product (for Rare items) */}
      {hasAlternate && (
        <div className="border-t pt-3">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Alternate Product (if rare item unavailable)</span>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <h6 className="font-medium text-orange-900">{alternateProduct.nameEn}</h6>
                <p className="text-sm text-orange-700">{alternateProduct.nameTa}</p>
                <p className="text-sm text-orange-600">{alternateVariant.type} - {alternateVariant.size}</p>
                <p className="text-xs text-orange-600">{alternateVariant.serves}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-orange-900">
                  {formatCurrency(alternateVariant.price * item.quantity)}
                </p>
                <p className="text-sm text-orange-700">
                  {formatCurrency(alternateVariant.price)} each
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Type Information */}
      <div className="border-t pt-3">
        {isRare && (
          <div className="flex items-start gap-2 p-2 bg-orange-50 border border-orange-200 rounded">
            <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
            <div className="text-xs text-orange-800">
              <p className="font-medium">Rare Product Notice:</p>
              <p>Available for next slot delivery. {hasAlternate ? 'Alternate product selected.' : 'No alternate selected - may be unavailable.'}</p>
            </div>
          </div>
        )}
        
        {isExotic && (
          <div className="flex items-start gap-2 p-2 bg-purple-50 border border-purple-200 rounded">
            <Clock className="h-4 w-4 text-purple-600 mt-0.5" />
            <div className="text-xs text-purple-800">
              <p className="font-medium">Exotic Product:</p>
              <p>Requires 2-7 days for delivery. Imported delicacy with premium quality assurance.</p>
            </div>
          </div>
        )}
        
        {!isRare && !isExotic && (
          <div className="flex items-start gap-2 p-2 bg-green-50 border border-green-200 rounded">
            <Package className="h-4 w-4 text-green-600 mt-0.5" />
            <div className="text-xs text-green-800">
              <p className="font-medium">Regular Product:</p>
              <p>Available for same-day or next-day delivery based on selected slot.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}