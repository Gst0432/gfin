-- Table des tableaux de liens numériques
CREATE TABLE digital_product_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des liens numériques
CREATE TABLE digital_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_id UUID NOT NULL REFERENCES digital_product_tables(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    link TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX idx_digital_tables_seller ON digital_product_tables(seller_id);
CREATE INDEX idx_digital_products_table ON digital_products(table_id);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_digital_tables_updated_at
    BEFORE UPDATE ON digital_product_tables
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_digital_products_updated_at
    BEFORE UPDATE ON digital_products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Politique RLS pour les tableaux de liens
CREATE POLICY "Users can view their own digital tables" ON digital_product_tables
    FOR SELECT
    USING (seller_id = auth.uid() OR EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Users can manage their own digital tables" ON digital_product_tables
    FOR ALL
    USING (seller_id = auth.uid() OR EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    ));

-- Politique RLS pour les liens numériques
CREATE POLICY "Users can view their own digital products" ON digital_products
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM digital_product_tables
        WHERE id = digital_products.table_id
        AND (seller_id = auth.uid() OR EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
        ))
    ));

CREATE POLICY "Users can manage their own digital products" ON digital_products
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM digital_product_tables
        WHERE id = digital_products.table_id
        AND (seller_id = auth.uid() OR EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
        ))
    ));