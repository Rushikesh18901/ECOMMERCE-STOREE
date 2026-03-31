import { X, Star, ShoppingBag, Heart, Share2 } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

// Modal for displaying detailed product information
export default function ProductDetail({ product, onClose, onAddToCart }: ProductDetailProps) {
  if (!product) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity" onClick={onClose} />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors">
              <X className="w-6 h-6" />
            </button>

            <div className="grid md:grid-cols-2 gap-8 p-8 overflow-y-auto max-h-[90vh]">
              <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-96 object-cover rounded-xl" />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
                    <Badge variant="error">Out of Stock</Badge>
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">{product.category}</p>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h2>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{product.rating} ({product.reviews} reviews)</span>
                </div>

                <p className="text-4xl font-bold text-gray-900 mb-6">${product.price}</p>
                <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

                <div className="space-y-3 mt-auto">
                  <Button variant="primary" size="lg" className="w-full flex items-center justify-center gap-2" onClick={() => { onAddToCart(product); onClose(); }} disabled={!product.inStock}>
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart
                  </Button>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 flex items-center justify-center gap-2"><Heart className="w-5 h-5" /> Wishlist</Button>
                    <Button variant="outline" className="flex-1 flex items-center justify-center gap-2"><Share2 className="w-5 h-5" /> Share</Button>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Free shipping</span><span className="font-medium">On orders over $100</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Returns</span><span className="font-medium">30 day return policy</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Delivery</span><span className="font-medium">3-5 business days</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
