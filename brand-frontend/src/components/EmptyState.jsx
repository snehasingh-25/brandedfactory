// Empty state component
export default function EmptyState({ 
  icon = "📦",
  title = "No items found",
  description = "There are no items to display at the moment.",
  action = null,
  className = ""
}) {
  return (
    <div className={`text-center py-16 ${className}`}>
      <div className="inline-block p-6 rounded-full mb-4" style={{ backgroundColor: 'var(--secondary)' }}>
        <span className="text-5xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
        {title}
      </h3>
      <p className="text-sm mb-6" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
        {description}
      </p>
      {action && action}
    </div>
  );
}

// Error message component for form inputs
export function ErrorMessage({ message, className = "" }) {
  if (!message) return null;
  
  return (
    <p 
      className={`text-sm mt-1 ${className}`}
      style={{ color: 'var(--sale-red)' }}
    >
      {message}
    </p>
  );
}

// Success message component
export function SuccessMessage({ message, className = "" }) {
  if (!message) return null;
  
  return (
    <div 
      className={`flex items-center gap-2 p-3 rounded-lg ${className}`}
      style={{ 
        backgroundColor: 'var(--secondary)',
        color: 'var(--primary)'
      }}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
