-- aB Labs Database Schema for Neon PostgreSQL
-- Auto-generated and synchronized with production database 'ab_labs'

CREATE TABLE IF NOT EXISTS payment_links (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  client_name VARCHAR(255),
  client_email VARCHAR(255),
  client_phone VARCHAR(255),
  template_slug VARCHAR(255) NOT NULL,
  template_name VARCHAR(255) NOT NULL,
  plan_type VARCHAR(50) NOT NULL DEFAULT 'MONTHLY',
  setup_fee_ngn INTEGER NOT NULL DEFAULT 15000,
  monthly_price_ngn INTEGER NOT NULL DEFAULT 5000,
  outright_price_ngn INTEGER NOT NULL DEFAULT 50000,
  amount_due_now_ngn INTEGER NOT NULL DEFAULT 20000,
  notes TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  clicks_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(255) PRIMARY KEY,
  payment_link_id VARCHAR(255) REFERENCES payment_links(id),
  template_slug VARCHAR(255) NOT NULL,
  plan_type VARCHAR(50) NOT NULL,
  amount_paid_ngn INTEGER NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(255),
  business_name VARCHAR(255),
  requested_domain VARCHAR(255),
  paystack_reference VARCHAR(255) UNIQUE NOT NULL,
  paystack_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(255),
  business_name VARCHAR(255),
  domain_name VARCHAR(255),
  domain_status VARCHAR(50) DEFAULT 'ACTIVE',
  domain_expiry_date TIMESTAMP WITH TIME ZONE,
  template_slug VARCHAR(255),
  plan_type VARCHAR(50),
  monthly_status VARCHAR(50) DEFAULT 'ACTIVE',
  portal_access_token VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  password_hash TEXT,
  build_phase INTEGER DEFAULT 1,
  logo_url TEXT,
  primary_color TEXT,
  accent_color TEXT,
  business_bio TEXT,
  whatsapp_number TEXT,
  demo_preview_url TEXT,
  brand_assets JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS template_pricing (
  slug TEXT PRIMARY KEY,
  price_ngn INTEGER NOT NULL,
  setup_fee_ngn INTEGER NOT NULL,
  monthly_ngn INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  template_interest VARCHAR(255),
  status VARCHAR(50) DEFAULT 'NEW',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_paystack_ref ON orders(paystack_reference);
CREATE INDEX IF NOT EXISTS idx_clients_portal_token ON clients(portal_access_token);
CREATE INDEX IF NOT EXISTS idx_payment_links_status ON payment_links(status);
