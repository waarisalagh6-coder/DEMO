# ⚡ BlinkKart – 10-Minute Quick Commerce App

A full-stack quick commerce app (Blinkit-inspired) with IoT integration.

```
User clicks "Place Order"
  → React Frontend (port 3000)
    → Express Backend (port 4000)
      → Python IoT Script
        → LED blinks (GPIO / ESP32 / Simulation)
```

---

## 📁 Project Structure

```
quickcommerce/
├── frontend/                  # React + Vite + CSS
│   ├── src/
│   │   ├── App.jsx            # Root component
│   │   ├── main.jsx           # Entry point
│   │   ├── index.css          # All styles
│   │   ├── data/
│   │   │   └── products.js    # 22 mock products
│   │   └── components/
│   │       ├── Header.jsx     # Sticky nav with cart button
│   │       ├── ProductGrid.jsx # Filterable product grid
│   │       ├── CartSidebar.jsx # Sliding cart with totals
│   │       └── OrderSuccess.jsx # Order confirmation overlay
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                   # Node.js + Express
│   ├── server.js              # API server
│   └── package.json
│
└── iot/
    └── led_trigger.py         # Python IoT bridge (auto-detects hardware)
```

---

## 🚀 Quick Start

### 1. Start the Backend

```bash
cd quickcommerce/backend
npm install
npm start
# Server runs on http://localhost:4000
```

### 2. Start the Frontend

```bash
cd quickcommerce/frontend
npm install
npm run dev
# App runs on http://localhost:3000
```

### 3. Test the Full Flow

1. Open http://localhost:3000
2. Add items to cart
3. Click **Place Order**
4. Watch the backend console → Python script runs → LED signal fires!

---

## 🔌 IoT Hardware Modes

The Python script (`iot/led_trigger.py`) **auto-detects** your hardware:

### Mode 1: Simulation (Default)
No hardware needed. Output is printed to the console:
```
══════════════════════════════════════════════════
  💡 ORDER RECEIVED – LED SIGNAL TRIGGERED
  Order ID : BK-1001
  Items    : 3 item(s)
  Total    : ₹245
  🟢 GPIO 18 → HIGH (LED ON – pulse 1/3)
  ⚫ GPIO 18 → LOW  (LED OFF)
  ...
```

### Mode 2: Raspberry Pi
Wiring: `GPIO 18 (BCM) → 220Ω resistor → LED+ → LED- → GND`

```bash
pip install RPi.GPIO
```
The script auto-detects `/proc/cpuinfo` for "Raspberry Pi".

### Mode 3: ESP32 / Arduino
Wiring: Upload the sketch from comments in `led_trigger.py` to your board.

```bash
pip install pyserial
# Set SERIAL_PORT in led_trigger.py (e.g., /dev/ttyUSB0 or COM3)
```

---

## 🛠 API Reference

### `GET /api/products`
Returns all 22 products from the mock database.

### `POST /api/place-order`
Places an order and triggers the LED signal.

**Request body:**
```json
{
  "items": [
    { "id": 1, "name": "Fresh Tomatoes", "price": 29, "quantity": 2 }
  ],
  "total": 58,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "BK-1001",
  "message": "Order BK-1001 confirmed! Arriving in ~10 minutes. ⚡",
  "iotSignal": { "success": true, "output": "..." },
  "order": { ... }
}
```

### `GET /api/orders`
Returns all placed orders.

### `GET /health`
Health check endpoint.

---

## 📦 Dependencies

**Frontend:** React 18, Vite, Google Fonts (Sora + DM Sans)

**Backend:** Express, cors, nodemon

**IoT:** Python 3.6+, optionally `RPi.GPIO` or `pyserial`

---

## 🔧 Customisation

- **Add products:** Edit `frontend/src/data/products.js` and `backend/server.js`
- **Change GPIO pin:** Edit `GPIO_PIN` in `iot/led_trigger.py`
- **Change LED duration:** Edit `LED_ON_SECONDS` in `iot/led_trigger.py`
- **Change serial port:** Edit `SERIAL_PORT` in `iot/led_trigger.py`
