import { Link } from 'react-router-dom';

// 404 Not Found page
export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
      <div className="text-center px-4">
        <div className="inline-block p-8 rounded-full mb-6" style={{ backgroundColor: 'var(--secondary)' }}>
          <span className="text-7xl">🔍</span>
        </div>
        <h1 className="text-6xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>404</h1>
        <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
          Page Not Found
        </h2>
        <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-4 rounded-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          style={{ 
            backgroundColor: 'var(--primary)', 
            color: 'var(--primary-foreground)' 
          }}
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

// 500 Server Error page
export function ServerError() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
      <div className="text-center px-4">
        <div className="inline-block p-8 rounded-full mb-6" style={{ backgroundColor: 'var(--secondary)' }}>
          <span className="text-7xl">⚠️</span>
        </div>
        <h1 className="text-6xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>500</h1>
        <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
          Server Error
        </h2>
        <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
          Something went wrong on our end. Please try again later.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 rounded-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            style={{ 
              backgroundColor: 'var(--primary)', 
              color: 'var(--primary-foreground)' 
            }}
          >
            Reload Page
          </button>
          <Link
            to="/"
            className="px-8 py-4 rounded-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95 border-2"
            style={{ 
              borderColor: 'var(--primary)',
              color: 'var(--primary)' 
            }}
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
