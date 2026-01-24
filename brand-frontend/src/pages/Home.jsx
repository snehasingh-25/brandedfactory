import { useEffect, useState, useRef } from "react";
import { API } from "../api";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import EmptyState from "../components/EmptyState";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [reels, setReels] = useState([]);
  const brandScrollRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        // Trending products chosen from admin panel (isTrending)
        setTrendingProducts((Array.isArray(data) ? data : []).filter(p => p?.isTrending).slice(0, 10));
      });

    fetch(`${API}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data));

    fetch(`${API}/brands`)
      .then(res => res.json())
      .then(data => setBrands(data));

    fetch(`${API}/reels`)
      .then(res => res.json())
      .then(data => {
        setReels(data);
        // Process Instagram embeds after reels are loaded
        setTimeout(() => {
          if (window.instgrm) {
            window.instgrm.Embeds.process();
          } else {
            // Load Instagram embed script if not already loaded
            const script = document.createElement('script');
            script.src = '//www.instagram.com/embed.js';
            script.async = true;
            script.onload = () => {
              if (window.instgrm) {
                window.instgrm.Embeds.process();
              }
            };
            document.body.appendChild(script);
          }
        }, 100);
      });
  }, []);

  // Map category names to emojis (fallback if no emoji in category)
  const getCategoryEmoji = (categoryName) => {
    const emojiMap = {
      "Bottles": "🍼",
      "Soft Toys": "🧸",
      "Gifts": "🎁",
      "Anniversary Gifts": "💍",
      "Birthday Gifts": "🎂",
      "Wedding Gifts": "💒",
      "Engagement Gifts": "💑",
      "Valentines Day": "❤️",
      "Retirement Gifts": "🎊",
      "Rakhi": "🧧",
      "Diwali": "🪔",
    };
    return emojiMap[categoryName] || "🎁";
  };

  const scrollBrands = (direction) => {
    if (brandScrollRef.current) {
      const scrollAmount = 300;
      brandScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen fade-in" style={{ backgroundColor: 'var(--background)' }}>
      {/* Hero Section */}
      <HeroSection />

      {/* Shop By Category Section */}
      {categories.length > 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Shop By Category</h2>
            <Link 
              to="/categories" 
              className="text-sm font-semibold inline-flex items-center gap-1 transition-all duration-300 hover:gap-2 group"
              style={{ color: 'var(--primary)' }}
            >
              View All
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
                style={{ backgroundColor: 'var(--card)' }}
              >
                {/* Background Image */}
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center text-6xl" style={{ backgroundColor: 'var(--secondary)' }}>
                    {getCategoryEmoji(category.name)}
                  </div>
                )}
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-bold text-white mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {category.name}
                  </h3>
                  <div className="h-0.5 w-0 bg-white group-hover:w-full transition-all duration-500 ease-out"></div>
                  <span className="text-white/80 text-sm mt-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                    Explore Collection &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <EmptyState 
            icon="📦"
            title="No Categories Available"
            description="Categories will appear here once they are added."
          />
        </div>
      )}

      {/* Trending Products Section */}
      {trendingProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" style={{ backgroundColor: 'var(--background)' }}>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Trending Products</h2>
            <Link
              to="/trending"
              className="text-sm font-semibold inline-flex items-center gap-1 transition-all duration-300 hover:gap-2 group"
              style={{ color: 'var(--primary)' }}
            >
              View All
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {trendingProducts.map((product, index) => (
              <div key={product.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shop By Brand Section */}
      {brands.length > 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ backgroundColor: 'var(--background)' }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Shop By Brand</h2>
            <Link 
              to="/brands" 
              className="text-sm font-semibold inline-flex items-center gap-1 transition-all duration-300 hover:gap-2 group"
              style={{ color: 'var(--primary)' }}
            >
              View All
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="relative">
            <button
              onClick={() => scrollBrands("left")}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full p-3 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 border active:scale-95"
              style={{ 
                borderColor: 'var(--border)',
                backgroundColor: 'var(--card)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.backgroundColor = 'var(--secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.backgroundColor = 'var(--card)';
              }}
            >
              <svg className="w-5 h-5" style={{ color: 'var(--foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div
              ref={brandScrollRef}
              className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 px-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/brands/${brand.slug}`}
                  className="flex-shrink-0 flex flex-col items-center min-w-[140px] group"
                >
                  <div className="w-32 h-32 rounded-full flex items-center justify-center text-5xl border-2 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 overflow-hidden cursor-pointer"
                    style={{ 
                      backgroundColor: 'var(--secondary)',
                      borderColor: 'var(--border)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                    }}
                  >
                    {brand.imageUrl ? (
                      <img
                        src={brand.imageUrl}
                        alt={brand.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--secondary)' }}>
                        <span className="text-5xl">🏢</span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-center transition-colors mt-2"
                    style={{ color: 'var(--foreground)', opacity: 0.8 }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '1';
                      e.target.style.color = 'var(--primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '0.8';
                      e.target.style.color = 'var(--foreground)';
                    }}
                  >
                    {brand.name}
                  </span>
                </Link>
              ))}
            </div>
            <button
              onClick={() => scrollBrands("right")}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full p-3 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 border active:scale-95"
              style={{ 
                borderColor: 'var(--border)',
                backgroundColor: 'var(--card)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.backgroundColor = 'var(--secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.backgroundColor = 'var(--card)';
              }}
            >
              <svg className="w-5 h-5" style={{ color: 'var(--foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}

      {/* Trending Gifts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ backgroundColor: 'var(--background)' }}>
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Products</h2>
          {products.length > 0 && (
            <Link
              to="/categories"
              className="text-sm font-semibold inline-flex items-center gap-1 transition-all duration-300 hover:gap-2 group"
              style={{ color: 'var(--primary)' }}
            >
              View All
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {products.length > 0 ? (
            products.map((p, index) => (
              <div key={p.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProductCard product={p} />
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState 
                icon="🎁"
                title="No Products Available"
                description="Products will appear here once they are added to the catalog."
              />
            </div>
          )}
        </div>
      </div>

      {/* Reels Section */}
      {reels.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ backgroundColor: 'var(--background)' }}>
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: 'var(--foreground)' }}>
            Follow Us <span style={{ color: 'var(--primary)' }}>@giftchoice</span>
          </h2>
          <div
            className="flex gap-6 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {reels.map((reel) => {
              // Extract YouTube video ID from URL
              const getYouTubeVideoId = (url) => {
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                const match = url.match(regExp);
                return match && match[2].length === 11 ? match[2] : null;
              };

              // Extract Instagram shortcode from URL
              const getInstagramShortcode = (url) => {
                const match = url.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
                return match ? match[1] : null;
              };

              if (reel.platform === "youtube") {
                const videoId = getYouTubeVideoId(reel.url);
                const embedUrl = videoId 
                  ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
                  : reel.url.includes('embed') 
                    ? reel.url 
                    : reel.url;

                return (
                  <div
                    key={reel.id}
                    className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group snap-start flex-none w-[85%] sm:w-[420px] lg:w-[460px]"
                    style={{ backgroundColor: 'var(--card)' }}
                  >
                    <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        src={embedUrl}
                        title={reel.title || "YouTube Reel"}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                      ></iframe>
                    </div>
                    {reel.title && (
                      <div className="p-3">
                        <p className="text-sm font-medium text-center" style={{ color: 'var(--foreground)' }}>
                          {reel.title}
                        </p>
                      </div>
                    )}
                  </div>
                );
              } else {
                // Instagram Reel - Use Instagram oEmbed API
                const shortcode = getInstagramShortcode(reel.url);
                
                return (
                  <div
                    key={reel.id}
                    className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group snap-start flex-none w-[85%] sm:w-[420px] lg:w-[460px]"
                    style={{ backgroundColor: 'var(--card)' }}
                  >
                    {shortcode ? (
                      <div className="relative w-full rounded-lg" style={{ paddingBottom: "100%", minHeight: '400px', backgroundColor: 'var(--card)' }}>
                        <blockquote
                          className="instagram-media"
                          data-instgrm-permalink={`https://www.instagram.com/reel/${shortcode}/`}
                          data-instgrm-version="14"
                          style={{
                            background: 'var(--card)',
                            border: 0,
                            borderRadius: '0.5rem',
                            margin: '1px',
                            maxWidth: '100%',
                            minWidth: '326px',
                            padding: 0,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%'
                          }}
                        >
                        </blockquote>
                      </div>
                    ) : (
                      <div className="relative w-full" style={{ paddingBottom: "100%" }}>
                        {reel.thumbnail ? (
                          <img
                            src={reel.thumbnail}
                            alt={reel.title || "Instagram Reel"}
                            className="absolute top-0 left-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--secondary)' }}>
                            <span className="text-6xl">🎬</span>
                          </div>
                        )}
                        <a
                          href={reel.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-all duration-300 rounded-lg"
                        >
                          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--card)' }}>
                            <svg
                              className="w-8 h-8 ml-1"
                              style={{ color: 'var(--foreground)' }}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </a>
                      </div>
                    )}
                    {reel.title && (
                      <div className="p-3">
                        <p className="text-sm font-medium text-center" style={{ color: 'var(--foreground)' }}>
                          {reel.title}
                        </p>
                      </div>
                    )}
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}

    </div>
  );
}
