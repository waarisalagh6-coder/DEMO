import { useState, useEffect } from "react";
import ProductGrid from "./components/ProductGrid";
import CartSidebar from "./components/CartSidebar";
import Header from "./components/Header";
import OrderSuccess from "./components/OrderSuccess";
import { products } from "./data/products";

export default function App() {
  const [cart, setCart] = useState({});
  const [orderStatus, setOrderStatus] = useState("idle"); // idle | placing | success | error
  const [orderMessage, setOrderMessage] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (productId) => {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
    setCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[productId] > 1) updated[productId]--;
      else delete updated[productId];
      return updated;
    });
  };

  const clearCart = () => setCart({});

  const cartItems = Object.entries(cart).map(([id, qty]) => ({
    ...products.find((p) => p.id === parseInt(id)),
    quantity: qty,
  }));

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = async () => {
    if (cartItems.length === 0) return;
    setOrderStatus("placing");
    try {
      const res = await fetch("http://localhost:4000/api/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          total: cartTotal,
          timestamp: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderStatus("success");
        setOrderMessage(data.message);
        clearCart();
        setCartOpen(false);
      } else {
        setOrderStatus("error");
        setOrderMessage(data.message || "Order failed. Please try again.");
      }
    } catch (err) {
      setOrderStatus("error");
      setOrderMessage("Cannot connect to server. Is the backend running on port 4000?");
    }
  };

  return (
    <div className="app-root">
      <Header cartCount={cartCount} onCartClick={() => setCartOpen(true)} />

      {orderStatus === "success" && (
        <OrderSuccess message={orderMessage} onDismiss={() => setOrderStatus("idle")} />
      )}
      {orderStatus === "error" && (
        <div className="error-banner">
          <span>⚠ {orderMessage}</span>
          <button onClick={() => setOrderStatus("idle")}>✕</button>
        </div>
      )}

      <main className="main-content">
        <div className="hero-strip">
          <div className="hero-badge">⚡ 10 min delivery</div>
          <h1 className="hero-title">Fresh groceries,<br />delivered in <em>a flash</em></h1>
          <p className="hero-sub">Over 500 products · No minimum order · Free delivery over ₹199</p>
        </div>

        <ProductGrid products={products} cart={cart} onAdd={addToCart} onRemove={removeFromCart} />
      </main>

      <CartSidebar
        open={cartOpen}
        items={cartItems}
        total={cartTotal}
        onAdd={addToCart}
        onRemove={removeFromCart}
        onClose={() => setCartOpen(false)}
        onPlaceOrder={placeOrder}
        orderStatus={orderStatus}
      />

      {cartOpen && <div className="cart-backdrop" onClick={() => setCartOpen(false)} />}
    </div>
  );
}
