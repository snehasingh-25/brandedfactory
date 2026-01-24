import { useEffect, useMemo, useRef, useState } from "react";

const DISMISS_KEY = "bf_announcement_dismissed_v1";

export default function AnnouncementBar() {
  const messages = useMemo(
    () => [
      "🏭 Direct Factory Connection – No Middlemen",
      "🎉 India’s No.1 Wholesale Platform – Direct from Factory",
      "💰 Best Prices Guaranteed – Lowest in Market",
      "🚚 Fast Delivery – Bulk Orders Welcome",
      "✅ 100% Authentic Products – Quality Assured",
    ],
    []
  );

  // Read localStorage synchronously to avoid initial layout shift/flash.
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });

  const [index, setIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const isHoveredRef = useRef(false);
  const timerRef = useRef(null);

  const stepMs = useMemo(() => {
    // Slower on mobile for a calmer feel.
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(max-width: 768px)").matches ? 5500 : 4000;
    }
    return 4500;
  }, []);

  const advance = () => {
    // exit -> swap -> enter (subtle real-world motion)
    setIsExiting(true);
    window.setTimeout(() => {
      setIndex((prev) => (prev + 1) % messages.length);
      setIsExiting(false);
    }, 220);
  };

  useEffect(() => {
    if (dismissed) return;
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      if (!isHoveredRef.current) advance();
    }, stepMs);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dismissed, stepMs, messages.length]);

  if (dismissed) return null;

  return (
    <div
      className="w-full border-b"
      style={{
        backgroundColor: "var(--secondary)",
        borderColor: "var(--border)",
      }}
    >
      <div
        className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-8 md:h-10 flex items-center justify-between gap-3"
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
      >
        <div className="flex-1 min-w-0 flex items-center justify-center md:justify-start">
          <div
            className={`announce-message text-[11px] md:text-xs font-semibold tracking-wide ${
              isExiting ? "announce-exit" : "announce-enter"
            }`}
            style={{ color: "var(--foreground)" }}
            role="status"
            aria-live="polite"
          >
            <span className="block truncate text-center md:text-left">
              {messages[index]}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ color: "var(--foreground)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--muted)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          aria-label="Dismiss announcement"
          onClick={() => {
            try {
              localStorage.setItem(DISMISS_KEY, "1");
            } catch {
              // ignore
            }
            setDismissed(true);
          }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

