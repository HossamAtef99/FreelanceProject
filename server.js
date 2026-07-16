require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://quysvtaemhjwiyrwxqfl.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1eXN2dGFlbWhqd2l5cnd4cWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2ODAyMjMsImV4cCI6MjA5OTI1NjIyM30.r_9fM1i_2Zc3rlGErtCbBW93DbUncXCwpiwLBIUJqTk';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(express.json({ limit: '10mb' }));

async function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
  const authedClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
  let { data: profile } = await authedClient.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (!profile && user.email && user.email === 'admin@omarphone.com') {
    const { data: upserted } = await authedClient.from('profiles').upsert({
      id: user.id, name: 'Admin', email: user.email, role: 'admin'
    }).select('role').maybeSingle();
    profile = upserted;
  }
  if (!profile || profile.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  req.user = user;
  next();
}

/* ----- Products API ----- */

app.get('/api/products/all', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').limit(200);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/product/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('id', req.params.id).maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Product not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products/:category', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('category', req.params.category);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) return res.status(500).json({ error: error.message });
    const grouped = {};
    for (const p of data || []) {
      const cat = p.category || 'other';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(p);
    }
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/products', requireAdmin, async (req, res) => {
  try {
    const product = req.body;
    if (!product || !product.id || !product.name) {
      return res.status(400).json({ error: 'Product must have id and name' });
    }
    if (typeof product.name !== 'string' || product.name.length > 200) {
      return res.status(400).json({ error: 'Invalid product name' });
    }
    const { data, error } = await supabase.from('products').upsert(product, { onConflict: 'id' }).select().maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, product: data || product });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = req.body;
    if (!updated || !updated.name) {
      return res.status(400).json({ error: 'Product must have a name' });
    }
    delete updated.id;
    const { data, error } = await supabase.from('products').update({ ...updated, updated_at: new Date().toISOString() }).eq('id', id).select().maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true, product: data });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('products').delete().eq('id', id).select().maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* ----- Orders API ----- */

app.post('/api/orders', async (req, res) => {
  try {
    const order = req.body;
    if (!order || !order.customer || !order.items || !order.items.length) {
      return res.status(400).json({ error: 'Invalid order data' });
    }
    const { data, error } = await supabase.from('orders').insert(order).select().maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, order: data || order });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/orders', async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(200);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/admin/orders/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }
    const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select().maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true, order: data });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* ----- Seed logic ----- */

const CATEGORY_FILES = {
  phones: 'data/phones.json',
  tablets: 'data/tablets.json',
  watches: 'data/watches.json',
  earbuds: 'data/earbuds.json',
  chargers: 'data/chargers.json',
  powerbanks: 'data/powerbanks.json',
};

const HARDCODED_ACCESSORIES = [
  { id: 'silicone-case', name: 'Silicone Case', brand: 'Generic', price: 899, category: 'cases', image: 'https://images.unsplash.com/photo-1542219550-76864b1bc385?w=600&auto=format&fit=crop&q=60', stock: true, popular: 50 },
  { id: 'usb-c-cable', name: 'USB-C Cable', brand: 'Generic', price: 749, category: 'cables', image: 'https://plus.unsplash.com/premium_photo-1759282946954-d1fdec6198eb?w=600&auto=format&fit=crop&q=60', stock: true, popular: 50 },
  { id: 'car-charger', name: 'Car Charger', brand: 'Generic', price: 1199, category: 'chargers', image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop', stock: true, popular: 50 },
  { id: 'tempered-glass', name: 'Tempered Glass Screen Protector', brand: 'Generic', price: 579, category: 'protectors', image: 'https://images.unsplash.com/photo-1607976973585-a6c285b90ef5?w=400&h=400&fit=crop', stock: true, popular: 50 },
  { id: 'headphones-sony', name: 'Sony WH-1000XM5', brand: 'Sony', price: 16749, category: 'headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', stock: true, popular: 50 },
  { id: 'leather-case', name: 'Leather Wallet Case', brand: 'Generic', price: 1399, category: 'cases', image: 'https://images.unsplash.com/photo-1657731739188-e31e3b8b86d6?w=600&auto=format&fit=crop&q=60', stock: true, popular: 50 },
];

async function seedAll() {
  const allProducts = [];
  for (const [cat, file] of Object.entries(CATEGORY_FILES)) {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
      const products = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
      for (const p of products) {
        if (!p.category) p.category = cat;
        if (!p.brand) p.brand = '';
        if (!p.colors) p.colors = p.color ? [p.color] : [];
        if (!p.images || !p.images.length) p.images = p.image ? [p.image] : [];
        allProducts.push(p);
      }
    }
  }

  for (const a of HARDCODED_ACCESSORIES) {
    const exists = allProducts.find(p => p.id === a.id);
    if (!exists) {
      if (!a.images || !a.images.length) a.images = a.image ? [a.image] : [];
      allProducts.push(a);
    }
  }

  if (allProducts.length) {
    const { error } = await supabase.from('products').upsert(allProducts, { onConflict: 'id' });
    if (error) console.error('Seed products error:', error.message);
    else console.log(`Seeded ${allProducts.length} products`);
  }

  const ordersPath = path.join(__dirname, 'data/orders.json');
  if (fs.existsSync(ordersPath)) {
    const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
    if (orders.length) {
      const { error } = await supabase.from('orders').upsert(orders, { onConflict: 'id' });
      if (error) console.error('Seed orders error:', error.message);
      else console.log(`Seeded ${orders.length} orders`);
    }
  }
}

/* ----- Seed endpoint (protected) ----- */

app.post('/api/seed', requireAdmin, async (req, res) => {
  try {
    await seedAll();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ----- Static files ----- */

app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  try {
    const { data, error } = await supabase.from('products').select('id').limit(1);
    if (error) throw error;
    if (!data || data.length === 0) {
      await seedAll();
    } else {
      console.log(`Database has existing products, skipping seed`);
    }
  } catch (e) { console.error('Startup seed check failed, seeding anyway:', e.message); try { await seedAll(); } catch (e2) { console.error('Seed failed:', e2.message); } }
});
