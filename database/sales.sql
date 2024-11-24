-- Table des ventes
CREATE TABLE sales (
    id VARCHAR(36) PRIMARY KEY,
    seller_id VARCHAR(36) NOT NULL,
    type ENUM('product', 'service') NOT NULL,
    item_id VARCHAR(36) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    quantity INT DEFAULT 1,
    unit_price DECIMAL(15, 2) NOT NULL,
    description TEXT,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method ENUM('cash', 'mobile', 'card', 'transfer', 'money_transfer') NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'completed',
    buyer_details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index pour améliorer les performances
CREATE INDEX idx_sales_seller ON sales(seller_id);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_type ON sales(type);
CREATE INDEX idx_sales_status ON sales(status);

-- Vue pour les statistiques de vente par vendeur
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

-- Vue pour les ventes journalières
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

-- Procédure pour ajouter une nouvelle vente
DELIMITER //
CREATE PROCEDURE add_sale(
    IN p_id VARCHAR(36),
    IN p_seller_id VARCHAR(36),
    IN p_type ENUM('product', 'service'),
    IN p_item_id VARCHAR(36),
    IN p_amount DECIMAL(15, 2),
    IN p_quantity INT,
    IN p_unit_price DECIMAL(15, 2),
    IN p_description TEXT,
    IN p_payment_method ENUM('cash', 'mobile', 'card', 'transfer', 'money_transfer'),
    IN p_buyer_details JSON
)
BEGIN
    INSERT INTO sales (
        id,
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
        p_id,
        p_seller_id,
        p_type,
        p_item_id,
        p_amount,
        p_quantity,
        p_unit_price,
        p_description,
        p_payment_method,
        p_buyer_details
    );
END //
DELIMITER ;

-- Procédure pour obtenir les ventes d'un vendeur
DELIMITER //
CREATE PROCEDURE get_seller_sales(
    IN p_seller_id VARCHAR(36),
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        s.*,
        CASE 
            WHEN s.type = 'product' THEN p.name
            WHEN s.type = 'service' THEN srv.title
        END as item_name
    FROM sales s
    LEFT JOIN products p ON s.type = 'product' AND s.item_id = p.id
    LEFT JOIN services srv ON s.type = 'service' AND s.item_id = srv.id
    WHERE s.seller_id = p_seller_id
    AND DATE(s.sale_date) BETWEEN p_start_date AND p_end_date
    ORDER BY s.sale_date DESC;
END //
DELIMITER ;

-- Trigger pour mettre à jour les statistiques après chaque vente
DELIMITER //
CREATE TRIGGER after_sale_insert
AFTER INSERT ON sales
FOR EACH ROW
BEGIN
    -- Mettre à jour les statistiques du vendeur si nécessaire
    -- Vous pouvez ajouter ici la logique pour mettre à jour d'autres tables liées
    IF NEW.type = 'product' THEN
        -- Mettre à jour le stock du produit
        UPDATE products 
        SET stock = stock - NEW.quantity
        WHERE id = NEW.item_id;
    END IF;
END //
DELIMITER ;

-- Exemple d'insertion d'une vente
INSERT INTO sales (
    id,
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
    UUID(),
    'seller_id_here',
    'product',
    'product_id_here',
    50000.00,
    1,
    50000.00,
    'Vente de produit XYZ',
    'mobile',
    JSON_OBJECT(
        'name', 'John Doe',
        'email', 'john@example.com',
        'phone', '+227 XX XX XX XX'
    )
);

-- Exemple d'utilisation de la procédure pour ajouter une vente
CALL add_sale(
    UUID(),
    'seller_id_here',
    'product',
    'product_id_here',
    50000.00,
    1,
    50000.00,
    'Vente de produit XYZ',
    'mobile',
    JSON_OBJECT(
        'name', 'John Doe',
        'email', 'john@example.com',
        'phone', '+227 XX XX XX XX'
    )
);

-- Exemple d'utilisation de la procédure pour obtenir les ventes d'un vendeur
CALL get_seller_sales('seller_id_here', '2024-01-01', '2024-12-31');