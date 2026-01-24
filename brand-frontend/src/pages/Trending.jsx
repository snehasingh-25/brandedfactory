import { useEffect, useState } from "react";
import { API } from "../api";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

export default function Trending() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`${API}/products?isTrending=true`)
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!mounted) return;
        setProducts([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
          <p style={{ color: "var(--foreground)", opacity: 0.7 }}>Loading trending products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: "var(--foreground)" }}>
              Trending Products
            </h1>
            <p className="mt-2 text-sm md:text-base" style={{ color: "var(--foreground)", opacity: 0.7 }}>
              Hand-picked trending items marked by admin.
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <EmptyState
            icon="🔥"
            title="No Trending Products"
            description="Mark products as Trending from the admin panel to show them here."
          />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {products.map((p, index) => (
              <div key={p.id} className="fade-in" style={{ animationDelay: `${index * 0.06}s` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

