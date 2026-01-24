import { Link } from 'react-router-dom';

export default function HeroSection() {
  const mounted = true;

  return (
    <div className="relative w-full overflow-hidden" 
      style={{ 
        height: 'var(--hero-height, 85vh)',
        background: 'linear-gradient(to bottom right, var(--background), var(--secondary))'
      }}
    >
      <style>{`
        :root {
          --hero-height: 60vh;
        }
        @media (min-width: 640px) {
          :root {
            --hero-height: 70vh;
          }
        }
        @media (min-width: 1024px) {
          :root {
            --hero-height: 85vh;
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.2); transform: scale(1); }
          50% { box-shadow: 0 0 40px rgba(var(--primary-rgb), 0.4); transform: scale(1.02); }
        }
        
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }

        /* Hero cards (subtle, premium motion) */
        @keyframes hero-card-a {
          0%, 100% { transform: rotate(6deg) translateY(0); }
          50% { transform: rotate(4deg) translateY(-6px); }
        }
        @keyframes hero-card-b {
          0%, 100% { transform: translate(-50%, -50%) rotate(-2deg) scale(1); }
          50% { transform: translate(-50%, -50%) rotate(-1deg) scale(1.03); }
        }
        @keyframes hero-card-c {
          0%, 100% { transform: rotate(-6deg) translateY(0); }
          50% { transform: rotate(-4deg) translateY(6px); }
        }
        .hero-card {
          border: 1px solid var(--border);
          background: var(--card);
          box-shadow: 0 18px 45px rgba(0,0,0,0.18);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-center">
          
          {/* Left Side (Content) */}
          <div className={`space-y-8 z-10 transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-current shadow-sm" 
              style={{ 
                color: 'var(--primary)',
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)'
              }}
            >
              <span className="text-xl">🏆</span>
              <span className="font-semibold text-sm">India's #1 Wholesale Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="hero-title gradient-text max-w-2xl leading-tight">
              Factory-Direct Wholesale for Branded Products
            </h1>

            {/* Tagline */}
            <p className="body-text-relaxed max-w-lg" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
              Source premium branded products at wholesale pricing — bulk orders, fast fulfilment, and trusted quality for retailers across India.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y" style={{ borderColor: 'var(--border)' }}>
              <div>
                <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>500+</div>
                <div className="text-xs font-medium uppercase tracking-wide opacity-70">Brands</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>10K+</div>
                <div className="text-xs font-medium uppercase tracking-wide opacity-70">Orders</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>98%</div>
                <div className="text-xs font-medium uppercase tracking-wide opacity-70">Satisfaction</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/categories" 
                className="px-8 py-4 rounded-lg font-bold text-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                style={{ 
                  backgroundColor: 'var(--primary)', 
                  color: 'var(--primary-foreground)' 
                }}
              >
                Start Shopping
              </Link>
              <Link 
                to="/about" 
                className="px-8 py-4 rounded-lg font-bold text-center transition-all duration-300 hover:bg-opacity-10 active:scale-95 border-2"
                style={{ 
                  borderColor: 'var(--primary)',
                  color: 'var(--primary)' 
                }}
              >
                Learn About Wholesale
              </Link>
            </div>
          </div>

          {/* Right Side (Visual - Desktop Only) */}
          <div className={`hidden lg:block relative h-full transition-all duration-1000 delay-300 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            {/* Central Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full filter blur-[100px] opacity-30 animate-pulse-glow"
              style={{ backgroundColor: 'var(--primary)' }}
            ></div>

            {/* Floating Cards Container */}
            <div className="relative w-full h-full">
              {/* Card 1 (Top Right) - men.jpg */}
              <div
                className="hero-card absolute top-[12%] right-[8%] w-52 h-72 rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-110"
                style={{ animation: "hero-card-a 7s ease-in-out infinite" }}
              >
                <div className="h-[70%] w-full overflow-hidden" style={{ backgroundColor: "var(--secondary)" }}>
                  <img
                    src="/men.jpg"
                    alt="Men collection"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Men</div>
                  <div className="text-xs mt-1" style={{ color: "var(--foreground)", opacity: 0.7 }}>
                    New arrivals
                  </div>
                </div>
              </div>

              {/* Card 2 (Center) - logo.jpeg */}
              <div
                className="hero-card absolute top-1/2 left-1/2 w-64 h-80 rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-110 animate-pulse-glow"
                style={{ animation: "hero-card-b 6s ease-in-out infinite" }}
              >
                <div className="h-[70%] w-full flex items-center justify-center" style={{ backgroundColor: "var(--secondary)" }}>
                  <img
                    src="/logo.jpeg"
                    alt="Branded Factory Sale"
                    className="w-40 h-40 object-contain rounded-2xl"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Branded Factory Sale</div>
                  <div className="text-xs mt-1" style={{ color: "var(--foreground)", opacity: 0.7 }}>
                    Factory-direct wholesale
                  </div>
                </div>
              </div>

              {/* Card 3 (Bottom Left) - women.jpg */}
              <div
                className="hero-card absolute bottom-[12%] left-[8%] w-56 h-72 rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-110"
                style={{ animation: "hero-card-c 8s ease-in-out infinite" }}
              >
                <div className="h-[70%] w-full overflow-hidden" style={{ backgroundColor: "var(--secondary)" }}>
                  <img
                    src="/women.jpg"
                    alt="Women collection"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Women</div>
                  <div className="text-xs mt-1" style={{ color: "var(--foreground)", opacity: 0.7 }}>
                    Best sellers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full filter blur-[80px] opacity-20"
        style={{ backgroundColor: 'var(--accent)' }}
      ></div>
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full filter blur-[80px] opacity-20"
        style={{ backgroundColor: 'var(--primary)' }}
      ></div>
    </div>
  );
}
