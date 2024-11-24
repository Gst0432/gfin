<?php
$servername = "localhost";
$username = "u540259652_gfinances";
$password = "XKm!V2vZl5f=";
$dbname = "u540259652_gfinances";

try {
    $pdo = new PDO(
        "mysql:host=$servername;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ]
    );
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}
?>