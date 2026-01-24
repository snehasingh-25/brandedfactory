import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // Build WhatsApp message
    let message = "Hi! I'd like to place an order:\n\n";
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.productName}\n`;
      message += `   Size: ${item.sizeLabel}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: ₹${item.price}\n`;
      message += `   Subtotal: ₹${item.subtotal.toFixed(2)}\n\n`;
    });

    message += `Total: ₹${getCartTotal().toFixed(2)}`;

    // Open WhatsApp
    window.open(
      `https://wa.me/919660994037?text=${encodeURIComponent(message)}`
    );

    // Optionally clear cart after checkout
    // clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "var(--background)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl shadow-lg p-12 text-center border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
              Your cart is empty
            </h2>
            <p className="mb-8" style={{ color: "var(--foreground)", opacity: 0.7 }}>
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8" style={{ color: "var(--foreground)" }}>Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl shadow-md p-6 flex flex-col sm:flex-row gap-6 hover:shadow-lg transition-all duration-300 fade-in border"
                style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
              >
                {/* Product Image */}
                <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: "var(--secondary)" }}>
                  {item.productImage ? (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl" style={{ opacity: 0.35 }}>🎁</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                        {item.productName}
                      </h3>
                      <p className="mt-1" style={{ color: "var(--foreground)", opacity: 0.7 }}>Size: {item.sizeLabel}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition-all duration-300 hover:scale-110 active:scale-95"
                      title="Remove item"
                    >
                      <svg
                        className="w-6 h-6"
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

                  <div className="flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg border flex items-center justify-center font-bold transition-all duration-300 active:scale-95"
                        style={{ borderColor: "var(--border)", color: "var(--foreground)", backgroundColor: "transparent" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--secondary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        −
                      </button>
                      <span className="text-lg font-semibold w-8 text-center transition-all duration-300" style={{ color: "var(--foreground)" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg border flex items-center justify-center font-bold transition-all duration-300 active:scale-95"
                        style={{ borderColor: "var(--border)", color: "var(--foreground)", backgroundColor: "transparent" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--secondary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-sm" style={{ color: "var(--foreground)", opacity: 0.7 }}>
                        ₹{item.price} × {item.quantity}
                      </div>
                      <div className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                        ₹{item.subtotal.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-xl shadow-lg p-6 sticky top-8 border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between" style={{ color: "var(--foreground)", opacity: 0.85 }}>
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span className="font-semibold">₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold" style={{ color: "var(--foreground)" }}>Total</span>
                    <span className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                      ₹{getCartTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 hover:opacity-90"
                  style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  Checkout via WhatsApp
                </button>
                <Link
                  to="/"
                  className="block w-full text-center py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-md active:scale-95"
                  style={{ backgroundColor: "var(--secondary)", color: "var(--foreground)" }}
                >
                  Continue Shopping
                </Link>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear your cart?")) {
                      clearCart();
                    }
                  }}
                  className="w-full text-red-600 py-2 text-sm hover:text-red-700 transition-all duration-300 hover:bg-red-50 rounded-lg active:scale-95"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
