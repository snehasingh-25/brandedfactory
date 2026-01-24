import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { API } from "../api";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function CategoriesPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const brandFilter = searchParams.get("brand") || "";
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/categories`).then(res => res.json()),
      fetch(`${API}/brands`).then(res => res.json())
    ])
      .then(([categoriesData, occasionsData]) => {
        setCategories(categoriesData);
        setBrands(brandsData);
        if (slug) {
          const category = categoriesData.find(cat => cat.slug === slug);
          if (category) {
            setSelectedCategory(category);
          } else if (categoriesData.length > 0) {
            setSelectedCategory(categoriesData[0]);
          }
        } else if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (selectedCategory && slug) {
      fetchCategoryProducts(selectedCategory.slug, brandFilter);
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [selectedCategory, slug, brandFilter]);

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
      setProducts(data);
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

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              onClick={() => handleCategoryClick(category)}
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

        {/* Products for Selected Category */}
        {selectedCategory && slug && (
          <div className="mt-12">
            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                {selectedCategory.name}
              </h3>
              {selectedCategory.description && (
                <p className="text-lg mb-4" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                  {selectedCategory.description}
                </p>
              )}

              {/* Occasion Filter */}
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
              <div className="text-center py-16">
                <div className="inline-block p-6 rounded-full mb-4" style={{ backgroundColor: 'var(--secondary)' }}>
                  <span className="text-4xl">🎁</span>
                </div>
                <p className="font-medium" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                  No products available in this category yet
                </p>
              </div>
            )}
          </div>
        )}

        {/* Show all categories if none selected */}
        {!selectedCategory && categories.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-block p-6 rounded-full mb-4" style={{ backgroundColor: 'var(--secondary)' }}>
              <span className="text-4xl">📦</span>
            </div>
            <p className="font-medium" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
              No categories available yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
