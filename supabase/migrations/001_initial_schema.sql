-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
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

-- Insert default admin
INSERT INTO users (
    name,
    email,
    role,
    is_premium,
    is_active,
    company_info
) VALUES (
    'Administrateur',
    '227makemoney@gmail.com',
    'admin',
    TRUE,
    TRUE,
    '{"name": "G-Finance", "address": "Niamey, Niger", "phone": "+227 XX XX XX XX", "email": "contact@g-finance.com"}'
) ON CONFLICT (email) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
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