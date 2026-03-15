import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { API } from "../api";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";
import { shuffleArray } from "../utils/shuffle";

export default function CategoriesPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const brandFilter = searchParams.get("brand") || "";
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const categoryScrollRef = useRef(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/categories`).then(res => res.json()),
      fetch(`${API}/brands`).then(res => res.json())
    ])
      .then(([categoriesData, brandsData]) => {
        setCategories(categoriesData);
        setBrands(brandsData);
        if (slug) {
          const category = categoriesData.find(cat => cat.slug === slug);
          if (category) {
            setSelectedCategory(category);
          } else {
            setSelectedCategory(null);
          }
        } else {
          setSelectedCategory(null);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryProducts(selectedCategory.slug, brandFilter);
    } else {
      fetchAllProducts(brandFilter);
    }
  }, [selectedCategory, brandFilter]);

  const fetchAllProducts = async (brand = "") => {
    setLoading(true);
    try {
      const params = brand ? new URLSearchParams({ brand }) : new URLSearchParams();
      const res = await fetch(`${API}/products?${params.toString()}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setProducts(shuffleArray(list));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryProducts = async (categorySlug, brand = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("category", categorySlug);
      if (brand) {
        params.append("brand", brand);
      }
      const res = await fetch(`${API}/products?${params.toString()}`);
      const data = await res.json();
      setProducts(shuffleArray(Array.isArray(data) ? data : []));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category.slug) {
      fetchCategoryProducts(category.slug, brandFilter);
    }
  };

  const handleBrandChange = (e) => {
    const newBrand = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (newBrand) {
      params.set("brand", newBrand);
    } else {
      params.delete("brand");
    }
    setSearchParams(params);
  };

  const clearBrandFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("brand");
    setSearchParams(params);
  };

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({
        left: direction === "left" ? -280 : 280,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--primary)' }}></div>
          <p style={{ color: 'var(--foreground)', opacity: 0.7 }}>Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16" style={{ backgroundColor: 'var(--background)' }}>
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Shop by Category
          </h2>
          <p className="text-lg" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
            Browse our wide range of gift categories
          </p>
        </div>

        {/* Categories – horizontal scroll */}
        <div className="relative mb-12">
          <button
            type="button"
            onClick={() => scrollCategories("left")}
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
            ref={categoryScrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                onClick={() => handleCategoryClick(category)}
                className="flex-shrink-0 w-[220px] sm:w-[260px] group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
                style={{ backgroundColor: 'var(--card)' }}
              >
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-bold text-white mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {category.name}
                  </h3>
                  <div className="h-0.5 w-0 bg-white group-hover:w-full transition-all duration-500 ease-out" />
                  <span className="text-white/80 text-sm mt-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                    Explore Collection &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollCategories("right")}
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

        {/* Products: all when no category selected, or for selected category */}
        {categories.length > 0 && (
          <div className="mt-12">
            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                {selectedCategory ? selectedCategory.name : "All Products"}
              </h3>
              {selectedCategory?.description && (
                <p className="text-lg mb-4" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                  {selectedCategory.description}
                </p>
              )}

              {/* Brand Filter */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                    Filter by Brand:
                  </label>
                  <select
                    value={brandFilter}
                    onChange={handleBrandChange}
                    className="px-4 py-2 rounded-lg border-2 text-sm transition-all duration-300 focus:outline-none"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: 'var(--card)',
                      color: 'var(--foreground)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                  >
                    <option value="">All Brands</option>
                    {brands.map((br) => (
                      <option key={br.id} value={br.slug}>
                        {br.name}
                      </option>
                    ))}
                  </select>
                </div>

                {brandFilter && (
                  <button
                    onClick={clearBrandFilter}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--secondary)',
                      color: 'var(--foreground)'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--secondary)'}
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              {brandFilter && (
                <p className="text-sm mb-4" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                  Showing products for {brands.find(b => b.slug === brandFilter)?.name || brandFilter}
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
                title={selectedCategory ? "No products available in this category yet" : "No products available"}
                description={selectedCategory ? "Products for this category will appear here once they are added." : "Products will appear here once they are added."}
              />
            )}
          </div>
        )}

        {/* Show all categories if none selected */}
        {!selectedCategory && categories.length === 0 && (
          <EmptyState
            logoSrc="/logo.jpeg"
            title="No categories available yet"
            description="Categories will appear here once they are added."
          />
        )}
      </div>
    </div>
  );
}
