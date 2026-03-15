import { useEffect, useRef, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { API } from "../api";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import { shuffleArray } from "../utils/shuffle";

export default function Brand() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category") || "";
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const brandScrollRef = useRef(null);

  const fetchAllProducts = async (category = "") => {
    try {
      const params = category ? new URLSearchParams({ category }) : new URLSearchParams();
      const res = await fetch(`${API}/products?${params.toString()}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setProducts(shuffleArray(list));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchBrandProducts = async (brandSlug, category = "") => {
    try {
      if (category) {
        // Fetch products filtered by both brand and category
        const params = new URLSearchParams();
        params.append("brand", brandSlug);
        params.append("category", category);
        const res = await fetch(`${API}/products?${params.toString()}`);
        const data = await res.json();
        setProducts(shuffleArray(Array.isArray(data) ? data : []));
        
        // Also fetch brand details
        const brandRes = await fetch(`${API}/brands/${brandSlug}`);
        const brandData = await brandRes.json();
        setSelectedBrand(brandData);
      } else {
        // Fetch all products for the brand
        const res = await fetch(`${API}/brands/${brandSlug}`);
        const data = await res.json();
        setSelectedBrand(data);
        setProducts(shuffleArray(Array.isArray(data.products) ? data.products : []));
      }
    } catch (error) {
      console.error("Error fetching brand products:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    // Fetch all brands and categories
    Promise.all([
      fetch(`${API}/brands`).then(res => res.json()),
      fetch(`${API}/categories`).then(res => res.json())
    ])
      .then(([brandsData, categoriesData]) => {
        if (!isMounted) return;
        
        setBrands(brandsData);
        setCategories(categoriesData);
        
        // If slug is provided, find and set the brand; otherwise no brand selected (show all products)
        if (slug) {
          const brand = brandsData.find(b => b.slug === slug);
          if (brand) {
            setSelectedBrand(brand);
          } else {
            setSelectedBrand(null);
          }
        } else {
          setSelectedBrand(null);
        }
        setLoading(false);
      })
      .catch(error => {
        if (!isMounted) return;
        console.error("Error fetching data:", error);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  useEffect(() => {
    if (selectedBrand) {
      fetchBrandProducts(selectedBrand.slug, categoryFilter);
    } else {
      fetchAllProducts(categoryFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, selectedBrand?.slug]);

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    fetchBrandProducts(brand.slug, categoryFilter);
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (newCategory) {
      params.set("category", newCategory);
    } else {
      params.delete("category");
    }
    setSearchParams(params);
  };

  const clearCategoryFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    setSearchParams(params);
  };

  const scrollBrands = (direction) => {
    if (brandScrollRef.current) {
      brandScrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
          <p style={{ color: 'var(--foreground)', opacity: 0.7 }}>Loading brands...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16" style={{ backgroundColor: 'var(--background)' }}>
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-heading mb-4" style={{ color: 'var(--foreground)' }}>
            Shop by Brand
          </h2>
          <p className="body-text" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
            Discover products from your favorite brands
          </p>
        </div>

        {/* Brands – horizontal scroll */}
        <div className="relative mb-12">
          <button
            type="button"
            onClick={() => scrollBrands("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 border active:scale-95"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--secondary)';
            }}
            onMouseLeave={(e) => {
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
                onClick={() => handleBrandClick(brand)}
                className="flex-shrink-0 flex flex-col items-center min-w-[140px] group text-center"
              >
                <div
                  className="w-32 h-32 rounded-full overflow-hidden mb-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{ backgroundColor: 'var(--secondary)' }}
                >
                  {brand.imageUrl ? (
                    <img
                      src={brand.imageUrl}
                      alt={brand.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl">🏢</span>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                  {brand.name}
                </h3>
              </Link>
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollBrands("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 border active:scale-95"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--card)';
            }}
          >
            <svg className="w-5 h-5" style={{ color: 'var(--foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Products: all when no brand selected, or for selected brand */}
        {brands.length > 0 && (
          <div className="mt-12">
            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                {selectedBrand ? selectedBrand.name : "All Products"}
              </h3>
              {selectedBrand?.description && (
                <p className="body-text mb-4" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                  {selectedBrand.description}
                </p>
              )}

              {/* Category Filter */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                    Filter by Category:
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={handleCategoryChange}
                    className="px-4 py-2 rounded-lg border-2 text-sm transition-all duration-300 focus:outline-none"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: 'var(--background)',
                      color: 'var(--foreground)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {categoryFilter && (
                  <button
                    onClick={clearCategoryFilter}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: 'var(--secondary)',
                      color: 'var(--foreground)'
                    }}
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              {categoryFilter && (
                <p className="text-sm mb-4" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                  Showing products in {categories.find(c => c.slug === categoryFilter)?.name || categoryFilter} category
                </p>
              )}
            </div>
            {products.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState 
                logoSrc="/logo.jpeg"
                title={selectedBrand ? "No Products Available" : "No products available"}
                description={selectedBrand ? `No products available for ${selectedBrand.name} yet` : "Products will appear here once they are added."}
              />
            )}
          </div>
        )}

        {/* Show all brands if none selected */}
        {!selectedBrand && brands.length === 0 && (
          <EmptyState 
            logoSrc="/logo.jpeg"
            title="No Brands Available"
            description="Brands will appear here once they are added."
          />
        )}
      </div>
    </div>
  );
}
