// Skeleton loading component for content
export default function Skeleton({ className = "", width, height, rounded = "rounded" }) {
  return (
    <div
      className={`${rounded} animate-pulse ${className}`}
      style={{
        width: width || '100%',
        height: height || '1rem',
        backgroundColor: 'var(--secondary)',
      }}
    />
  );
}

// Skeleton for product cards
export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden shadow-md" style={{ backgroundColor: 'var(--card)' }}>
      <Skeleton height="200px" rounded="rounded-t-lg" />
      <div className="p-4 space-y-3">
        <Skeleton height="20px" width="80%" />
        <Skeleton height="16px" width="60%" />
        <Skeleton height="24px" width="40%" />
        <Skeleton height="36px" width="100%" rounded="rounded-lg" />
      </div>
    </div>
  );
}

// Skeleton for category cards
export function CategoryCardSkeleton() {
  return (
    <Skeleton 
      className="aspect-[4/5] rounded-2xl" 
      width="100%"
    />
  );
}

// Skeleton for list items
export function ListItemSkeleton({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton width="60px" height="60px" rounded="rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton height="16px" width="70%" />
            <Skeleton height="14px" width="50%" />
          </div>
        </div>
      ))}
    </div>
  );
}
