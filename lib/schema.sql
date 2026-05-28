CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  color TEXT
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  amount REAL NOT NULL,
  currency TEXT NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('monthly','yearly')),
  next_charge_date TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','cancelled')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_next_charge
  ON subscriptions(next_charge_date)
  WHERE status = 'active';

CREATE TABLE IF NOT EXISTS payment_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subscription_id INTEGER NOT NULL
    REFERENCES subscriptions(id) ON DELETE CASCADE,
  amount REAL NOT NULL,
  currency TEXT NOT NULL,
  charged_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_events_subscription
  ON payment_events(subscription_id);
