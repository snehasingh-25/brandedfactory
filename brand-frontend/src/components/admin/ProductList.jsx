import { useState, useMemo, useEffect } from "react";
import { API } from "../../api";
import EmptyState from "../EmptyState";

export default function ProductList({ products, onEdit, onDelete }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = safeProducts
      .map(p => p.category?.name)
      .filter(Boolean);
    return [...new Set(cats)];
  }, [safeProducts]);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    return safeProducts.filter(product => {
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !categoryFilter || 
        product.category?.name === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [safeProducts, searchQuery, categoryFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API}/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("Product deleted successfully!");
        onDelete();
      } else {
        const data = await res.json();
        alert("Error: " + (data.error || data.message));
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="rounded-xl shadow-md overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h3 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
            All Products ({filteredProducts.length})
          </h3>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 rounded-lg text-sm transition-all duration-300 focus:outline-none"
              style={{
                border: '2px solid var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                minWidth: '200px'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 rounded-lg text-sm transition-all duration-300 focus:outline-none"
              style={{
                border: '2px solid var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {safeProducts.length === 0 ? (
        <div className="p-12">
          <EmptyState 
            icon="📦"
            title="No Products Yet"
            description="Add your first product using the form above!"
          />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12">
          <EmptyState 
            icon="🔍"
            title="No Products Found"
            description="Try adjusting your search or filter criteria."
          />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: 'var(--secondary)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase" style={{ color: 'var(--foreground)' }}>Image</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase" style={{ color: 'var(--foreground)' }}>Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase" style={{ color: 'var(--foreground)' }}>Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase" style={{ color: 'var(--foreground)' }}>Badges</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase" style={{ color: 'var(--foreground)' }}>Sizes</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase" style={{ color: 'var(--foreground)' }}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {paginatedProducts.map((product) => {
                  const images = product.images ? (Array.isArray(product.images) ? product.images : JSON.parse(product.images)) : [];
                  return (
                    <tr key={product.id} className="transition-colors" style={{ backgroundColor: 'var(--card)' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--card)'}
                    >
                      <td className="px-6 py-4">
                        {images.length > 0 ? (
                          <img
                            src={images[0]}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl" style={{ backgroundColor: 'var(--secondary)' }}>
                            🎁
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold" style={{ color: 'var(--foreground)' }}>{product.name}</div>
                        <div className="text-sm line-clamp-1" style={{ color: 'var(--foreground)', opacity: 0.7 }}>{product.description}</div>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: 'var(--foreground)' }}>
                        {product.category?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {product.isNew && (
                            <span className="px-2 py-1 text-xs rounded-full font-semibold" style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}>
                              New
                            </span>
                          )}
                          {product.isTrending && (
                            <span className="px-2 py-1 text-xs rounded-full font-semibold" style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}>
                              Trending
                            </span>
                          )}
                          {product.badge && (
                            <span className="px-2 py-1 text-xs rounded-full font-semibold" style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}>
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: 'var(--foreground)' }}>
                        {product.sizes?.length || 0} sizes
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => onEdit(product)}
                            className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105"
                            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105"
                            style={{ backgroundColor: 'var(--sale-red)', color: 'var(--primary-foreground)' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <div className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: currentPage === 1 ? 'transparent' : 'var(--secondary)',
                    color: 'var(--foreground)'
                  }}
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-10 h-10 rounded-lg text-sm font-medium transition-all duration-300"
                        style={{
                          backgroundColor: currentPage === pageNum ? 'var(--primary)' : 'var(--secondary)',
                          color: currentPage === pageNum ? 'var(--primary-foreground)' : 'var(--foreground)'
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: currentPage === totalPages ? 'transparent' : 'var(--secondary)',
                    color: 'var(--foreground)'
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
