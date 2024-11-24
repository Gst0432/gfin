-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create sales table
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('product', 'service')),
    item_id UUID NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(15, 2) NOT NULL,
    description TEXT,
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'mobile', 'card', 'transfer', 'money_transfer')),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
    buyer_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_sales_seller ON sales(seller_id);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_type ON sales(type);
CREATE INDEX idx_sales_status ON sales(status);

-- Create view for seller statistics
CREATE VIEW seller_sales_stats AS
SELECT 
    seller_id,
    COUNT(*) as total_sales,
    SUM(amount) as total_revenue,
    AVG(amount) as average_sale,
    MIN(amount) as min_sale,
    MAX(amount) as max_sale,
    COUNT(DISTINCT DATE(sale_date)) as active_days
FROM sales
WHERE status = 'completed'
GROUP BY seller_id;

-- Create view for daily sales
CREATE VIEW daily_sales AS
SELECT 
    seller_id,
    DATE(sale_date) as sale_day,
    COUNT(*) as num_sales,
    SUM(amount) as daily_revenue,
    SUM(quantity) as items_sold
FROM sales
WHERE status = 'completed'
GROUP BY seller_id, DATE(sale_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_sales_updated_at
    BEFORE UPDATE ON sales
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own sales"
    ON sales
    FOR SELECT
    USING (auth.uid() = seller_id OR EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Users can insert their own sales"
    ON sales
    FOR INSERT
    WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own sales"
    ON sales
    FOR UPDATE
    USING (auth.uid() = seller_id OR EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Users can delete their own sales"
    ON sales
    FOR DELETE
    USING (auth.uid() = seller_id OR EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    ));

-- Create function to handle product stock updates
CREATE OR REPLACE FUNCTION handle_sale_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'product' THEN
        UPDATE products 
        SET stock = stock - NEW.quantity
        WHERE id = NEW.item_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for product stock updates
CREATE TRIGGER update_product_stock
    AFTER INSERT ON sales
    FOR EACH ROW
    EXECUTE FUNCTION handle_sale_product_stock();

-- Example of how to insert a sale using Supabase
/* 
INSERT INTO sales (
    seller_id,
    type,
    item_id,
    amount,
    quantity,
    unit_price,
    description,
    payment_method,
    buyer_details
) VALUES (
    auth.uid(), -- Current user's ID
    'product',
    '123e4567-e89b-12d3-a456-426614174000', -- Product ID
    50000.00,
    1,
    50000.00,
    'Vente de produit XYZ',
    'mobile',
    jsonb_build_object(
        'name', 'John Doe',
        'email', 'john@example.com',
        'phone', '+227 XX XX XX XX'
    )
);
*/