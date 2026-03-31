import { Star, ShoppingBag } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import Badge from './Badge';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

// Display product card with image, rating, price, and add to cart button
export default function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  return (
    <Card hover className="overflow-hidden group cursor-pointer">
      <div onClick={() => onViewDetails(product)}>
        <div className="relative overflow-hidden bg-gray-100">
          <img src={product.image} alt={product.name} className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300" />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="error">Out of Stock</Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{product.category}</p>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-600">({product.reviews})</span>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900">${product.price}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <Button variant="primary" className="w-full flex items-center justify-center gap-2" onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} disabled={!product.inStock}>
          <ShoppingBag className="w-4 h-4" />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}
