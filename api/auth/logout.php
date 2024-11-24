<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
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

    if ($token) {
        // Supprimer le token de la base de données
        $stmt = $pdo->prepare('DELETE FROM auth_tokens WHERE token = ?');
        $stmt->execute([$token]);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Déconnexion réussie'
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}