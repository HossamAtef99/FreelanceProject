const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname)));

const CATEGORY_FILES = {
  phones: 'data/phones.json',
  tablets: 'data/tablets.json',
  watches: 'data/watches.json',
  earbuds: 'data/earbuds.json',
  chargers: 'data/chargers.json',
  powerbanks: 'data/powerbanks.json',
};

function readCategory(category) {
  const file = CATEGORY_FILES[category];
  if (!file) return [];
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return [];
  try {
    return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  } catch {
    return [];
  }
}

function writeCategory(category, products) {
  const file = CATEGORY_FILES[category];
  if (!file) return false;
  fs.writeFileSync(path.join(__dirname, file), JSON.stringify(products, null, 2));
  return true;
}

app.get('/api/products/all', (req, res) => {
  const all = [];
  for (const cat of Object.keys(CATEGORY_FILES)) {
    const products = readCategory(cat);
    all.push(...products);
  }
  res.json(all);
});

app.get('/api/product/:id', (req, res) => {
  const found = findProductById(req.params.id);
  if (!found) return res.status(404).json({ error: 'Product not found' });
  res.json(found.product);
});

app.get('/api/products/:category', (req, res) => {
  res.json(readCategory(req.params.category));
});

app.get('/api/admin/products', (req, res) => {
  const all = {};
  for (const cat of Object.keys(CATEGORY_FILES)) {
    all[cat] = readCategory(cat);
  }
  res.json(all);
});

function findProductById(id) {
  for (const cat of Object.keys(CATEGORY_FILES)) {
    const products = readCategory(cat);
    const found = products.find(p => p.id === id);
    if (found) return { category: cat, product: found };
  }
  return null;
}

app.post('/api/products', (req, res) => {
  const product = req.body;
  const category = product.category || 'phones';
  const products = readCategory(category);
  const existing = products.findIndex(p => p.id === product.id);
  if (existing !== -1) {
    products[existing] = product;
  } else {
    products.push(product);
  }
  writeCategory(category, products);
  res.json({ success: true, product });
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const updated = req.body;
  const newCategory = updated.category || 'phones';
  const found = findProductById(id);
  if (found && found.category !== newCategory) {
    const oldProducts = readCategory(found.category);
    writeCategory(found.category, oldProducts.filter(p => p.id !== id));
  }
  const products = readCategory(newCategory);
  const idx = products.findIndex(p => p.id === id);
  if (idx !== -1) {
    products[idx] = { ...products[idx], ...updated };
  } else {
    products.push(updated);
  }
  writeCategory(newCategory, products);
  res.json({ success: true, product: products[idx !== -1 ? idx : products.length - 1] });
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const found = findProductById(id);
  if (!found) return res.status(404).json({ error: 'Product not found' });
  const products = readCategory(found.category);
  writeCategory(found.category, products.filter(p => p.id !== id));
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
