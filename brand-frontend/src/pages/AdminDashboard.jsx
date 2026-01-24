import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API } from "../api";
import ProductForm from "../components/admin/ProductForm";
import CategoryForm from "../components/admin/CategoryForm";
import ProductList from "../components/admin/ProductList";
import CategoryList from "../components/admin/CategoryList";
import OrderList from "../components/admin/OrderList";
import MessageList from "../components/admin/MessageList";
import ReelForm from "../components/admin/ReelForm";
import ReelList from "../components/admin/ReelList";
import BrandForm from "../components/admin/BrandForm";
import BrandList from "../components/admin/BrandList";
import BannerForm from "../components/admin/BannerForm";
import BannerList from "../components/admin/BannerList";
import Spinner from "../components/Spinner";

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reels, setReels] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);
  const [editingReel, setEditingReel] = useState(null);
  const [editingBanner, setEditingBanner] = useState(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const headers = { Authorization: `Bearer ${token}` };

      if (activeTab === "products") {
        const [productsRes, brandsRes] = await Promise.all([
          fetch(`${API}/products`, { headers }),
          fetch(`${API}/brands/all`, { headers })
        ]);
        
        if (!productsRes.ok) {
          const errorData = await productsRes.json();
          console.error("Error fetching products:", errorData);
          setProducts([]);
        } else {
          const productsData = await productsRes.json();
          setProducts(Array.isArray(productsData) ? productsData : []);
        }
        
        if (brandsRes.ok) {
          const brandsData = await brandsRes.json();
          setBrands(Array.isArray(brandsData) ? brandsData : []);
        }
      } else if (activeTab === "categories") {
        const res = await fetch(`${API}/categories`, { headers });
        const data = await res.json();
        setCategories(data);
      } else if (activeTab === "occasions") {
        const res = await fetch(`${API}/brands/all`, { headers });
        const data = await res.json();
        setBrands(data);
      } else if (activeTab === "orders") {
        const res = await fetch(`${API}/orders`, { headers });
        const data = await res.json();
        setOrders(data);
      } else if (activeTab === "messages") {
        const res = await fetch(`${API}/contact`, { headers });
        const data = await res.json();
        setMessages(data);
      } else if (activeTab === "reels") {
        const res = await fetch(`${API}/reels/all`, { headers });
        const data = await res.json();
        setReels(data);
      } else if (activeTab === "banners") {
        const res = await fetch(`${API}/banners/all`, { headers });
        const data = await res.json();
        setBanners(data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSave = () => {
    setEditingProduct(null);
    loadData();
  };

  const handleCategorySave = () => {
    setEditingCategory(null);
    loadData();
  };

  const handleBrandSave = () => {
    setEditingBrand(null);
    loadData();
  };

  const handleReelSave = () => {
    setEditingReel(null);
    loadData();
  };

  const handleBannerSave = () => {
    setEditingBanner(null);
    loadData();
  };

  const tabs = [
    { id: "products", label: "Products", icon: "📦" },
    { id: "categories", label: "Categories", icon: "🏷️" },
    { id: "brands", label: "Brands", icon: "🏢" },
    { id: "reels", label: "Reels", icon: "🎬" },
    { id: "messages", label: "Contact Submissions", icon: "📩" },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    setEditingProduct(null);
    setEditingCategory(null);
    setEditingBrand(null);
    setEditingReel(null);
    setEditingBanner(null);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background)' }}>
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block w-64 border-r" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.jpeg" alt="Logo" className="h-8 w-auto" />
            <div>
              <h2 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>BRANDED FACTORY</h2>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--sale-red)' }}>SALE</p>
            </div>
          </div>
          <p className="text-xs" style={{ color: 'var(--foreground)', opacity: 0.7 }}>{user?.email}</p>
        </div>
        
        <nav className="p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-left ${
                activeTab === tab.id ? 'font-semibold' : ''
              }`}
              style={{
                backgroundColor: activeTab === tab.id ? 'var(--secondary)' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--foreground)',
                opacity: activeTab === tab.id ? 1 : 0.8
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = 'var(--secondary)';
                  e.currentTarget.style.opacity = '1';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.opacity = '0.8';
                }
              }}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar - Mobile Menu */}
        <header className="lg:hidden border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <img src="/logo.jpeg" alt="Logo" className="h-8 w-auto" />
              <div>
                <h2 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>BRANDED FACTORY</h2>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--sale-red)' }}>SALE</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg transition-all"
              style={{ color: 'var(--foreground)' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="border-t p-4 space-y-1" style={{ borderColor: 'var(--border)' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-left ${
                    activeTab === tab.id ? 'font-semibold' : ''
                  }`}
                  style={{
                    backgroundColor: activeTab === tab.id ? 'var(--secondary)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--primary)' : 'var(--foreground)',
                    opacity: activeTab === tab.id ? 1 : 0.8
                  }}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-left mt-4"
                style={{ color: 'var(--foreground)', opacity: 0.8 }}
              >
                <span className="text-xl">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          )}
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              {tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
              Manage your {tabs.find(t => t.id === activeTab)?.label.toLowerCase() || 'content'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)'
              }}
            >
              View Shop
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 border"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'var(--border)',
                color: 'var(--foreground)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Spinner size="lg" className="mb-4" />
                <p style={{ color: 'var(--foreground)', opacity: 0.7 }}>Loading...</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === "products" && (
                <div className="space-y-6">
                  <ProductForm
                    product={editingProduct}
                    categories={categories}
                    brands={brands}
                    onSave={handleProductSave}
                  />
                  <ProductList
                    products={products}
                    onEdit={setEditingProduct}
                    onDelete={loadData}
                  />
                </div>
              )}

              {activeTab === "categories" && (
                <div className="space-y-6">
                  <CategoryForm
                    category={editingCategory}
                    onSave={handleCategorySave}
                  />
                  <CategoryList
                    categories={categories}
                    onEdit={setEditingCategory}
                    onDelete={loadData}
                  />
                </div>
              )}

              {activeTab === "brands" && (
                <div className="space-y-6">
                  <BrandForm
                    brand={editingBrand}
                    onSave={handleBrandSave}
                  />
                  <BrandList
                    brands={brands}
                    onEdit={setEditingBrand}
                    onDelete={loadData}
                  />
                </div>
              )}

              {activeTab === "reels" && (
                <div className="space-y-6">
                  <ReelForm reel={editingReel} onSave={handleReelSave} />
                  <ReelList reels={reels} onEdit={setEditingReel} onDelete={loadData} />
                </div>
              )}

              {activeTab === "messages" && (
                <MessageList messages={messages} onUpdate={loadData} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
