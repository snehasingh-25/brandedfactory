// Image placeholder component
export default function ImagePlaceholder({ 
  width = "100%", 
  height = "200px", 
  icon = "🎁",
  text = "",
  className = ""
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${className}`}
      style={{
        width,
        height,
        backgroundColor: 'var(--secondary)',
        color: 'var(--foreground)',
        opacity: 0.5
      }}
    >
      <span className="text-4xl mb-2">{icon}</span>
      {text && (
        <span className="text-sm font-medium">{text}</span>
      )}
    </div>
  );
}
