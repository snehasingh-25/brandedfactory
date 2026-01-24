import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { API } from "../api";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

export default function Brand() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category") || "";
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBrandProducts = async (brandSlug, category = "") => {
    try {
      if (category) {
        // Fetch products filtered by both brand and category
        const params = new URLSearchParams();
        params.append("brand", brandSlug);
        params.append("category", category);
        const res = await fetch(`${API}/products?${params.toString()}`);
        const data = await res.json();
        setProducts(data || []);
        
        // Also fetch brand details
        const brandRes = await fetch(`${API}/brands/${brandSlug}`);
        const brandData = await brandRes.json();
        setSelectedBrand(brandData);
      } else {
        // Fetch all products for the brand
        const res = await fetch(`${API}/brands/${brandSlug}`);
        const data = await res.json();
        setSelectedBrand(data);
        setProducts(data.products || []);
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
        
        // If slug is provided, find and set the brand
        if (slug) {
          const brand = brandsData.find(b => b.slug === slug);
          if (brand) {
            setSelectedBrand(brand);
          }
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
    if (selectedBrand && slug) {
      fetchBrandProducts(selectedBrand.slug, categoryFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, slug, selectedBrand?.slug]);

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

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to={`/brands/${brand.slug}`}
              onClick={() => handleBrandClick(brand)}
              className="group text-center"
            >
              <div
                className="w-full aspect-square rounded-full overflow-hidden mb-3 mx-auto transition-all duration-300 group-hover:scale-125 shadow-md group-hover:shadow-lg"
                style={{ 
                  backgroundColor: 'var(--secondary)',
                  maxWidth: '150px'
                }}
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

        {/* Products for Selected Brand */}
        {selectedBrand && (
          <div className="mt-12">
            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                {selectedBrand.name}
              </h3>
              {selectedBrand.description && (
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
                icon="🎁"
                title="No Products Available"
                description={`No products available for ${selectedBrand.name} yet`}
              />
            )}
          </div>
        )}

        {/* Show all brands if none selected */}
        {!selectedBrand && brands.length === 0 && (
          <EmptyState 
            icon="🏢"
            title="No Brands Available"
            description="Brands will appear here once they are added."
          />
        )}
      </div>
    </div>
  );
}
