// Spinner component for loading actions
export default function Spinner({ size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  return (
    <div className={`${className} inline-block`}>
      <svg
        className={`animate-spin ${sizeClasses[size]}`}
        style={{ color: 'var(--primary)' }}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

// Button with spinner
export function LoadingButton({ 
  children, 
  loading = false, 
  disabled = false,
  className = "",
  ...props 
}) {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`${className} relative transition-all duration-300 ${
        loading || disabled ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    >
      {loading && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Spinner size="sm" />
        </span>
      )}
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
    </button>
  );
}
