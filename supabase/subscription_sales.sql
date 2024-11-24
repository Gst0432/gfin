-- Table des ventes d'abonnements
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

-- Index pour améliorer les performances
CREATE INDEX idx_subscription_sales_seller ON subscription_sales(seller_id);
CREATE INDEX idx_subscription_sales_status ON subscription_sales(status);
CREATE INDEX idx_subscription_sales_dates ON subscription_sales(purchase_date, expiry_date);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_subscription_sales_updated_at
    BEFORE UPDATE ON subscription_sales
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Politique RLS pour les ventes d'abonnements
CREATE POLICY "Users can view their own subscription sales" ON subscription_sales
    FOR SELECT
    USING (seller_id = auth.uid() OR EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Users can manage their own subscription sales" ON subscription_sales
    FOR ALL
    USING (seller_id = auth.uid() OR EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    ));