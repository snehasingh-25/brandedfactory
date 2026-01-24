import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ImagePlaceholder from "./ImagePlaceholder";
import { useToast } from "./Toast";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const images = product.images ? (Array.isArray(product.images) ? product.images : JSON.parse(product.images)) : [];

  const handleAddToCart = () => {
    if (!product.sizes || product.sizes.length === 0) {
      showToast("This product has no sizes available", "error");
      return;
    }

    // If only one size, add directly. Otherwise, navigate to product detail
    if (product.sizes.length === 1) {
      const success = addToCart(product, product.sizes[0], 1);
      if (success) {
        showToast("Added to cart!", "success");
      } else {
        showToast("Failed to add to cart", "error");
      }
    } else {
      // Navigate to product detail to select size
      window.location.href = `/product/${product.id}`;
    }
  };

  // Get the lowest price from sizes
  const getLowestPrice = () => {
    if (!product.sizes || product.sizes.length === 0) return null;
    const prices = product.sizes.map(s => parseFloat(s.price));
    return Math.min(...prices);
  };

  const lowestPrice = getLowestPrice();

  return (
    <div className="rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group" style={{ backgroundColor: 'var(--card)' }}>
      {/* Product Image */}
      <Link to={`/product/${product.id}`}>
        <div className="relative h-64 flex items-center justify-center overflow-hidden cursor-pointer">
          {images.length > 0 ? (
            <img
              src={images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <ImagePlaceholder 
            width="100%" 
            height="100%" 
            icon="🎁"
            className={images.length > 0 ? 'hidden' : ''}
          />
          
          {/* Badges - Top Right */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
            {product.isNew && (
              <span className="px-2 py-0.5 text-xs rounded-full font-semibold shadow-sm" style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}>
                New
              </span>
            )}
            {product.badge && (
              <span className="px-2 py-0.5 text-xs rounded-full font-semibold shadow-sm" style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}>
                {product.badge}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-base font-semibold mb-1.5 line-clamp-1 transition-colors cursor-pointer" style={{ color: 'var(--foreground)' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--foreground)'}>
            {product.name}
          </h3>
        </Link>
        <p className="text-sm mb-3 line-clamp-2 min-h-[2.5rem]" style={{ color: 'var(--foreground)', opacity: 0.7 }}>{product.description}</p>

        {/* Price */}
        {lowestPrice && (
          <div className="mb-3">
            <span className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
              ₹{lowestPrice}
              {product.sizes.length > 1 && (
                <span className="text-sm font-normal ml-1" style={{ color: 'var(--foreground)', opacity: 0.6 }}>onwards</span>
              )}
            </span>
          </div>
        )}

        {/* Add Button */}
        <button
          onClick={handleAddToCart}
          className="w-full py-2.5 rounded-lg font-medium transition-all duration-300 hover:opacity-90 active:scale-95 text-sm flex items-center justify-center gap-2"
          style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Add
        </button>
      </div>
    </div>
  );
}
  