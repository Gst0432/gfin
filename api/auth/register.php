<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

try {
    // Récupérer et décoder les données JSON
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!isset($data['email']) || !isset($data['password']) || !isset($data['name'])) {
        throw new Exception('Tous les champs sont requis');
    }

    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $password = $data['password'];
    $name = htmlspecialchars(strip_tags($data['name']));

    // Validation des données
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email invalide');
    }

    if (strlen($password) < 8) {
        throw new Exception('Le mot de passe doit contenir au moins 8 caractères');
    }

    if (strlen($name) < 2) {
        throw new Exception('Le nom doit contenir au moins 2 caractères');
    }

    // Vérifier si l'email existe déjà
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        throw new Exception('Cet email est déjà utilisé');
    }

    // Créer l'utilisateur
    $stmt = $pdo->prepare('
        INSERT INTO users (id, name, email, password_hash, role, is_premium, created_at, is_active)
        VALUES (UUID(), ?, ?, ?, "user", 0, NOW(), 1)
    ');
    $stmt->execute([$name, $email, password_hash($password, PASSWORD_DEFAULT)]);

    // Récupérer l'utilisateur créé
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        throw new Exception('Erreur lors de la création du compte');
    }

    // Générer un token d'authentification
    $token = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));

    // Sauvegarder le token
    $stmt = $pdo->prepare('
        INSERT INTO auth_tokens (id, user_id, token, expires_at) 
        VALUES (UUID(), ?, ?, ?)
    ');
    $stmt->execute([$user['id'], $token, $expiresAt]);

    // Préparer la réponse
    $response = [
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'isPremium' => (bool)$user['is_premium'],
            'premiumExpiryDate' => $user['premium_expiry_date'],
            'createdAt' => $user['created_at'],
            'isActive' => (bool)$user['is_active']
        ],
        'token' => $token
    ];

    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
    exit;
}