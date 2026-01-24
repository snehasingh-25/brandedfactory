import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import Typed from "typed.js";
import Fuse from "fuse.js";
import { API } from "../api";

export default function Navbar() {
  const { getCartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const typedElementRef = useRef(null);
  const typedInstanceRef = useRef(null);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const mobileSuggestionsRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/categories", label: "Catalogue" },
    { path: "/brands", label: "Brands" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch all products for fuzzy search
  useEffect(() => {
    fetch(`${API}/products`)
      .then(res => res.json())
      .then(data => {
        setAllProducts(data);
      })
      .catch(error => {
        console.error("Error fetching products for search:", error);
      });
  }, []);

  // Fuzzy search suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 0 && allProducts.length > 0) {
      const fuse = new Fuse(allProducts, {
        keys: ['name', 'description', 'keywords'],
        threshold: 0.4, // 0 = perfect match, 1 = match anything
        includeScore: true,
        minMatchCharLength: 2,
      });

      const results = fuse.search(searchQuery);
      const suggestions = results.slice(0, 5).map(result => result.item);
      
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setSearchSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
      }, 0);
    } else {
      setTimeout(() => {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }, 0);
    }
  }, [searchQuery, allProducts]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const inDesktop = searchInputRef.current?.contains(event.target) || suggestionsRef.current?.contains(event.target);
      const inMobile = mobileSearchRef.current?.contains(event.target) || mobileSuggestionsRef.current?.contains(event.target);
      if (!inDesktop && !inMobile) setShowSuggestions(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize Typed.js for search bar
  useEffect(() => {
    if (typedElementRef.current && !typedInstanceRef.current) {
      typedInstanceRef.current = new Typed(typedElementRef.current, {
        strings: [' Search products at wholesale', ' Factory-direct best prices'],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|',
      });
    }

    return () => {
      if (typedInstanceRef.current) {
        typedInstanceRef.current.destroy();
        typedInstanceRef.current = null;
      }
    };
  }, []);

  // Control typing based on searchQuery
  useEffect(() => {
    if (typedInstanceRef.current) {
      if (searchQuery) {
        typedInstanceRef.current.stop();
      } else {
        typedInstanceRef.current.start();
      }
    }
  }, [searchQuery]);

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-sm transition-all border-b shadow-sm`}
      style={{ 
        backgroundColor: scrolled ? 'var(--card)' : 'var(--background)',
        borderColor: 'var(--border)',
        minHeight: 'var(--navbar-height, 64px)'
      }}
    >
      <style>{`
        :root {
          --navbar-height: 56px;
        }
        @media (min-width: 1024px) {
          :root {
            --navbar-height: 64px;
          }
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="flex items-center justify-between flex-shrink-0 min-h-[56px] lg:min-h-[64px]">
          
          {/* Left: Logo + Brand Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/logo.jpeg" 
              alt="Brand Factory Logo" 
              className="h-8 w-auto lg:h-10 transform group-hover:scale-110 transition-all duration-300"
            />
            <div className="flex flex-col">
              <span 
                className="font-bold uppercase text-sm lg:text-base border border-current rounded-full px-2 py-0.5 tracking-wider"
                style={{ color: 'var(--sale-red)' }}
              >
                Branded Factory Sale
              </span>
              <span className="hidden lg:block text-[10px] font-medium tracking-wide opacity-80" style={{ color: 'var(--foreground)' }}>
                A Complete Shopping Center
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => (
                <Link
                key={item.path}
                  to={item.path}
                className="text-sm font-medium transition-all duration-300 relative group py-2"
                  style={{
                  color: isActive(item.path) ? 'var(--primary)' : 'var(--foreground)',
                  }}
                >
                  {item.label}
                <span 
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-current transform transition-transform duration-300 origin-left ${
                    isActive(item.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                  style={{ backgroundColor: 'var(--primary)' }}
                />
                </Link>
            ))}
          </div>

          {/* Right: Search (Desktop) + Theme Toggle + Cart + Admin + Mobile Menu */}
          <div className="flex items-center gap-3">
            
            {/* Search Bar - Desktop only (mobile has its own below header) */}
            <div className="relative hidden lg:block">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    // Stop typing when user starts typing
                    if (typedInstanceRef.current && e.target.value) {
                      typedInstanceRef.current.stop();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                      setShowSuggestions(false);
                    } else if (e.key === 'Escape') {
                      setShowSuggestions(false);
                    }
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.backgroundColor = 'var(--card)';
                    e.target.style.color = 'var(--foreground)';
                    // Pause typing when focused
                    if (typedInstanceRef.current) {
                      typedInstanceRef.current.stop();
                    }
                    if (searchSuggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={(e) => {
                    // Delay to allow click on suggestions
                    setTimeout(() => {
                      if (!searchQuery) {
                        e.target.style.borderColor = 'var(--border)';
                        e.target.style.backgroundColor = 'var(--secondary)';
                        e.target.style.color = 'transparent';
                        // Resume typing when blurred and no query
                        if (typedInstanceRef.current) {
                          typedInstanceRef.current.start();
                        }
                      }
                      setShowSuggestions(false);
                    }, 200);
                  }}
                  className="rounded-full px-5 py-2.5 pr-10 w-40 sm:w-48 md:w-60 text-sm transition-all duration-300 relative z-10"
                  style={{
                    backgroundColor: searchQuery ? 'var(--card)' : 'var(--secondary)',
                    border: '1px solid var(--border)',
                    color: searchQuery ? 'var(--foreground)' : 'transparent'
                  }}
                />
                {!searchQuery && (
                  <span
                    ref={typedElementRef}
                    className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-sm z-20"
                    style={{ color: 'var(--foreground)', opacity: 0.6 }}
                  ></span>
                )}
                <button
                  onClick={() => {
                    if (searchQuery.trim()) {
                      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                      setShowSuggestions(false);
                    }
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer z-30"
                >
                  <svg
                    className="w-4 h-4"
                    style={{ color: 'var(--foreground)', opacity: 0.6 }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>

                {/* Search Suggestions Dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute top-full left-0 mt-2 w-60 bg-white rounded-lg shadow-xl border z-50 max-h-80 overflow-y-auto"
                    style={{ 
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)'
                    }}
                  >
                    <div className="p-2">
                      <div className="text-xs font-semibold px-3 py-2" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                        Suggestions
                      </div>
                      {searchSuggestions.map((product) => {
                        const images = product.images ? (Array.isArray(product.images) ? product.images : JSON.parse(product.images)) : [];
                        return (
                          <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            onClick={() => {
                              setShowSuggestions(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer group"
                            style={{ 
                              backgroundColor: 'transparent'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--secondary)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            {images.length > 0 ? (
                              <img
                                src={images[0]}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--secondary)' }}>
                                <span className="text-xl">🎁</span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm truncate" style={{ color: 'var(--foreground)' }}>
                                {product.name}
                              </div>
                              {product.category && (
                                <div className="text-xs truncate" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                                  {product.category.name}
                                </div>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                      <Link
                        to={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                        onClick={() => setShowSuggestions(false)}
                        className="block px-3 py-2 rounded-lg text-sm font-semibold text-center transition-colors"
                        style={{ 
                          color: 'var(--foreground)',
                          backgroundColor: 'var(--secondary)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--accent)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--secondary)';
                        }}
                      >
                        View all results for "{searchQuery}"
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Theme Toggle Button */}
                <button
              onClick={toggleTheme}
              className="p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center w-10 h-10"
                            style={{ 
                backgroundColor: 'transparent',
                color: 'var(--foreground)'
                            }}
                            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--secondary)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                )}
              </button>

            {/* Cart Button */}
            <Link 
              to="/cart" 
              className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 group"
              style={{ color: 'var(--foreground)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Shopping Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getCartCount() > 0 && (
                <span 
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold animate-pulse"
                  style={{ 
                    backgroundColor: 'var(--primary)', 
                    color: 'var(--primary-foreground)'
                  }}
                >
                  {getCartCount() > 99 ? '99+' : getCartCount()}
                </span>
              )}
            </Link>

            {/* Admin Link (Desktop) */}
            <Link 
              to="/admin/login" 
              className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110"
              style={{ color: 'var(--foreground)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Admin Panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 active:scale-95"
              style={{ color: 'var(--foreground)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
        </div>

        {/* Mobile-only: Full-width search bar below header (Nykaa-style) */}
        <div 
          className="lg:hidden w-full px-4 pb-3 pt-3 border-t flex-shrink-0" 
          style={{ borderColor: 'var(--border)' }}
          ref={mobileSearchRef}
        >
          <div className="relative w-full">
            <div className="relative w-full">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-20 pointer-events-none"
                style={{ color: 'var(--foreground)', opacity: 0.5 }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (typedInstanceRef.current && e.target.value) typedInstanceRef.current.stop();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                    setShowSuggestions(false);
                  } else if (e.key === 'Escape') setShowSuggestions(false);
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.backgroundColor = 'var(--card)';
                  e.target.style.color = 'var(--foreground)';
                  if (typedInstanceRef.current) typedInstanceRef.current.stop();
                  if (searchSuggestions.length > 0) setShowSuggestions(true);
                }}
                onBlur={(e) => {
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                placeholder="Search for products..."
                className="w-full rounded-full pl-12 pr-12 py-3 text-base border transition-all"
                style={{
                  backgroundColor: searchQuery ? 'var(--card)' : 'var(--secondary)',
                  borderColor: 'var(--border)',
                  color: searchQuery ? 'var(--foreground)' : 'var(--foreground)',
                }}
              />
              <button
                onClick={() => {
                  if (searchQuery.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                    setShowSuggestions(false);
                  }
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer z-30"
              >
                <svg className="w-5 h-5" style={{ color: 'var(--foreground)', opacity: 0.6 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            {showSuggestions && searchSuggestions.length > 0 && (
              <div
                ref={mobileSuggestionsRef}
                className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-xl border z-50 max-h-80 overflow-y-auto"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div className="p-2">
                  <div className="text-xs font-semibold px-3 py-2" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Suggestions</div>
                  {searchSuggestions.map((product) => {
                    const imgs = product.images ? (Array.isArray(product.images) ? product.images : JSON.parse(product.images)) : [];
                    return (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={() => { setShowSuggestions(false); setSearchQuery(""); }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
                        style={{ backgroundColor: 'transparent' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--secondary)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        {imgs.length > 0 ? (
                          <img src={imgs[0]} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--secondary)' }}><span className="text-xl">🎁</span></div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate" style={{ color: 'var(--foreground)' }}>{product.name}</div>
                          {product.category && <div className="text-xs truncate" style={{ color: 'var(--foreground)', opacity: 0.6 }}>{product.category.name}</div>}
                        </div>
                      </Link>
                    );
                  })}
                  <Link
                    to={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                    onClick={() => setShowSuggestions(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-center transition-colors"
                    style={{ color: 'var(--foreground)', backgroundColor: 'var(--secondary)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--secondary)'; }}
                  >
                    View all results for "{searchQuery}"
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Drawer - Full Width Slide Down */}
        <div
          className={`lg:hidden fixed inset-x-0 top-[112px] bg-white/95 backdrop-blur-md border-b transition-all duration-300 ease-in-out z-40 ${
            isMobileMenuOpen ? "translate-y-0 opacity-100 shadow-xl" : "-translate-y-full opacity-0 pointer-events-none"
          }`}
          style={{ 
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)'
          }}
        >
          <div className="flex flex-col p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 flex items-center justify-between"
                style={{
                  color: isActive(item.path) ? 'var(--primary)' : 'var(--foreground)',
                  backgroundColor: isActive(item.path) ? 'var(--secondary)' : 'transparent',
                }}
              >
                {item.label}
                <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
            
            <div className="h-px w-full my-2" style={{ backgroundColor: 'var(--border)' }}></div>
            
            <Link
              to="/admin/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 flex items-center justify-between"
              style={{ color: 'var(--foreground)' }}
            >
              Admin Panel
              <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
