const express = require("express");
const cors = require("cors");
const { spawn, execFile } = require("child_process");
const path = require("path");

const app = express();
const PORT = 4000;

// ── Middleware ──────────────────────────────────────────────────
app.use(cors({ origin: ["http://localhost:3000", "http://127.0.0.1:3000"] }));
app.use(express.json());

// ── Mock Product Database ───────────────────────────────────────
const products = [
  { id: 1,  name: "Fresh Tomatoes",      category: "Vegetables", price: 29,  unit: "500g"  },
  { id: 2,  name: "Baby Spinach",        category: "Vegetables", price: 45,  unit: "200g"  },
  { id: 3,  name: "Onions",              category: "Vegetables", price: 35,  unit: "1kg"   },
  { id: 4,  name: "Bananas",             category: "Fruits",     price: 49,  unit: "6 pcs" },
  { id: 5,  name: "Royal Gala Apples",   category: "Fruits",     price: 99,  unit: "4 pcs" },
  { id: 6,  name: "Lemons",             category: "Fruits",     price: 25,  unit: "4 pcs" },
  { id: 7,  name: "Full Cream Milk",     category: "Dairy",      price: 62,  unit: "1L"    },
  { id: 8,  name: "Amul Butter",         category: "Dairy",      price: 55,  unit: "100g"  },
  { id: 9,  name: "Farm Eggs",           category: "Dairy",      price: 89,  unit: "12 pcs"},
  { id: 10, name: "Curd (Dahi)",         category: "Dairy",      price: 40,  unit: "400g"  },
  { id: 11, name: "Lay's Classic",       category: "Snacks",     price: 20,  unit: "26g"   },
  { id: 12, name: "Digestive Biscuits",  category: "Snacks",     price: 35,  unit: "250g"  },
  { id: 13, name: "Instant Noodles",     category: "Snacks",     price: 14,  unit: "70g"   },
  { id: 14, name: "Dark Chocolate",      category: "Snacks",     price: 75,  unit: "55g"   },
  { id: 15, name: "Roasted Peanuts",     category: "Snacks",     price: 55,  unit: "200g"  },
  { id: 16, name: "Basmati Rice",        category: "Staples",    price: 149, unit: "1kg"   },
  { id: 17, name: "Toor Dal",            category: "Staples",    price: 99,  unit: "500g"  },
  { id: 18, name: "Sunflower Oil",       category: "Staples",    price: 179, unit: "1L"    },
  { id: 19, name: "Whole Wheat Atta",    category: "Staples",    price: 85,  unit: "1kg"   },
  { id: 20, name: "Orange Juice",        category: "Beverages",  price: 110, unit: "1L"    },
  { id: 21, name: "Green Tea",           category: "Beverages",  price: 130, unit: "25 bags"},
  { id: 22, name: "Cold Coffee Tetra",   category: "Beverages",  price: 45,  unit: "200ml" },
];

// In-memory order store
const orders = [];
let orderCounter = 1000;

// ── Helper: Trigger Python IoT Script ──────────────────────────
function triggerIoTScript(orderData) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "..", "iot", "led_trigger.py");
    const orderJson = JSON.stringify({
      order_id: orderData.orderId,
      item_count: orderData.items.length,
      total: orderData.total,
    });

    console.log(`\n🔌 [IoT] Triggering Python script: ${scriptPath}`);

    // Try python3 first, fall back to python
    const pythonCmd = process.platform === "win32" ? "python" : "python3";

    const pyProcess = spawn(pythonCmd, [scriptPath, orderJson], {
      timeout: 10000, // 10 second timeout
    });

    let stdout = "";
    let stderr = "";

    pyProcess.stdout.on("data", (data) => {
      stdout += data.toString();
      console.log(`🐍 [Python] ${data.toString().trim()}`);
    });

    pyProcess.stderr.on("data", (data) => {
      stderr += data.toString();
      console.error(`🐍 [Python STDERR] ${data.toString().trim()}`);
    });

    pyProcess.on("close", (code) => {
      if (code === 0) {
        console.log(`✅ [IoT] Python script exited successfully`);
        resolve({ success: true, output: stdout });
      } else {
        console.error(`❌ [IoT] Python script exited with code ${code}`);
        // Don't reject – a missing Python shouldn't break the order
        resolve({ success: false, error: stderr, code });
      }
    });

    pyProcess.on("error", (err) => {
      console.error(`❌ [IoT] Failed to spawn Python: ${err.message}`);
      resolve({ success: false, error: err.message });
    });
  });
}

// ── Routes ──────────────────────────────────────────────────────

// GET /api/products
app.get("/api/products", (req, res) => {
  res.json({ success: true, products });
});

// GET /api/orders
app.get("/api/orders", (req, res) => {
  res.json({ success: true, orders });
});

// POST /api/place-order  ← Main endpoint
app.post("/api/place-order", async (req, res) => {
  try {
    const { items, total, timestamp } = req.body;

    // Basic validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty or invalid." });
    }

    // Build order record
    const orderId = `BK-${++orderCounter}`;
    const order = {
      orderId,
      items,
      subtotal: total,
      deliveryFee: total > 199 ? 0 : 25,
      grandTotal: total + (total > 199 ? 0 : 25),
      status: "confirmed",
      placedAt: timestamp || new Date().toISOString(),
      estimatedDelivery: "10 minutes",
    };
    orders.push(order);

    console.log(`\n📦 Order received: ${orderId}`);
    console.log(`   Items: ${items.map((i) => `${i.name} x${i.quantity}`).join(", ")}`);
    console.log(`   Total: ₹${order.grandTotal}`);

    // ── Trigger IoT LED signal ──────────────────────────────────
    const iotResult = await triggerIoTScript(order);

    res.json({
      success: true,
      orderId,
      message: `Order ${orderId} confirmed! Arriving in ~10 minutes. ⚡`,
      iotSignal: iotResult,
      order,
    });
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", server: "BlinkKart Backend", port: PORT });
});

// ── Start Server ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n⚡ BlinkKart Backend running on http://localhost:${PORT}`);
  console.log(`   Products API: http://localhost:${PORT}/api/products`);
  console.log(`   Orders API:   http://localhost:${PORT}/api/orders`);
  console.log(`   Health:       http://localhost:${PORT}/health\n`);
});
