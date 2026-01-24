import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingButton } from "../components/Spinner";
import { ErrorMessage } from "../components/EmptyState";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      navigate("/admin/dashboard");
    } else {
      setError(result.message || "Invalid credentials");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--background)' }}>
      <div className="w-full max-w-md">
        <div className="rounded-2xl shadow-xl p-8 md:p-10" style={{ backgroundColor: 'var(--card)' }}>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img 
                src="/logo.jpeg" 
                alt="Brand Factory Logo" 
                className="h-12 w-auto"
              />
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                  BRANDED FACTORY
                </h2>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--sale-red)' }}>
                  SALE
                </p>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
              Admin Login
            </h1>
            <p className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
              Sign in to access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none"
                style={{
                  border: '2px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                placeholder="Enter username"
                required
                autoComplete="username"
              />
              <ErrorMessage message={error && error.includes('username') ? error : ''} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none"
                style={{
                  border: '2px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                placeholder="Enter password"
                required
                autoComplete="current-password"
              />
              <ErrorMessage message={error && error.includes('password') ? error : ''} />
            </div>

            {error && !error.includes('username') && !error.includes('password') && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--secondary)' }}>
                <p className="text-sm" style={{ color: 'var(--sale-red)' }}>{error}</p>
              </div>
            )}

            <LoadingButton
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              style={{ 
                backgroundColor: 'var(--primary)', 
                color: 'var(--primary-foreground)' 
              }}
            >
              Login
            </LoadingButton>
          </form>
        </div>
      </div>
    </div>
  );
}
