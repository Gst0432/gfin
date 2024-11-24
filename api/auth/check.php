<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

try {
    $headers = getallheaders();
    $token = null;

    if (isset($headers['Authorization'])) {
        $auth = $headers['Authorization'];
        if (strpos($auth, 'Bearer ') === 0) {
            $token = substr($auth, 7);
        }
    }

    if (!$token) {
        throw new Exception('Token non fourni');
    }

    // Vérifier le token dans la base de données
    $stmt = $pdo->prepare('
        SELECT u.* 
        FROM users u 
        JOIN auth_tokens t ON u.id = t.user_id 
        WHERE t.token = ? AND t.expires_at > NOW() AND u.is_active = 1
    ');
    $stmt->execute([$token]);
    $user = $stmt->fetch();

    if (!$user) {
        throw new Exception('Session invalide ou expirée');
    }

    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'isPremium' => (bool)$user['is_premium'],
            'premiumExpiryDate' => $user['premium_expiry_date'],
            'createdAt' => $user['created_at'],
            'isActive' => (bool)$user['is_active'],
            'companyInfo' => $user['company_info'] ? json_decode($user['company_info']) : null
        ]
    ]);

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}