import { useState } from 'react';
import { Button, Badge, Modal } from '../../ui';
import { Crown, AlertTriangle, Clock, Package, Plus, Check } from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';
import type { Product, ProductVariant } from '../../../types';

interface RareProductSelectorProps {
  product: Product;
  variant: ProductVariant;
  onAddToOrder: (productId: string, variantId: string, alternateProductId?: string, alternateVariantId?: string) => void;
  availableProducts: Product[];
  className?: string;
}

export function RareProductSelector({ 
  product, 
  variant, 
  onAddToOrder, 
  availableProducts,
  className = '' 
}: RareProductSelectorProps) {
  const [showAlternateModal, setShowAlternateModal] = useState(false);
  const [selectedAlternate, setSelectedAlternate] = useState<{
    productId: string;
    variantId: string;
  } | null>(null);

  // Get similar products for alternates (same category, not rare)
  const alternateProducts = availableProducts.filter(p => 
    p.category === product.category && 
    !p.isRare && 
    p.id !== product.id &&
    p.isActive
  );

  const handleAddRareProduct = () => {
    if (product.isRare) {
      setShowAlternateModal(true);
    } else {
      onAddToOrder(product.id, variant.id);
    }
  };

  const handleConfirmWithAlternate = () => {
    onAddToOrder(
      product.id, 
      variant.id, 
      selectedAlternate?.productId, 
      selectedAlternate?.variantId
    );
    setShowAlternateModal(false);
    setSelectedAlternate(null);
  };

  const handleConfirmWithoutAlternate = () => {
    onAddToOrder(product.id, variant.id);
    setShowAlternateModal(false);
  };

  return (
    <>
      <div className={`border rounded-lg p-3 hover:border-blue-300 transition-colors ${className}`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{product.nameEn}</h4>
            <p className="text-sm text-gray-600">{product.nameTa}</p>
            <p className="text-xs text-gray-500">{product.sku}</p>
          </div>
          <div className="flex gap-1">
            {product.isBestSeller && (
              <Badge variant="warning">Best Seller</Badge>
            )}
            {product.isRare && (
              <Badge variant="danger" className="flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Rare
              </Badge>
            )}
            {product.deliveryType === 'exotic' && (
              <Badge variant="purple" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Exotic
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex-1">
              <p className="text-sm font-medium">{variant.type} - {variant.size}</p>
              <p className="text-xs text-gray-600">{variant.serves} • Stock: {variant.stock}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-green-600">
                  {formatCurrency(variant.price)}
                </span>
                {variant.discount && (
                  <Badge variant="success">{variant.discount}% off</Badge>
                )}
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleAddRareProduct}
              disabled={variant.stock === 0}
              className={product.isRare ? 'bg-orange-600 hover:bg-orange-700' : ''}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Rare Product Warning */}
        {product.isRare && (
          <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
              <div className="text-xs text-orange-800">
                <p className="font-medium">Rare Product Notice:</p>
                <p>Available for next slot delivery. Please select an alternate product in case this item is unavailable during procurement.</p>
              </div>
            </div>
          </div>
        )}

        {/* Exotic Product Info */}
        {product.deliveryType === 'exotic' && (
          <div className="mt-3 p-2 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-purple-600 mt-0.5" />
              <div className="text-xs text-purple-800">
                <p className="font-medium">Exotic Product:</p>
                <p>Requires 2-7 days for delivery. Imported delicacy with premium quality.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alternate Product Selection Modal */}
      <Modal
        isOpen={showAlternateModal}
        onClose={() => setShowAlternateModal(false)}
        title="Select Alternate Product"
        size="lg"
      >
        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-600 flex items-center justify-center">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-900">Rare Product Selected</h3>
                <p className="text-sm text-orange-800 mt-1">
                  <span className="font-medium">{product.nameEn}</span> is a rare product. 
                  If this item is not available during procurement, we will deliver your selected alternate product.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Choose an Alternate Product (Recommended)</h4>
            
            {alternateProducts.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {alternateProducts.map((altProduct) => (
                  <div key={altProduct.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{altProduct.nameEn}</h5>
                        <p className="text-sm text-gray-600">{altProduct.nameTa}</p>
                      </div>
                      {altProduct.isBestSeller && (
                        <Badge variant="warning">Best Seller</Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {altProduct.variants.map((altVariant) => (
                        <div key={altVariant.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{altVariant.type} - {altVariant.size}</p>
                            <p className="text-xs text-gray-600">{altVariant.serves}</p>
                            <span className="text-sm font-semibold text-green-600">
                              {formatCurrency(altVariant.price)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedAlternate({
                              productId: altProduct.id,
                              variantId: altVariant.id
                            })}
                            className={`p-2 rounded-lg border-2 transition-colors ${
                              selectedAlternate?.productId === altProduct.id && 
                              selectedAlternate?.variantId === altVariant.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {selectedAlternate?.productId === altProduct.id && 
                             selectedAlternate?.variantId === altVariant.id ? (
                              <Check className="h-4 w-4 text-blue-600" />
                            ) : (
                              <div className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No alternate products available in this category</p>
              </div>
            )}
          </div>

          {selectedAlternate && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  <span className="font-medium">Alternate selected:</span> {
                    alternateProducts.find(p => p.id === selectedAlternate.productId)?.nameEn
                  }
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAlternateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleConfirmWithoutAlternate}
              className="flex-1"
            >
              Add Without Alternate
            </Button>
            <Button
              type="button"
              onClick={handleConfirmWithAlternate}
              disabled={!selectedAlternate}
              className="flex-1"
            >
              Add with Alternate
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}