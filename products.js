export const products = [
  // Fruits & Veggies
  { id: 1,  name: "Fresh Tomatoes",       emoji: "🍅", category: "Vegetables", price: 29,  unit: "500g",  badge: "Farm Fresh" },
  { id: 2,  name: "Baby Spinach",         emoji: "🥬", category: "Vegetables", price: 45,  unit: "200g",  badge: null },
  { id: 3,  name: "Onions",               emoji: "🧅", category: "Vegetables", price: 35,  unit: "1kg",   badge: "Best Value" },
  { id: 4,  name: "Bananas",              emoji: "🍌", category: "Fruits",     price: 49,  unit: "6 pcs", badge: null },
  { id: 5,  name: "Royal Gala Apples",    emoji: "🍎", category: "Fruits",     price: 99,  unit: "4 pcs", badge: "Imported" },
  { id: 6,  name: "Lemons",              emoji: "🍋", category: "Fruits",     price: 25,  unit: "4 pcs", badge: null },

  // Dairy & Eggs
  { id: 7,  name: "Full Cream Milk",      emoji: "🥛", category: "Dairy",      price: 62,  unit: "1L",    badge: "Daily Fresh" },
  { id: 8,  name: "Amul Butter",          emoji: "🧈", category: "Dairy",      price: 55,  unit: "100g",  badge: null },
  { id: 9,  name: "Farm Eggs",            emoji: "🥚", category: "Dairy",      price: 89,  unit: "12 pcs",badge: "Free Range" },
  { id: 10, name: "Curd (Dahi)",          emoji: "🍶", category: "Dairy",      price: 40,  unit: "400g",  badge: null },

  // Snacks
  { id: 11, name: "Lay's Classic",        emoji: "🥔", category: "Snacks",     price: 20,  unit: "26g",   badge: null },
  { id: 12, name: "Digestive Biscuits",   emoji: "🍪", category: "Snacks",     price: 35,  unit: "250g",  badge: "Bestseller" },
  { id: 13, name: "Instant Noodles",      emoji: "🍜", category: "Snacks",     price: 14,  unit: "70g",   badge: null },
  { id: 14, name: "Dark Chocolate",       emoji: "🍫", category: "Snacks",     price: 75,  unit: "55g",   badge: "New" },
  { id: 15, name: "Roasted Peanuts",      emoji: "🥜", category: "Snacks",     price: 55,  unit: "200g",  badge: null },

  // Staples
  { id: 16, name: "Basmati Rice",         emoji: "🍚", category: "Staples",    price: 149, unit: "1kg",   badge: "Premium" },
  { id: 17, name: "Toor Dal",             emoji: "🫘", category: "Staples",    price: 99,  unit: "500g",  badge: null },
  { id: 18, name: "Sunflower Oil",        emoji: "🫙", category: "Staples",    price: 179, unit: "1L",    badge: null },
  { id: 19, name: "Whole Wheat Atta",     emoji: "🌾", category: "Staples",    price: 85,  unit: "1kg",   badge: "Stone Ground" },

  // Beverages
  { id: 20, name: "Orange Juice",         emoji: "🍊", category: "Beverages",  price: 110, unit: "1L",    badge: "No Added Sugar" },
  { id: 21, name: "Green Tea",            emoji: "🍵", category: "Beverages",  price: 130, unit: "25 bags",badge: null },
  { id: 22, name: "Cold Coffee Tetra",    emoji: "☕", category: "Beverages",  price: 45,  unit: "200ml", badge: "Chilled" },
];

export const categories = ["All", ...new Set(products.map((p) => p.category))];
