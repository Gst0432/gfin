-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    is_premium BOOLEAN DEFAULT FALSE,
    premium_expiry_date TIMESTAMP WITH TIME ZONE,
    auto_renew BOOLEAN DEFAULT FALSE,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    company_info JSONB
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    purchase_price DECIMAL(15, 2) NOT NULL,
    selling_price DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(15, 2) NOT NULL,
    expiry_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('premium', 'sale')),
    amount DECIMAL(15, 2) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    sale_type VARCHAR(20) CHECK (sale_type IN ('product', 'service')),
    buyer_details JSONB,
    payment_method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'completed',
    item_id UUID,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sales Goals table
CREATE TABLE sales_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target DECIMAL(15, 2) NOT NULL,
    current DECIMAL(15, 2) DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('monthly', 'yearly')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Expenses table
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Digital Product Tables
CREATE TABLE digital_product_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Digital Products
CREATE TABLE digital_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_id UUID NOT NULL REFERENCES digital_product_tables(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    link TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subscription Sales
CREATE TABLE subscription_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_name VARCHAR(100) NOT NULL,
    duration INTEGER NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100),
    customer_phone VARCHAR(20),
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired')),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_services_seller ON services(seller_id);
CREATE INDEX idx_transactions_seller ON transactions(seller_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_sales_goals_seller ON sales_goals(seller_id);
CREATE INDEX idx_expenses_seller ON expenses(seller_id);
CREATE INDEX idx_digital_tables_seller ON digital_product_tables(seller_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_subscription_sales_seller ON subscription_sales(seller_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_goals_updated_at
    BEFORE UPDATE ON sales_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_digital_product_tables_updated_at
    BEFORE UPDATE ON digital_product_tables
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user
INSERT INTO users (
    id,
    name,
    email,
    role,
    is_premium,
    is_active,
    company_info
) VALUES (
    uuid_generate_v4(),
    'Administrateur',
    '227makemoney@gmail.com',
    'admin',
    TRUE,
    TRUE,
    '{"name": "G-Finance", "address": "Niamey, Niger", "phone": "+227 XX XX XX XX", "email": "contact@g-finance.com"}'
) ON CONFLICT (email) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_product_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT
    USING (auth.uid() = id OR EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE
    USING (auth.uid() = id OR EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Users can view their own products" ON products
    FOR SELECT
    USING (seller_id = auth.uid() OR EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Users can manage their own products" ON products
    FOR ALL
    USING (seller_id = auth.uid() OR EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    ));

-- Repeat similar policies for other tables
-- Add more specific policies as needed for your application's security requirements