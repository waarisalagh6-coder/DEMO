import { useState } from "react";
import { categories } from "../data/products";

export default function ProductGrid({ products, cart, onAdd, onRemove }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <section className="product-section">
      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`cat-tab ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            qty={cart[product.id] || 0}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product, qty, onAdd, onRemove }) {
  return (
    <div className="product-card">
      {product.badge && <div className="product-badge">{product.badge}</div>}
      <div className="product-emoji">{product.emoji}</div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <span className="product-unit">{product.unit}</span>
      </div>
      <div className="product-footer">
        <span className="product-price">₹{product.price}</span>
        {qty === 0 ? (
          <button className="add-btn" onClick={() => onAdd(product.id)}>
            ADD
          </button>
        ) : (
          <div className="qty-control">
            <button className="qty-btn" onClick={() => onRemove(product.id)}>−</button>
            <span className="qty-num">{qty}</span>
            <button className="qty-btn" onClick={() => onAdd(product.id)}>+</button>
          </div>
        )}
      </div>
    </div>
  );
}
