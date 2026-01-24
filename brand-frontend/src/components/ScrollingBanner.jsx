import React from 'react';

export default function ScrollingBanner() {
  const text = "BRANDED FACTORY";
  
  // Create the individual item with consistent spacing
  // using unique keys for the array
  const items = Array(10).fill(null).map((_, i) => (
    <span key={i} className="mx-6 text-xs md:text-sm font-bold tracking-[0.2em] uppercase inline-block">
      {text}
    </span>
  ));

  return (
    <div 
      className="w-full overflow-hidden flex h-8 md:h-10 items-center relative z-50"
      style={{ 
        backgroundColor: 'var(--secondary)',
        color: 'var(--foreground)',
        borderBottom: '1px solid var(--border)'
      }}
    >
      <div className="animate-marquee whitespace-nowrap flex items-center shrink-0">
        {items}
      </div>
      <div className="animate-marquee whitespace-nowrap flex items-center shrink-0">
        {items}
      </div>
    </div>
  );
}
