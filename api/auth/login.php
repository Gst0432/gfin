<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://gfinances.pro');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/database.php';

try {
    // Récupérer et décoder les données JSON
    $input = file_get_contents('php://input');
    if (!$input) {
        throw new Exception('Données non reçues');
    }

    $data = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Données JSON invalides');
    }

    if (!isset($data['email']) || !isset($data['password'])) {
        throw new Exception('Email et mot de passe requis');
    }

    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $password = $data['password'];

    // Récupérer l'utilisateur
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? AND is_active = 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        throw new Exception('Email ou mot de passe incorrect');
    }

    // Mettre à jour la dernière connexion
    $stmt = $pdo->prepare('UPDATE users SET last_login = NOW() WHERE id = ?');
    $stmt->execute([$user['id']]);

    // Générer un nouveau token
    $token = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));

    // Supprimer les anciens tokens de l'utilisateur
    $stmt = $pdo->prepare('DELETE FROM auth_tokens WHERE user_id = ?');
    $stmt->execute([$user['id']]);

    // Sauvegarder le nouveau token
    $stmt = $pdo->prepare('
        INSERT INTO auth_tokens (id, user_id, token, expires_at) 
        VALUES (UUID(), ?, ?, ?)
    ');
    $stmt->execute([$user['id'], $token, $expiresAt]);

    // Préparer les données utilisateur
    $userData = [
        'id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role'],
        'isPremium' => (bool)$user['is_premium'],
        'premiumExpiryDate' => $user['premium_expiry_date'],
        'createdAt' => $user['created_at'],
        'isActive' => (bool)$user['is_active']
    ];

    if ($user['company_info']) {
        $userData['companyInfo'] = json_decode($user['company_info'], true);
    }

    // Envoyer la réponse JSON
    echo json_encode([
        'success' => true,
        'user' => $userData,
        'token' => $token
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
    exit;
}