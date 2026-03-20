// ==========================================
// ReUz — JSON File Database (zero deps)
// ==========================================

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_FILE = join(__dirname, 'reuz_data.json');

// Default state
const defaultState = {
  users: [],
  products: [],
  orders: [],
  disputes: [],
  conversations: [],
  messages: [],
  notifications: [],
  offers: [],
  favorites: [],
  lastRead: []
};

// Load or create
let data;
if (existsSync(DB_FILE)) {
  try {
    data = JSON.parse(readFileSync(DB_FILE, 'utf8'));
    // Ensure all collections exist
    for (const key of Object.keys(defaultState)) {
      if (!data[key]) data[key] = [];
    }
  } catch {
    data = { ...defaultState };
  }
} else {
  data = { ...defaultState };
}

// Save (debounced)
let saveTimer = null;
function save() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('DB save failed:', e.message);
    }
  }, 100);
}

function saveNow() {
  if (saveTimer) clearTimeout(saveTimer);
  try {
    writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('DB save failed:', e.message);
  }
}

// === CRUD ===
const db = {
  // Get all items in a collection
  getAll(collection) {
    return data[collection] || [];
  },

  // Find by ID
  getById(collection, id) {
    return (data[collection] || []).find(item => item.id === id);
  },

  // Find with predicate
  filter(collection, predicate) {
    return (data[collection] || []).filter(predicate);
  },

  // Find one
  findOne(collection, predicate) {
    return (data[collection] || []).find(predicate);
  },

  // Insert
  insert(collection, item) {
    if (!data[collection]) data[collection] = [];
    data[collection].push(item);
    save();
    return item;
  },

  // Update by ID
  update(collection, id, updates) {
    const items = data[collection] || [];
    const idx = items.findIndex(i => i.id === id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], ...updates };
      save();
      return items[idx];
    }
    return null;
  },

  // Update with predicate
  updateWhere(collection, predicate, updates) {
    const items = data[collection] || [];
    let count = 0;
    items.forEach((item, idx) => {
      if (predicate(item)) {
        items[idx] = { ...items[idx], ...updates };
        count++;
      }
    });
    if (count > 0) save();
    return count;
  },

  // Upsert (for lastRead)
  upsert(collection, predicate, item) {
    const items = data[collection] || [];
    const idx = items.findIndex(predicate);
    if (idx >= 0) {
      items[idx] = { ...items[idx], ...item };
    } else {
      items.push(item);
    }
    save();
  },

  // Delete
  remove(collection, id) {
    if (!data[collection]) return;
    data[collection] = data[collection].filter(i => i.id !== id);
    save();
  },

  // Count
  count(collection, predicate) {
    if (!predicate) return (data[collection] || []).length;
    return (data[collection] || []).filter(predicate).length;
  },

  // Force save
  save: saveNow
};

// === Generate ID ===
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// === Seed Data ===
function seedDatabase() {
  if (db.count('users') > 0) return;

  const hash = bcrypt.hashSync('demo123', 10);
  const now = Date.now();

  // Users (kept for demo/testing)
  const users = [
    { id: 'user_alice', name: 'Alice Karimova', email: 'alice@demo.com', password: hash, region: 'Tashkent', bio: 'Vintage fashion lover based in Tashkent.', rating: 4.8, reviewCount: 23, joinedAt: now - 86400000 * 120, listingsCount: 0, phone: '+998 90 123 4567', verified: 1 },
    { id: 'user_bob', name: 'Bobur Umarov', email: 'bob@demo.com', password: hash, region: 'Samarkand', bio: 'Tech enthusiast upgrading my gear.', rating: 4.5, reviewCount: 15, joinedAt: now - 86400000 * 90, listingsCount: 0, phone: '+998 91 234 5678', verified: 1 },
    { id: 'user_carol', name: 'Kamola Nazarova', email: 'carol@demo.com', password: hash, region: 'Fergana', bio: 'Minimalist on a mission to declutter!', rating: 4.9, reviewCount: 31, joinedAt: now - 86400000 * 200, listingsCount: 0, phone: '+998 93 345 6789', verified: 1 },
    { id: 'user_dima', name: 'Dima Aliyev', email: 'dima@demo.com', password: hash, region: 'Bukhara', bio: 'Sneakerhead from Bukhara.', rating: 4.7, reviewCount: 19, joinedAt: now - 86400000 * 60, listingsCount: 0, phone: '+998 94 456 7890', verified: 1 },
    { id: 'user_elena', name: 'Elena Rashidova', email: 'elena@demo.com', password: hash, region: 'Namangan', bio: 'Mom of two clearing out the family wardrobe.', rating: 4.6, reviewCount: 12, joinedAt: now - 86400000 * 45, listingsCount: 0, phone: '+998 97 567 8901', verified: 0 }
  ];
  users.forEach(u => db.insert('users', u));  // Seed 15 clothing products — prices in UZS (so'm), rate: $1 = 12,188
    const products = [
    { id: 'prod_1', title: 'Red Evening Dress', description: 'Stunning red evening dress, worn once. Perfect for formal events.', price: 549000, category: 'w_dresses', brand: 'Zara', condition: 'Like New', size: 'M', images: ['/uploads/seed-dress_red-1.svg', '/uploads/seed-dress_red-2.svg'], sellerId: 'user_alice' },
    { id: 'prod_2', title: 'Navy Slim Blazer', description: 'Classic navy blazer, tailored slim fit. Great for office or events.', price: 792000, category: 'm_blazers', brand: 'H&M', condition: 'Good', size: 'L', images: ['/uploads/seed-blazer_navy-1.svg', '/uploads/seed-blazer_navy-2.svg'], sellerId: 'user_bob' },
    { id: 'prod_3', title: 'Vintage Blue Jeans', description: 'High-waisted vintage blue jeans, perfectly broken in.', price: 366000, category: 'w_jeans', brand: 'Levi\'s', condition: 'Good', size: '28', images: ['/uploads/seed-jeans_blue-1.svg', '/uploads/seed-jeans_blue-2.svg'], sellerId: 'user_carol' },
    { id: 'prod_4', title: 'White Leather Sneakers', description: 'Clean white leather sneakers, barely worn. Unisex style.', price: 670000, category: 'm_sneakers', brand: 'Nike', condition: 'Like New', size: '42', images: ['/uploads/seed-sneakers_white-1.svg', '/uploads/seed-sneakers_white-2.svg'], sellerId: 'user_dima' },
    { id: 'prod_5', title: 'Oversized Gray Hoodie', description: 'Super comfortable oversized hoodie. Soft cotton blend.', price: 305000, category: 'm_hoodies', brand: 'Uniqlo', condition: 'Good', size: 'XL', images: ['/uploads/seed-hoodie_gray-1.svg', '/uploads/seed-hoodie_gray-2.svg'], sellerId: 'user_alice' },
    { id: 'prod_6', title: 'Floral Summer Skirt', description: 'Light floral skirt, perfect for summer days. Flowy fabric.', price: 244000, category: 'w_skirts', brand: 'Mango', condition: 'New', size: 'S', images: ['/uploads/seed-skirt_floral-1.svg', '/uploads/seed-skirt_floral-2.svg'], sellerId: 'user_elena' },
    { id: 'prod_7', title: 'Leather Biker Jacket', description: 'Genuine leather biker jacket, broken in beautifully. Timeless style.', price: 1463000, category: 'm_jackets', brand: 'AllSaints', condition: 'Good', size: 'M', images: ['/uploads/seed-jacket_leather-1.svg', '/uploads/seed-jacket_leather-2.svg'], sellerId: 'user_bob' },
    { id: 'prod_8', title: 'Black Graphic Tee', description: 'Minimalist black t-shirt with subtle graphic print.', price: 183000, category: 'm_graphic_tees', brand: 'Stüssy', condition: 'Good', size: 'L', images: ['/uploads/seed-tshirt_black-1.svg', '/uploads/seed-tshirt_black-2.svg'], sellerId: 'user_carol' },
    { id: 'prod_9', title: 'Khaki Chino Shorts', description: 'Classic khaki chino shorts for casual summer wear.', price: 219000, category: 'm_shorts', brand: 'Gap', condition: 'Good', size: 'M', images: ['/uploads/seed-shorts_khaki-1.svg', '/uploads/seed-shorts_khaki-2.svg'], sellerId: 'user_dima' },
    { id: 'prod_10', title: 'Brown Chelsea Boots', description: 'Suede Chelsea boots in rich brown. Versatile and stylish.', price: 914000, category: 'm_boots', brand: 'Clarks', condition: 'Like New', size: '43', images: ['/uploads/seed-boots_brown-1.svg', '/uploads/seed-boots_brown-2.svg'], sellerId: 'user_alice' },
    { id: 'prod_11', title: 'Cream Cable-Knit Sweater', description: 'Cozy cream cable-knit sweater, perfect for layering.', price: 427000, category: 'w_sweaters', brand: 'COS', condition: 'New', size: 'M', images: ['/uploads/seed-sweater_cream-1.svg', '/uploads/seed-sweater_cream-2.svg'], sellerId: 'user_elena' },
    { id: 'prod_12', title: 'Camel Wool Coat', description: 'Elegant camel wool coat, knee-length. Classic silhouette.', price: 1158000, category: 'w_coats', brand: 'Max Mara', condition: 'Like New', size: 'M', images: ['/uploads/seed-coat_camel-1.svg', '/uploads/seed-coat_camel-2.svg'], sellerId: 'user_carol' },
    { id: 'prod_13', title: 'Green Polo Shirt', description: 'Classic green polo shirt, breathable piqué cotton.', price: 268000, category: 'm_polo_shirts', brand: 'Ralph Lauren', condition: 'Good', size: 'L', images: ['/uploads/seed-polo_green-1.svg', '/uploads/seed-polo_green-2.svg'], sellerId: 'user_bob' },
    { id: 'prod_14', title: 'Denim Puffer Vest', description: 'Trendy denim puffer vest, great for transitional weather.', price: 488000, category: 'w_vests', brand: 'Bershka', condition: 'New', size: 'S', images: ['/uploads/seed-vest_denim-1.svg', '/uploads/seed-vest_denim-2.svg'], sellerId: 'user_dima' },
    { id: 'prod_15', title: 'Pink Girls Romper', description: 'Adorable pink romper for girls (age 4-6). Soft cotton.', price: 146000, category: 'k_g_clothing', brand: 'Carter\'s', condition: 'Like New', size: '5Y', images: ['/uploads/seed-romper_pink-1.svg', '/uploads/seed-romper_pink-2.svg'], sellerId: 'user_elena' }
  ];

  products.forEach(p => {
    db.insert('products', {
      ...p,
      material: '', color: '', sold: false,
      createdAt: now - Math.floor(Math.random() * 86400000 * 30),
      views: Math.floor(Math.random() * 100)
    });
  });

  // Update listing counts
  const sellerCounts = {};
  products.forEach(p => { sellerCounts[p.sellerId] = (sellerCounts[p.sellerId] || 0) + 1; });
  Object.entries(sellerCounts).forEach(([sid, count]) => {
    db.update('users', sid, { listingsCount: count });
  });

  saveNow();
  console.log(`✅ Database seeded with ${users.length} demo users and ${products.length} clothing products`);
}

seedDatabase();

export default db;

