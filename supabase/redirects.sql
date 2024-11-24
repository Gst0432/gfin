-- Création de la table des redirections
CREATE TABLE redirects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_path TEXT NOT NULL,
    target_url TEXT NOT NULL,
    status INTEGER DEFAULT 301,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX idx_redirects_source ON redirects(source_path);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_redirects_updated_at
    BEFORE UPDATE ON redirects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertion de la redirection pour le paiement
INSERT INTO redirects (source_path, target_url, status)
VALUES 
    ('/payment', 'https://vente.paiementpro.net/g-startup/1936', 301);

-- Politique RLS pour les redirections
CREATE POLICY "Anyone can view redirects" ON redirects
    FOR SELECT
    TO PUBLIC
    USING (true);

-- Fonction pour obtenir l'URL de redirection
CREATE OR REPLACE FUNCTION get_redirect_url(path TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN (
        SELECT target_url
        FROM redirects
        WHERE source_path = path
        LIMIT 1
    );
END;
$$;