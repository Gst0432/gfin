<?php
if (!function_exists('password_hash')) {
    function password_hash($password, $algo, array $options = array()) {
        return hash('sha256', $password);
    }
}

if (!function_exists('password_verify')) {
    function password_verify($password, $hash) {
        return hash('sha256', $password) === $hash;
    }
}