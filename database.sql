-- Création de la base de données
CREATE DATABASE IF NOT EXISTS u540259652_gfinances;
USE u540259652_gfinances;

-- Table des utilisateurs
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    is_premium BOOLEAN DEFAULT FALSE,
    premium_expiry_date DATETIME,
    auto_renew BOOLEAN DEFAULT FALSE,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    company_info JSON
);

-- Table des produits
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    seller_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    purchase_price DECIMAL(15, 2) NOT NULL,
    selling_price DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des services
CREATE TABLE services (
    id VARCHAR(36) PRIMARY KEY,
    seller_id VARCHAR(36) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(15, 2) NOT NULL,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des transactions
CREATE TABLE transactions (
    id VARCHAR(36) PRIMARY KEY,
    type ENUM('premium', 'sale') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    buyer_name VARCHAR(100),
    buyer_email VARCHAR(100),
    buyer_phone VARCHAR(20),
    payment_method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'completed',
    item_id VARCHAR(36),
    seller_id VARCHAR(36),
    buyer_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table des objectifs de vente
CREATE TABLE sales_goals (
    id VARCHAR(36) PRIMARY KEY,
    seller_id VARCHAR(36) NOT NULL,
    target DECIMAL(15, 2) NOT NULL,
    current DECIMAL(15, 2) DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    type ENUM('monthly', 'yearly') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des dépenses
CREATE TABLE expenses (
    id VARCHAR(36) PRIMARY KEY,
    seller_id VARCHAR(36) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des ventes d'abonnements
CREATE TABLE subscription_sales (
    id VARCHAR(36) PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    duration INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100),
    customer_phone VARCHAR(20),
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP NOT NULL,
    status ENUM('active', 'expired') DEFAULT 'active',
    seller_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des tableaux de produits numériques
CREATE TABLE digital_product_tables (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    seller_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des produits numériques
CREATE TABLE digital_products (
    id VARCHAR(36) PRIMARY KEY,
    table_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    link TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES digital_product_tables(id) ON DELETE CASCADE
);

-- Table des notifications
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Création des index pour optimiser les performances
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_premium ON users(is_premium);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_seller ON transactions(seller_id);
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_services_seller ON services(seller_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_seller ON expenses(seller_id);
CREATE INDEX idx_sales_goals_seller ON sales_goals(seller_id);
CREATE INDEX idx_subscription_sales_status ON subscription_sales(status);
CREATE INDEX idx_digital_products_table ON digital_products(table_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- Insertion de l'utilisateur admin par défaut
INSERT INTO users (id, name, email, password_hash, role, is_premium, is_active)
VALUES (
    UUID(),
    'Administrateur',
    '227makemoney@gmail.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: 'admin123'
    'admin',
    TRUE,
    TRUE
);