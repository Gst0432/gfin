-- Création des administrateurs
INSERT INTO users (
    id,
    name,
    email,
    role,
    is_premium,
    is_active,
    company_info,
    created_at
) VALUES 
-- Admin principal
(
    uuid_generate_v4(),
    'Administrateur Principal',
    '227makemoney@gmail.com',
    'admin',
    TRUE,
    TRUE,
    jsonb_build_object(
        'name', 'G-Finance',
        'address', 'Niamey, Niger',
        'phone', '+227 XX XX XX XX',
        'email', 'contact@g-finance.com'
    ),
    CURRENT_TIMESTAMP
),
-- Admin secondaire
(
    uuid_generate_v4(),
    'Administrateur G-Startup',
    'contact@gstartup.pro',
    'admin',
    TRUE,
    TRUE,
    jsonb_build_object(
        'name', 'G-Finance',
        'address', 'Niamey, Niger',
        'phone', '+227 XX XX XX XX',
        'email', 'contact@gstartup.pro'
    ),
    CURRENT_TIMESTAMP
),
-- Admin support
(
    uuid_generate_v4(),
    'Administrateur Support',
    'support@gtransfert.pro',
    'admin',
    TRUE,
    TRUE,
    jsonb_build_object(
        'name', 'G-Finance',
        'address', 'Niamey, Niger',
        'phone', '+227 XX XX XX XX',
        'email', 'support@gtransfert.pro'
    ),
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO UPDATE 
SET 
    role = 'admin',
    is_premium = TRUE,
    is_active = TRUE,
    company_info = EXCLUDED.company_info;

-- Création des comptes auth pour les administrateurs
DO $$
BEGIN
    -- Pour l'admin principal
    IF NOT EXISTS (
        SELECT 1 FROM auth.users WHERE email = '227makemoney@gmail.com'
    ) THEN
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            last_sign_in_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            uuid_generate_v4(),
            'authenticated',
            'authenticated',
            '227makemoney@gmail.com',
            crypt('admin123', gen_salt('bf')),
            now(),
            now(),
            now(),
            now()
        );
    END IF;

    -- Pour l'admin G-Startup
    IF NOT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'contact@gstartup.pro'
    ) THEN
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            last_sign_in_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            uuid_generate_v4(),
            'authenticated',
            'authenticated',
            'contact@gstartup.pro',
            crypt('Nigerien2024', gen_salt('bf')),
            now(),
            now(),
            now(),
            now()
        );
    END IF;

    -- Pour l'admin Support
    IF NOT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'support@gtransfert.pro'
    ) THEN
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            last_sign_in_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            uuid_generate_v4(),
            'authenticated',
            'authenticated',
            'support@gtransfert.pro',
            crypt('Papuscool1@1', gen_salt('bf')),
            now(),
            now(),
            now(),
            now()
        );
    END IF;
END $$;

-- Création des notifications de bienvenue pour les admins
INSERT INTO notifications (
    id,
    user_id,
    title,
    message,
    is_read,
    created_at
) 
SELECT 
    uuid_generate_v4(),
    id,
    'Bienvenue sur G-Finance',
    'Bienvenue dans votre tableau de bord administrateur.',
    FALSE,
    CURRENT_TIMESTAMP
FROM users 
WHERE email IN ('227makemoney@gmail.com', 'contact@gstartup.pro', 'support@gtransfert.pro')
AND NOT EXISTS (
    SELECT 1 
    FROM notifications n 
    WHERE n.user_id = users.id 
    AND n.title = 'Bienvenue sur G-Finance'
);