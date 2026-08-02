<?php
/**
 * Helper autentikasi admin berbasis PHP session.
 * require di setiap endpoint admin/*.php yang butuh proteksi login.
 */

function startSecureSession()
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => $isHttps,
    ]);
    session_start();
}

/**
 * Panggil ini di awal endpoint admin yang wajib login.
 * Otomatis hentikan request (401) kalau belum login.
 */
function requireAdminAuth()
{
    startSecureSession();
    if (empty($_SESSION['admin_id'])) {
        http_response_code(401);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => false, 'message' => 'Belum login atau sesi berakhir. Silakan login kembali.']);
        exit;
    }
}

function applyCorsHeaders($config)
{
    $allowedOrigin = $config['allowed_origin'] ?? '*';
    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json; charset=utf-8');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
