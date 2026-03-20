// ==========================================
// ReUz — API Routes (JSON DB)
// ==========================================

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import db, { generateId } from './db.js';
import { signToken, authMiddleware, optionalAuth } from './auth.js';
import { emitToUser, emitToConversation } from './socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Multer storage config for product images
const storage = multer.diskStorage({
  destination: join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = file.originalname.split('.').pop();
    cb(null, `product-${uniqueSuffix}.${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

export default function createRoutes(io) {
  const router = Router();

  // ==========================================
  // AUTH
  // ==========================================
  router.post('/auth/register', (req, res) => {
    try {
      const { name, email, password, region } = req.body;
      if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required' });
      if (db.findOne('users', u => u.email === email)) return res.status(400).json({ error: 'Email already registered' });
      const hash = bcrypt.hashSync(password, 10);
      const id = generateId();
      const user = { id, name, email, password: hash, region: region || 'Tashkent', bio: '', rating: 0, reviewCount: 0, joinedAt: Date.now(), listingsCount: 0, phone: '', verified: 0 };
      db.insert('users', user);
      const token = signToken(id);
      const { password: _, ...safe } = user;
      res.json({ token, user: safe });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.post('/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      const user = db.findOne('users', u => u.email === email);
      if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Invalid email or password' });
      const token = signToken(user.id);
      const { password: _, ...safe } = user;
      res.json({ token, user: safe });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.get('/auth/me', authMiddleware, (req, res) => {
    const user = db.getById('users', req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password: _, ...safe } = user;
    res.json(safe);
  });

  // ==========================================
  // USERS
  // ==========================================
  router.get('/users/:id', (req, res) => {
    const user = db.getById('users', req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password: _, ...safe } = user;
    res.json(safe);
  });

  // ==========================================
  // PRODUCTS
  // ==========================================
  router.get('/products', (req, res) => {
    const { category, search, sort, sellerId } = req.query;
    let products = db.getAll('products');

    if (category && category !== 'All') {
      const prefixMap = { women: 'w_', men: 'm_', kids: 'k_' };
      const prefix = prefixMap[category];
      if (prefix) {
        products = products.filter(p => p.category === category || (p.category && p.category.startsWith(prefix)));
      } else {
        products = products.filter(p => p.category === category);
      }
    }
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p => p.title.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q) || (p.brand || '').toLowerCase().includes(q));
    }
    if (sellerId) products = products.filter(p => p.sellerId === sellerId);

    if (sort === 'price_asc') products.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') products.sort((a, b) => b.price - a.price);
    else if (sort === 'popular') products.sort((a, b) => (b.views || 0) - (a.views || 0));
    else products.sort((a, b) => b.createdAt - a.createdAt);

    res.json(products);
  });

  router.get('/products/:id', (req, res) => {
    const product = db.getById('products', req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    db.update('products', req.params.id, { views: (product.views || 0) + 1 });
    res.json(product);
  });

  router.post('/products', authMiddleware, upload.array('images', 10), (req, res) => {
    try {
      const files = req.files || [];
      if (files.length < 2) return res.status(400).json({ error: 'At least 2 images are required' });
      if (files.length > 10) return res.status(400).json({ error: 'Maximum 10 images allowed' });

      const { title, description, price, category, brand, condition, size, material, color } = req.body;
      if (!title || !description || !price) return res.status(400).json({ error: 'Title, description and price required' });

      const images = files.map(f => `/uploads/${f.filename}`);
      const id = generateId();
      const product = { id, title, description, price: parseFloat(price), category: category || '', brand: brand || '', condition: condition || '', size: size || '', material: material || '', color: color || '', images, sellerId: req.userId, sold: false, createdAt: Date.now(), views: 0 };
      db.insert('products', product);
      const user = db.getById('users', req.userId);
      if (user) db.update('users', req.userId, { listingsCount: (user.listingsCount || 0) + 1 });
      res.json(product);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ==========================================
  // ORDERS
  // ==========================================
  router.get('/orders', authMiddleware, (req, res) => {
    const orders = db.filter('orders', o => o.buyerId === req.userId || o.sellerId === req.userId).sort((a, b) => b.createdAt - a.createdAt);
    res.json(orders);
  });

  router.get('/orders/:id', authMiddleware, (req, res) => {
    const order = db.getById('orders', req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  });

  router.post('/orders', authMiddleware, (req, res) => {
    try {
      const { productId, payment, pricing, shipping, overridePrice } = req.body;
      const product = db.getById('products', productId);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      if (product.sold) return res.status(400).json({ error: 'Product already sold' });
      if (product.sellerId === req.userId) return res.status(400).json({ error: 'Cannot buy your own item' });

      const id = generateId();
      const now = Date.now();
      const itemPrice = (pricing?.itemPrice) || product.price;
      const protectionFee = pricing?.protectionFee || parseFloat((itemPrice * 0.05).toFixed(2));
      const shippingCost = pricing?.shippingCost || 4.50;
      const salesTax = pricing?.salesTax || parseFloat((itemPrice * 0.10).toFixed(2));
      const platformFee = pricing?.platformFee || parseFloat((itemPrice * 0.05).toFixed(2));
      const buyerPays = pricing?.buyerPays || parseFloat((itemPrice + protectionFee + shippingCost + salesTax).toFixed(2));
      const sellerGets = pricing?.sellerGets || parseFloat((itemPrice - platformFee).toFixed(2));

      const orderPricing = { itemPrice, protectionFee, shippingCost, salesTax, platformFee, buyerPays, sellerGets };

      db.update('products', productId, { sold: true, soldAt: now });

      const order = {
        id, productId, buyerId: req.userId, sellerId: product.sellerId,
        status: 'paid',
        pricing: orderPricing,
        shipping: shipping || {},
        paymentDetails: payment || { cardLast4: '****', method: 'card' },
        statusHistory: [{ status: 'paid', timestamp: now, note: 'Payment received' }],
        createdAt: now, updatedAt: now, deliveredAt: null, disputeId: null, sellerPaidOut: false
      };
      db.insert('orders', order);

      // Create conversation
      const convId = generateId();
      db.insert('conversations', { id: convId, orderId: id, productId, buyerId: req.userId, sellerId: product.sellerId, escalated: false, createdAt: now, updatedAt: now });

      // System message (tracking messages are shown in the status tracker, not as chat bubbles — but still stored for backend records)
      const msgId = generateId();
      db.insert('messages', { id: msgId, conversationId: convId, senderId: '__system__', text: `💳 Payment confirmed — $${orderPricing.buyerPays.toFixed(2)} paid for "${product.title}".`, type: 'system', subtype: 'success', timestamp: now });

      // Notify seller
      const buyer = db.getById('users', req.userId);
      const notifId = generateId();
      db.insert('notifications', { id: notifId, userId: product.sellerId, type: 'purchase', title: 'New order!', message: `${buyer?.name || 'Buyer'} purchased your "${product.title}" — $${orderPricing.sellerGets.toFixed(2)}`, link: `/chat/${id}`, read: 0, createdAt: now });
      emitToUser(io, product.sellerId, 'notification:new', { id: notifId, type: 'purchase', title: 'New order!', message: `${buyer?.name || 'Buyer'} purchased "${product.title}"`, link: `/chat/${id}`, createdAt: now });

      // Simulate delivery timeline
      setTimeout(() => progressOrder(io, id, 'shipped'), 5000);

      res.json(order);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Track in-flight confirms to prevent duplicates
  const pendingConfirms = new Set();

  router.put('/orders/:id/confirm', authMiddleware, (req, res) => {
    try {
      const orderId = req.params.id;
      const order = db.getById('orders', orderId);
      if (!order) return res.status(404).json({ error: 'Order not found' });

      // Auth: only the buyer can confirm
      if (order.buyerId !== req.userId) {
        return res.status(403).json({ error: 'Only the buyer can confirm receipt' });
      }

      // Already completed — idempotent success
      if (order.status === 'completed') {
        return res.json({ ok: true, order, message: 'Order already confirmed' });
      }

      // Must be in delivered state
      if (order.status !== 'delivered') {
        return res.status(400).json({ error: `Order not in DELIVERED state (current: ${order.status})` });
      }

      // Prevent duplicate concurrent requests
      if (pendingConfirms.has(orderId)) {
        return res.status(409).json({ error: 'Confirm already in progress' });
      }
      pendingConfirms.add(orderId);

      const now = Date.now();
      const history = Array.isArray(order.statusHistory) ? order.statusHistory : [];
      const updates = {
        status: 'completed',
        updatedAt: now,
        sellerPaidOut: true,
        statusHistory: [...history, { status: 'completed', timestamp: now, note: 'Buyer confirmed receipt' }]
      };
      db.update('orders', orderId, updates);
      postSystemMsg(io, orderId, '✅ Buyer confirmed receipt. Order complete! Seller payout released.', 'success');
      emitOrderUpdate(io, orderId, 'completed');

      pendingConfirms.delete(orderId);

      const updatedOrder = db.getById('orders', orderId);
      res.json({ ok: true, order: updatedOrder });
    } catch (e) {
      pendingConfirms.delete(req.params.id);
      res.status(500).json({ error: e.message });
    }
  });

  router.put('/orders/:id/cancel', authMiddleware, (req, res) => {
    const order = db.getById('orders', req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const now = Date.now();
    const history = Array.isArray(order.statusHistory) ? order.statusHistory : [];
    db.update('orders', req.params.id, { status: 'cancelled', updatedAt: now, statusHistory: [...history, { status: 'cancelled', timestamp: now, note: 'Order cancelled' }] });
    db.update('products', order.productId, { sold: false, soldAt: null });
    postSystemMsg(io, req.params.id, '❌ Order cancelled. Product relisted. Buyer refunded.', 'warning');
    res.json({ ok: true });
  });

  function progressOrder(io, orderId, newStatus) {
    const order = db.getById('orders', orderId);
    if (!order || order.status === 'completed' || order.status === 'cancelled') return;
    const now = Date.now();
    const history = Array.isArray(order.statusHistory) ? order.statusHistory : [];
    const updates = { status: newStatus, updatedAt: now, statusHistory: [...history, { status: newStatus, timestamp: now, note: newStatus }] };
    if (newStatus === 'delivered') updates.deliveredAt = now;
    db.update('orders', orderId, updates);
    if (newStatus === 'shipped') {
      const trackingNo = 'UZ' + Math.random().toString(36).substring(2, 10).toUpperCase();
      postSystemMsg(io, orderId, `📦 Item shipped! Tracking: ${trackingNo}`, 'info');
      emitOrderUpdate(io, orderId, 'shipped');
      setTimeout(() => progressOrder(io, orderId, 'delivered'), 8000);
    } else if (newStatus === 'delivered') {
      postSystemMsg(io, orderId, '✅ Item delivered! You have 2 days to confirm or report an issue.', 'success');
      emitOrderUpdate(io, orderId, 'delivered');
      // Auto-complete after 2 minutes (simulates 2-day buyer review window)
      setTimeout(() => {
        const o = db.getById('orders', orderId);
        if (o && o.status === 'delivered') {
          const h = Array.isArray(o.statusHistory) ? o.statusHistory : [];
          db.update('orders', orderId, { status: 'completed', updatedAt: Date.now(), sellerPaidOut: true, statusHistory: [...h, { status: 'completed', timestamp: Date.now(), note: 'Auto-completed: buyer review window expired' }] });
          postSystemMsg(io, orderId, '⏰ Review window expired. Order auto-completed. Seller payout released.', 'success');
          emitOrderUpdate(io, orderId, 'completed');
        }
      }, 120000); // 2 minutes = simulated 2 days
    }
  }

  function emitOrderUpdate(io, orderId, status) {
    const order = db.getById('orders', orderId);
    if (!order) return;
    // Emit full order object so frontend can sync all fields
    const payload = { orderId, status, order };
    emitToUser(io, order.buyerId, 'order:update', payload);
    emitToUser(io, order.sellerId, 'order:update', payload);
  }

  function postSystemMsg(io, orderId, text, subtype) {
    const conv = db.findOne('conversations', c => c.orderId === orderId);
    if (!conv) return;
    const msgId = generateId();
    const now = Date.now();
    db.insert('messages', { id: msgId, conversationId: conv.id, senderId: '__system__', text, type: 'system', subtype, timestamp: now });
    db.update('conversations', conv.id, { updatedAt: now });
    emitToConversation(io, conv.id, 'chat:message', { id: msgId, conversationId: conv.id, senderId: '__system__', text, type: 'system', subtype, timestamp: now });
  }

  // ==========================================
  // CONVERSATIONS & MESSAGES
  // ==========================================
  router.get('/conversations', authMiddleware, (req, res) => {
    let convs = db.filter('conversations', c => c.buyerId === req.userId || c.sellerId === req.userId).sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));
    convs = convs.map(c => {
      const msgs = db.filter('messages', m => m.conversationId === c.id).sort((a, b) => b.timestamp - a.timestamp);
      const lastRead = db.findOne('lastRead', lr => lr.conversationId === c.id && lr.userId === req.userId);
      const lastReadTs = lastRead?.timestamp || 0;
      return {
        ...c,
        lastMessage: msgs[0] || null,
        messages: db.filter('messages', m => m.conversationId === c.id).sort((a, b) => a.timestamp - b.timestamp),
        unreadCount: db.count('messages', m => m.conversationId === c.id && m.senderId !== req.userId && m.senderId !== '__system__' && m.timestamp > lastReadTs)
      };
    });
    res.json(convs);
  });

  router.get('/conversations/:id', authMiddleware, (req, res) => {
    const conv = db.getById('conversations', req.params.id);
    if (!conv) return res.status(404).json({ error: 'Conversation not found' });
    conv.messages = db.filter('messages', m => m.conversationId === conv.id).sort((a, b) => a.timestamp - b.timestamp);
    res.json(conv);
  });

  router.get('/conversations/:id/messages', authMiddleware, (req, res) => {
    const messages = db.filter('messages', m => m.conversationId === req.params.id).sort((a, b) => a.timestamp - b.timestamp);
    res.json(messages);
  });

  router.post('/conversations', authMiddleware, (req, res) => {
    try {
      const { productId, sellerId, orderId } = req.body;

      if (orderId) {
        const conv = db.findOne('conversations', c => c.orderId === orderId);
        if (conv) {
          conv.messages = db.filter('messages', m => m.conversationId === conv.id).sort((a, b) => a.timestamp - b.timestamp);
          return res.json(conv);
        }
      }

      if (productId && sellerId) {
        let conv = db.findOne('conversations', c => c.productId === productId && c.buyerId === req.userId && c.sellerId === sellerId && !c.orderId);
        if (conv) {
          conv.messages = db.filter('messages', m => m.conversationId === conv.id).sort((a, b) => a.timestamp - b.timestamp);
          return res.json(conv);
        }
        const id = generateId();
        const now = Date.now();
        conv = { id, orderId: null, productId, buyerId: req.userId, sellerId, escalated: false, createdAt: now, updatedAt: now };
        db.insert('conversations', conv);
        conv.messages = [];
        return res.json(conv);
      }

      res.status(400).json({ error: 'productId+sellerId or orderId required' });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.post('/conversations/:id/messages', authMiddleware, (req, res) => {
    try {
      const conv = db.getById('conversations', req.params.id);
      if (!conv) return res.status(404).json({ error: 'Conversation not found' });

      const { text, type, offerId, offerAmount, offerStatus, isCounter } = req.body;
      const msgId = generateId();
      const now = Date.now();

      const message = { id: msgId, conversationId: conv.id, senderId: req.userId, text, type: type || 'user', subtype: null, offerId: offerId || null, offerAmount: offerAmount || null, offerStatus: offerStatus || null, isCounter: isCounter ? true : false, timestamp: now };
      db.insert('messages', message);
      db.update('conversations', conv.id, { updatedAt: now });

      emitToConversation(io, conv.id, 'chat:message', message);

      // Notify
      const recipientId = conv.buyerId === req.userId ? conv.sellerId : conv.buyerId;
      const sender = db.getById('users', req.userId);
      const notifId = generateId();
      db.insert('notifications', { id: notifId, userId: recipientId, type: 'message', title: sender?.name || 'Someone', message: text.length > 60 ? text.substring(0, 60) + '…' : text, link: conv.orderId ? `/chat/${conv.orderId}` : `/messages/${conv.id}`, read: 0, createdAt: now });
      emitToUser(io, recipientId, 'notification:new', { id: notifId, type: 'message', title: sender?.name || 'Someone', message: text, createdAt: now });

      res.json(message);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.put('/conversations/:id/read', authMiddleware, (req, res) => {
    db.upsert('lastRead', lr => lr.conversationId === req.params.id && lr.userId === req.userId, { conversationId: req.params.id, userId: req.userId, timestamp: Date.now() });
    res.json({ ok: true });
  });

  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  router.get('/notifications', authMiddleware, (req, res) => {
    const notifs = db.filter('notifications', n => n.userId === req.userId).sort((a, b) => b.createdAt - a.createdAt).slice(0, 50);
    res.json(notifs);
  });

  router.get('/notifications/unread-count', authMiddleware, (req, res) => {
    const count = db.count('notifications', n => n.userId === req.userId && !n.read);
    res.json({ count });
  });

  router.put('/notifications/:id/read', authMiddleware, (req, res) => {
    db.update('notifications', req.params.id, { read: 1 });
    res.json({ ok: true });
  });

  router.put('/notifications/read-all', authMiddleware, (req, res) => {
    db.updateWhere('notifications', n => n.userId === req.userId, { read: 1 });
    res.json({ ok: true });
  });

  // ==========================================
  // OFFERS
  // ==========================================
  router.post('/offers', authMiddleware, (req, res) => {
    try {
      const { productId, amount } = req.body;
      const product = db.getById('products', productId);
      if (!product) return res.status(404).json({ error: 'Product not found' });

      const buyer = db.getById('users', req.userId);

      let conv = db.findOne('conversations', c => c.productId === productId && c.buyerId === req.userId && c.sellerId === product.sellerId && !c.orderId);
      if (!conv) {
        const convId = generateId();
        const now = Date.now();
        conv = { id: convId, orderId: null, productId, buyerId: req.userId, sellerId: product.sellerId, escalated: false, createdAt: now, updatedAt: now };
        db.insert('conversations', conv);
      }

      const offerId = generateId();
      const now = Date.now();
      db.insert('offers', { id: offerId, productId, buyerId: req.userId, sellerId: product.sellerId, amount, originalPrice: product.price, status: 'pending', isCounter: false, createdAt: now });

      const msgId = generateId();
      const text = `💰 Offer: $${parseFloat(amount).toFixed(2)} (Listed at $${parseFloat(product.price).toFixed(2)})`;
      const message = { id: msgId, conversationId: conv.id, senderId: req.userId, text, type: 'offer', subtype: null, offerId, offerAmount: amount, offerStatus: 'pending', isCounter: false, timestamp: now };
      db.insert('messages', message);
      db.update('conversations', conv.id, { updatedAt: now });

      emitToConversation(io, conv.id, 'chat:message', message);

      const notifId = generateId();
      db.insert('notifications', { id: notifId, userId: product.sellerId, type: 'purchase', title: 'New offer!', message: `${buyer?.name || 'Buyer'} offered $${parseFloat(amount).toFixed(2)} for "${product.title}"`, link: `/messages/${conv.id}`, read: 0, createdAt: now });
      emitToUser(io, product.sellerId, 'notification:new', { id: notifId, type: 'purchase', title: 'New offer!', createdAt: now });

      const offer = db.getById('offers', offerId);
      conv.messages = db.filter('messages', m => m.conversationId === conv.id).sort((a, b) => a.timestamp - b.timestamp);
      res.json({ offer, conv });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.put('/offers/:id/accept', authMiddleware, (req, res) => {
    try {
      const offer = db.getById('offers', req.params.id);
      if (!offer || offer.status !== 'pending') return res.status(400).json({ error: 'Invalid offer' });
      const now = Date.now();
      db.update('offers', offer.id, { status: 'accepted', respondedAt: now });
      db.updateWhere('messages', m => m.offerId === offer.id, { offerStatus: 'accepted' });

      const product = db.getById('products', offer.productId);
      const conv = db.findOne('conversations', c => c.productId === offer.productId && (c.buyerId === offer.buyerId || c.sellerId === offer.sellerId) && !c.orderId);

      if (conv) {
        const msgId = generateId();
        db.insert('messages', { id: msgId, conversationId: conv.id, senderId: '__system__', text: `✅ Offer accepted! $${parseFloat(offer.amount).toFixed(2)} — Creating order...`, type: 'system', subtype: 'success', timestamp: now });
        emitToConversation(io, conv.id, 'chat:message', { id: msgId, conversationId: conv.id, senderId: '__system__', text: `✅ Offer accepted! $${parseFloat(offer.amount).toFixed(2)}`, type: 'system', subtype: 'success', timestamp: now });
      }

      // Auto-create order from accepted offer
      if (product && !product.sold) {
        const orderId = generateId();
        const itemPrice = parseFloat(offer.amount);
        const platformFee = Math.round(itemPrice * 0.05 * 100) / 100;
        const sellerGets = Math.round((itemPrice - platformFee) * 100) / 100;
        const pricing = { itemPrice, buyerPays: itemPrice, sellerGets, platformFee, shippingCost: 0 };

        db.update('products', offer.productId, { sold: true, soldAt: now });

        const order = {
          id: orderId, productId: offer.productId, buyerId: offer.buyerId, sellerId: offer.sellerId,
          status: 'paid',
          pricing,
          shipping: { label: 'Standard', fromRegion: '', toRegion: '', cost: 0 },
          paymentDetails: { cardLast4: '****', method: 'offer' },
          statusHistory: [{ status: 'paid', timestamp: now, note: 'Payment via accepted offer' }],
          createdAt: now, updatedAt: now, deliveredAt: null, disputeId: null, sellerPaidOut: false
        };
        db.insert('orders', order);

        // Link conversation to order
        if (conv) {
          db.update('conversations', conv.id, { orderId, updatedAt: now });
          const payMsg = generateId();
          db.insert('messages', { id: payMsg, conversationId: conv.id, senderId: '__system__', text: `💳 Payment confirmed — $${itemPrice.toFixed(2)} for "${product.title}". Delivery starting...`, type: 'system', subtype: 'success', timestamp: now + 1 });
          emitToConversation(io, conv.id, 'chat:message', { id: payMsg, conversationId: conv.id, senderId: '__system__', text: `💳 Payment confirmed — $${itemPrice.toFixed(2)}`, type: 'system', subtype: 'success', timestamp: now + 1 });
        }

        // Start delivery simulation
        setTimeout(() => progressOrder(io, orderId, 'shipped'), 5000);
      }

      // Notify buyer
      const notifId = generateId();
      db.insert('notifications', { id: notifId, userId: offer.buyerId, type: 'purchase', title: 'Offer accepted!', message: `Your offer for "${product?.title}" was accepted — order created!`, link: conv ? `/messages/${conv.id}` : '/', read: 0, createdAt: now });
      emitToUser(io, offer.buyerId, 'notification:new', { id: notifId, type: 'purchase', title: 'Offer accepted!', createdAt: now });

      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.put('/offers/:id/reject', authMiddleware, (req, res) => {
    try {
      const offer = db.getById('offers', req.params.id);
      if (!offer || offer.status !== 'pending') return res.status(400).json({ error: 'Invalid offer' });
      db.update('offers', offer.id, { status: 'rejected', respondedAt: Date.now() });
      db.updateWhere('messages', m => m.offerId === offer.id, { offerStatus: 'rejected' });

      const conv = db.findOne('conversations', c => c.productId === offer.productId && (c.buyerId === offer.buyerId || c.sellerId === offer.sellerId) && !c.orderId);
      if (conv) {
        const msgId = generateId();
        const now = Date.now();
        db.insert('messages', { id: msgId, conversationId: conv.id, senderId: offer.sellerId, text: '❌ Offer declined', type: 'system', subtype: 'error', timestamp: now });
        emitToConversation(io, conv.id, 'chat:message', { id: msgId, conversationId: conv.id, senderId: offer.sellerId, text: '❌ Offer declined', type: 'system', subtype: 'error', timestamp: now });
      }

      const product = db.getById('products', offer.productId);
      const notifId = generateId();
      db.insert('notifications', { id: notifId, userId: offer.buyerId, type: 'purchase', title: 'Offer declined', message: `Your offer for "${product?.title}" was declined`, link: conv ? `/messages/${conv.id}` : '/', read: 0, createdAt: Date.now() });
      emitToUser(io, offer.buyerId, 'notification:new', { id: notifId, type: 'purchase', title: 'Offer declined', createdAt: Date.now() });

      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.put('/offers/:id/counter', authMiddleware, (req, res) => {
    try {
      const offer = db.getById('offers', req.params.id);
      if (!offer || offer.status !== 'pending') return res.status(400).json({ error: 'Invalid offer' });
      const { amount } = req.body;

      db.update('offers', offer.id, { status: 'countered', respondedAt: Date.now() });
      db.updateWhere('messages', m => m.offerId === offer.id, { offerStatus: 'countered' });

      const counterId = generateId();
      const now = Date.now();
      db.insert('offers', { id: counterId, productId: offer.productId, buyerId: offer.buyerId, sellerId: offer.sellerId, amount, originalPrice: offer.originalPrice, status: 'pending', isCounter: true, originalOfferId: offer.id, createdAt: now });

      const conv = db.findOne('conversations', c => c.productId === offer.productId && (c.buyerId === offer.buyerId || c.sellerId === offer.sellerId) && !c.orderId);
      if (conv) {
        const msgId = generateId();
        const text = `💰 Counter offer: $${parseFloat(amount).toFixed(2)}`;
        const message = { id: msgId, conversationId: conv.id, senderId: offer.sellerId, text, type: 'offer', subtype: null, offerId: counterId, offerAmount: amount, offerStatus: 'pending', isCounter: true, timestamp: now };
        db.insert('messages', message);
        db.update('conversations', conv.id, { updatedAt: now });
        emitToConversation(io, conv.id, 'chat:message', message);
      }

      const notifId = generateId();
      db.insert('notifications', { id: notifId, userId: offer.buyerId, type: 'purchase', title: 'Counter offer!', message: `Counter-offered $${parseFloat(amount).toFixed(2)}`, link: conv ? `/messages/${conv.id}` : '/', read: 0, createdAt: now });
      emitToUser(io, offer.buyerId, 'notification:new', { id: notifId, type: 'purchase', title: 'Counter offer!', createdAt: now });

      res.json({ ok: true, counter: db.getById('offers', counterId) });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ==========================================
  // DISPUTES
  // ==========================================
  router.post('/disputes', authMiddleware, (req, res) => {
    try {
      const { orderId, reason, description } = req.body;
      const order = db.getById('orders', orderId);
      if (!order) return res.status(404).json({ error: 'Order not found' });

      // Auth: only the buyer can open a dispute
      if (order.buyerId !== req.userId) {
        return res.status(403).json({ error: 'Only the buyer can report issues' });
      }

      // Must be delivered
      if (order.status !== 'delivered') {
        return res.status(400).json({ error: `Order not in DELIVERED state (current: ${order.status})` });
      }

      // Duplicate check
      if (order.disputeId) return res.status(400).json({ error: 'Dispute already exists for this order' });

      // 48h time window check (simulated: 2 minutes = 120000ms)
      const DISPUTE_WINDOW_MS = 120000; // 2 min simulates 48h
      if (order.deliveredAt && (Date.now() - order.deliveredAt) > DISPUTE_WINDOW_MS) {
        return res.status(400).json({ error: 'Dispute window expired. Issues must be reported within 48 hours of delivery.' });
      }

      if (!reason) return res.status(400).json({ error: 'Dispute reason is required' });

      const id = generateId();
      const now = Date.now();
      const history = Array.isArray(order.statusHistory) ? order.statusHistory : [];
      db.insert('disputes', { id, orderId, reason, description: description || '', status: 'open', buyerId: order.buyerId, sellerId: order.sellerId, sellerResponse: null, partialAmount: null, createdAt: now });
      db.update('orders', orderId, { disputeId: id, status: 'disputed', updatedAt: now, statusHistory: [...history, { status: 'disputed', timestamp: now, note: `Issue reported: ${reason.replace(/_/g, ' ')}` }] });
      postSystemMsg(io, orderId, `⚠️ Issue reported: ${reason.replace(/_/g, ' ')}. Payment is held until resolved.`, 'warning');
      emitOrderUpdate(io, orderId, 'disputed');
      res.json(db.getById('disputes', id));
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.get('/disputes/:id', authMiddleware, (req, res) => {
    const dispute = db.getById('disputes', req.params.id);
    if (!dispute) return res.status(404).json({ error: 'Dispute not found' });
    res.json(dispute);
  });

  // Seller accepts return
  router.put('/disputes/:id/accept-return', authMiddleware, (req, res) => {
    try {
      const dispute = db.getById('disputes', req.params.id);
      if (!dispute) return res.status(404).json({ error: 'Dispute not found' });
      const now = Date.now();
      db.update('disputes', dispute.id, { status: 'return_required', sellerResponse: 'accept_return', respondedAt: now });
      postSystemMsg(io, dispute.orderId, '📦 Seller accepted the return. Please ship the item back.', 'info');
      emitOrderUpdate(io, dispute.orderId, 'disputed');
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Seller offers partial refund
  router.put('/disputes/:id/partial-refund', authMiddleware, (req, res) => {
    try {
      const dispute = db.getById('disputes', req.params.id);
      if (!dispute) return res.status(404).json({ error: 'Dispute not found' });
      const { amount } = req.body;
      if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
      const now = Date.now();
      db.update('disputes', dispute.id, { status: 'partial_offered', sellerResponse: 'partial_refund', partialAmount: parseFloat(amount), respondedAt: now });
      postSystemMsg(io, dispute.orderId, `💰 Seller offered partial refund: $${parseFloat(amount).toFixed(2)}. Buyer keeps the item.`, 'info');
      emitOrderUpdate(io, dispute.orderId, 'disputed');
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Buyer accepts partial refund — per Buyer Protection policy:
  // Partial refund = partial item price + proportional protection fee + proportional sales tax
  // Does NOT include shipping fee
  router.put('/disputes/:id/buyer-accept', authMiddleware, (req, res) => {
    try {
      const dispute = db.getById('disputes', req.params.id);
      if (!dispute) return res.status(404).json({ error: 'Dispute not found' });
      const now = Date.now();
      const order = db.getById('orders', dispute.orderId);
      const p = order?.pricing || {};
      const partialItemAmt = dispute.partialAmount || 0;
      const ratio = p.itemPrice ? (partialItemAmt / p.itemPrice) : 0;
      const partialProtection = parseFloat(((p.protectionFee || 0) * ratio).toFixed(2));
      const partialTax = parseFloat(((p.salesTax || 0) * ratio).toFixed(2));
      const totalRefund = parseFloat((partialItemAmt + partialProtection + partialTax).toFixed(2));

      db.update('disputes', dispute.id, { status: 'resolved_partial_refund', resolvedAt: now, refundBreakdown: { itemRefund: partialItemAmt, protectionRefund: partialProtection, taxRefund: partialTax, total: totalRefund } });
      const history = Array.isArray(order?.statusHistory) ? order.statusHistory : [];
      db.update('orders', dispute.orderId, { status: 'completed', updatedAt: now, sellerPaidOut: true, statusHistory: [...history, { status: 'completed', timestamp: now, note: `Partial refund: $${totalRefund}` }] });
      postSystemMsg(io, dispute.orderId, `✅ Partial refund accepted: $${partialItemAmt.toFixed(2)} (item) + $${partialProtection.toFixed(2)} (protection) + $${partialTax.toFixed(2)} (tax) = $${totalRefund.toFixed(2)} total. Buyer keeps item.`, 'success');
      emitOrderUpdate(io, dispute.orderId, 'completed');
      res.json({ ok: true, refund: totalRefund });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Buyer declines partial refund → escalate
  router.put('/disputes/:id/buyer-decline', authMiddleware, (req, res) => {
    try {
      const dispute = db.getById('disputes', req.params.id);
      if (!dispute) return res.status(404).json({ error: 'Dispute not found' });
      const now = Date.now();
      db.update('disputes', dispute.id, { status: 'under_review', escalated: true, escalatedAt: now });
      const conv = db.findOne('conversations', c => c.orderId === dispute.orderId);
      if (conv) db.update('conversations', conv.id, { escalated: true });
      postSystemMsg(io, dispute.orderId, '🔍 Buyer declined partial refund. Dispute escalated for review.', 'warning');
      emitOrderUpdate(io, dispute.orderId, 'disputed');
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Buyer ships return — full refund per Buyer Protection:
  // Full refund = item price + protection fee + shipping fee + sales tax
  router.put('/disputes/:id/ship-return', authMiddleware, (req, res) => {
    try {
      const dispute = db.getById('disputes', req.params.id);
      if (!dispute) return res.status(404).json({ error: 'Dispute not found' });
      const now = Date.now();
      db.update('disputes', dispute.id, { status: 'return_shipped', returnShippedAt: now });
      postSystemMsg(io, dispute.orderId, '📦 Return shipped. You will receive a full refund once the item is received.', 'info');

      // Simulate return delivery → auto-resolve with full refund
      setTimeout(() => {
        const d = db.getById('disputes', dispute.id);
        if (d && d.status === 'return_shipped') {
          const order = db.getById('orders', dispute.orderId);
          const p = order?.pricing || {};
          const itemRefund = p.itemPrice || 0;
          const protectionRefund = p.protectionFee || 0;
          const shippingRefund = p.shippingCost || 0;
          const taxRefund = p.salesTax || 0;
          const totalRefund = parseFloat((itemRefund + protectionRefund + shippingRefund + taxRefund).toFixed(2));

          db.update('disputes', dispute.id, { status: 'resolved_refund', resolvedAt: Date.now(), refundBreakdown: { itemRefund, protectionRefund, shippingRefund, taxRefund, total: totalRefund } });
          const hist = Array.isArray(order?.statusHistory) ? order.statusHistory : [];
          db.update('orders', dispute.orderId, { status: 'refunded', updatedAt: Date.now(), statusHistory: [...hist, { status: 'refunded', timestamp: Date.now(), note: `Full refund: $${totalRefund}` }] });
          postSystemMsg(io, dispute.orderId, `✅ Return received. Full refund: $${itemRefund.toFixed(2)} (item) + $${protectionRefund.toFixed(2)} (protection) + $${shippingRefund.toFixed(2)} (shipping) + $${taxRefund.toFixed(2)} (tax) = $${totalRefund.toFixed(2)}`, 'success');
          emitOrderUpdate(io, dispute.orderId, 'refunded');
        }
      }, 10000);

      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ==========================================
  // FAVORITES
  // ==========================================
  router.get('/favorites', authMiddleware, (req, res) => {
    const favs = db.filter('favorites', f => f.userId === req.userId);
    const enriched = favs.map(f => {
      const p = db.getById('products', f.productId);
      return { ...f, ...(p || {}) };
    });
    res.json(enriched);
  });

  router.post('/favorites', authMiddleware, (req, res) => {
    const { productId } = req.body;
    const existing = db.findOne('favorites', f => f.userId === req.userId && f.productId === productId);
    if (existing) {
      db.remove('favorites', existing.id);
      return res.json({ favorited: false });
    }
    db.insert('favorites', { id: generateId(), userId: req.userId, productId, createdAt: Date.now() });
    res.json({ favorited: true });
  });

  return router;
}
