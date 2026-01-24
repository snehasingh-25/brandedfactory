export default function About() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      {/* Leadership / Director Spotlight */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left copy */}
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold tracking-wide mb-6"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                Leadership
              </div>

              <h1 className="hero-title mb-4" style={{ color: "var(--foreground)" }}>
                Meet Our Director
              </h1>

              <p
                className="body-text leading-relaxed"
                style={{ color: "var(--foreground)", opacity: 0.75 }}
              >
                Under visionary leadership, Branded Factory Sale has grown from a small wholesale operation to one of
                the most trusted names in factory-direct distribution. Our director brings decades of experience in
                wholesale business and maintains strong relationships with manufacturers worldwide.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "20+ years in wholesale distribution",
                  "Direct partnerships with 150+ factories",
                  "Committed to quality and customer satisfaction",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "var(--secondary)", color: "var(--foreground)" }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="body-text" style={{ color: "var(--foreground)", opacity: 0.8 }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right card */}
            <div
              className="rounded-2xl border shadow-sm p-6 md:p-8"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-40 h-40 md:w-44 md:h-44 rounded-full overflow-hidden border-4 mb-6"
                  style={{ borderColor: "var(--secondary)", backgroundColor: "var(--secondary)" }}
                >
                  <img
                    src="/director.jpeg"
                    alt="Director"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--foreground)" }}>
                  BASANT GANDHI
                </h2>
                <p className="text-sm font-semibold mt-2" style={{ color: "var(--foreground)", opacity: 0.8 }}>
                  Founder &amp; Managing Director
                </p>

                <p className="mt-6 italic text-sm md:text-base leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.7 }}>
                  “Our mission is to bridge the gap between manufacturers and retailers, providing authentic products
                  at unbeatable wholesale prices.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-14 md:py-20" style={{ backgroundColor: "var(--muted)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border p-8" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
              <div className="flex items-start gap-4">
                
                <div>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--foreground)" }}>Our Mission</h3>
                  <p className="body-text leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.75 }}>
                    To provide businesses with direct access to premium branded products at wholesale prices,
                    eliminating middlemen and ensuring maximum value for our customers. We strive to build long-term
                    partnerships based on trust, quality, and competitive pricing.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border p-8" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
              <div className="flex items-start gap-4">
                <div>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--foreground)" }}>Our Vision</h3>
                  <p className="body-text leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.75 }}>
                    To become the leading wholesale distribution platform in India, connecting thousands of retailers
                    with authentic branded products. We envision a future where every business—regardless of size—has
                    access to premium products at factory-direct prices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-heading mb-3" style={{ color: "var(--foreground)" }}>Our Achievements</h2>
            <p className="body-text" style={{ color: "var(--foreground)", opacity: 0.7 }}>
              Numbers that reflect our commitment to excellence and customer satisfaction
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Brand Partners", sub: "Premium brands worldwide" },
              { value: "10K+", label: "Orders Fulfilled", sub: "Successful bulk deliveries" },
              { value: "150+", label: "Factory Partners", sub: "Direct manufacturing sources" },
              { value: "98%", label: "Client Satisfaction", sub: "Happy wholesale customers" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold" style={{ color: "var(--foreground)" }}>
                  {s.value}
                </div>
                <div className="mt-2 text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  {s.label}
                </div>
                <div className="mt-1 text-xs" style={{ color: "var(--foreground)", opacity: 0.65 }}>
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-14 md:py-20" style={{ backgroundColor: "var(--muted)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-heading mb-3" style={{ color: "var(--foreground)" }}>Our Core Values</h2>
            <p className="body-text" style={{ color: "var(--foreground)", opacity: 0.7 }}>
              The principles that guide our business and define our commitment to customers
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "✨", title: "Quality Assurance", desc: "Strict quality checks to ensure authentic, reliable products." },
              { icon: "💰", title: "Best Value", desc: "Factory-direct pricing that keeps your margins strong." },
              { icon: "🤝", title: "Trust & Transparency", desc: "Long-term relationships built on clear, fair dealings." },
              { icon: "🚚", title: "Reliable Fulfilment", desc: "Smooth logistics and bulk-order support for businesses." },
            ].map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border p-6 shadow-sm"
                style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
              >
                <h3 className="mt-4 text-lg font-bold" style={{ color: "var(--foreground)" }}>
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.75 }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}