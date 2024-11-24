-- Configuration de l'authentification pour l'administrateur
-- Créer d'abord l'utilisateur dans auth.users
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
) ON CONFLICT (email) DO NOTHING;

-- Lier l'utilisateur auth avec le profil utilisateur
INSERT INTO public.users (
    id,
    name,
    email,
    role,
    is_premium,
    is_active,
    company_info
) VALUES (
    (SELECT id FROM auth.users WHERE email = '227makemoney@gmail.com'),
    'Administrateur',
    '227makemoney@gmail.com',
    'admin',
    TRUE,
    TRUE,
    jsonb_build_object(
        'name', 'G-Finance',
        'address', 'Niamey, Niger',
        'phone', '+227 XX XX XX XX',
        'email', 'contact@g-finance.com'
    )
) ON CONFLICT (email) DO UPDATE 
SET 
    role = 'admin',
    is_premium = TRUE,
    is_active = TRUE,
    company_info = EXCLUDED.company_info;