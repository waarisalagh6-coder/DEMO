export default function CartSidebar({ open, items, total, onAdd, onRemove, onClose, onPlaceOrder, orderStatus }) {
  const deliveryFee = total > 199 ? 0 : 25;
  const grandTotal = total + deliveryFee;
  const placing = orderStatus === "placing";

  return (
    <aside className={`cart-sidebar ${open ? "open" : ""}`}>
      <div className="cart-header">
        <div>
          <h2 className="cart-title">My Cart</h2>
          {items.length > 0 && (
            <p className="cart-eta">⚡ Delivery in ~10 mins</p>
          )}
        </div>
        <button className="cart-close" onClick={onClose}>✕</button>
      </div>

      <div className="cart-body">
        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <p>Your cart is empty</p>
            <span>Add items to get started!</span>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <span className="cart-item-emoji">{item.emoji}</span>
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-unit">{item.unit}</span>
                  </div>
                  <div className="cart-qty-control">
                    <button className="qty-btn sm" onClick={() => onRemove(item.id)}>−</button>
                    <span className="qty-num sm">{item.quantity}</span>
                    <button className="qty-btn sm" onClick={() => onAdd(item.id)}>+</button>
                  </div>
                  <span className="cart-item-price">₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>

            <div className="cart-promo">
              <span className="promo-icon">🎁</span>
              <span>Apply coupon or promo code</span>
              <button className="promo-btn">Apply</button>
            </div>
          </>
        )}
      </div>

      {items.length > 0 && (
        <div className="cart-footer">
          <div className="bill-section">
            <h4 className="bill-title">Bill Details</h4>
            <div className="bill-row"><span>Item total</span><span>₹{total}</span></div>
            <div className="bill-row">
              <span>Delivery fee</span>
              <span className={deliveryFee === 0 ? "free-tag" : ""}>
                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
              </span>
            </div>
            {deliveryFee === 0 && (
              <div className="free-delivery-note">🎉 You saved ₹25 on delivery!</div>
            )}
            <div className="bill-row total-row">
              <span>To Pay</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>

          <button
            className={`place-order-btn ${placing ? "loading" : ""}`}
            onClick={onPlaceOrder}
            disabled={placing}
          >
            {placing ? (
              <span className="spinner-row">
                <span className="spinner" />
                Placing Order...
              </span>
            ) : (
              <>
                <span>Place Order · ₹{grandTotal}</span>
                <span className="btn-arrow">→</span>
              </>
            )}
          </button>

          <p className="order-note">⚡ Order will be delivered in 10 minutes</p>
        </div>
      )}
    </aside>
  );
}
