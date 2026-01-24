import { useState, useMemo, useEffect } from "react";
import { API } from "../../api";
import EmptyState from "../EmptyState";

export default function BrandList({ brands, onEdit, onDelete }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, inactive
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const handleDelete = async (brandId) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API}/brands/${brandId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("Brand deleted successfully!");
        onDelete();
      } else {
        const data = await res.json();
        alert("Error: " + (data.error || data.message));
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // Filter brands
  const filteredBrands = useMemo(() => {
    return brands.filter(brand => {
      const matchesSearch = !searchQuery || 
        brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.slug?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "active" && brand.isActive) ||
        (statusFilter === "inactive" && !brand.isActive);
      
      return matchesSearch && matchesStatus;
    });
  }, [brands, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const paginatedBrands = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBrands.slice(start, start + itemsPerPage);
  }, [filteredBrands, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  return (
    <div className="rounded-xl shadow-md overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h3 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
            All Brands ({filteredBrands.length})
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search brands..."
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg text-sm transition-all duration-300 focus:outline-none"
              style={{
                border: '2px solid var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {brands.length === 0 ? (
        <div className="p-12">
          <EmptyState 
            icon="🎉"
            title="No Brands Yet"
            description="Add your first brand using the form above!"
          />
        </div>
      ) : filteredBrands.length === 0 ? (
        <div className="p-12">
          <EmptyState 
            icon="🔍"
            title="No Brands Found"
            description="Try adjusting your search or filter criteria."
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {paginatedBrands.map((brand) => (
              <div
                key={brand.id}
                className={`border-2 rounded-lg p-4 transition overflow-hidden ${
                  !brand.isActive ? "opacity-75" : ""
                }`}
                style={{ 
                  borderColor: brand.isActive ? 'var(--border)' : 'var(--accent)',
                  backgroundColor: 'var(--background)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = brand.isActive ? 'var(--border)' : 'var(--accent)'}
              >
                <div className="w-full h-32 mb-3 rounded-lg overflow-hidden flex items-center justify-center" style={{ backgroundColor: 'var(--secondary)' }}>
                  {brand.imageUrl ? (
                    <img
                      src={brand.imageUrl}
                      alt={brand.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">🏢</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>{brand.name}</h4>
                  {!brand.isActive && (
                    <span className="px-2 py-1 text-xs rounded-full font-semibold" style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}>
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-sm mb-1" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Slug: {brand.slug}</p>
                <p className="text-sm font-semibold mb-4" style={{ color: 'var(--primary)' }}>
                  {brand._count?.products || 0} products
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(brand)}
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: 'var(--sale-red)', color: 'var(--primary-foreground)' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <div className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredBrands.length)} of {filteredBrands.length} brands
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
