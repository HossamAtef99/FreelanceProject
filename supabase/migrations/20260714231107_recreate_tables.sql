DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price NUMERIC NOT NULL,
  "oldPrice" NUMERIC DEFAULT 0,
  storage TEXT,
  ram TEXT,
  color TEXT DEFAULT '',
  colors JSONB DEFAULT '[]'::jsonb,
  image TEXT DEFAULT '',
  images JSONB DEFAULT '[]'::jsonb,
  "colorImages" JSONB DEFAULT '{}'::jsonb,
  rating NUMERIC DEFAULT 5,
  reviews INTEGER DEFAULT 0,
  stock BOOLEAN DEFAULT true,
  category TEXT NOT NULL,
  badge TEXT DEFAULT '',
  popular INTEGER DEFAULT 50,
  condition TEXT DEFAULT 'new',
  battery INTEGER DEFAULT 100,
  warranty TEXT DEFAULT '6 Months',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on products" ON products;
CREATE POLICY "Allow all on products"
  ON products FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  payment TEXT DEFAULT 'Cash on Delivery',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on orders" ON orders;
CREATE POLICY "Allow all on orders"
  ON orders FOR ALL
  USING (true)
  WITH CHECK (true);
