import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { API } from "../api";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/Toast";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import ImagePlaceholder from "../components/ImagePlaceholder";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState("details");
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const imageRef = useRef(null);
  const zoomRef = useRef(null);

  // Get prices from selected size (3-price system)
  const getPrices = (size) => {
    if (!size) return null;
    const ourPrice = size.price || 0;
    const mrp = size.mrp || null;
    const marketPrice = size.marketPrice || null;
    const discount = mrp ? Math.round(((mrp - ourPrice) / mrp) * 100) : 0;
    return { mrp, marketPrice, ourPrice, discount };
  };

  useEffect(() => {
    fetch(`${API}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
        setLoading(false);
        
        // Fetch related products
        if (data.categoryId) {
          fetch(`${API}/products?category=${data.category?.slug || ''}`)
            .then(res => res.json())
            .then(products => {
              // Filter out current product and limit to 8
              const related = products
                .filter(p => p.id !== data.id)
                .slice(0, 8);
              setRelatedProducts(related);
            })
            .catch(err => console.error("Error fetching related products:", err));
        }
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  }, [id]);

  // Image zoom on hover (desktop)
  const handleImageMouseMove = (e) => {
    if (!imageRef.current || !zoomRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    zoomRef.current.style.transform = `scale(2) translate(-${xPercent}%, -${yPercent}%)`;
    zoomRef.current.style.transformOrigin = `${xPercent}% ${yPercent}%`;
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      showToast("Please select a size", "error");
      return;
    }

    const success = addToCart(product, selectedSize, quantity);
    if (success) {
      showToast("Added to cart!", "success");
    } else {
      showToast("Failed to add to cart", "error");
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    showToast(isWishlisted ? "Removed from wishlist" : "Added to wishlist", "success");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <h2 className="section-heading mb-4" style={{ color: 'var(--foreground)' }}>Product not found</h2>
          <Link to="/" className="body-text" style={{ color: 'var(--primary)' }}>
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images ? (Array.isArray(product.images) ? product.images : JSON.parse(product.images)) : [];
  const sortedSizes = Array.isArray(product?.sizes)
    ? [...product.sizes].sort((a, b) => {
        const order = [
          "XS",
          "S",
          "M",
          "L",
          "XL",
          "XXL",
          "XXXL",
          "28",
          "30",
          "32",
          "34",
          "36",
          "38",
          "40",
          "42",
          "44",
          "46",
          "Free Size",
        ];
        const ai = order.indexOf(String(a?.label ?? ""));
        const bi = order.indexOf(String(b?.label ?? ""));
        if (ai === -1 && bi === -1) return String(a?.label ?? "").localeCompare(String(b?.label ?? ""));
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      })
    : [];

  const prices = selectedSize ? getPrices(selectedSize) : null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 pb-4">
        <nav className="flex items-center space-x-2 text-sm">
          <Link to="/" className="hover:underline" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
            Home
          </Link>
          <span style={{ color: 'var(--foreground)', opacity: 0.5 }}>/</span>
          <Link to="/categories" className="hover:underline" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
            Categories
          </Link>
          {product.category && (
            <>
              <span style={{ color: 'var(--foreground)', opacity: 0.5 }}>/</span>
              <Link
                to={`/category/${product.category.slug}`}
                className="hover:underline"
                style={{ color: 'var(--foreground)', opacity: 0.7 }}
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span style={{ color: 'var(--foreground)', opacity: 0.5 }}>/</span>
          <span style={{ color: 'var(--foreground)' }}>{product.name}</span>
        </nav>
      </div>

      {/* Main Product Section */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Section - Media Gallery */}
          <div className="space-y-4">
            {/* Large Primary Image with Zoom */}
            <div
              ref={imageRef}
              className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
              style={{ backgroundColor: 'var(--secondary)' }}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleImageMouseMove}
            >
              {images.length > 0 ? (
                <>
                  <img
                    src={images[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {isZoomed && (
                    <div
                      ref={zoomRef}
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: `url(${images[selectedImageIndex]})`,
                        backgroundSize: '200%',
                        backgroundPosition: 'center',
                        opacity: 0.8,
                        transition: 'transform 0.1s ease-out'
                      }}
                    />
                  )}
                </>
              ) : (
                <ImagePlaceholder width="100%" height="100%" icon="🎁" />
              )}
            </div>

            {/* Vertical Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-primary scale-105'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    style={{
                      borderColor: selectedImageIndex === idx ? 'var(--primary)' : 'transparent'
                    }}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Lifestyle Image Slot (Optional) */}
            {images.length > 0 && (
              <div className="hidden md:block relative aspect-[16/9] rounded-2xl overflow-hidden">
                <img
                  src={images[0]}
                  alt={`${product.name} lifestyle`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}
          </div>

          {/* Right Section - Product Info (Sticky) */}
          <div
            className="lg:sticky lg:top-20 self-start lg:rounded-2xl lg:p-6 lg:shadow-sm border"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              maxHeight: 'calc(100vh - 100px)',
              overflowY: 'auto'
            }}
          >
            <div className="space-y-6">
              {/* Brand Name */}
              {product.brands && product.brands.length > 0 && (
                <p className="text-sm font-medium uppercase tracking-wider" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                  {product.brands[0].name}
                </p>
              )}

              {/* Product Title */}
              <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--foreground)' }}>
                {product.name}
              </h1>

              {/* Pricing Section - 3 Price System */}
              {prices && (
                <div className="space-y-2 py-4 border-t border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--foreground)' }}>
                      ₹{prices.ourPrice.toFixed(2)}
                    </span>
                    {prices.discount > 0 && prices.mrp && (
                      <span
                        className="px-3 py-1 rounded-full text-sm font-bold"
                        style={{ backgroundColor: 'var(--sale-red)', color: 'white' }}
                      >
                        {prices.discount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    {prices.mrp && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm line-through" style={{ color: 'var(--foreground)', opacity: 0.4 }}>
                          MRP: ₹{prices.mrp.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {prices.marketPrice && (
                      <span className="text-sm line-through" style={{ color: 'var(--foreground)', opacity: 0.5 }}>
                        Market Price: ₹{prices.marketPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-2" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                    Inclusive of all taxes
                  </p>
                </div>
              )}

              {/* Variant Selection */}
              <div className="space-y-4">
                {/* Size Selector */}
                {sortedSizes.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                      Size: {selectedSize?.label || 'Select a size'}
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {sortedSizes.map((size) => {
                        const isAvailable = true; // In production, check size.available or stock
                        const isSelected = selectedSize?.id === size.id;
                        return (
                          <button
                            key={size.id}
                            onClick={() => isAvailable && setSelectedSize(size)}
                            disabled={!isAvailable}
                            className={`p-3 rounded-lg border-2 font-semibold text-sm transition-all ${
                              isSelected
                                ? 'border-primary scale-105'
                                : isAvailable
                                ? 'border-gray-300 hover:border-primary hover:scale-105'
                                : 'border-gray-200 opacity-40 cursor-not-allowed'
                            }`}
                            style={{
                              borderColor: isSelected ? 'var(--primary)' : isAvailable ? 'var(--border)' : 'var(--border)',
                              backgroundColor: isSelected ? 'var(--secondary)' : 'transparent',
                              color: isAvailable ? 'var(--foreground)' : 'var(--foreground)',
                              opacity: isAvailable ? 1 : 0.4
                            }}
                          >
                            {size.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                  Quantity
                </label>
                <div className="flex items-center gap-3 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border flex items-center justify-center font-bold transition-all hover:scale-105 active:scale-95"
                    style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  >
                    −
                  </button>
                  <span className="text-xl font-bold w-12 text-center" style={{ color: 'var(--foreground)' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border flex items-center justify-center font-bold transition-all hover:scale-105 active:scale-95"
                    style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Call To Action */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                  className="flex-1 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                >
                  Add to Bag
                </button>
                <button
                  onClick={handleWishlist}
                  className="px-6 py-4 rounded-xl border-2 transition-all hover:scale-105 active:scale-95"
                  style={{
                    borderColor: 'var(--border)',
                    color: isWishlisted ? 'var(--sale-red)' : 'var(--foreground)',
                    backgroundColor: isWishlisted ? 'var(--secondary)' : 'transparent'
                  }}
                >
                  <svg className="w-6 h-6" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Delivery & Trust */}
              <div className="space-y-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span style={{ color: 'var(--foreground)' }}>100% Original Product</span>
                </div>
              </div>

              {/* Social Proof & Trust Boosters */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-1 text-xs">
                  <svg className="w-4 h-4" style={{ color: 'var(--primary)' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span style={{ color: 'var(--foreground)', opacity: 0.7 }}>Secure Payment</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <svg className="w-4 h-4" style={{ color: 'var(--primary)' }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                  <span style={{ color: 'var(--foreground)', opacity: 0.7 }}>Fast Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Section */}
        <div className="mt-12 space-y-6">
          {/* Short Description */}
          <div className="prose max-w-none" style={{ color: 'var(--foreground)' }}>
            <p className="body-text leading-relaxed">{product.description}</p>
          </div>

          {/* Key Highlights */}

          {/* Accordion Tabs */}
          <div className="space-y-4">
            {[
              { id: "details", label: "Product Details", content: product.details || "" },
              { id: "specifications", label: "Specifications", content: product.specifications || "" },
              { id: "care", label: "Care Instructions", content: product.careInstructions || "" },
              { id: "returns", label: "Return & Refund Policy", content: product.returnPolicy || "" },
            ]
              .filter((tab) => String(tab.content || "").trim().length > 0)
              .map((tab) => (
              <div key={tab.id} className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                <button
                  onClick={() => setActiveAccordion(activeAccordion === tab.id ? "" : tab.id)}
                  className="w-full px-6 py-4 flex items-center justify-between font-semibold transition-all hover:bg-opacity-50"
                  style={{ backgroundColor: activeAccordion === tab.id ? 'var(--secondary)' : 'transparent', color: 'var(--foreground)' }}
                >
                  <span>{tab.label}</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${activeAccordion === tab.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeAccordion === tab.id && (
                  <div className="px-6 py-4 border-t whitespace-pre-line" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    {tab.content}
                  </div>
                )}
              </div>
              ))}
          </div>

          {/* You May Also Like */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 pt-12 border-t" style={{ borderColor: 'var(--border)' }}>
              <h2 className="section-heading mb-6" style={{ color: 'var(--foreground)' }}>
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky CTA Bar (Mobile Only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 border-t shadow-lg z-50" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto flex gap-3">
          <button
            onClick={handleWishlist}
            className="px-4 py-3 rounded-xl border-2"
            style={{
              borderColor: 'var(--border)',
              color: isWishlisted ? 'var(--sale-red)' : 'var(--foreground)'
            }}
          >
            <svg className="w-6 h-6" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className="flex-1 py-3 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            Add to Bag {prices && `- ₹${(prices.ourPrice * quantity).toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
