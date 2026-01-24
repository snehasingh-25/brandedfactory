import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API } from "../api";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";
import Fuse from "fuse.js";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("category") || "";
  const brandFilter = searchParams.get("brand") || "";
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [matchedCategory, setMatchedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch categories, brands, and all products for suggestions
  useEffect(() => {
    Promise.all([
      fetch(`${API}/categories`).then(res => res.json()),
      fetch(`${API}/brands`).then(res => res.json()),
      fetch(`${API}/products`).then(res => res.json())
    ])
      .then(([categoriesData, brandsData, productsData]) => {
        setCategories(categoriesData);
        setBrands(brandsData);
        setAllProducts(productsData);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      setMatchedCategory(null);
      setSuggestedProducts([]);
      setShowSuggestions(false);
      
      const params = new URLSearchParams();
      if (query) params.append("search", query);
      if (categoryFilter) params.append("category", categoryFilter);
      if (brandFilter) params.append("brand", brandFilter);

      const url = `${API}/products?${params.toString()}`;
      
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setProducts(data);
        
        // If no results and we have a query, try fuzzy search and category matching
        if (data.length === 0 && query && !categoryFilter && !brandFilter && allProducts.length > 0) {
          // First, try fuzzy search on all products
          const fuse = new Fuse(allProducts, {
            keys: ['name', 'description', 'keywords'],
            threshold: 0.4, // 0 = perfect match, 1 = match anything
            includeScore: true,
            minMatchCharLength: 2,
          });

          const fuzzyResults = fuse.search(query);
          const fuzzyProducts = fuzzyResults.slice(0, 20).map(result => result.item);

          if (fuzzyProducts.length > 0) {
            // Show fuzzy search results
            setSuggestedProducts(fuzzyProducts);
            setMatchedCategory(null);
            setShowSuggestions(true);
          } else {
            // If fuzzy search also fails, try to find a matching category
            const matchingCategory = categories.find(cat => 
              cat.name.toLowerCase().includes(query.toLowerCase()) ||
              cat.slug.toLowerCase().includes(query.toLowerCase().replace(/\s+/g, '-'))
            );
            
            if (matchingCategory) {
              // Fetch all products from the matching category
              try {
                const categoryRes = await fetch(`${API}/products?category=${matchingCategory.slug}`);
                if (categoryRes.ok) {
                  const categoryProducts = await categoryRes.json();
                  setSuggestedProducts(categoryProducts);
                  setMatchedCategory(matchingCategory);
                  setShowSuggestions(true);
                }
              } catch (error) {
                console.error("Error fetching category products:", error);
              }
            }
          }
        } else {
          setSuggestedProducts([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Error searching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    // Only perform search if we have categories loaded or no query
    if (categories.length > 0 || !query) {
      performSearch();
    }
  }, [query, categoryFilter, brandFilter, categories]);

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

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    setSearchParams(params);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4" style={{ color: 'var(--foreground)' }}>Searching...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16" style={{ backgroundColor: 'var(--background)' }}>
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="section-heading mb-4" style={{ color: 'var(--foreground)' }}>
            Search Results
          </h2>
          
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                Category:
              </label>
              <select
                value={categoryFilter}
                onChange={handleCategoryChange}
                className="px-4 py-2 rounded-lg border text-sm transition-all duration-300 focus:outline-none"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--card)',
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

            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                Brand:
              </label>
              <select
                value={brandFilter}
                onChange={handleBrandChange}
                className="px-4 py-2 rounded-lg border text-sm transition-all duration-300 focus:outline-none"
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

            {(categoryFilter || brandFilter) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
                style={{
                  backgroundColor: 'var(--secondary)',
                  color: 'var(--foreground)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--secondary)'}
              >
                Clear Filters
              </button>
            )}
          </div>

          {(query || categoryFilter || brandFilter) && (
            <p className="body-text mb-4" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
              {products.length > 0 
                ? `Found ${products.length} product${products.length !== 1 ? 's' : ''}${query ? ` for "${query}"` : ''}${categoryFilter ? ` in ${categories.find(c => c.slug === categoryFilter)?.name || categoryFilter}` : ''}${brandFilter ? ` for ${brands.find(b => b.slug === brandFilter)?.name || brandFilter}` : ''}`
                : showSuggestions && matchedCategory
                ? `No exact matches found for "${query}". Showing products from "${matchedCategory.name}" category:`
                : `No products found${query ? ` for "${query}"` : ''}${categoryFilter ? ` in ${categories.find(c => c.slug === categoryFilter)?.name || categoryFilter}` : ''}${brandFilter ? ` for ${brands.find(b => b.slug === brandFilter)?.name || brandFilter}` : ''}`
              }
            </p>
          )}
        </div>

        {!query && !categoryFilter && !brandFilter ? (
          <EmptyState
            icon="🔍"
            title="Start Searching"
            description="Enter a search term or select filters to find products"
          />
        ) : products.length > 0 ? (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : showSuggestions && suggestedProducts.length > 0 ? (
          <div>
            {matchedCategory && (
              <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--secondary)' }}>
                <p className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                  No exact matches found for "{query}"
                </p>
                <p className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
                  Showing all products from the <strong>"{matchedCategory.name}"</strong> category:
                </p>
              </div>
            )}
            <div className="product-grid">
              {suggestedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            icon="😔"
            title="No products found"
            description="Try searching with different keywords or adjust your filters"
          />
        )}
      </div>
    </div>
  );
}
